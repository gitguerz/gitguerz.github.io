// guerz.lol — GuerzBook (guestbook)
// Shared wall backed by a Cloudflare Worker + KV: every visitor sees every signature.
// name + email required (email regex-checked). email is stored server-side, never displayed.
// Falls back to a local-only wall if the backend is unset or unreachable.
(function () {
  // ⬇️ paste the Cloudflare Worker URL here (no trailing slash) ⬇️
  var API_BASE = '';
  // e.g. 'https://guerzbook.yoursubdomain.workers.dev' or 'https://gb.guerz.lol'

  // optional: keeps emailing you a copy of each signature. set to '' to turn off.
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojgwbwj';

  var CACHE_KEY = 'guerz-guestbook-cache';
  var LOCAL_KEY = 'guerz-guestbook';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var SEED = [
    { name: 'get-up-kid88', when: 'jul 14', message: 'rooting for you, ship the ugly version!!' },
    { name: 'dialup_dana', when: 'jul 16', message: 'the y2k lj energy is immaculate. bookmarked <3' }
  ];

  function readStore(key) {
    try {
      var saved = JSON.parse(localStorage.getItem(key));
      return Array.isArray(saved) ? saved : null;
    } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function renderEntry(entry) {
    var wrap = document.createElement('div');
    wrap.className = 'guestbook-entry';
    wrap.style.marginTop = '10px';
    wrap.innerHTML =
      '<div class="guestbook-user">' + escapeHTML(entry.name) +
        (entry.when ? ' · <span style="font-weight:400">' + escapeHTML(entry.when) + '</span>' : '') +
      '</div>' +
      '<div class="guestbook-text">' + escapeHTML(entry.message) + '</div>';
    return wrap;
  }

  function paint(list, entries) {
    list.innerHTML = '';
    entries.forEach(function (entry) { list.appendChild(renderEntry(entry)); });
  }

  function init() {
    var form = document.getElementById('guerzbook-form');
    var list = document.getElementById('guerzbook-entries');
    var status = document.getElementById('gb-status');
    if (!form || !list) return;

    var live = !!API_BASE;
    // show something instantly: cached wall, local marks, or the seeds
    var entries = (live ? readStore(CACHE_KEY) : readStore(LOCAL_KEY)) || SEED.slice();
    paint(list, entries);

    if (live) {
      fetch(API_BASE + '/entries', { headers: { Accept: 'application/json' } })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data || !Array.isArray(data.entries)) return;
          entries = SEED.concat(data.entries);
          writeStore(CACHE_KEY, entries);
          paint(list, entries);
        })
        .catch(function () {});
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('gb-name').value.trim();
      var email = document.getElementById('gb-email').value.trim();
      var message = document.getElementById('gb-message').value.trim();

      if (!name || !email || !message) {
        status.textContent = 'name, email + a note are all required ♥';
        status.className = 'form-status form-status--err';
        return;
      }
      if (!EMAIL_RE.test(email)) {
        status.textContent = "that email doesn't look right";
        status.className = 'form-status form-status--err';
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      status.textContent = 'signing...';
      status.className = 'form-status';

      var payload = { name: name, email: email, message: message };
      var target = live ? API_BASE + '/entries' : FORMSPREE_ENDPOINT;
      if (!live) payload._subject = 'new guerz.lol guestbook signature';

      fetch(target, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            status.textContent = result.data && result.data.error
              ? result.data.error
              : 'hmm, that didn\u2019t go through \u2014 try again?';
            status.className = 'form-status form-status--err';
            return;
          }

          var when = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
          var entry = (result.data && result.data.entry) || { name: name, when: when, message: message };

          if (result.data && result.data.pending) {
            status.textContent = 'signed! it\u2019ll show up once guerz waves it through ^_^';
          } else {
            entries = entries.concat([{ name: entry.name, when: entry.when || when, message: entry.message }]);
            writeStore(live ? CACHE_KEY : LOCAL_KEY, entries);
            list.appendChild(renderEntry(entry));
            status.textContent = 'signed! thanks for stopping by ^_^';
          }
          status.className = 'form-status form-status--ok';
          form.reset();

          // keep the email notification going even on the live backend
          if (live && FORMSPREE_ENDPOINT) {
            fetch(FORMSPREE_ENDPOINT, {
              method: 'POST',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: 'new guerz.lol guestbook signature'
              })
            }).catch(function () {});
          }
        })
        .catch(function () {
          status.textContent = 'network hiccup \u2014 try again in a sec?';
          status.className = 'form-status form-status--err';
        })
        .then(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
