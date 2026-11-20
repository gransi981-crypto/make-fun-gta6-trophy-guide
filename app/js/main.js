// Leonida Ledger — boot and wiring.
// Loads app/data/trophies.json, restores saved progress from localStorage,
// and wires the tracker tabs, kind filters, search, spoiler setting and the
// export / import controls. The app fetches nothing else: every file it
// loads lives under app/, and it makes no network request at run time.

import { KIND_FILTERS, countForKind, filterTrophies } from './filters.js';
import {
  loadState,
  saveState,
  isEarned,
  setEarned,
  earnedCount,
  earnedCountByGrade,
  exportProgress,
  parseImportedProgress,
  resetProgress,
} from './store.js';
import { renderChecklist, renderDetail } from './renderChecklist.js';
import { renderRoadmap, renderMissables } from './renderRoadmap.js';

const DATA_URL = 'data/trophies.json';

const state = loadState();
let trophies = [];
let activeKind = 'all';
let query = '';
let activeView = 'tracker';

const $ = (id) => document.getElementById(id);

function updateProgress() {
  const earned = earnedCount(state, trophies);
  const total = trophies.length;
  $('progress-count').textContent = `${earned} / ${total} earned`;
  $('progress-fill').style.width = total ? `${(earned / total) * 100}%` : '0%';
  $('progress-fill').setAttribute('aria-valuenow', String(earned));
  const byGrade = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => `${earnedCountByGrade(state, trophies, grade)} ${grade}`)
    .join(' · ');
  $('progress-grades').textContent = byGrade;
  $('save-count').textContent = `${earned} of ${total} trophies earned — saved in this browser.`;
}

function refreshAll() {
  updateProgress();
  const visible = filterTrophies(trophies, activeKind, query);
  renderChecklist($('trophy-list'), visible, state, selectTrophy);
  const selected = trophies.find((t) => t.id === state.selectedId) ?? null;
  renderDetail($('detail-pane'), selected, state, (id, earned) => {
    setEarned(state, id, earned);
    refreshAll();
  });
  $('list-count').textContent = `${visible.length} of ${trophies.length} trophies`;
  $('spoiler-toggle').checked = state.spoiler;
  $('spoiler-toggle-save').checked = state.spoiler;
  document.body.classList.toggle('spoiler-on', state.spoiler);
}

function selectTrophy(id, { keepSelection } = {}) {
  state.selectedId = id;
  saveState(state);
  refreshAll();
  if (!keepSelection) {
    $('detail-pane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function buildFilterChips() {
  const bar = $('kind-filters');
  bar.replaceChildren();
  for (const filter of KIND_FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip' + (filter.key === activeKind ? ' is-active' : '');
    button.textContent = `${filter.label} (${countForKind(trophies, filter.key)})`;
    button.setAttribute('aria-pressed', filter.key === activeKind ? 'true' : 'false');
    button.addEventListener('click', () => {
      activeKind = filter.key;
      buildFilterChips();
      refreshAll();
    });
    bar.appendChild(button);
  }
}

function showView(view) {
  activeView = view;
  for (const tab of document.querySelectorAll('[data-view-tab]')) {
    tab.classList.toggle('is-active', tab.dataset.viewTab === view);
    tab.setAttribute('aria-selected', tab.dataset.viewTab === view ? 'true' : 'false');
  }
  for (const section of document.querySelectorAll('[data-view]')) {
    section.hidden = section.dataset.view !== view;
  }
  if (view === 'roadmap') renderRoadmap($('roadmap-body'), trophies, state);
  if (view === 'missables') renderMissables($('missables-body'), trophies, state);
}

function setSpoiler(on) {
  state.spoiler = on;
  saveState(state);
  refreshAll();
}

function wireSaveControls() {
  $('export-button').addEventListener('click', () => {
    const count = exportProgress(state);
    $('save-message').textContent = `Exported ${count} earned ${count === 1 ? 'trophy' : 'trophies'} to leonida-ledger-progress.json.`;
  });
  $('import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = parseImportedProgress(await file.text());
      state.earned = imported.earned;
      state.spoiler = imported.spoiler;
      saveState(state);
      refreshAll();
      $('save-message').textContent = `Imported ${imported.importedCount} earned ${imported.importedCount === 1 ? 'trophy' : 'trophies'} from ${file.name}.`;
    } catch {
      $('save-message').textContent = 'That file could not be read as a Leonida Ledger export. Nothing was changed.';
    }
    event.target.value = '';
  });
  $('reset-button').addEventListener('click', () => {
    if (window.confirm('Clear all earned trophies? This cannot be undone.')) {
      resetProgress(state);
      refreshAll();
      $('save-message').textContent = 'Progress cleared.';
    }
  });
}

async function boot() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`could not load ${DATA_URL}`);
  const data = await response.json();
  trophies = data.trophies;

  $('total-count').textContent = String(trophies.length);
  $('grade-counts').textContent = '1 platinum · 2 gold · 6 silver · 46 bronze · 28 hidden on PlayStation · 0 online';

  buildFilterChips();
  $('search-input').addEventListener('input', (event) => {
    query = event.target.value;
    refreshAll();
  });
  $('spoiler-toggle').addEventListener('change', (event) => setSpoiler(event.target.checked));
  $('spoiler-toggle-save').addEventListener('change', (event) => setSpoiler(event.target.checked));
  for (const tab of document.querySelectorAll('[data-view-tab]')) {
    tab.addEventListener('click', () => showView(tab.dataset.viewTab));
  }
  wireSaveControls();

  if (!trophies.some((t) => t.id === state.selectedId)) {
    state.selectedId = trophies.find((t) => t.id === 28)?.id ?? trophies[0].id;
  }
  refreshAll();
  showView(activeView);
}

boot().catch((error) => {
  $('trophy-list').innerHTML = `<li class="empty-row">The trophy list could not be loaded: ${error.message}</li>`;
});
