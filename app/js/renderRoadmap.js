// Leonida Ledger — the roadmap and missables pages.
// Renders the three roadmap stages and the missable list from roadmap.js,
// with the trophy counts each stage is built on.

import { ROADMAP_STAGES, MISSABLE_NOTES, ROADMAP_META } from './roadmap.js';

export function renderRoadmap(container, trophies, state) {
  const earned = trophies.filter((t) => state.earned[t.id]).length;
  const storyTotal = trophies.filter((t) => t.kinds.includes('story')).length;
  const storyEarned = trophies.filter((t) => t.kinds.includes('story') && state.earned[t.id]).length;

  const meta = document.createElement('div');
  meta.className = 'roadmap-meta';
  meta.innerHTML = `
    <div><span class="meta-label">Difficulty</span><strong>${ROADMAP_META.difficulty}</strong></div>
    <div><span class="meta-label">Time to platinum</span><strong>${ROADMAP_META.time}</strong></div>
    <div><span class="meta-label">Playthroughs</span><strong>${ROADMAP_META.playthroughs}</strong></div>
    <div><span class="meta-label">Online trophies</span><strong>${ROADMAP_META.online}</strong></div>
    <div><span class="meta-label">Missable</span><strong>${ROADMAP_META.missable}</strong></div>
    <div><span class="meta-label">Hardest trophy</span><strong>${ROADMAP_META.hardest}</strong></div>
    <div><span class="meta-label">Your progress</span><strong>${earned} of ${trophies.length} trophies · ${storyEarned} of ${storyTotal} story</strong></div>`;

  const stages = document.createElement('div');
  stages.className = 'roadmap-stages';
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('section');
    section.className = 'roadmap-stage';
    const list = stage.steps.map((step) => `<li>${step}</li>`).join('');
    section.innerHTML = `
      <div class="stage-number">${stage.stage}</div>
      <div class="stage-body">
        <h3>${stage.title} <span class="stage-hours">${stage.hours}</span></h3>
        <p>${stage.blurb}</p>
        <ol>${list}</ol>
      </div>`;
    stages.appendChild(section);
  }

  container.replaceChildren(meta, stages);
}

export function renderMissables(container, trophies, state) {
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent =
    'Built from the official descriptions and the published roadmaps: only one trophy in the whole list can be missed, and it is flagged here. Everything else stays available after the story.';

  const list = document.createElement('div');
  list.className = 'missable-list';
  for (const note of MISSABLE_NOTES) {
    const trophy = note.trophyId ? trophies.find((t) => t.id === note.trophyId) : null;
    const earned = trophy ? state.earned[trophy.id] === true : false;
    const card = document.createElement('article');
    card.className = 'missable-card' + (earned ? ' is-earned' : '');
    card.innerHTML = `
      <h3>${note.name} <span class="risk-badge">${note.risk}</span></h3>
      <p>${note.detail}</p>
      ${trophy ? `<p class="missable-status">${earned ? 'Earned — safe.' : 'Not earned yet — mind the Chapter 1 meditation.'}</p>` : ''}`;
    list.appendChild(card);
  }

  container.replaceChildren(intro, list);
}
