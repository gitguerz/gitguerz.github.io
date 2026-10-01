"use strict";
/* WordPress 101 — The Blog Archive Engine | interactions, local progress, and export */
const STORAGE_KEY = "blogguerz-archive-engine-v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const tasks = $$(".task input[type='checkbox']");
const tests = $$(".test-check");
const stations = $$(".station");
const routes = $$("input[name='wordpress-route']");
const notes = [$("#theme-notes"), $("#next-notes")];
const progressNumber = $("#progress-number");
const progressText = $("#progress-text");
const progressMeter = $("#progress-meter");
const progressFill = $("#progress-fill");
const nextTask = $("#next-task");
const routeResult = $("#route-result");
const toast = $("#toast");
const stationFilter = $("#station-filter");
const focusToggle = $("#focus-toggle");
let focused = false;
let toastTimer;

function announce(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function readState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (error) { console.warn("Could not read local workshop state.", error); return {}; }
}
function saveState() {
  const state = {
    tasks: Object.fromEntries(tasks.map(box => [box.id, box.checked])),
    tests: tests.map(box => box.checked),
    route: routes.find(input => input.checked)?.value || "hosted",
    notes: Object.fromEntries(notes.map(note => [note.id, note.value])),
    theme: document.documentElement.dataset.theme || "light"
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.warn("Could not save local workshop state.", error); announce("Could not save here—export your workshop log."); }
}
function renderProgress() {
  const done = tasks.filter(box => box.checked).length;
  const total = tasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressNumber.textContent = `${percent}%`;
  progressText.textContent = `${done} of ${total} roadmap tasks complete`;
  progressFill.style.width = `${percent}%`;
  progressMeter.setAttribute("aria-valuenow", String(percent));
}
function renderRoute() {
  const route = routes.find(input => input.checked)?.value || "hosted";
  routeResult.innerHTML = route === "hosted"
    ? "<strong>Hosted route selected.</strong> Start with editor fluency, account recovery, menus, templates, and a truthful small site. Check the current plan before assuming a feature, theme, or plugin is available."
    : "<strong>Self-hosted route selected.</strong> Start small: one maintained theme, a minimal plugin set, a documented backup location, and a staging/rollback story before bigger changes.";
}
function visibleTasks() { return tasks.filter(box => !box.closest(".station").hidden); }
function pickNextTask() {
  const selected = visibleTasks().find(box => !box.checked) || tasks.find(box => !box.checked);
  if (!selected) {
    nextTask.textContent = "Roadmap clear. Write the release note, keep the recovery path, and go publish something real.";
    announce("Workshop clear. Publishing permit granted.");
    return;
  }
  const station = selected.closest(".station");
  station.querySelectorAll("details").forEach(detail => detail.open = true);
  nextTask.innerHTML = `<strong>${station.querySelector("h2").textContent}</strong><br>${selected.parentElement.querySelector("strong").textContent}`;
  station.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => selected.focus({ preventScroll: true }), 420);
  announce("One next move selected.");
}
function applyFilter() {
  const group = stationFilter.value;
  stations.forEach(station => station.hidden = group !== "all" && station.dataset.group !== group);
  focused = false;
  document.body.classList.remove("focused");
  stations.forEach(station => station.classList.remove("focus-station"));
  focusToggle.setAttribute("aria-pressed", "false");
  focusToggle.textContent = "Focus workshop off";
  announce(group === "all" ? "Showing all phases." : "Roadmap phase filtered.");
}
function toggleFocus() {
  focused = !focused;
  const visibleStations = stations.filter(station => !station.hidden);
  const target = visibleStations.find(station => station.querySelector("input[type='checkbox']:not(:checked)")) || visibleStations[0];
  stations.forEach(station => station.classList.toggle("focus-station", focused && station === target));
  document.body.classList.toggle("focused", focused);
  focusToggle.setAttribute("aria-pressed", String(focused));
  focusToggle.textContent = focused ? "Focus workshop on" : "Focus workshop off";
  if (focused && target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  announce(focused ? "One phase at a time. The rest is in the supply closet." : "Full workshop restored.");
}
function setDetails(open) { $$("details").forEach(detail => detail.open = open); }
function toggleTheme() {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  saveState();
  announce(root.dataset.theme === "dark" ? "Night workshop on." : "Day workshop on.");
}
function exportLog() {
  const route = routes.find(input => input.checked)?.value || "hosted";
  const taskLines = tasks.map(box => `- [${box.checked ? "x" : " "}] ${box.parentElement.querySelector("strong").textContent}`);
  const testLines = tests.map(box => `- [${box.checked ? "x" : " "}] ${box.parentElement.textContent.trim()}`);
  const text = [
    "---", "title: WordPress 101 — The Blog Archive Engine", `updated: ${new Date().toISOString().slice(0,10)}`, `route: ${route}`, "---", "",
    "# WordPress 101 — The Blog Archive Engine", "", `Route selected: ${route}`, "", "## Roadmap tasks", ...taskLines, "", "## Battle test register", ...testLines, "", "## Field notes", `- Theme/template: ${notes[0].value || ""}`, `- One next action: ${notes[1].value || ""}`, "", "## Linear notes", "Original roadmap writing and design: Guerz. Third-party platform and WordPress materials remain subject to their owners' terms.", ""
  ].join("\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url; link.download = "blogguerz-archive-engine-log.md"; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce("Workshop log exported for Obsidian.");
}
function resetProgress() {
  if (!confirm("Reset all local task marks and field notes in this browser? Export first if you want a record.")) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (error) { console.warn("Could not clear workshop state.", error); }
  tasks.concat(tests).forEach(box => box.checked = false);
  notes.forEach(note => note.value = "");
  routes[0].checked = true;
  document.documentElement.dataset.theme = "light";
  renderRoute(); renderProgress(); announce("Local progress reset. Fresh ink, fresh page.");
}
function restoreState() {
  const state = readState();
  tasks.forEach(box => box.checked = Boolean(state.tasks?.[box.id]));
  tests.forEach((box, index) => box.checked = Boolean(state.tests?.[index]));
  const savedRoute = routes.find(input => input.value === state.route);
  if (savedRoute) savedRoute.checked = true;
  notes.forEach(note => note.value = state.notes?.[note.id] || "");
  document.documentElement.dataset.theme = state.theme === "dark" ? "dark" : "light";
  renderRoute(); renderProgress();
}
tasks.concat(tests).forEach(box => box.addEventListener("change", () => { saveState(); renderProgress(); }));
notes.forEach(note => note.addEventListener("input", saveState));
routes.forEach(input => input.addEventListener("change", () => { saveState(); renderRoute(); }));
$("#pick-next-task").addEventListener("click", pickNextTask);
$("#export-progress").addEventListener("click", exportLog);
$("#focus-toggle").addEventListener("click", toggleFocus);
$("#open-all-details").addEventListener("click", () => setDetails(true));
$("#close-all-details").addEventListener("click", () => setDetails(false));
$("#reset-progress").addEventListener("click", resetProgress);
$("#theme-toggle").addEventListener("click", toggleTheme);
stationFilter.addEventListener("change", applyFilter);
restoreState();
