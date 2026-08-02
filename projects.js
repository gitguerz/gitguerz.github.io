// guerz.lol — projects page: copy-to-clipboard, lazy iframe previews
(function () {
  function loadFrame(scope) {
    if (!scope) return;
    scope.querySelectorAll('iframe[data-src]').forEach(function (f) {
      if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src'));
    });
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

  function initLazyPreview() {
    document.querySelectorAll('.lj-project-box').forEach(function (box) {
      box.addEventListener('toggle', function () {
        if (!box.open) return;
        loadFrame(box);
      });
    });
  }

  function init() {
    initCopy();
    initLazyPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
