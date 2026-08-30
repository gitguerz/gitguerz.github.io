// guerz.lol — projects page: copy-to-clipboard, lazy iframe previews
(function () {
  function loadFrame(scope) {
    if (!scope) return;
    scope.querySelectorAll('iframe[data-src]').forEach(function (f) {
      if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src'));
    });
  }

  // numbered lines + syntax-colored tokens + comments styled as italic annotations
  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var HTML_RE = /(<!DOCTYPE[^>]*>)|(<\/?[a-zA-Z][\w:-]*)|(\/>|>)|([a-zA-Z_:][\w:-]*)(=)("[^"]*"|'[^']*')|(&[a-zA-Z#0-9]+;)/g;
  function tokenizeHtml(code) {
    var out = '', last = 0, m;
    HTML_RE.lastIndex = 0;
    while ((m = HTML_RE.exec(code)) !== null) {
      if (m.index > last) out += escHtml(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-punct">' + escHtml(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tok-name">' + escHtml(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tok-punct">' + escHtml(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tok-attr">' + escHtml(m[4]) + '</span><span class="tok-punct">' + escHtml(m[5]) + '</span><span class="tok-val">' + escHtml(m[6]) + '</span>';
      else if (m[7]) out += '<span class="tok-func">' + escHtml(m[7]) + '</span>';
      last = HTML_RE.lastIndex;
    }
    out += escHtml(code.slice(last));
    return out;
  }

  var CSS_RE = /(@[a-zA-Z-]+)|(::?[a-zA-Z-][\w-]*)|(\.[a-zA-Z][\w-]*)|(#[0-9a-fA-F]{3,8}\b)|(#[a-zA-Z][\w-]*)|([a-zA-Z-]+)(\()|(\))|(-?\d*\.?\d+[a-zA-Z%]*)|(["'][^"']*["'])|([a-zA-Z-]+(?=\s*:(?!:)))|([a-zA-Z-]+(?=\s*[,{]))|([a-zA-Z][a-zA-Z0-9-]*)|([{}:;,])/g;
  function tokenizeCss(code) {
    var out = '', last = 0, m;
    CSS_RE.lastIndex = 0;
    while ((m = CSS_RE.exec(code)) !== null) {
      if (m.index > last) out += escHtml(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-func">' + escHtml(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tok-func">' + escHtml(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tok-attr">' + escHtml(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tok-num">' + escHtml(m[4]) + '</span>';
      else if (m[5]) out += '<span class="tok-num">' + escHtml(m[5]) + '</span>';
      else if (m[6]) out += '<span class="tok-func">' + escHtml(m[6]) + '</span><span class="tok-punct">' + escHtml(m[7]) + '</span>';
      else if (m[8]) out += '<span class="tok-punct">' + escHtml(m[8]) + '</span>';
      else if (m[9]) out += '<span class="tok-num">' + escHtml(m[9]) + '</span>';
      else if (m[10]) out += '<span class="tok-val">' + escHtml(m[10]) + '</span>';
      else if (m[11]) out += '<span class="tok-attr">' + escHtml(m[11]) + '</span>';
      else if (m[12]) out += '<span class="tok-name">' + escHtml(m[12]) + '</span>';
      else if (m[13]) out += '<span class="tok-val">' + escHtml(m[13]) + '</span>';
      else if (m[14]) out += '<span class="tok-punct">' + escHtml(m[14]) + '</span>';
      last = CSS_RE.lastIndex;
    }
    out += escHtml(code.slice(last));
    return out;
  }

  var COMMENT_RE = /(<!--[\s\S]*?-->)|(\/\*[\s\S]*?\*\/)/g;

  function highlightCode() {
    document.querySelectorAll('.code code').forEach(function (code) {
      if (code.dataset.cmt) return;
      code.dataset.cmt = '1';
      var raw = code.textContent;
      code._raw = raw;
      var block = code.closest('.code-block');
      var fileEl = block ? block.querySelector('.code-file') : null;
      var fileName = fileEl ? fileEl.textContent.trim() : '';
      var tokenize = /\.css$/i.test(fileName) ? tokenizeCss : tokenizeHtml;
      var lines = raw.replace(/\n$/, '').split('\n');
      var html = lines.map(function (line, i) {
        var out = '', last = 0, m;
        COMMENT_RE.lastIndex = 0;
        while ((m = COMMENT_RE.exec(line)) !== null) {
          if (m.index > last) out += tokenize(line.slice(last, m.index));
          out += '<span class="cmt">' + escHtml(m[0]) + '</span>';
          last = COMMENT_RE.lastIndex;
        }
        out += tokenize(line.slice(last));
        return '<div class="line"><span class="ln" aria-hidden="true">' + (i + 1) + '</span><span class="src">' + out + '</span></div>';
      }).join('');
      code.innerHTML = html;
    });
  }

  function announce(msg) {
    var live = document.getElementById('sr-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'sr-live';
      live.className = 'sr-only';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      document.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 60);
  }

  function initCopy() {
    document.querySelectorAll('.code-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var block = btn.closest('.code-block');
        var code = block ? block.querySelector('code') : null;
        if (!code) return;
        var text = code._raw || code.textContent;
        var done = function () {
          btn.textContent = 'copied \u2713';
          announce('code copied to clipboard');
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

  // Tabs: every tab is Tab-reachable (SC 2.1.1) and arrow / home / end also work
  var tabUid = 0;
  function initTabs() {
    document.querySelectorAll('.project-inner').forEach(function (inner) {
      var panes = [].slice.call(inner.querySelectorAll('.view-pane'));
      if (panes.length < 2) return;
      var order = { html: 0, code: 0, css: 1, preview: 2 };
      panes.sort(function (a, b) {
        return order[a.getAttribute('data-pane')] - order[b.getAttribute('data-pane')];
      });
      var uid = ++tabUid;
      var bar = document.createElement('div');
      bar.className = 'view-tabs';
      bar.setAttribute('role', 'tablist');
      bar.setAttribute('aria-label', 'project view');
      var tabs = [];

      function select(index, moveFocus) {
        tabs.forEach(function (t, j) {
          var on = j === index;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = 0;
          panes[j].hidden = !on;
        });
        if (moveFocus) tabs[index].focus();
        loadFrame(inner);
      }

      panes.forEach(function (pane, i) {
        var label = pane.querySelector('.pane-label');
        if (label) label.remove();
        var kind = pane.getAttribute('data-pane');
        var tabId = 'tab-' + uid + '-' + i;
        var paneId = 'pane-' + uid + '-' + i;
        var tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'view-tab';
        tab.id = tabId;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        tab.setAttribute('aria-controls', paneId);
        tab.tabIndex = 0;
        tab.textContent = kind === 'html' ? '</> html' : kind === 'css' ? '</> css' : kind === 'code' ? '</> code' : '▶ preview';
        tab.addEventListener('click', function () { select(i, false); });
        tab.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = tabs.length - 1;
          if (next === null) return;
          e.preventDefault();
          select(next, true);
        });
        pane.id = paneId;
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-labelledby', tabId);
        pane.tabIndex = 0;
        pane.hidden = i !== 0;
        tabs.push(tab);
        bar.appendChild(tab);
        inner.appendChild(pane);
      });
      inner.insertBefore(bar, panes[0]);
      var links = inner.querySelector(':scope > .project-links');
      if (links) inner.appendChild(links);
    });
  }

  function initLazyPreview() {
    document.querySelectorAll('.project-box').forEach(function (box) {
      box.addEventListener('toggle', function () {
        if (!box.open) return;
        loadFrame(box);
      });
    });
  }

  function init() {
    highlightCode();
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
