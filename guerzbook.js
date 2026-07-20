// guerz.lol — GuerzBook (guestbook)
// entries live in localStorage for now (static site, no backend yet).
// name + email required (email regex-checked), stored but never displayed.
(function () {
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

      var when = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
      var entry = { name: name, email: email, when: when, message: message }; // email stored, never displayed
      entries.push(entry);
      saveEntries(entries);

      list.appendChild(renderEntry(entry));
      form.reset();
      status.textContent = 'signed! thanks for stopping by ^_^';
      status.className = 'lj-form-status lj-form-status--ok';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
