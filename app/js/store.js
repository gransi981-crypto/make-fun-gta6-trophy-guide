// Leonida Ledger — saved progress.
// The tracker keeps its state in the browser only: which trophies are earned,
// whether spoiler-safe mode is on, and which trophy is open in the detail pane.
// Nothing is sent anywhere. Export writes the same state to a file the reader
// can keep or move to another browser; import reads such a file back.

export const STORAGE_KEY = 'leonida-ledger-v1';
export const EXPORT_FILENAME = 'leonida-ledger-progress.json';

export function blankState() {
  return { earned: {}, spoiler: false, selectedId: null };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankState();
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      spoiler: parsed.spoiler === true,
      selectedId: typeof parsed.selectedId === 'number' ? parsed.selectedId : null,
    };
  } catch {
    return blankState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: state.earned,
      spoiler: state.spoiler,
      selectedId: state.selectedId,
    }));
  } catch {
    // Storage can be full or blocked; the checklist still works in memory.
  }
}

export function isEarned(state, trophyId) {
  return state.earned[trophyId] === true;
}

export function setEarned(state, trophyId, earned) {
  if (earned) state.earned[trophyId] = true;
  else delete state.earned[trophyId];
  saveState(state);
}

export function earnedCount(state, trophies) {
  return trophies.filter((trophy) => isEarned(state, trophy.id)).length;
}

export function earnedCountByGrade(state, trophies, grade) {
  return trophies.filter((trophy) => trophy.grade === grade && isEarned(state, trophy.id)).length;
}

export function exportProgress(state) {
  const payload = {
    app: 'Leonida Ledger — GTA 6 trophy tracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: Object.keys(state.earned).map(Number).sort((a, b) => a - b),
    spoiler: state.spoiler,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = EXPORT_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return payload.earned.length;
}

export function parseImportedProgress(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
  const ids = Array.isArray(parsed.earned) ? parsed.earned : [];
  const earned = {};
  for (const id of ids) {
    const n = Number(id);
    if (Number.isInteger(n) && n >= 1 && n <= 55) earned[n] = true;
  }
  return {
    earned,
    spoiler: parsed.spoiler === true,
    importedCount: Object.keys(earned).length,
  };
}

export function resetProgress(state) {
  state.earned = {};
  saveState(state);
}
