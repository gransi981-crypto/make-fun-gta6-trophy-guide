// Leonida Ledger — the roadmap to the platinum and the missable list.
// Built from the official trophy descriptions and the published roadmaps
// (PowerPyx, GTASpotter): which story chapters and missions, which
// collectibles and counts, and in what order. Times are the roadmap's
// estimates: about 200 hours to the platinum, in one playthrough.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story',
    hours: '60–80 hours',
    blurb:
      'Finish the story and enjoy it. The 100% checklist is not viewable until after the story, but every bit of progress you make during it already counts.',
    steps: [
      'Complete Chapters 1 to 5 in order — the 12 story trophies (the chapter trophies and the named missions: Gone Fishing, Breakfast Run, The Cartel Heist, Child’s Play, Headliners, VCIA Takedown and Operation Savage Glory) all pop on their own.',
      'Do the one possibly missable thing now: the Chapter 1 meditation at Jason’s house — see the Missables page. It is the only trophy that can be missed.',
      'Scan vehicles with the WAiNK app and study animals through the binoculars as you meet them: 200 of 277 vehicles and 100 of 255 animals are needed later.',
      'There is no mission replay, so keep a manual save at the start and end of each chapter. There are 15 manual save slots and 1 autosave slot.',
      'Cheats disable trophies and saving, so leave them off for a trophy run.',
    ],
  },
  {
    stage: 2,
    title: 'The 100% checklist',
    hours: 'about 100 hours',
    blurb:
      'After the story, the checklist opens under Progress, then Stats, then 100% Completion. It is closer to 60% true completion: most side quests are not needed, and collectibles are only partly required.',
    steps: [
      'Complete any 70 of the 80 challenges — 50 already earns One Last Thing, and you may skip the 10 hardest.',
      'Finish every robbery: all 8 bank vaults (5 for Maximum Withdrawal) and all 39 illegal gang operations (1 per gang for Pest Control).',
      'Gold all 42 Shooting Range challenges at the 12 ranges, and win all 42 Top Fun drone races at the 14 locations.',
      'Complete Bret’s 15 Target Decks, scan 200 vehicles, study 100 animals, complete 300 stunts, and meditate at 15 of the 18 spots.',
      'A Long Road, the gold for 100% completion, pops here — it is the hardest trophy in the set.',
    ],
  },
  {
    stage: 3,
    title: 'Strangers and cleanup',
    hours: 'about 10 hours',
    blurb:
      'Whatever is left after the checklist. Every quest giver tied to a trophy is still available in free-roam after the story.',
    steps: [
      'Complete 8 stranger mission strands — Kirk, Kyle, Yago and Pilot Pete are confirmed to count.',
      'Finish the five character questlines: Andy (Lucia-only), Kenton, Billy, Randy and Tyrone (Jason-only).',
      'Mop up the miscellaneous trophies: the partner robberies, the plane and the tank, the UFO easter egg, the showroom Banshee and the money trophies.',
      'Vice Got a Price!, the platinum, pops when the last of the other 54 is earned.',
    ],
  },
];

export const MISSABLE_NOTES = [
  {
    trophyId: 28,
    name: 'Positive Mental Attitude',
    risk: 'Potentially missable — the only one',
    detail:
      'One meditation happens at Jason’s house in Chapter 1 and is gone after that chapter. After the mission Down to Earth, talk to Lucia in the kitchen in the morning, follow her out to the balcony when she says she is going to meditate, and choose Accept. It raises the counter by 1 but is not marked as a spot, and it is still unconfirmed whether it is required for the trophy — do it while you can. The other 18 spots are all available after the story, and the last one needs both characters together, unlocked after Coffee Break in Chapter 2.',
  },
  {
    trophyId: null,
    name: 'Everything else',
    risk: 'Not missable',
    detail:
      'No other trophy can be missed. Optional missions that expire (the black icons with pink letters) do not count toward trophies or 100% completion, and every quest giver tied to a trophy — Andy, Kenton, Billy, Randy, Tyrone and Bret — is still available in free-roam after the story. Some fences and magazine collectibles in story buildings disappear, but they are not needed for any trophy.',
  },
];

export const ROADMAP_META = {
  difficulty: '4 out of 10',
  time: 'about 200 hours',
  playthroughs: '1 — no New Game+, no mission replay',
  online: '0 online trophies — all 55 are offline and single-player',
  missable: 'Potentially 1 — Positive Mental Attitude',
  hardest: 'A Long Road (100% completion)',
};
