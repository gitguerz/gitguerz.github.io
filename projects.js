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

  function initTabs() {
    document.querySelectorAll('.lj-project-inner').forEach(function (inner) {
      var panes = [].slice.call(inner.querySelectorAll('.lj-view-pane'));
      if (panes.length < 2) return;
      panes.sort(function (a, b) {
        return (a.getAttribute('data-pane') === 'code' ? 0 : 1) - (b.getAttribute('data-pane') === 'code' ? 0 : 1);
      });
      var bar = document.createElement('div');
      bar.className = 'lj-view-tabs';
      bar.setAttribute('role', 'tablist');
      panes.forEach(function (pane, i) {
        var label = pane.querySelector('.lj-pane-label');
        if (label) label.remove();
        var isCode = pane.getAttribute('data-pane') === 'code';
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'lj-view-tab';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        tab.textContent = isCode ? '</> code' : '▶ preview';
        tab.addEventListener('click', function () {
          bar.querySelectorAll('.lj-view-tab').forEach(function (t, j) {
            t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
            panes[j].hidden = t !== tab;
          });
          loadFrame(inner);
        });
        bar.appendChild(tab);
        pane.hidden = i !== 0;
        inner.appendChild(pane);
      });
      inner.insertBefore(bar, panes[0]);
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
    initTabs();
    initLazyPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
