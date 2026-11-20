// Leonida Ledger — the tracker: checklist rows and the detail pane.
// A row shows the medal, the official name, description and grade, the kind
// tags, a missable flag, and a checkbox. Clicking a row opens its guide in
// the detail pane beside the list, with its sources named beside it.

import { isMasked, maskedName, SPOILER_NOTE } from './filters.js';
import { isEarned, setEarned } from './store.js';

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };
const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
};

export function gradeBadge(trophy) {
  return `<span class="medal medal-${trophy.grade}" title="${GRADE_LABEL[trophy.grade]}">${GRADE_LETTER[trophy.grade]}</span>`;
}

function targetLine(trophy) {
  if (trophy.target === null || trophy.target === undefined) return '';
  const formatted = trophy.target >= 1000 ? trophy.target.toLocaleString('en-US') : String(trophy.target);
  return `<span class="target">Target: ${formatted}</span>`;
}

export function renderChecklist(listEl, trophies, state, onSelect) {
  listEl.replaceChildren();
  if (trophies.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-row';
    empty.textContent = 'No trophies match this filter.';
    listEl.appendChild(empty);
    return;
  }
  for (const trophy of trophies) {
    const masked = isMasked(trophy, state);
    const earned = isEarned(state, trophy.id);
    const row = document.createElement('li');
    row.className = 'trophy-row' + (earned ? ' is-earned' : '') + (state.selectedId === trophy.id ? ' is-selected' : '');
    row.dataset.trophyId = String(trophy.id);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'earn-check';
    check.checked = earned;
    check.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : trophy.name} as earned`);
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      setEarned(state, trophy.id, check.checked);
      onSelect(trophy.id, { keepSelection: true });
    });

    const body = document.createElement('div');
    body.className = 'row-body';
    const tags = trophy.kinds.map((kind) => `<span class="kind-tag">${KIND_LABEL[kind]}</span>`).join('');
    const missable = trophy.missable ? '<span class="missable-flag">Possibly missable</span>' : '';
    const hidden = trophy.hidden && !masked ? '<span class="hidden-flag">Hidden on PSN</span>' : '';
    body.innerHTML = `
      <div class="row-head">${gradeBadge(trophy)}
        <span class="row-name">${masked ? maskedName(trophy) : escapeHtml(trophy.name)}</span>
        ${missable}${hidden}
      </div>
      <p class="row-desc">${masked ? 'Hidden until earned — turn spoiler-safe mode off, or earn it, to reveal the name and description.' : escapeHtml(trophy.description)}</p>
      <div class="row-meta">${tags}${targetLine(trophy)}</div>`;

    row.append(check, body);
    row.addEventListener('click', () => onSelect(trophy.id, { keepSelection: false }));
    listEl.appendChild(row);
  }
}

export function renderDetail(detailEl, trophy, state, onToggleEarned) {
  if (!trophy) {
    detailEl.innerHTML = `
      <p class="detail-empty">Select a trophy to read its guide. Every guide is written in our own words and names its sources, so you can check where each fact comes from.</p>`;
    return;
  }
  const masked = isMasked(trophy, state);
  const earned = isEarned(state, trophy.id);
  const sources = trophy.sources
    .map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a></li>`)
    .join('');
  const tags = trophy.kinds.map((kind) => `<span class="kind-tag">${KIND_LABEL[kind]}</span>`).join('');
  detailEl.innerHTML = `
    <div class="detail-head">${gradeBadge(trophy)}
      <div>
        <h2>${masked ? maskedName(trophy) : escapeHtml(trophy.name)}</h2>
        <p class="detail-grade">${GRADE_LABEL[trophy.grade]}${trophy.hidden ? ' · Hidden on PlayStation until earned' : ''}</p>
      </div>
    </div>
    <p class="detail-desc"><strong>Official description:</strong> ${masked ? 'Hidden until earned.' : escapeHtml(trophy.description)}</p>
    <div class="detail-meta">${tags}${trophy.missable ? '<span class="missable-flag">Possibly missable</span>' : ''}${targetLine(trophy)}</div>
    <h3>Guide</h3>
    <p class="detail-guide">${masked ? 'This trophy is hidden on PlayStation, so its name and description stay hidden in spoiler-safe mode until you earn it. Turn the mode off to read the guide.' : escapeHtml(trophy.guide)}</p>
    ${masked ? '' : `<h3>Sources</h3><ul class="detail-sources">${sources}</ul>
    <p class="source-note">The guide above is written in our own words from these sources. The official name, description and grade are shown as PlayStation publishes them.</p>`}
    <label class="detail-earned"><input type="checkbox" id="detail-earned-check" ${earned ? 'checked' : ''}> Earned</label>
    ${state.spoiler ? `<p class="spoiler-note">${SPOILER_NOTE}</p>` : ''}`;
  const check = detailEl.querySelector('#detail-earned-check');
  check.addEventListener('change', () => onToggleEarned(trophy.id, check.checked));
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
