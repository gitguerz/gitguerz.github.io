// guerz.lol — projects page: copy-to-clipboard, preview/code toggle, lazy iframes
(function () {
  function loadFrame(pane) {
    if (!pane) return;
    var f = pane.querySelector('iframe[data-src]');
    if (f && !f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src'));
  }

  function initCopy() {
    document.querySelectorAll('.lj-code-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var block = btn.closest('.lj-code-block');
        var code = block ? block.querySelector('code') : null;
        if (!code) return;
        var text = code.textContent;
        var done = function () {
          btn.textContent = 'copied \u2713';
          clearTimeout(btn._t);
          btn._t = setTimeout(function () { btn.textContent = 'copy'; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          try {
            var ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          } catch (e) {}
          done();
        }
      });
    });
  }

  function initToggle() {
    document.querySelectorAll('.lj-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var inner = btn.closest('.lj-project-inner');
        if (!inner) return;
        var view = btn.getAttribute('data-view');
        inner.querySelectorAll('.lj-view-btn').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        inner.querySelectorAll('.lj-view-pane').forEach(function (p) {
          var match = p.getAttribute('data-pane') === view;
          p.hidden = !match;
          if (match) loadFrame(p);
        });
      });
    });
  }

  function initLazyPreview() {
    document.querySelectorAll('.lj-project-box').forEach(function (box) {
      box.addEventListener('toggle', function () {
        if (!box.open) return;
        var active = box.querySelector('.lj-view-pane:not([hidden])');
        loadFrame(active);
      });
    });
  }

  function init() {
    initCopy();
    initToggle();
    initLazyPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
