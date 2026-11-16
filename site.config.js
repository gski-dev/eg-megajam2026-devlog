export default {
  title: 'EG / MegaJam 2026',
  description: 'A development journal about building a high fantasy RTS in Unreal Engine: the decisions, the pipeline, and the work in progress.',
  url: 'https://gski-dev.github.io',
  basePath: '/eg-megajam2026-devlog',
  githubUrl: 'https://github.com/gski-dev/eg-megajam2026-devlog',
  timeZone: 'America/New_York',
  navigation: [
    { title: 'Overview', path: '/' },
    { title: 'Journal', path: '/journal/' },
    { title: 'Process', path: '/process/' },
    { title: 'The project', path: '/project/' },
  ],
  project: {
    updated: '2026-11-15T12:00:00-05:00',
    focus: 'Bringing the systems together',
    stage: 'Prototype development',
    metrics: [
      { value: '03', label: 'Fantasy factions', detail: 'Humans, Elves & Goblins' },
      { value: '60', label: 'Canonical unit variants', detail: 'Saved animation production' },
      { value: '33', label: 'Building families', detail: 'Five presentation states each' },
    ],
    workstreams: [
      { name: 'Characters & animation', state: 'Review pending', description: 'The canonical roster has saved equipment and action assets. Grip, movement, timing, and readability still need visual review.' },
      { name: 'Squad combat', state: 'Sandbox implemented', description: 'A dedicated arena brings selection, squad orders, class rules, and presentation together. Movement and fighting need playtesting.' },
      { name: 'Buildings & bases', state: 'Sandbox implemented', description: 'Three faction sandboxes expose construction and damage states, shared footprints, and the 3 → 5 → 7 pad progression.' },
      { name: 'Pinewatch Vale', state: 'Integration next', description: 'The woodland map is saved. Economy, AI, and vision have source implementations; a playable 1v1 match still needs runtime integration.' },
    ],
  },
};
