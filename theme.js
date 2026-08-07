// guerz.lol — shared day/night theme toggle
// include on every page after the <body> markup (or defer)
(function () {
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-theme-btn') === mode;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    var favicon = document.getElementById('favicon');
    if (favicon) favicon.setAttribute('href', mode === 'night' ? 'favicon-lavender.svg' : 'favicon-peach.svg');
    var avatar = document.getElementById('avatar-img');
    if (avatar) avatar.setAttribute('src', mode === 'night' ? 'favicon-lavender.svg' : 'favicon-peach.svg');
    try { localStorage.setItem('guerz-theme', mode); } catch (e) {}
  }

  function initTheme() {
    var saved = 'day';
    try {
      var stored = localStorage.getItem('guerz-theme');
      if (stored === 'day' || stored === 'night') saved = stored;
    } catch (e) {}
    applyTheme(saved);

    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(btn.getAttribute('data-theme-btn'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
