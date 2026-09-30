/* WordPress 101 Side Quest Workshop — app.js */

(() => {
  'use strict';

  /* 1. App references: stable selectors and IDs drive progress, filtering, and export. */
  const STORAGE_KEY = 'wordpress-side-quest-workshop-v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const taskBoxes = $$('.task input[type="checkbox"]');
  const testBoxes = $$('.test-check');
  const stations = $$('.station');
  const routeInputs = $$('input[name="wordpress-route"]');
  const progressNumber = $('#progress-number');
  const progressText = $('#progress-text');
  const meter = $('#progress-meter');
  const progressFill = $('#progress-fill');
  const nextTask = $('#next-task');
  const routeResult = $('#route-result');
  const toast = $('#toast');
  const filter = $('#station-filter');
  const focusToggle = $('#focus-toggle');
  let toastTimer;
  let focusEnabled = false;

  /* 2. Guard: fail clearly in developer tools rather than presenting a fake working workshop. */
  if (!taskBoxes.length || !progressNumber || !progressText || !meter || !progressFill || !nextTask || !routeResult) {
    console.error('Workshop initialization failed: expected controls are missing.');
    return;
  }

  /* 3. Toast: gives short feedback without blocking the user with a modal. */
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* 4. Storage read: invalid or blocked local state becomes a harmless blank workshop. */
  function readState() {
    try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('Could not read workshop state.', error); return {}; }
  }

  /* 5. Storage write: saves only local checkbox states and selected route. */
  function saveState() {
    const state = {
      tasks: Object.fromEntries(taskBoxes.map((box) => [box.id, box.checked])),
      tests: Object.fromEntries(testBoxes.map((box, index) => [index, box.checked])),
      route: routeInputs.find((input) => input.checked)?.value || 'hosted'
    };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('Could not save workshop state.', error); showToast('Could not save here—export your workshop log.'); }
  }

  /* 6. Progress renderer: counts only core roadmap work; test register remains an independent safety gate. */
  function renderProgress() {
    const done = taskBoxes.filter((box) => box.checked).length;
    const total = taskBoxes.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    progressNumber.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    meter.setAttribute('aria-valuenow', String(percent));
    progressText.textContent = `${done} of ${total} workshop tasks complete`;
  }

  /* 7. Route explainer: updates guidance for the selected hosted or self-hosted path. */
  function renderRoute() {
    const selected = routeInputs.find((input) => input.checked)?.value || 'hosted';
    const content = selected === 'hosted'
      ? '<strong>Hosted route selected.</strong> Start by checking the current WordPress.com plan details for the features you need. Your first wins are editor familiarity, pages, menus, account recovery, and a truthful small site—not installing every plugin tutorial mentions.'
      : '<strong>Self-hosted route selected.</strong> You are responsible for choosing hosting, connecting a domain, backups, updates, and recovery. Start small: one maintained theme, a minimal plugin set, a documented backup location, and a staging/rollback story before bigger changes.';
    routeResult.innerHTML = content;
  }

  /* 8. Restore: applies only current checkbox IDs/indices and a recognized route selection. */
  function restoreState() {
    const state = readState();
    taskBoxes.forEach((box) => { box.checked = Boolean(state.tasks && state.tasks[box.id]); });
    testBoxes.forEach((box, index) => { box.checked = Boolean(state.tests && state.tests[index]); });
    const savedRoute = routeInputs.find((input) => input.value === state.route);
    if (savedRoute) savedRoute.checked = true;
    renderRoute();
    renderProgress();
  }

  /* 9. Next move: selects unfinished visible work first, then scrolls and focuses the control. */
  function pickNextTask() {
    const visibleIncomplete = taskBoxes.filter((box) => !box.checked && !box.closest('.station').hidden);
    const selected = visibleIncomplete[0] || taskBoxes.find((box) => !box.checked);
    if (!selected) {
      nextTask.textContent = 'Workshop complete. Write the release note, make a backup, and go make something with the site.';
      showToast('Workshop clear. Publishing permit granted.');
      return;
    }
    const station = selected.closest('.station');
    const title = selected.parentElement.querySelector('strong')?.textContent || 'Complete the selected task.';
    station.querySelectorAll('details').forEach((details) => { details.open = true; });
    nextTask.innerHTML = `<strong>${station.querySelector('h2').textContent}</strong><br>${title}`;
    station.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => selected.focus({ preventScroll: true }), 420);
  }

  /* 10. Station filtering: changes view only and turns off Focus Mode to avoid conflicting hidden states. */
  function applyFilter() {
    const group = filter.value;
    stations.forEach((station) => { station.hidden = group !== 'all' && station.dataset.group !== group; });
    focusEnabled = false;
    document.body.classList.remove('focused');
    stations.forEach((station) => station.classList.remove('focus-station'));
    focusToggle.setAttribute('aria-pressed', 'false');
    focusToggle.textContent = 'Focus workshop: off';
    showToast(group === 'all' ? 'Showing all workshop stations.' : 'Workshop station filtered.');
  }

  /* 11. Focus Mode: isolates a visible station with unfinished work and leaves a route back out. */
  function toggleFocus() {
    focusEnabled = !focusEnabled;
    const visibleStations = stations.filter((station) => !station.hidden);
    const target = visibleStations.find((station) => station.querySelector('input[type="checkbox"]:not(:checked)')) || visibleStations[0];
    stations.forEach((station) => station.classList.toggle('focus-station', focusEnabled && station === target));
    document.body.classList.toggle('focused', focusEnabled);
    focusToggle.setAttribute('aria-pressed', String(focusEnabled));
    focusToggle.textContent = focusEnabled ? 'Focus workshop: on' : 'Focus workshop: off';
    if (focusEnabled && target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(focusEnabled ? 'One workshop station. The rest is in the supply closet.' : 'Full workshop restored.');
  }

  /* 12. Details controller: expands/collapses native instructor-note panels together. */
  function setAllDetails(open) { $$('details').forEach((details) => { details.open = open; }); }

  /* 13. Markdown export: makes an Obsidian-ready workshop record using current progress and route. */
  function exportWorkshopLog() {
    const route = routeInputs.find((input) => input.checked)?.value || 'hosted';
    const tasks = taskBoxes.map((box) => `- [${box.checked ? 'x' : ' '}] ${box.parentElement.querySelector('strong')?.textContent || box.id}`);
    const tests = testBoxes.map((box) => `- [${box.checked ? 'x' : ' '}] ${box.parentElement.textContent.trim()}`);
    const markdown = ['---','title: "WordPress 101 Side Quest Workshop"',`updated: "${new Date().toISOString().slice(0, 10)}"`,`route: "${route}"`,'license: "CC BY-NC-SA 4.0 for original content/design"','---','','# WordPress 101 · Side Quest Workshop','','## Route selected',route,'','## Workshop tasks',...tasks,'','## Battle test register',...tests,'','## Linear notes','© 2026 Guerz. Original writing, workshop structure, templates, and visual design: CC BY-NC-SA 4.0 — https://creativecommons.org/licenses/by-nc-sa/4.0/','','Primary author, editor, and implementer: Guerz. Research and drafting assistance: Perplexity AI. Third-party WordPress/platform materials excluded unless explicitly identified.',''].join('\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wordpress-side-quest-workshop-log.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Workshop log exported for Obsidian.');
  }

  /* 14. Reset: confirmation gate prevents accidental deletion of local workshop progress. */
  function resetProgress() {
    if (!window.confirm('Reset all workshop and battle-test marks in this browser? Export first if you want a record.')) return;
    try { window.localStorage.removeItem(STORAGE_KEY); }
    catch (error) { console.warn('Could not clear workshop state.', error); }
    taskBoxes.concat(testBoxes).forEach((box) => { box.checked = false; });
    routeInputs[0].checked = true;
    renderRoute();
    renderProgress();
    showToast('Workshop reset. Fresh ink, fresh page.');
  }

  /* 15. Theme toggle: swaps workshop token sets without claiming cross-device persistence. */
  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    showToast(root.dataset.theme === 'dark' ? 'Night workshop on.' : 'Day workshop on.');
  }

  /* 16. Event wiring: each control gets a single explicit behavior. */
  taskBoxes.concat(testBoxes).forEach((box) => box.addEventListener('change', () => { saveState(); renderProgress(); }));
  routeInputs.forEach((input) => input.addEventListener('change', () => { saveState(); renderRoute(); }));
  $('#pick-next-task').addEventListener('click', pickNextTask);
  $('#export-progress').addEventListener('click', exportWorkshopLog);
  focusToggle.addEventListener('click', toggleFocus);
  $('#open-all-details').addEventListener('click', () => setAllDetails(true));
  $('#close-all-details').addEventListener('click', () => setAllDetails(false));
  $('#reset-progress').addEventListener('click', resetProgress);
  filter.addEventListener('change', applyFilter);
  $('#theme-toggle').addEventListener('click', toggleTheme);

  /* 17. Startup: restore safe browser-local state after all controls have been wired. */
  restoreState();
})();
