/* guerz.lol Cloudflare Roadmap v2 — app.js */

(() => {
  'use strict';

  /* 1. App references: valid CSS selectors prevent the previous 0-of-0 failure. */
  const STORAGE_KEY = 'guerz-cloudflare-roadmap-zine-v2';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const checkboxes = $$('.task input[type="checkbox"]');
  const safetyBoxes = $$('.safety input[type="checkbox"]');
  const phases = $$('.phase');
  const progressText = $('#progress-text');
  const meterFill = $('#meter-fill');
  const progressMeter = $('#progress-meter');
  const nextTask = $('#next-task');
  const toast = $('#toast');
  const filter = $('#phase-filter');
  const focusToggle = $('#focus-toggle');
  let toastTimer;

  /* 2. Guard: exit loudly in dev tools instead of presenting fake working controls. */
  if (!checkboxes.length || !progressText || !meterFill || !progressMeter || !nextTask) {
    console.error('Roadmap initialization failed: required controls were not found.');
    return;
  }

  /* 3. Toast: lightweight status feedback for all app actions. */
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3500);
  }

  /* 4. Storage: safely retrieve browser-local completion state. */
  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('Could not read saved roadmap progress.', error); return {}; }
  }

  /* 5. Storage: save only task IDs and booleans; no personal or secret data. */
  function saveState() {
    const state = {
      tasks: Object.fromEntries(checkboxes.map((box) => [box.id, box.checked])),
      safety: Object.fromEntries(safetyBoxes.map((box) => [box.parentElement.textContent.trim(), box.checked]))
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('Could not save progress.', error); showToast('Could not save here. Export a backup.'); }
  }

  /* 6. Dashboard: compute progress and update visual plus accessible status. */
  function updateUI() {
    const completed = checkboxes.filter((box) => box.checked).length;
    const total = checkboxes.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    meterFill.style.width = `${percent}%`;
    progressMeter.setAttribute('aria-valuenow', String(percent));
    progressText.textContent = `${completed} of ${total} tasks done · ${percent}%`;
  }

  /* 7. Restore: apply only matching saved keys from a prior browser session. */
  function applyState() {
    const state = readState();
    checkboxes.forEach((box) => { box.checked = Boolean(state.tasks && state.tasks[box.id]); });
    safetyBoxes.forEach((box) => { const key = box.parentElement.textContent.trim(); box.checked = Boolean(state.safety && state.safety[key]); });
    updateUI();
  }

  /* 8. Next-task picker: choose visible unfinished work first, then a safe fallback. */
  function pickNext() {
    const visible = checkboxes.filter((box) => !box.checked && !box.closest('.phase').hidden);
    const box = visible[0] || checkboxes.find((item) => !item.checked);
    if (!box) {
      nextTask.textContent = 'Everything is checked. Either celebrate or add a new phase before your brain opens 47 unrelated tabs.';
      showToast('Roadmap cleared. Respectfully: hell yeah.');
      return;
    }
    const phase = box.closest('.phase');
    const label = box.labels[0];
    phase.querySelectorAll('details').forEach((detail) => { detail.open = true; });
    nextTask.innerHTML = `<strong>${phase.querySelector('.phase-title').textContent}</strong><br>${label.childNodes[0].textContent.trim()}<small>${label.querySelector('small')?.textContent || ''}</small>`;
    phase.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => box.focus({ preventScroll: true }), 450);
  }

  /* 9. Filtering: show the requested category and cancel focus mode to prevent conflicts. */
  function applyFilter() {
    const value = filter.value;
    phases.forEach((phase) => { phase.hidden = value !== 'all' && phase.dataset.group !== value; });
    document.body.classList.remove('focus-mode');
    phases.forEach((phase) => phase.classList.remove('focus-phase'));
    focusToggle.setAttribute('aria-pressed', 'false');
    focusToggle.textContent = 'Focus mode off';
    showToast(value === 'all' ? 'Showing all phases.' : `Showing ${filter.options[filter.selectedIndex].text}.`);
  }

  /* 10. Focus Mode: isolate one visible phase containing incomplete work. */
  function toggleFocus() {
    const isOn = document.body.classList.toggle('focus-mode');
    if (isOn) {
      const visiblePhases = phases.filter((phase) => !phase.hidden);
      const target = visiblePhases.find((phase) => phase.querySelector('input[type="checkbox"]:not(:checked)')) || visiblePhases[0];
      phases.forEach((phase) => phase.classList.toggle('focus-phase', phase === target));
      focusToggle.setAttribute('aria-pressed', 'true');
      focusToggle.textContent = 'Focus mode on';
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Focus mode: one phase. The rest can wait outside.');
    } else {
      phases.forEach((phase) => phase.classList.remove('focus-phase'));
      focusToggle.setAttribute('aria-pressed', 'false');
      focusToggle.textContent = 'Focus mode off';
      showToast('Focus mode off. The entire roadmap has returned from the void.');
    }
  }

  /* 11. Export: generate a JSON backup that can be restored through Import progress. */
  function exportProgress() {
    const payload = { exportedAt: new Date().toISOString(), roadmap: 'guerz.lol-cloudflare-roadmap-zine-v2', checks: Object.fromEntries(checkboxes.map((box) => [box.id, box.checked])), safety: Object.fromEntries(safetyBoxes.map((box) => [box.parentElement.textContent.trim(), box.checked])) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guerz-cloudflare-roadmap-progress.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Progress backup exported. Nice, responsible behavior.');
  }

  /* 12. Import: accept only JSON with known checkbox values; bad files do no harm. */
  function importProgress(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        checkboxes.forEach((box) => { if (typeof parsed.checks?.[box.id] === 'boolean') box.checked = parsed.checks[box.id]; });
        safetyBoxes.forEach((box) => { const key = box.parentElement.textContent.trim(); if (typeof parsed.safety?.[key] === 'boolean') box.checked = parsed.safety[key]; });
        saveState();
        updateUI();
        showToast('Progress imported. The timeline has been repaired.');
      } catch (error) { showToast('That file was not a valid roadmap progress backup. No harm done.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /* 13. Reset: require direct confirmation before deleting only this roadmap's state. */
  function resetProgress() {
    if (!window.confirm('Reset every roadmap checkbox in this browser? Export a backup first if you want one.')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { console.warn(error); }
    checkboxes.concat(safetyBoxes).forEach((box) => { box.checked = false; });
    updateUI();
    showToast('Checks reset. The roadmap has been reborn, damp and furious.');
  }

  /* 14. Event wiring: every user control has one explicit behavior. */
  checkboxes.concat(safetyBoxes).forEach((box) => box.addEventListener('change', () => { saveState(); updateUI(); }));
  $('#pick-next-task').addEventListener('click', pickNext);
  focusToggle.addEventListener('click', toggleFocus);
  $('#open-all-details').addEventListener('click', () => $$('details').forEach((detail) => { detail.open = true; }));
  $('#close-all-details').addEventListener('click', () => $$('details').forEach((detail) => { detail.open = false; }));
  $('#export-progress').addEventListener('click', exportProgress);
  $('#import-progress').addEventListener('change', importProgress);
  $('#reset-progress').addEventListener('click', resetProgress);
  filter.addEventListener('change', applyFilter);

  /* 15. Startup: render from saved state only after every event handler is ready. */
  applyState();
})();
