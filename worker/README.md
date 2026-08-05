# GuerzBook backend — setup (browser only, no terminal)

Result: one shared guestbook wall every visitor sees, on Cloudflare's free tier.

## 1. Make the KV namespace

Cloudflare dashboard → **Storage & Databases → KV → Create instance**.
Name it `guerzbook`. That's the database.

## 2. Make the Worker

**Compute (Workers) → Create → Start from Hello World → Deploy.**
Name it `guerzbook`. Then **Edit code**, delete what's there, paste all of
`worker/guerzbook-worker.js`, and **Deploy**.

## 3. Bind KV + set variables

On the Worker → **Settings**:

- **Bindings → Add → KV namespace**: variable name `GUESTBOOK`, namespace `guerzbook`.
- **Variables and Secrets → Add**:
  - `ADMIN_TOKEN` — type **Secret**. A long random string, keep it private. Lets you delete entries.
  - `ALLOWED_ORIGINS` — type Text: `https://guerz.lol,https://www.guerz.lol`
  - `REQUIRE_APPROVAL` — type Text: `false` (flip to `true` if spam shows up; entries then stay hidden until you approve)

**Deploy** again after adding bindings.

## 4. Give me the URL

Copy the Worker URL (`https://guerzbook.<your-subdomain>.workers.dev`) and paste it in chat.
I'll drop it into `guerzbook.js` and the wall goes live for everyone.

Optional: **Domains & Routes → Add → Custom domain** → `gb.guerz.lol` for a tidier URL.

---

## Running it

Read every signature including emails:

```
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://YOUR-WORKER-URL/admin/entries
```

Delete one (id comes from the call above):

```
curl -X DELETE -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://YOUR-WORKER-URL/entries/THE-ID
```

Both also work in the dashboard's Worker **Playground**, or just ask me and I'll run them for you.

## What's protected

- 3 signatures per IP per 10 minutes
- length caps: name 40, email 120, message 600
- exact-duplicate submissions dropped
- honeypot `website` field silently discarded
- emails stored but **never** returned by the public endpoint
- 500 most recent entries kept
