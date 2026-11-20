// Leonida Ledger — filters, search and the spoiler rule.
// Kinds follow the official descriptions: story (the 12 chapter and mission
// trophies), missable (the one trophy that can be missed), collectibles
// (cards, scans, vehicles, garages, map) and activities (everything else
// playable). No trophy in this list is online — all 55 are offline,
// single-player — so the online filter is an honest empty state.

export const KIND_FILTERS = [
  { key: 'all', label: 'All trophies' },
  { key: 'story', label: 'Story' },
  { key: 'missable', label: 'Missable' },
  { key: 'collectibles', label: 'Collectibles' },
  { key: 'activities', label: 'Activities' },
  { key: 'online', label: 'Online' },
];

export function countForKind(trophies, kind) {
  if (kind === 'all') return trophies.length;
  if (kind === 'online') return 0;
  return trophies.filter((trophy) => trophy.kinds.includes(kind)).length;
}

export function trophyMatchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'online') return false;
  return trophy.kinds.includes(kind);
}

export function trophyMatchesSearch(trophy, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    trophy.name.toLowerCase().includes(q) ||
    trophy.description.toLowerCase().includes(q) ||
    trophy.guide.toLowerCase().includes(q)
  );
}

export function filterTrophies(trophies, kind, query) {
  return trophies.filter(
    (trophy) => trophyMatchesKind(trophy, kind) && trophyMatchesSearch(trophy, query),
  );
}

// Spoiler-safe mode hides the name and description of every trophy that is
// hidden on PlayStation until it is earned. Earned trophies always show.
// The platinum and the visible trophies are never masked.
export function isMasked(trophy, state) {
  return state.spoiler && trophy.hidden && !state.earned[trophy.id];
}

export function maskedName(trophy) {
  return trophy.grade === 'gold'
    ? 'Hidden gold trophy'
    : 'Hidden story trophy';
}

export const SPOILER_NOTE =
  'Spoiler-safe mode is on: the names and descriptions of the 28 trophies hidden on PlayStation stay hidden until you earn them.';
