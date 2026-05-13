#!/usr/bin/env node
/**
 * fetch-samples.js
 *
 * Creates the samples/ directory structure and prints a manifest of all
 * required audio files. Replace each file with a real CC0 MP3 sample
 * (freesound.org, looperman.com, etc.) then commit to the repo so
 * jsDelivr CDN can serve them.
 *
 * Usage:  node scripts/fetch-samples.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'samples');

// ── Required drum one-shot files ──────────────────────────────────────────────
const DRUM_FILES = [
  // kick
  'drums/kick/kick-trap-01.mp3',
  'drums/kick/kick-heavy-01.mp3',
  'drums/kick/kick-distorted-01.mp3',
  'drums/kick/kick-sub-01.mp3',
  'drums/kick/kick-punchy-01.mp3',
  'drums/kick/kick-electronic-01.mp3',
  'drums/kick/kick-boomy-01.mp3',
  'drums/kick/kick-clicky-01.mp3',
  'drums/kick/kick-acoustic-01.mp3',
  'drums/kick/kick-layered-01.mp3',
  // snare
  'drums/snare/snare-crisp-01.mp3',
  'drums/snare/snare-fat-01.mp3',
  'drums/snare/snare-wood-01.mp3',
  'drums/snare/snare-vinyl-01.mp3',
  'drums/snare/snare-pitched-01.mp3',
  'drums/snare/snare-rimshot-01.mp3',
  // clap
  'drums/clap/clap-trap-01.mp3',
  'drums/clap/clap-wide-01.mp3',
  'drums/clap/clap-tight-01.mp3',
  'drums/clap/clap-layered-01.mp3',
  'drums/clap/clap-dry-01.mp3',
  'drums/clap/clap-reverb-01.mp3',
  // hat closed
  'drums/hat-closed/hat-closed-tight-01.mp3',
  'drums/hat-closed/hat-closed-loose-01.mp3',
  'drums/hat-closed/hat-closed-sizzle-01.mp3',
  'drums/hat-closed/hat-closed-crisp-01.mp3',
  'drums/hat-closed/hat-closed-muted-01.mp3',
  // hat open
  'drums/hat-open/hat-open-short-01.mp3',
  'drums/hat-open/hat-open-long-01.mp3',
  'drums/hat-open/hat-open-airy-01.mp3',
  'drums/hat-open/hat-open-trashy-01.mp3',
  // hat roll
  'drums/hat-roll/hat-roll-stutter-01.mp3',
  'drums/hat-roll/hat-roll-triplet-01.mp3',
  'drums/hat-roll/hat-roll-fast-01.mp3',
  'drums/hat-roll/hat-roll-slow-01.mp3',
  // 808 bass (C0–G2 root notes for Tone.Sampler)
  'drums/808/808-C0-01.mp3',
  'drums/808/808-C1-01.mp3',
  'drums/808/808-G1-01.mp3',
  'drums/808/808-C2-01.mp3',
  'drums/808/808-G2-01.mp3',
  // synth stabs (C3–C5 root notes for melody Sampler)
  'synths/stabs/stab-hard-01.mp3',
  'synths/stabs/stab-airy-01.mp3',
  'synths/stabs/stab-dark-01.mp3',
  'synths/stabs/stab-bright-01.mp3',
  'synths/stabs/stab-distorted-01.mp3',
  'synths/stabs/stab-clean-01.mp3',
  'synths/stabs/stab-detuned-01.mp3',
  'synths/stabs/stab-vintage-01.mp3',
  'synths/stabs/stab-digital-01.mp3',
  'synths/stabs/stab-orchestral-01.mp3',
];

// ── Loop file generation (mirrors LOOP_CATEGORIES in samples.js) ──────────────
const LOOP_CATEGORIES = [
  { prefix:'loops/chords/chord-rage-dark',      count:5  },
  { prefix:'loops/chords/chord-rage-bright',    count:4  },
  { prefix:'loops/chords/chord-melodic-dark',   count:5  },
  { prefix:'loops/chords/chord-melodic-bright', count:4  },
  { prefix:'loops/chords/chord-chill',          count:5  },
  { prefix:'loops/chords/chord-gospel',         count:4  },
  { prefix:'loops/chords/chord-psychedelic',    count:4  },
  { prefix:'loops/chords/chord-jazz',           count:4  },
  { prefix:'loops/chords/chord-dark-trap',      count:5  },
  { prefix:'loops/chords/chord-ambient',        count:4  },
  { prefix:'loops/chords/chord-soul',           count:4  },
  { prefix:'loops/chords/chord-rnb',            count:4  },
  { prefix:'loops/chords/chord-drill',          count:4  },
  { prefix:'loops/chords/chord-cinematic',      count:4  },
  { prefix:'loops/chords/chord-neo-soul',       count:4  },
  { prefix:'loops/chords/chord-boom-bap',       count:4  },
  { prefix:'loops/chords/chord-euphoric',       count:4  },
  { prefix:'loops/chords/chord-experimental',   count:4  },
  { prefix:'loops/chords/chord-emo',            count:4  },
  { prefix:'loops/chords/chord-orchestral',     count:4  },
  { prefix:'loops/melody/melody-dark-synth',    count:5  },
  { prefix:'loops/melody/melody-bright-synth',  count:5  },
  { prefix:'loops/melody/melody-piano-sad',     count:4  },
  { prefix:'loops/melody/melody-piano-happy',   count:4  },
  { prefix:'loops/melody/melody-trap-lead',     count:4  },
  { prefix:'loops/melody/melody-flute',         count:4  },
  { prefix:'loops/melody/melody-strings',       count:4  },
  { prefix:'loops/melody/melody-808-lead',      count:4  },
  { prefix:'loops/melody/melody-vocal-chop',    count:4  },
  { prefix:'loops/melody/melody-arp-bright',    count:4  },
  { prefix:'loops/melody/melody-arp-dark',      count:4  },
  { prefix:'loops/melody/melody-lo-fi',         count:4  },
  { prefix:'loops/melody/melody-rage-synth',    count:4  },
  { prefix:'loops/melody/melody-psychedelic',   count:4  },
  { prefix:'loops/melody/melody-gospel',        count:5  },
  { prefix:'loops/guitar/guitar-trap',          count:5  },
  { prefix:'loops/guitar/guitar-lofi',          count:5  },
  { prefix:'loops/guitar/guitar-psychedelic',   count:5  },
  { prefix:'loops/guitar/guitar-clean',         count:5  },
  { prefix:'loops/guitar/guitar-distorted',     count:5  },
  { prefix:'loops/guitar/guitar-slide',         count:5  },
  { prefix:'loops/guitar/guitar-acoustic',      count:5  },
  { prefix:'loops/guitar/guitar-funk',          count:5  },
  { prefix:'loops/texture/texture-atmospheric', count:6  },
  { prefix:'loops/texture/texture-dark-drone',  count:6  },
  { prefix:'loops/texture/texture-rain',        count:6  },
  { prefix:'loops/texture/texture-noise',       count:6  },
  { prefix:'loops/texture/texture-ambient',     count:6  },
  { prefix:'loops/drum-loop/drumloop-trap-hard',count:5  },
  { prefix:'loops/drum-loop/drumloop-trap-chill',count:5 },
  { prefix:'loops/drum-loop/drumloop-boom-bap', count:5  },
  { prefix:'loops/drum-loop/drumloop-rage',     count:5  },
  { prefix:'loops/drum-loop/drumloop-swing',    count:5  },
  { prefix:'loops/bass/bass-808-dark',          count:5  },
  { prefix:'loops/bass/bass-808-melodic',       count:5  },
  { prefix:'loops/bass/bass-funk',              count:5  },
  { prefix:'loops/bass/bass-sub',               count:5  },
];

const LOOP_FILES = LOOP_CATEGORIES.flatMap(cat =>
  Array.from({ length: cat.count }, (_, i) =>
    `${cat.prefix}-${String(i + 1).padStart(2, '0')}.mp3`
  )
);

const ALL_FILES = [...DRUM_FILES, ...LOOP_FILES];

// ── Create directories ────────────────────────────────────────────────────────
function mkdirp(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
}

const DIRS = [
  'drums/kick', 'drums/snare', 'drums/clap',
  'drums/hat-closed', 'drums/hat-open', 'drums/hat-roll',
  'drums/808', 'drums/perc', 'drums/cymbal',
  'loops/chords', 'loops/melody', 'loops/guitar',
  'loops/texture', 'loops/drum-loop', 'loops/bass',
  'synths/stabs', 'synths/leads', 'synths/pads', 'synths/fx',
];

console.log('Creating sample directories...');
DIRS.forEach(d => { mkdirp(d); console.log(`  samples/${d}/`); });

// ── Write MANIFEST.txt ────────────────────────────────────────────────────────
const manifest = [
  '# BEATMKR Sample Library Manifest',
  `# Generated: ${new Date().toISOString()}`,
  `# Total files required: ${ALL_FILES.length}`,
  '#',
  '# Source CC0 samples from:',
  '#   freesound.org  (requires free account, CC0 filter)',
  '#   looperman.com  (free loops, check license per upload)',
  '#   sampleswap.org (public domain)',
  '#',
  '# Naming convention: {category}-{vibe}-{number}.mp3',
  '# Place each file in samples/ then commit to GitHub.',
  '# jsDelivr CDN will serve from:',
  '#   https://cdn.jsdelivr.net/gh/bastianm1112-svg/beatmaker@main/samples/',
  '',
  ...ALL_FILES,
].join('\n');

fs.writeFileSync(path.join(ROOT, 'MANIFEST.txt'), manifest);
console.log(`\nManifest written to samples/MANIFEST.txt`);
console.log(`\n${ALL_FILES.length} files required:`);
console.log(`  ${DRUM_FILES.length} drum one-shots`);
console.log(`  ${LOOP_FILES.length} loops`);
console.log('\nPlace real CC0 MP3s in each samples/ subdirectory.');
console.log('Then: git add samples/ && git commit -m "feat: add sample library"');
