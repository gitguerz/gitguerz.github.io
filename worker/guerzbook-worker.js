// guerz.lol — GuerzBook shared backend (Cloudflare Worker + KV)
//
// GET  /entries  -> { entries: [{ id, name, when, message }] }   (public, no emails)
// POST /entries  -> { ok: true, entry }                          (public, rate limited)
// DELETE /entries/:id  -> { ok: true }                           (needs ADMIN_TOKEN)
// GET  /admin/entries  -> full records incl. emails               (needs ADMIN_TOKEN)
//
// Bindings required:
//   KV namespace  GUESTBOOK
// Env vars (Settings -> Variables):
//   ADMIN_TOKEN        long random string — lets you delete entries
//   ALLOWED_ORIGINS    comma list, e.g. "https://guerz.lol,http://localhost:8000"
//   REQUIRE_APPROVAL   "true" to hold new entries until you approve them (default false)

const ENTRIES_KEY = 'entries';
const MAX_ENTRIES = 500;
const LIMITS = { name: 40, email: 120, message: 600 };
const RATE_WINDOW = 60 * 10; // seconds
const RATE_MAX = 3;          // signatures per IP per window

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...cors(origin)
    }
  });

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function pickOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (!allowed.length) return origin || '*';
  return allowed.includes(origin) ? origin : allowed[0];
}

async function readEntries(env) {
  const raw = await env.GUESTBOOK.get(ENTRIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const writeEntries = (env, entries) =>
  env.GUESTBOOK.put(ENTRIES_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));

const publicShape = e => ({ id: e.id, name: e.name, when: e.when, message: e.message });

const authed = (request, env) =>
  !!env.ADMIN_TOKEN &&
  request.headers.get('Authorization') === `Bearer ${env.ADMIN_TOKEN}`;

async function rateLimited(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate:${ip}`;
  const count = parseInt((await env.GUESTBOOK.get(key)) || '0', 10);
  if (count >= RATE_MAX) return true;
  await env.GUESTBOOK.put(key, String(count + 1), { expirationTtl: RATE_WINDOW });
  return false;
}

function clean(value, max) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max);
}

export default {
  async fetch(request, env) {
    const origin = pickOrigin(request, env);
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    if (path === '/admin/entries' && request.method === 'GET') {
      if (!authed(request, env)) return json({ error: 'unauthorized' }, 401, origin);
      return json({ entries: await readEntries(env) }, 200, origin);
    }

    if (path === '/entries' && request.method === 'GET') {
      const entries = await readEntries(env);
      return json({ entries: entries.filter(e => e.approved !== false).map(publicShape) }, 200, origin);
    }

    if (path === '/entries' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'bad json' }, 400, origin);
      }

      const name = clean(body.name, LIMITS.name);
      const email = clean(body.email, LIMITS.email);
      const message = clean(body.message, LIMITS.message);

      if (!name || !email || !message) return json({ error: 'name, email and message are required' }, 422, origin);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid email' }, 422, origin);
      if (clean(body.website, 40)) return json({ ok: true, entry: null }, 200, origin); // honeypot
      if (await rateLimited(request, env)) return json({ error: 'slow down a sec — try again later' }, 429, origin);

      const requireApproval = String(env.REQUIRE_APPROVAL || '').toLowerCase() === 'true';
      const entry = {
        id: crypto.randomUUID(),
        name,
        email,
        message,
        when: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'America/New_York'
        }).toLowerCase(),
        at: new Date().toISOString(),
        approved: !requireApproval
      };

      const entries = await readEntries(env);
      const dupe = entries.some(e => e.name === name && e.message === message);
      if (!dupe) {
        entries.push(entry);
        await writeEntries(env, entries);
      }

      return json({ ok: true, pending: requireApproval, entry: publicShape(entry) }, 201, origin);
    }

    const del = path.match(/^\/entries\/([\w-]+)$/);
    if (del && request.method === 'DELETE') {
      if (!authed(request, env)) return json({ error: 'unauthorized' }, 401, origin);
      const entries = await readEntries(env);
      await writeEntries(env, entries.filter(e => e.id !== del[1]));
      return json({ ok: true }, 200, origin);
    }

    return json({ error: 'not found' }, 404, origin);
  }
};
