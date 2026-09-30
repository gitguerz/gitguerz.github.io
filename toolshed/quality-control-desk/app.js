/* Guerz Site Quality Control Desk — app.js */

(() => {
  'use strict';

  /* 1. Element references: valid selectors and stable checkbox IDs power the app state. */
  const STORAGE_KEY = 'guerz-site-quality-control-desk-v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const reviewBoxes = $$('.check-row input[type="checkbox"]');
  const lanes = $$('.review-lane');
  const scoreNumber = $('#score-number');
  const progressText = $('#progress-text');
  const meter = $('#progress-meter');
  const progressFill = $('#progress-fill');
  const nextTask = $('#next-task');
  const toast = $('#toast');
  const filter = $('#lane-filter');
  const focusToggle = $('#focus-toggle');
  let toastTimer;
  let focusEnabled = false;

  /* 2. Startup guard: avoids a deceptive half-working page if essential markup changes. */
  if (!reviewBoxes.length || !scoreNumber || !progressText || !meter || !progressFill || !nextTask) {
    console.error('QC Desk could not start: expected review controls are missing.');
    return;
  }

  /* 3. Toast feedback: reports local interactions without modal interruptions. */
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* 4. Local state reader: malformed or unavailable browser storage becomes an empty review. */
  function readState() {
    try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (error) { console.warn('Could not read saved QC state.', error); return {}; }
  }

  /* 5. Local state writer: stores only checkbox IDs and booleans in the current browser. */
  function saveState() {
    const checks = Object.fromEntries(reviewBoxes.map((box) => [box.id, box.checked]));
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ checks })); }
    catch (error) { console.warn('Could not save QC state.', error); showToast('Could not save here—export your review log.'); }
  }

  /* 6. Score renderer: calculates review progress and updates visual and ARIA status. */
  function renderScore() {
    const complete = reviewBoxes.filter((box) => box.checked).length;
    const total = reviewBoxes.length;
    const percent = total ? Math.round((complete / total) * 100) : 0;
    scoreNumber.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    meter.setAttribute('aria-valuenow', String(percent));
    progressText.textContent = `${complete} of ${total} review checks complete`;
  }

  /* 7. State restore: only matching current checkbox IDs receive saved states. */
  function restoreState() {
    const state = readState();
    reviewBoxes.forEach((box) => { box.checked = Boolean(state.checks && state.checks[box.id]); });
    renderScore();
  }

  /* 8. Next-check picker: selects unfinished visible work, then scrolls and focuses it. */
  function pickNextTask() {
    const visible = reviewBoxes.filter((box) => !box.checked && !box.closest('.review-lane').hidden);
    const selected = visible[0] || reviewBoxes.find((box) => !box.checked);
    if (!selected) {
      nextTask.textContent = 'Review complete. Record the release, close the tabs, and let the page exist for a while.';
      showToast('Desk cleared. Put the red pen down.');
      return;
    }
    const lane = selected.closest('.review-lane');
    const label = selected.parentElement;
    const title = label.querySelector('strong')?.textContent || 'Complete the selected check.';
    lane.querySelectorAll('details').forEach((details) => { details.open = true; });
    nextTask.innerHTML = `<strong>${lane.querySelector('h2').textContent}</strong><br>${title}`;
    lane.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => selected.focus({ preventScroll: true }), 420);
  }

  /* 9. Filter: narrows the board and disables Focus Mode so the two display states cannot conflict. */
  function applyFilter() {
    const value = filter.value;
    lanes.forEach((lane) => { lane.hidden = value !== 'all' && lane.dataset.lane !== value; });
    focusEnabled = false;
    document.body.classList.remove('focused');
    lanes.forEach((lane) => lane.classList.remove('focus-lane'));
    focusToggle.setAttribute('aria-pressed', 'false');
    focusToggle.textContent = 'Enter focus review';
    showToast(value === 'all' ? 'Showing every review lane.' : 'Review lane filtered.');
  }

  /* 10. Focus review: isolates one visible lane with unfinished work for lower cognitive load. */
  function toggleFocus() {
    focusEnabled = !focusEnabled;
    const visibleLanes = lanes.filter((lane) => !lane.hidden);
    const target = visibleLanes.find((lane) => lane.querySelector('input[type="checkbox"]:not(:checked)')) || visibleLanes[0];
    lanes.forEach((lane) => lane.classList.toggle('focus-lane', focusEnabled && lane === target));
    document.body.classList.toggle('focused', focusEnabled);
    focusToggle.setAttribute('aria-pressed', String(focusEnabled));
    focusToggle.textContent = focusEnabled ? 'Exit focus review' : 'Enter focus review';
    if (focusEnabled && target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(focusEnabled ? 'One review lane. Everything else can wait.' : 'Full review board restored.');
  }

  /* 11. Detail controls: open or close native evidence-note panels together. */
  function setDetails(open) { $$('details').forEach((details) => { details.open = open; }); }

  /* 12. Markdown export: creates a portable review log for Obsidian with current checked states. */
  function exportReviewLog() {
    const lines = reviewBoxes.map((box) => {
      const title = box.parentElement.querySelector('strong')?.textContent || box.id;
      return `- [${box.checked ? 'x' : ' '}] ${title}`;
    });
    const markdown = ['---','title: "Guerz Site Quality Control Review"',`updated: "${new Date().toISOString().slice(0, 10)}"`,'license: "CC BY-NC-SA 4.0 for original content/design"','---','','# Guerz Site Quality Control Review','','## Checks',...lines,'','## Linear notes','© 2026 Guerz. Original review structure, writing, templates, and visual design: CC BY-NC-SA 4.0 — https://creativecommons.org/licenses/by-nc-sa/4.0/','','Primary author, editor, and implementer: Guerz. Research and drafting assistance: Perplexity AI. Third-party materials excluded unless explicitly identified.',''].join('\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guerz-site-quality-control-review.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Review log exported for Obsidian.');
  }

  /* 13. Reset: requires confirmation before deleting only this app's saved local state. */
  function resetReview() {
    if (!window.confirm('Reset all quality-control review marks in this browser? Export first if you want a record.')) return;
    try { window.localStorage.removeItem(STORAGE_KEY); }
    catch (error) { console.warn('Could not clear saved QC state.', error); }
    reviewBoxes.forEach((box) => { box.checked = false; });
    renderScore();
    showToast('Review marks reset. Fresh page, fresh eyes.');
  }

  /* 14. Theme: flips the document token set without claiming cross-device preference storage. */
  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    showToast(root.dataset.theme === 'dark' ? 'Dark proofing desk on.' : 'Light proofing desk on.');
  }

  /* 15. Event wiring: each UI element receives one explicit responsibility. */
  reviewBoxes.forEach((box) => box.addEventListener('change', () => { saveState(); renderScore(); }));
  $('#pick-next-task').addEventListener('click', pickNextTask);
  $('#export-progress').addEventListener('click', exportReviewLog);
  focusToggle.addEventListener('click', toggleFocus);
  $('#open-all-details').addEventListener('click', () => setDetails(true));
  $('#close-all-details').addEventListener('click', () => setDetails(false));
  $('#reset-progress').addEventListener('click', resetReview);
  filter.addEventListener('change', applyFilter);
  $('#theme-toggle').addEventListener('click', toggleTheme);

  /* 16. App startup: restore saved marks and show an accurate review score immediately. */
  restoreState();
})();
