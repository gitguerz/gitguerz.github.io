// guerz.lol — GuerzBook (guestbook)
// Signatures POST to Formspree — collected privately in your dashboard + emailed to you.
// The visible wall still uses localStorage so a signer sees their own mark land;
// it is NOT shared across visitors yet (static site, no shared backend).
// name + email required (email regex-checked). email is collected, never displayed.
(function () {
  // ⬇️⬇️⬇️ REPLACE THIS after Formspree signup — paste your endpoint here ⬇️⬇️⬇️
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojgwbwj';
  // ⬆️⬆️⬆️ looks like https://formspree.io/f/abcdwxyz ⬆️⬆️⬆️

  var STORAGE_KEY = 'guerz-guestbook';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function loadEntries() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (e) {}
    return [
      { name: 'get-up-kid88', when: 'jul 14', message: 'rooting for you, ship the ugly version!!' },
      { name: 'dialup_dana', when: 'jul 16', message: 'the y2k lj energy is immaculate. bookmarked <3' }
    ];
  }

  function saveEntries(entries) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (e) {}
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function renderEntry(entry) {
    var wrap = document.createElement('div');
    wrap.className = 'lj-guestbook-entry';
    wrap.style.marginTop = '10px';
    wrap.innerHTML =
      '<div class="lj-guestbook-user">' + escapeHTML(entry.name) +
        (entry.when ? ' · <span style="font-weight:400">' + escapeHTML(entry.when) + '</span>' : '') +
      '</div>' +
      '<div class="lj-guestbook-text">' + escapeHTML(entry.message) + '</div>';
    return wrap;
  }

  function init() {
    var form = document.getElementById('guerzbook-form');
    var list = document.getElementById('guerzbook-entries');
    var status = document.getElementById('gb-status');
    if (!form || !list) return;

    var entries = loadEntries();
    entries.forEach(function (entry) { list.appendChild(renderEntry(entry)); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = document.getElementById('gb-name');
      var emailEl = document.getElementById('gb-email');
      var msgEl = document.getElementById('gb-message');
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = msgEl.value.trim();

      if (!name || !email || !message) {
        status.textContent = 'name, email + a note are all required ♥';
        status.className = 'lj-form-status lj-form-status--err';
        return;
      }
      if (!EMAIL_RE.test(email)) {
        status.textContent = "that email doesn't look right";
        status.className = 'lj-form-status lj-form-status--err';
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      status.textContent = 'signing...';
      status.className = 'lj-form-status';

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: 'new guerz.lol guestbook signature'
        })
      })
      .then(function (res) {
        if (res.ok) {
          var when = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
          var entry = { name: name, email: email, when: when, message: message };
          entries.push(entry);
          saveEntries(entries);
          list.appendChild(renderEntry(entry));
          form.reset();
          status.textContent = 'signed! thanks for stopping by ^_^';
          status.className = 'lj-form-status lj-form-status--ok';
        } else {
          status.textContent = 'hmm, that didn\u2019t go through \u2014 try again?';
          status.className = 'lj-form-status lj-form-status--err';
        }
      })
      .catch(function () {
        status.textContent = 'network hiccup \u2014 try again in a sec?';
        status.className = 'lj-form-status lj-form-status--err';
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
