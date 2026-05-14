#!/usr/bin/env node
/**
 * BEATMKR Loop Generator
 * Generates real musical loops via MIDI → FluidSynth → MP3
 *
 * Run: node scripts/make-loops.js
 */

'use strict';
const { execSync, spawnSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const SAMPLES  = path.resolve(__dirname, '..', 'samples');
const SF2      = path.resolve(__dirname, 'GeneralUser.sf2');
const FLUID    = path.resolve(__dirname, 'fluidsynth', 'fluidsynth.exe');
const TMP      = path.join(os.tmpdir(), 'beatmkr-midi');

fs.mkdirSync(TMP, { recursive: true });

let done = 0, skip = 0;

// ─────────────────────────────────────────────────────────────
// MIDI byte utilities
// ─────────────────────────────────────────────────────────────
function be16(n) { return Buffer.from([(n>>8)&0xff, n&0xff]); }
function be32(n) { return Buffer.from([(n>>24)&0xff,(n>>16)&0xff,(n>>8)&0xff,n&0xff]); }

function vlq(n) {
  if (n < 0x80) return Buffer.from([n]);
  const out = [];
  out.unshift(n & 0x7f);
  n >>= 7;
  while (n > 0) { out.unshift((n & 0x7f) | 0x80); n >>= 7; }
  return Buffer.from(out);
}

function trackChunk(events) {
  // events: [{delta, data: Buffer}]
  const body = Buffer.concat(
    events.map(e => Buffer.concat([vlq(e.delta), e.data]))
  );
  return Buffer.concat([Buffer.from('MTrk'), be32(body.length), body]);
}

function midiFile(bpm, ...tracks) {
  const usec = Math.round(60000000 / bpm);
  const TPB  = 480;
  const header = Buffer.concat([
    Buffer.from('MThd'), be32(6),
    be16(1),                       // format 1
    be16(tracks.length + 1),       // tempo track + content tracks
    be16(TPB),
  ]);
  const tempoTrack = trackChunk([
    { delta: 0, data: Buffer.from([0xff, 0x51, 0x03, (usec>>16)&0xff, (usec>>8)&0xff, usec&0xff]) },
    { delta: 0, data: Buffer.from([0xff, 0x2f, 0x00]) },
  ]);
  return Buffer.concat([header, tempoTrack, ...tracks]);
}

const TPB = 480; // ticks per beat

// Helpers to build event data
const progChange = (ch, prog) => Buffer.from([0xc0|ch, prog]);
const noteOn     = (ch, note, vel) => Buffer.from([0x90|ch, note, vel]);
const noteOff    = (ch, note)      => Buffer.from([0x80|ch, note, 0]);
const endTrack   = ()              => Buffer.from([0xff, 0x2f, 0x00]);
const cc         = (ch, ctrl, val) => Buffer.from([0xb0|ch, ctrl, val]);

// ─────────────────────────────────────────────────────────────
// Render MIDI bytes → MP3
// ─────────────────────────────────────────────────────────────
function render(midiBuf, dest, bpm = 140) {
  if (fs.existsSync(dest)) { skip++; return; }
  const mid = path.join(TMP, `${Date.now()}.mid`);
  const wav = mid.replace('.mid', '.wav');
  fs.writeFileSync(mid, midiBuf);

  const r = spawnSync(FLUID, [
    '-ni',
    '-F', wav,
    '-r', '44100',
    '--quiet',
    SF2, mid,
  ], { encoding: 'utf8' });

  if (!fs.existsSync(wav)) {
    console.error(`  FLUID failed for ${path.basename(dest)}: ${r.stderr?.slice(0,120)}`);
    fs.unlinkSync(mid);
    return;
  }

  execSync(`ffmpeg -y -i "${wav}" -codec:a libmp3lame -q:a 3 "${dest}" -loglevel error`);
  fs.unlinkSync(mid);
  fs.unlinkSync(wav);
  done++;
  process.stdout.write(`♪ ${path.relative(SAMPLES, dest)}\n`);
}

// ─────────────────────────────────────────────────────────────
// Music theory helpers
// ─────────────────────────────────────────────────────────────

// MIDI note numbers: C4 = 60
function note(name) {
  const map = { C:0,D:2,E:4,F:5,G:7,A:9,B:11 };
  const m = name.match(/^([A-G])(#|b)?(\d)$/);
  const pc = map[m[1]] + (m[2]==='#'?1:m[2]==='b'?-1:0);
  return pc + (parseInt(m[3]) + 1) * 12;
}

// Chord builder: root MIDI note + intervals (semitones above)
function chord(root, ...intervals) {
  return [root, ...intervals.map(i => root + i)];
}

// Common chord shapes
const MINOR    = [0, 3, 7];
const MAJOR    = [0, 4, 7];
const MAJ7     = [0, 4, 7, 11];
const MIN7     = [0, 3, 7, 10];
const DOM7     = [0, 4, 7, 10];
const SUS4     = [0, 5, 7];
const DIM      = [0, 3, 6];
const AUG      = [0, 4, 8];
const POWER    = [0, 7];

// ─────────────────────────────────────────────────────────────
// CHORD LOOP builder
// Takes a progression [{notes, beats}] and GM instrument
// bars = how many times to repeat the progression
// ─────────────────────────────────────────────────────────────
function chordLoop(prog, instrument, velocity, bars, bpm, dest) {
  const events = [];
  events.push({ delta: 0, data: cc(0, 7, 100) });      // volume
  events.push({ delta: 0, data: cc(0, 91, 30) });      // reverb
  events.push({ delta: 0, data: progChange(0, instrument) });

  for (let bar = 0; bar < bars; bar++) {
    for (const step of prog) {
      const dur = step.beats * TPB;
      // Note ons
      step.notes.forEach(n => events.push({ delta: 0, data: noteOn(0, n, velocity) }));
      // Note offs (staggered slightly for naturalness)
      step.notes.forEach((n, i) => {
        events.push({ delta: i === 0 ? dur - 4 : 0, data: noteOff(0, n) });
      });
    }
  }
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

// ─────────────────────────────────────────────────────────────
// MELODY LOOP builder
// phrase: [{note, beats, vel?}] — repeating melodic phrase
// ─────────────────────────────────────────────────────────────
function melodyLoop(phrase, instrument, bars, bpm, dest) {
  const events = [];
  events.push({ delta: 0, data: cc(0, 7, 110) });
  events.push({ delta: 0, data: cc(0, 91, 20) });
  events.push({ delta: 0, data: progChange(0, instrument) });

  for (let bar = 0; bar < bars; bar++) {
    for (const step of phrase) {
      const vel = step.vel ?? 90;
      const dur = Math.round(step.beats * TPB);
      events.push({ delta: 0,       data: noteOn(0, step.note, vel) });
      events.push({ delta: dur - 8, data: noteOff(0, step.note) });
    }
  }
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

// ─────────────────────────────────────────────────────────────
// DRUM LOOP builder
// pattern: array of {note, timing (beat offset), vel}
// ─────────────────────────────────────────────────────────────
// GM drum notes
const KICK   = 36;
const SNARE  = 38;
const CLAP   = 39;
const HIHAT  = 42;
const OPENHAT= 46;
const RIDE   = 51;
const CRASH  = 49;
const PERC   = 37;

function drumLoop(hits, bars, bpm, dest) {
  const beatsPerBar = 4;
  const events = [];
  events.push({ delta: 0, data: cc(9, 7, 110) });

  for (let bar = 0; bar < bars; bar++) {
    // Sort hits by tick offset within bar
    const sorted = [...hits].sort((a, b) => a.tick - b.tick);
    let prev = 0;
    for (const hit of sorted) {
      const tick = Math.round(hit.tick * TPB);
      events.push({ delta: tick - prev, data: noteOn(9, hit.note, hit.vel ?? 100) });
      events.push({ delta: 2,           data: noteOff(9, hit.note) });
      prev = tick + 2;
    }
    // Move to next bar
    const barTicks = beatsPerBar * TPB;
    const consumed = sorted[sorted.length - 1]
      ? Math.round(sorted[sorted.length - 1].tick * TPB) + 2
      : 0;
    events.push({ delta: barTicks - consumed, data: Buffer.from([0x00]) });
    prev = 0;
  }
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

// Simplified drum builder — hit list per bar as beat positions
function hits(list) {
  // list: [[beat_offset, note, vel], ...]
  return list.map(([tick, note, vel]) => ({ tick, note, vel }));
}

// ─────────────────────────────────────────────────────────────
// BASS LOOP builder
// ─────────────────────────────────────────────────────────────
function bassLoop(pattern, instrument, bars, bpm, dest) {
  // instrument 33 = Electric Bass (finger), 38 = Synth Bass 1
  const events = [];
  events.push({ delta: 0, data: cc(1, 7, 115) });
  events.push({ delta: 0, data: progChange(1, instrument) });

  for (let bar = 0; bar < bars; bar++) {
    for (const step of pattern) {
      const dur = Math.round(step.beats * TPB);
      events.push({ delta: 0,       data: noteOn(1, step.note, step.vel ?? 110) });
      events.push({ delta: dur - 4, data: noteOff(1, step.note) });
    }
  }
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

// ─────────────────────────────────────────────────────────────
// GUITAR LOOP builder (arpeggiated or strummed)
// ─────────────────────────────────────────────────────────────
function guitarLoop(prog, instrument, style, bars, bpm, dest) {
  // style: 'strum' | 'arp' | 'pluck'
  const events = [];
  events.push({ delta: 0, data: cc(2, 7, 100) });
  events.push({ delta: 0, data: cc(2, 91, 25) });
  events.push({ delta: 0, data: progChange(2, instrument) });

  for (let bar = 0; bar < bars; bar++) {
    for (const step of prog) {
      const notes = step.notes;
      const beatDur = Math.round(step.beats * TPB);

      if (style === 'strum') {
        // Strum: notes slightly offset (16 ticks apart)
        notes.forEach((n, i) => {
          events.push({ delta: i === 0 ? 0 : 8, data: noteOn(2, n, 90 - i * 5) });
        });
        notes.forEach((n, i) => {
          events.push({ delta: i === 0 ? beatDur - notes.length * 8 - 4 : 0, data: noteOff(2, n) });
        });
      } else if (style === 'arp') {
        // Arpeggio: each note individually
        const noteDur = Math.round(beatDur / notes.length);
        for (const n of notes) {
          events.push({ delta: 0,         data: noteOn(2, n, 88) });
          events.push({ delta: noteDur - 4, data: noteOff(2, n) });
        }
      } else {
        // Pluck: first note with decay feel
        events.push({ delta: 0,          data: noteOn(2, notes[0], 95) });
        events.push({ delta: beatDur - 4, data: noteOff(2, notes[0]) });
      }
    }
  }
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

// ─────────────────────────────────────────────────────────────
// TEXTURE builder (sustained pad)
// ─────────────────────────────────────────────────────────────
function textureLoop(noteList, instrument, bars, bpm, dest) {
  const totalBeats = bars * 4;
  const events = [];
  events.push({ delta: 0, data: cc(3, 7, 80) });
  events.push({ delta: 0, data: cc(3, 91, 60) });  // heavy reverb
  events.push({ delta: 0, data: cc(3, 93, 30) });  // chorus
  events.push({ delta: 0, data: progChange(3, instrument) });

  noteList.forEach(n => events.push({ delta: 0, data: noteOn(3, n, 70) }));
  const totalTicks = totalBeats * TPB;
  noteList.forEach((n, i) => {
    events.push({ delta: i === 0 ? totalTicks - 4 : 0, data: noteOff(3, n) });
  });
  events.push({ delta: 0, data: endTrack() });
  render(midiFile(bpm, trackChunk(events)), dest, bpm);
}

function d(...parts) { return path.join(SAMPLES, ...parts); }

// ─────────────────────────────────────────────────────────────
// INSTRUMENT NUMBERS (GM 0-indexed)
// ─────────────────────────────────────────────────────────────
const GM = {
  piano:        0,
  eBright:      1,
  eGrand:       2,
  honky:        3,
  ePiano1:      4,
  ePiano2:      5,
  harpsichord:  6,
  clavinet:     7,
  celesta:      8,
  musicbox:    10,
  vibraphone:  11,
  marimba:     12,
  xylophone:   13,
  organ:       16,
  jazz_organ:  17,
  guitar_nylon:24,
  guitar_steel:25,
  guitar_jazz: 26,
  guitar_clean:27,
  guitar_muted:28,
  guitar_dist: 30,
  guitar_harm: 31,
  bass_finger: 32,
  bass_pick:   33,
  bass_fretless:35,
  synth_bass1: 38,
  synth_bass2: 39,
  violin:      40,
  viola:       41,
  cello:       42,
  strings:     48,
  strings2:    49,
  synth_str1:  50,
  synth_str2:  51,
  choir:       52,
  pad_new_age: 88,
  pad_warm:    89,
  pad_polysynth:90,
  pad_choir:   91,
  pad_metallic:92,
  pad_halo:    93,
  pad_sweep:   94,
  fx_rain:     96,
  fx_sound_track:97,
  fx_crystal:  98,
  fx_atmosphere:99,
  fx_brightness:100,
  fx_goblins:  101,
  fx_echoes:   102,
  lead_square: 80,
  lead_saw:    81,
  lead_calliope:82,
  lead_chiffer:83,
  lead_charang:84,
  lead_voice:  85,
  lead_5ths:   86,
  lead_bass:   87,
  flute:       73,
  recorder:    74,
  oboe:        68,
  trumpet:     56,
  trombone:    57,
  french_horn: 60,
  brass_sect:  61,
  synth_brass1:62,
  synth_brass2:63,
};

// ─────────────────────────────────────────────────────────────
// GENERATE ALL LOOPS
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\nBEATMKR Loop Generator (FluidSynth + GeneralUser GS)\n' + '─'.repeat(56));

  // ══════════════════════════════════════════════════════════
  // CHORD LOOPS
  // ══════════════════════════════════════════════════════════
  console.log('\n[CHORD LOOPS]');

  // rage-dark (Am — Gm — Fm — Gm): dark, ominous
  const rageDark = [
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('G2'), ...MINOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MINOR), beats: 2 },
  ];
  [[GM.pad_warm, 80,'01'],[GM.strings,75,'02'],[GM.lead_saw,70,'03'],[GM.pad_metallic,65,'04'],[GM.synth_str1,70,'05']].forEach(([inst,vel,n]) =>
    chordLoop(rageDark, inst, vel, 2, 140, d('loops/chords',`chord-rage-dark-${n}.mp3`)));

  // rage-bright (A — E — F — C): energetic
  const rageBright = [
    { notes: chord(note('A2'), ...MAJOR), beats: 2 },
    { notes: chord(note('E2'), ...MAJOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
  ];
  [[GM.lead_saw,85,'01'],[GM.synth_str1,80,'02'],[GM.pad_warm,75,'03'],[GM.strings,80,'04']].forEach(([inst,vel,n]) =>
    chordLoop(rageBright, inst, vel, 2, 140, d('loops/chords',`chord-rage-bright-${n}.mp3`)));

  // melodic-dark (Dm — Am — Bb — F): sad melodic
  const melodicDark = [
    { notes: chord(note('D3'), ...MINOR), beats: 2 },
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('A#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
  ];
  [[GM.strings,70,'01'],[GM.pad_warm,65,'02'],[GM.piano,60,'03'],[GM.synth_str1,65,'04'],[GM.pad_choir,60,'05']].forEach(([inst,vel,n]) =>
    chordLoop(melodicDark, inst, vel, 2, 85, d('loops/chords',`chord-melodic-dark-${n}.mp3`)));

  // melodic-bright (C — G — Am — F): uplifting
  const melodicBright = [
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
  ];
  [[GM.piano,80,'01'],[GM.strings,75,'02'],[GM.pad_warm,70,'03'],[GM.ePiano1,75,'04']].forEach(([inst,vel,n]) =>
    chordLoop(melodicBright, inst, vel, 2, 100, d('loops/chords',`chord-melodic-bright-${n}.mp3`)));

  // chill (Am — F — C — G): classic chill
  const chill = [
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
  ];
  [[GM.ePiano1,70,'01'],[GM.piano,65,'02'],[GM.pad_warm,60,'03'],[GM.strings,65,'04'],[GM.guitar_clean,70,'05']].forEach(([inst,vel,n]) =>
    chordLoop(chill, inst, vel, 2, 90, d('loops/chords',`chord-chill-${n}.mp3`)));

  // gospel (I — IV — V — IV): gospel feel
  const gospel = [
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
  ];
  [[GM.organ,85,'01'],[GM.piano,80,'02'],[GM.strings,75,'03'],[GM.pad_choir,70,'04']].forEach(([inst,vel,n]) =>
    chordLoop(gospel, inst, vel, 2, 95, d('loops/chords',`chord-gospel-${n}.mp3`)));

  // psychedelic (Am — E — C — G): trippy
  const psychedelic = [
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('E2'), ...MAJOR), beats: 1 },
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...SUS4),  beats: 3 },
  ];
  [[GM.pad_halo,65,'01'],[GM.fx_atmosphere,60,'02'],[GM.pad_metallic,60,'03'],[GM.synth_str1,65,'04']].forEach(([inst,vel,n]) =>
    chordLoop(psychedelic, inst, vel, 2, 95, d('loops/chords',`chord-psychedelic-${n}.mp3`)));

  // jazz (ii — V — I — vi): jazz changes
  const jazz = [
    { notes: chord(note('D3'), ...MIN7),  beats: 2 },
    { notes: chord(note('G2'), ...DOM7),  beats: 2 },
    { notes: chord(note('C3'), ...MAJ7),  beats: 2 },
    { notes: chord(note('A2'), ...MIN7),  beats: 2 },
  ];
  [[GM.piano,75,'01'],[GM.ePiano1,70,'02'],[GM.guitar_jazz,72,'03'],[GM.vibraphone,68,'04']].forEach(([inst,vel,n]) =>
    chordLoop(jazz, inst, vel, 2, 90, d('loops/chords',`chord-jazz-${n}.mp3`)));

  // dark-trap (Cm — Ab — Eb — Bb): trap minor
  const darkTrap = [
    { notes: chord(note('C3'), ...MINOR), beats: 2 },
    { notes: chord(note('G#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('A#2'), ...MINOR), beats: 2 },
  ];
  [[GM.pad_warm,65,'01'],[GM.strings,60,'02'],[GM.synth_str1,60,'03'],[GM.pad_metallic,58,'04'],[GM.lead_saw,62,'05']].forEach(([inst,vel,n]) =>
    chordLoop(darkTrap, inst, vel, 2, 140, d('loops/chords',`chord-dark-trap-${n}.mp3`)));

  // ambient (Em — Am — D — G): floating
  const ambient = [
    { notes: chord(note('E2'), ...MINOR), beats: 4 },
    { notes: chord(note('A2'), ...MINOR), beats: 4 },
  ];
  [[GM.pad_new_age,60,'01'],[GM.pad_warm,58,'02'],[GM.pad_halo,55,'03'],[GM.fx_atmosphere,55,'04']].forEach(([inst,vel,n]) =>
    chordLoop(ambient, inst, vel, 2, 75, d('loops/chords',`chord-ambient-${n}.mp3`)));

  // soul (Dm — G — C — Am): soul progression
  const soul = [
    { notes: chord(note('D3'), ...MINOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
  ];
  [[GM.ePiano1,78,'01'],[GM.piano,75,'02'],[GM.organ,72,'03'],[GM.strings,70,'04']].forEach(([inst,vel,n]) =>
    chordLoop(soul, inst, vel, 2, 90, d('loops/chords',`chord-soul-${n}.mp3`)));

  // rnb (Fm — Db — Ab — Eb): smooth R&B
  const rnb = [
    { notes: chord(note('F2'), ...MINOR), beats: 2 },
    { notes: chord(note('C#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D#2'), ...MAJOR), beats: 2 },
  ];
  [[GM.ePiano1,72,'01'],[GM.piano,68,'02'],[GM.pad_warm,65,'03'],[GM.strings,68,'04']].forEach(([inst,vel,n]) =>
    chordLoop(rnb, inst, vel, 2, 95, d('loops/chords',`chord-rnb-${n}.mp3`)));

  // drill (Gm — F — Eb — D): UK drill
  const drill = [
    { notes: chord(note('G2'), ...MINOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D2'), ...MAJOR),  beats: 2 },
  ];
  [[GM.lead_saw,75,'01'],[GM.synth_str1,70,'02'],[GM.strings,65,'03'],[GM.pad_metallic,68,'04']].forEach(([inst,vel,n]) =>
    chordLoop(drill, inst, vel, 2, 140, d('loops/chords',`chord-drill-${n}.mp3`)));

  // cinematic (Cm — Ab — Bb — G): epic cinematic
  const cinematic = [
    { notes: chord(note('C3'), ...MINOR), beats: 2 },
    { notes: chord(note('G#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('A#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
  ];
  [[GM.strings,72,'01'],[GM.pad_warm,68,'02'],[GM.strings2,70,'03'],[GM.choir,65,'04']].forEach(([inst,vel,n]) =>
    chordLoop(cinematic, inst, vel, 2, 85, d('loops/chords',`chord-cinematic-${n}.mp3`)));

  // neo-soul (Am9 voiced): neo-soul
  const neoSoul = [
    { notes: chord(note('A2'), ...MIN7),  beats: 3 },
    { notes: chord(note('D3'), ...MIN7),  beats: 2 },
    { notes: chord(note('G2'), ...DOM7),  beats: 3 },
  ];
  [[GM.ePiano1,76,'01'],[GM.piano,72,'02'],[GM.guitar_jazz,70,'03'],[GM.pad_warm,68,'04']].forEach(([inst,vel,n]) =>
    chordLoop(neoSoul, inst, vel, 2, 88, d('loops/chords',`chord-neo-soul-${n}.mp3`)));

  // boom-bap (Am — F — G — E): classic boom bap
  const boomBap = [
    { notes: chord(note('A2'), ...MINOR), beats: 2 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('E2'), ...MAJOR), beats: 2 },
  ];
  [[GM.piano,78,'01'],[GM.ePiano1,75,'02'],[GM.strings,70,'03'],[GM.vibraphone,72,'04']].forEach(([inst,vel,n]) =>
    chordLoop(boomBap, inst, vel, 2, 92, d('loops/chords',`chord-boom-bap-${n}.mp3`)));

  // euphoric (C — G — Am — Em — F): anthemic
  const euphoric = [
    { notes: chord(note('C3'), ...MAJOR), beats: 1 },
    { notes: chord(note('G2'), ...MAJOR), beats: 1 },
    { notes: chord(note('A2'), ...MINOR), beats: 1 },
    { notes: chord(note('E2'), ...MINOR), beats: 1 },
    { notes: chord(note('F2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
  ];
  [[GM.synth_str1,82,'01'],[GM.strings,80,'02'],[GM.pad_warm,78,'03'],[GM.lead_saw,75,'04']].forEach(([inst,vel,n]) =>
    chordLoop(euphoric, inst, vel, 1, 128, d('loops/chords',`chord-euphoric-${n}.mp3`)));

  // experimental (chromatic cluster): atonal
  const experimental = [
    { notes: [note('A2'), note('A#2'), note('B2')], beats: 2 },
    { notes: [note('F2'), note('F#2'), note('C3')], beats: 2 },
    { notes: [note('D3'), note('D#3'), note('G#2')], beats: 2 },
    { notes: [note('E2'), note('A#2'), note('D#3')], beats: 2 },
  ];
  [[GM.pad_metallic,55,'01'],[GM.fx_goblins,50,'02'],[GM.fx_atmosphere,50,'03'],[GM.pad_sweep,52,'04']].forEach(([inst,vel,n]) =>
    chordLoop(experimental, inst, vel, 2, 100, d('loops/chords',`chord-experimental-${n}.mp3`)));

  // emo (Em — C — G — D): emo/indie
  const emo = [
    { notes: chord(note('E2'), ...MINOR), beats: 2 },
    { notes: chord(note('C3'), ...MAJOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D3'), ...MAJOR), beats: 2 },
  ];
  [[GM.guitar_clean,78,'01'],[GM.piano,74,'02'],[GM.strings,70,'03'],[GM.ePiano1,72,'04']].forEach(([inst,vel,n]) =>
    chordLoop(emo, inst, vel, 2, 120, d('loops/chords',`chord-emo-${n}.mp3`)));

  // orchestral (Cm — G — Ab — Eb): cinematic orchestral
  const orchestral = [
    { notes: chord(note('C3'), ...MINOR), beats: 2 },
    { notes: chord(note('G2'), ...MAJOR), beats: 2 },
    { notes: chord(note('G#2'), ...MAJOR), beats: 2 },
    { notes: chord(note('D#2'), ...MAJOR), beats: 2 },
  ];
  [[GM.strings,75,'01'],[GM.strings2,72,'02'],[GM.choir,68,'03'],[GM.french_horn,70,'04']].forEach(([inst,vel,n]) =>
    chordLoop(orchestral, inst, vel, 2, 80, d('loops/chords',`chord-orchestral-${n}.mp3`)));

  // ══════════════════════════════════════════════════════════
  // MELODY LOOPS
  // ══════════════════════════════════════════════════════════
  console.log('\n[MELODY LOOPS]');

  // dark-synth: minor pentatonic descending
  const darkSynthMel = [
    {note:note('A4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('E4'),beats:1},
    {note:note('D4'),beats:0.5},{note:note('C4'),beats:0.5},{note:note('A3'),beats:1},
    {note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('G4'),beats:2},
    {note:note('A3'),beats:2},
  ];
  [[GM.lead_saw,'01',140],[GM.lead_square,'02',140],[GM.synth_str1,'03',140],
   [GM.lead_charang,'04',140],[GM.lead_5ths,'05',140]].forEach(([inst,n,bpm]) =>
    melodyLoop(darkSynthMel, inst, 2, bpm, d('loops/melody',`melody-dark-synth-${n}.mp3`)));

  // bright-synth: major scale ascending run
  const brightSynthMel = [
    {note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('C5'),beats:0.5},
    {note:note('B4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('E4'),beats:1},
    {note:note('F4'),beats:0.5},{note:note('A4'),beats:0.5},{note:note('C5'),beats:1},
    {note:note('G4'),beats:2},
  ];
  [[GM.lead_saw,'01',128],[GM.lead_square,'02',128],[GM.lead_calliope,'03',128],
   [GM.synth_str1,'04',128],[GM.lead_chiffer,'05',128]].forEach(([inst,n,bpm]) =>
    melodyLoop(brightSynthMel, inst, 2, bpm, d('loops/melody',`melody-bright-synth-${n}.mp3`)));

  // piano-sad: melancholic descending
  const pianoSadMel = [
    {note:note('E4'),beats:1},{note:note('D4'),beats:0.5},{note:note('C4'),beats:0.5},
    {note:note('B3'),beats:1},{note:note('A3'),beats:1},{note:note('G3'),beats:2},
    {note:note('A3'),beats:1},{note:note('E3'),beats:1},
  ];
  [[GM.piano,'01',80],[GM.ePiano1,'02',80],[GM.ePiano2,'03',80],[GM.piano,'04',75]].forEach(([inst,n,bpm]) =>
    melodyLoop(pianoSadMel, inst, 2, bpm, d('loops/melody',`melody-piano-sad-${n}.mp3`)));

  // piano-happy: bouncy major
  const pianoHappyMel = [
    {note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('E4'),beats:0.5},
    {note:note('F4'),beats:0.5},{note:note('A4'),beats:0.5},{note:note('G4'),beats:1},
    {note:note('E4'),beats:0.5},{note:note('C4'),beats:0.5},{note:note('D4'),beats:1},{note:note('C4'),beats:1},
  ];
  [[GM.piano,'01',120],[GM.ePiano1,'02',120],[GM.piano,'03',115],[GM.ePiano2,'04',110]].forEach(([inst,n,bpm]) =>
    melodyLoop(pianoHappyMel, inst, 2, bpm, d('loops/melody',`melody-piano-happy-${n}.mp3`)));

  // trap-lead: sparse minor phrase
  const trapLeadMel = [
    {note:note('A4'),beats:1},{note:note('G4'),beats:0.5},{note:note('E4'),beats:0.5},
    {note:note('D4'),beats:2},{note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},
    {note:note('A4'),beats:2},
  ];
  [[GM.lead_saw,'01',140],[GM.lead_square,'02',140],[GM.lead_chiffer,'03',140],[GM.lead_charang,'04',140]].forEach(([inst,n,bpm]) =>
    melodyLoop(trapLeadMel, inst, 2, bpm, d('loops/melody',`melody-trap-lead-${n}.mp3`)));

  // flute: flowing major
  const fluteMel = [
    {note:note('G5'),beats:0.5},{note:note('A5'),beats:0.5},{note:note('B5'),beats:0.5},{note:note('G5'),beats:0.5},
    {note:note('E5'),beats:1},{note:note('D5'),beats:0.5},{note:note('E5'),beats:0.5},
    {note:note('G5'),beats:1},{note:note('A5'),beats:0.5},{note:note('G5'),beats:1},
    {note:note('E5'),beats:1.5},
  ];
  [[GM.flute,'01',95],[GM.recorder,'02',95],[GM.flute,'03',90],[GM.oboe,'04',90]].forEach(([inst,n,bpm]) =>
    melodyLoop(fluteMel, inst, 2, bpm, d('loops/melody',`melody-flute-${n}.mp3`)));

  // strings: soaring minor
  const stringsMel = [
    {note:note('E4'),beats:2},{note:note('D4'),beats:1},{note:note('C4'),beats:1},
    {note:note('B3'),beats:2},{note:note('G3'),beats:2},
  ];
  [[GM.strings,'01',85],[GM.strings2,'02',85],[GM.synth_str1,'03',85],[GM.viola,'04',82]].forEach(([inst,n,bpm]) =>
    melodyLoop(stringsMel, inst, 2, bpm, d('loops/melody',`melody-strings-${n}.mp3`)));

  // 808-lead: low chromatic slide feel
  const lead808Mel = [
    {note:note('A2'),beats:1},{note:note('G2'),beats:0.5},{note:note('G#2'),beats:0.5},
    {note:note('A2'),beats:1},{note:note('F2'),beats:1},{note:note('D2'),beats:2},
    {note:note('E2'),beats:2},
  ];
  [[GM.synth_bass1,'01',140],[GM.synth_bass2,'02',140],[GM.bass_fretless,'03',140],[GM.lead_bass,'04',140]].forEach(([inst,n,bpm]) =>
    melodyLoop(lead808Mel, inst, 2, bpm, d('loops/melody',`melody-808-lead-${n}.mp3`)));

  // vocal-chop: staccato chop feel
  const vocalChopMel = [
    {note:note('A4'),beats:0.25,vel:100},{note:note('A4'),beats:0.25,vel:0},
    {note:note('C5'),beats:0.25,vel:100},{note:note('C5'),beats:0.25,vel:0},
    {note:note('E5'),beats:0.5,vel:95},
    {note:note('D5'),beats:0.25,vel:100},{note:note('D5'),beats:0.25,vel:0},
    {note:note('C5'),beats:0.5,vel:90},{note:note('A4'),beats:1},
    {note:note('G4'),beats:0.5,vel:85},{note:note('A4'),beats:1.5},
  ];
  [[GM.choir,'01',130],[GM.lead_voice,'02',130],[GM.pad_choir,'03',125],[GM.choir,'04',120]].forEach(([inst,n,bpm]) =>
    melodyLoop(vocalChopMel, inst, 2, bpm, d('loops/melody',`melody-vocal-chop-${n}.mp3`)));

  // arp-bright: major arpeggio
  const arpBrightMel = [
    {note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('C5'),beats:0.5},
    {note:note('G4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},
    {note:note('F4'),beats:0.5},{note:note('A4'),beats:0.5},{note:note('C5'),beats:0.5},{note:note('A4'),beats:0.5},
    {note:note('G4'),beats:0.5},{note:note('B4'),beats:0.5},{note:note('D5'),beats:0.5},{note:note('G4'),beats:0.5},
  ];
  [[GM.lead_square,'01',128],[GM.lead_calliope,'02',120],[GM.fx_crystal,'03',115],[GM.lead_chiffer,'04',110]].forEach(([inst,n,bpm]) =>
    melodyLoop(arpBrightMel, inst, 2, bpm, d('loops/melody',`melody-arp-bright-${n}.mp3`)));

  // arp-dark: minor arpeggio
  const arpDarkMel = [
    {note:note('A3'),beats:0.5},{note:note('C4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('A4'),beats:0.5},
    {note:note('E4'),beats:0.5},{note:note('C4'),beats:0.5},{note:note('A3'),beats:0.5},{note:note('C4'),beats:0.5},
    {note:note('G3'),beats:0.5},{note:note('B3'),beats:0.5},{note:note('D4'),beats:0.5},{note:note('G4'),beats:0.5},
    {note:note('D4'),beats:0.5},{note:note('B3'),beats:0.5},{note:note('G3'),beats:0.5},{note:note('B3'),beats:0.5},
  ];
  [[GM.lead_saw,'01',130],[GM.synth_str1,'02',125],[GM.pad_metallic,'03',120],[GM.lead_square,'04',115]].forEach(([inst,n,bpm]) =>
    melodyLoop(arpDarkMel, inst, 2, bpm, d('loops/melody',`melody-arp-dark-${n}.mp3`)));

  // lo-fi: slow jazzy phrase
  const loFiMel = [
    {note:note('E4'),beats:1.5},{note:note('D4'),beats:0.5},{note:note('C4'),beats:1},
    {note:note('A3'),beats:1},{note:note('B3'),beats:0.5},{note:note('C4'),beats:0.5},
    {note:note('E4'),beats:2},
  ];
  [[GM.piano,'01',80],[GM.ePiano1,'02',80],[GM.vibraphone,'03',78],[GM.ePiano2,'04',75]].forEach(([inst,n,bpm]) =>
    melodyLoop(loFiMel, inst, 2, bpm, d('loops/melody',`melody-lo-fi-${n}.mp3`)));

  // rage-synth: aggressive minor
  const rageSynthMel = [
    {note:note('A4'),beats:0.25,vel:110},{note:note('G4'),beats:0.25,vel:110},
    {note:note('A4'),beats:0.5,vel:115},{note:note('E4'),beats:0.5,vel:105},
    {note:note('D4'),beats:1,vel:100},{note:note('E4'),beats:0.25,vel:110},{note:note('F4'),beats:0.25,vel:110},
    {note:note('E4'),beats:0.5,vel:108},{note:note('A3'),beats:2,vel:100},
  ];
  [[GM.lead_saw,'01',145],[GM.lead_square,'02',145],[GM.lead_charang,'03',140],[GM.lead_5ths,'04',140]].forEach(([inst,n,bpm]) =>
    melodyLoop(rageSynthMel, inst, 2, bpm, d('loops/melody',`melody-rage-synth-${n}.mp3`)));

  // psychedelic: whole-tone wandering
  const psychMel = [
    {note:note('C4'),beats:0.5},{note:note('D4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('F#4'),beats:0.5},
    {note:note('G#4'),beats:1},{note:note('F#4'),beats:0.5},{note:note('E4'),beats:0.5},
    {note:note('D4'),beats:1},{note:note('C4'),beats:2},
  ];
  [[GM.pad_halo,'01',95],[GM.fx_atmosphere,'02',90],[GM.fx_echoes,'03',90],[GM.pad_metallic,'04',88]].forEach(([inst,n,bpm]) =>
    melodyLoop(psychMel, inst, 2, bpm, d('loops/melody',`melody-psychedelic-${n}.mp3`)));

  // gospel: pentatonic soul
  const gospelMel = [
    {note:note('G4'),beats:0.5},{note:note('A4'),beats:0.5},{note:note('C5'),beats:1},
    {note:note('A4'),beats:0.5},{note:note('G4'),beats:0.5},{note:note('E4'),beats:1},
    {note:note('D4'),beats:0.5},{note:note('E4'),beats:0.5},{note:note('G4'),beats:2},
  ];
  [[GM.piano,'01',90],[GM.organ,'02',88],[GM.ePiano1,'03',85],[GM.piano,'04',85],[GM.choir,'05',80]].forEach(([inst,n,bpm]) =>
    melodyLoop(gospelMel, inst, 2, bpm, d('loops/melody',`melody-gospel-${n}.mp3`)));

  // ══════════════════════════════════════════════════════════
  // GUITAR LOOPS
  // ══════════════════════════════════════════════════════════
  console.log('\n[GUITAR LOOPS]');

  const trapGuitProg = [
    {notes:chord(note('A2'),...MINOR),beats:2},{notes:chord(note('F2'),...MAJOR),beats:2},
    {notes:chord(note('G2'),...MAJOR),beats:2},{notes:chord(note('E2'),...MINOR),beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(trapGuitProg, GM.guitar_muted, 'arp', 2, 140, d('loops/guitar',`guitar-trap-0${n}.mp3`));

  const lofiGuitProg = [
    {notes:chord(note('A2'),...MINOR),beats:4},{notes:chord(note('F2'),...MAJOR),beats:4},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(lofiGuitProg, GM.guitar_nylon, 'strum', 2, 80, d('loops/guitar',`guitar-lofi-0${n}.mp3`));

  const psychGuitProg = [
    {notes:chord(note('E2'),...MINOR),beats:2},{notes:chord(note('A2'),...MINOR),beats:2},
    {notes:chord(note('C3'),...MAJOR),beats:2},{notes:chord(note('D3'),...MAJOR),beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(psychGuitProg, GM.guitar_clean, 'arp', 2, 95, d('loops/guitar',`guitar-psychedelic-0${n}.mp3`));

  const cleanGuitProg = [
    {notes:chord(note('G2'),...MAJOR),beats:2},{notes:chord(note('D3'),...MAJOR),beats:2},
    {notes:chord(note('A2'),...MINOR),beats:2},{notes:chord(note('E2'),...MINOR),beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(cleanGuitProg, GM.guitar_clean, 'strum', 2, 100, d('loops/guitar',`guitar-clean-0${n}.mp3`));

  const distGuitProg = [
    {notes:chord(note('E2'),...POWER),beats:2},{notes:chord(note('A2'),...POWER),beats:2},
    {notes:chord(note('G2'),...POWER),beats:2},{notes:chord(note('D2'),...POWER),beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(distGuitProg, GM.guitar_dist, 'strum', 2, 120, d('loops/guitar',`guitar-distorted-0${n}.mp3`));

  const slideGuitProg = [
    {notes:[note('A3')],beats:1},{notes:[note('G3')],beats:0.5},{notes:[note('A3')],beats:0.5},
    {notes:[note('E3')],beats:1},{notes:[note('D3')],beats:1},{notes:[note('A2')],beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(slideGuitProg, GM.guitar_steel, 'pluck', 2, 90, d('loops/guitar',`guitar-slide-0${n}.mp3`));

  const acousticGuitProg = [
    {notes:chord(note('G2'),...MAJOR),beats:2},{notes:chord(note('C3'),...MAJOR),beats:2},
    {notes:chord(note('D3'),...MAJOR),beats:2},{notes:chord(note('G2'),...MAJOR),beats:2},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(acousticGuitProg, GM.guitar_nylon, 'strum', 2, 100, d('loops/guitar',`guitar-acoustic-0${n}.mp3`));

  const funkGuitProg = [
    {notes:chord(note('E2'),...MINOR),beats:1},{notes:chord(note('E2'),...MINOR),beats:0.5},
    {notes:chord(note('A2'),...MINOR),beats:0.5},{notes:chord(note('E2'),...MINOR),beats:1},
    {notes:chord(note('G2'),...MAJOR),beats:0.5},{notes:chord(note('A2'),...MINOR),beats:0.5},
    {notes:chord(note('E2'),...MINOR),beats:1},{notes:chord(note('D3'),...MAJOR),beats:1},
  ];
  for(let n=1;n<=5;n++)
    guitarLoop(funkGuitProg, GM.guitar_muted, 'strum', 2, 108, d('loops/guitar',`guitar-funk-0${n}.mp3`));

  // ══════════════════════════════════════════════════════════
  // TEXTURE LOOPS (sustained pads)
  // ══════════════════════════════════════════════════════════
  console.log('\n[TEXTURE LOOPS]');

  const textInst = [GM.pad_new_age, GM.pad_warm, GM.pad_halo, GM.fx_atmosphere, GM.fx_rain, GM.pad_sweep];
  for(let n=1;n<=6;n++)
    textureLoop([note('A2'),note('E3'),note('A3')], textInst[n-1], 4, 75, d('loops/texture',`texture-atmospheric-0${n}.mp3`));

  const droneInst = [GM.pad_metallic, GM.pad_warm, GM.fx_goblins, GM.pad_halo, GM.synth_str1, GM.fx_echoes];
  const droneNotes = [[note('A1'),note('E2')],[note('D2'),note('A2')],[note('E2'),note('B2')],
                      [note('C2'),note('G2')],[note('F2'),note('C3')],[note('G1'),note('D2')]];
  for(let n=1;n<=6;n++)
    textureLoop(droneNotes[n-1], droneInst[n-1], 4, 70, d('loops/texture',`texture-dark-drone-0${n}.mp3`));

  // rain: tremolo via many short notes on pad
  for(let n=1;n<=6;n++) {
    const rainNotes = [[note('A3'),note('E4')],[note('D4'),note('A4')],[note('E3'),note('B3')],
                       [note('G3'),note('D4')],[note('C4'),note('G4')],[note('F3'),note('C4')]];
    textureLoop(rainNotes[n-1], GM.fx_rain, 4, 80, d('loops/texture',`texture-rain-0${n}.mp3`));
  }

  const noiseNotes = [[note('A2'),note('A3')],[note('D3'),note('D4')],[note('E2'),note('E3')],
                      [note('G2'),note('G3')],[note('C3'),note('C4')],[note('F2'),note('F3')]];
  const noiseInst = [GM.fx_brightness, GM.fx_crystal, GM.pad_metallic, GM.fx_goblins, GM.pad_sweep, GM.fx_echoes];
  for(let n=1;n<=6;n++)
    textureLoop(noiseNotes[n-1], noiseInst[n-1], 4, 85, d('loops/texture',`texture-noise-0${n}.mp3`));

  const ambNotes = [[note('E2'),note('B2'),note('E3')],[note('A2'),note('E3'),note('A3')],
                    [note('D2'),note('A2'),note('D3')],[note('G2'),note('D3'),note('G3')],
                    [note('C2'),note('G2'),note('C3')],[note('F2'),note('C3'),note('F3')]];
  const ambInst = [GM.pad_new_age,GM.pad_warm,GM.pad_choir,GM.pad_halo,GM.pad_polysynth,GM.fx_atmosphere];
  for(let n=1;n<=6;n++)
    textureLoop(ambNotes[n-1], ambInst[n-1], 4, 75, d('loops/texture',`texture-ambient-0${n}.mp3`));

  // ══════════════════════════════════════════════════════════
  // DRUM LOOPS
  // ══════════════════════════════════════════════════════════
  console.log('\n[DRUM LOOPS]');

  // trap-hard: 808 kick pattern, hard snare
  const trapHardPatterns = [
    hits([[0,KICK,110],[0.5,KICK,90],[1,HIHAT,80],[1.5,HIHAT,70],[2,SNARE,110],[2.5,KICK,80],
          [2.75,KICK,75],[3,HIHAT,80],[3.5,HIHAT,70]]),
    hits([[0,KICK,115],[0.75,KICK,85],[1,HIHAT,85],[1.5,HIHAT,75],[1.75,HIHAT,65],[2,SNARE,110],[2.5,KICK,90],[3,HIHAT,85],[3.5,CLAP,95]]),
    hits([[0,KICK,110],[0.5,HIHAT,80],[1,HIHAT,75],[1.5,HIHAT,70],[2,SNARE,115],[2.25,KICK,80],[2.5,KICK,75],[3,HIHAT,80],[3.5,HIHAT,75],[3.75,HIHAT,65]]),
    hits([[0,KICK,112],[1,HIHAT,82],[1.5,HIHAT,72],[2,SNARE,108],[2.5,KICK,88],[3,KICK,75],[3.5,HIHAT,80]]),
    hits([[0,KICK,118],[0.25,KICK,90],[0.75,HIHAT,78],[1,HIHAT,85],[1.5,HIHAT,72],[2,SNARE,112],[2.5,CLAP,90],[3,KICK,82],[3.5,HIHAT,78]]),
  ];
  for(let n=1;n<=5;n++)
    drumLoop(trapHardPatterns[n-1], 4, 140, d('loops/drum-loop',`drumloop-trap-hard-0${n}.mp3`));

  // trap-chill
  const trapChillPatterns = [
    hits([[0,KICK,100],[1,HIHAT,70],[2,SNARE,100],[2.5,HIHAT,65],[3,KICK,85],[3.5,HIHAT,70]]),
    hits([[0,KICK,105],[0.5,HIHAT,65],[1,HIHAT,72],[2,SNARE,98],[3,KICK,80],[3.5,HIHAT,68]]),
    hits([[0,KICK,98],[1,HIHAT,68],[1.75,HIHAT,60],[2,SNARE,102],[2.5,KICK,80],[3,HIHAT,70]]),
    hits([[0,KICK,102],[1,HIHAT,72],[2,SNARE,100],[3,KICK,88],[3.25,KICK,75],[3.5,HIHAT,68]]),
    hits([[0,KICK,100],[0.75,KICK,80],[1,HIHAT,70],[2,SNARE,102],[3,HIHAT,65],[3.5,HIHAT,60]]),
  ];
  for(let n=1;n<=5;n++)
    drumLoop(trapChillPatterns[n-1], 4, 130, d('loops/drum-loop',`drumloop-trap-chill-0${n}.mp3`));

  // boom-bap: classic hip-hop
  const boomBapPatterns = [
    hits([[0,KICK,105],[0.5,HIHAT,80],[1,HIHAT,75],[1.5,HIHAT,80],[2,SNARE,108],[2.5,HIHAT,80],[3,KICK,90],[3.5,HIHAT,75]]),
    hits([[0,KICK,108],[0.5,HIHAT,78],[1,HIHAT,82],[1.5,HIHAT,78],[2,SNARE,110],[2.5,HIHAT,78],[2.75,HIHAT,70],[3,KICK,88],[3.25,KICK,75],[3.5,HIHAT,82]]),
    hits([[0,KICK,110],[0.5,HIHAT,80],[1,HIHAT,78],[2,SNARE,112],[2.5,HIHAT,80],[3,KICK,92],[3.5,HIHAT,78]]),
    hits([[0,KICK,106],[0.5,HIHAT,76],[1,HIHAT,80],[1.5,HIHAT,74],[2,SNARE,108],[2.5,HIHAT,80],[3,KICK,86],[3.5,HIHAT,76],[3.75,PERC,70]]),
    hits([[0,KICK,112],[0.5,HIHAT,82],[1,HIHAT,78],[1.5,HIHAT,85],[2,SNARE,110],[2.5,HIHAT,80],[3,KICK,90],[3.5,HIHAT,82]]),
  ];
  for(let n=1;n<=5;n++)
    drumLoop(boomBapPatterns[n-1], 4, 93, d('loops/drum-loop',`drumloop-boom-bap-0${n}.mp3`));

  // rage: double-time hi-hats
  const ragePatterns = [
    hits([[0,KICK,115],[0.5,HIHAT,85],[0.75,HIHAT,75],[1,HIHAT,85],[1.25,HIHAT,75],[1.5,HIHAT,80],[1.75,HIHAT,72],
          [2,SNARE,112],[2.5,HIHAT,85],[2.75,HIHAT,75],[3,HIHAT,85],[3.25,HIHAT,75],[3.5,KICK,95],[3.75,HIHAT,72]]),
    hits([[0,KICK,118],[0.25,KICK,90],[0.5,HIHAT,82],[0.75,HIHAT,75],[1,HIHAT,82],[1.25,HIHAT,72],[1.5,HIHAT,80],[1.75,HIHAT,70],
          [2,SNARE,115],[2.5,HIHAT,82],[2.75,HIHAT,75],[3,HIHAT,82],[3.25,HIHAT,72],[3.5,KICK,98]]),
    hits([[0,KICK,115],[0.5,HIHAT,80],[0.75,HIHAT,72],[1,HIHAT,80],[1.5,HIHAT,78],[1.75,HIHAT,70],
          [2,SNARE,110],[2.25,CLAP,90],[2.5,HIHAT,80],[2.75,HIHAT,72],[3,KICK,88],[3.5,HIHAT,80]]),
    hits([[0,KICK,120],[0.5,HIHAT,85],[0.75,HIHAT,78],[1,HIHAT,85],[1.25,HIHAT,78],[1.5,HIHAT,82],[1.75,HIHAT,75],
          [2,SNARE,115],[2.5,HIHAT,85],[2.75,HIHAT,78],[3,KICK,95],[3.25,KICK,80],[3.5,HIHAT,85]]),
    hits([[0,KICK,115],[0.5,HIHAT,82],[0.75,HIHAT,75],[1,HIHAT,82],[1.25,HIHAT,72],[1.5,HIHAT,80],
          [2,SNARE,112],[2.5,HIHAT,82],[2.75,HIHAT,75],[3,HIHAT,82],[3.25,HIHAT,72],[3.5,KICK,92]]),
  ];
  for(let n=1;n<=5;n++)
    drumLoop(ragePatterns[n-1], 4, 145, d('loops/drum-loop',`drumloop-rage-0${n}.mp3`));

  // swing: laid-back shuffle
  const swingPatterns = [
    hits([[0,KICK,105],[0.67,HIHAT,75],[1,HIHAT,80],[1.67,HIHAT,72],[2,SNARE,108],[2.67,HIHAT,75],[3,KICK,88],[3.67,HIHAT,72]]),
    hits([[0,KICK,108],[0.67,HIHAT,78],[1,HIHAT,82],[1.67,HIHAT,75],[2,SNARE,110],[2.33,PERC,65],[2.67,HIHAT,78],[3,KICK,90],[3.67,HIHAT,75]]),
    hits([[0,KICK,102],[0.67,HIHAT,75],[1,HIHAT,80],[1.33,HIHAT,68],[1.67,HIHAT,75],[2,SNARE,106],[2.67,HIHAT,78],[3,KICK,85],[3.33,KICK,72],[3.67,HIHAT,75]]),
    hits([[0,KICK,106],[0.67,HIHAT,76],[1,HIHAT,82],[1.67,HIHAT,74],[2,SNARE,108],[2.67,HIHAT,76],[3,RIDE,72],[3.67,HIHAT,74]]),
    hits([[0,KICK,110],[0.67,HIHAT,78],[1,HIHAT,82],[1.67,HIHAT,75],[2,SNARE,108],[2.67,HIHAT,78],[3,KICK,88],[3.33,KICK,72],[3.67,HIHAT,75]]),
  ];
  for(let n=1;n<=5;n++)
    drumLoop(swingPatterns[n-1], 4, 95, d('loops/drum-loop',`drumloop-swing-0${n}.mp3`));

  // ══════════════════════════════════════════════════════════
  // BASS LOOPS
  // ══════════════════════════════════════════════════════════
  console.log('\n[BASS LOOPS]');

  const bassPatterns808dark = [
    [{note:note('A1'),beats:1},{note:note('A1'),beats:0.5},{note:note('G1'),beats:0.5},{note:note('A1'),beats:2}],
    [{note:note('A1'),beats:2},{note:note('E2'),beats:1},{note:note('D2'),beats:1}],
    [{note:note('A1'),beats:1},{note:note('G1'),beats:1},{note:note('A1'),beats:1.5},{note:note('C2'),beats:0.5}],
    [{note:note('A1'),beats:0.5},{note:note('A1'),beats:0.5},{note:note('A1'),beats:1},{note:note('G1'),beats:1},{note:note('A1'),beats:1}],
    [{note:note('A1'),beats:2},{note:note('G1'),beats:1},{note:note('F1'),beats:1}],
  ];
  for(let n=1;n<=5;n++)
    bassLoop(bassPatterns808dark[n-1], GM.synth_bass1, 2, 140, d('loops/bass',`bass-808-dark-0${n}.mp3`));

  const bassPatterns808mel = [
    [{note:note('A1'),beats:0.5},{note:note('C2'),beats:0.5},{note:note('E2'),beats:1},{note:note('G2'),beats:1},{note:note('E2'),beats:1}],
    [{note:note('D2'),beats:1},{note:note('F2'),beats:0.5},{note:note('A2'),beats:0.5},{note:note('G2'),beats:1},{note:note('E2'),beats:1}],
    [{note:note('A1'),beats:1},{note:note('B1'),beats:0.5},{note:note('C2'),beats:0.5},{note:note('E2'),beats:1},{note:note('D2'),beats:1}],
    [{note:note('C2'),beats:1},{note:note('E2'),beats:1},{note:note('G2'),beats:1},{note:note('F2'),beats:1}],
    [{note:note('A1'),beats:0.5},{note:note('E2'),beats:0.5},{note:note('A2'),beats:1},{note:note('G2'),beats:0.5},{note:note('E2'),beats:0.5},{note:note('D2'),beats:1}],
  ];
  for(let n=1;n<=5;n++)
    bassLoop(bassPatterns808mel[n-1], GM.synth_bass1, 2, 130, d('loops/bass',`bass-808-melodic-0${n}.mp3`));

  const bassPatternsFunc = [
    [{note:note('E2'),beats:0.5},{note:note('E2'),beats:0.25},{note:note('E2'),beats:0.25},{note:note('G2'),beats:0.5},{note:note('A2'),beats:0.5},{note:note('E2'),beats:1.5},{note:note('D2'),beats:0.5}],
    [{note:note('A2'),beats:0.5},{note:note('A2'),beats:0.25},{note:note('A2'),beats:0.25},{note:note('G2'),beats:0.5},{note:note('E2'),beats:0.5},{note:note('A1'),beats:2}],
    [{note:note('G2'),beats:0.5},{note:note('G2'),beats:0.25},{note:note('A2'),beats:0.25},{note:note('G2'),beats:0.5},{note:note('E2'),beats:0.5},{note:note('G1'),beats:2}],
    [{note:note('E2'),beats:0.5},{note:note('F#2'),beats:0.5},{note:note('G2'),beats:0.5},{note:note('A2'),beats:0.5},{note:note('G2'),beats:1},{note:note('E2'),beats:1}],
    [{note:note('D2'),beats:0.5},{note:note('D2'),beats:0.25},{note:note('D2'),beats:0.25},{note:note('F2'),beats:0.5},{note:note('G2'),beats:0.5},{note:note('D2'),beats:2}],
  ];
  for(let n=1;n<=5;n++)
    bassLoop(bassPatternsFunc[n-1], GM.bass_finger, 2, 108, d('loops/bass',`bass-funk-0${n}.mp3`));

  const bassPatternsSub = [
    [{note:note('A1'),beats:4}],
    [{note:note('E2'),beats:2},{note:note('D2'),beats:2}],
    [{note:note('A1'),beats:2},{note:note('G1'),beats:2}],
    [{note:note('C2'),beats:4}],
    [{note:note('D2'),beats:2},{note:note('A1'),beats:2}],
  ];
  for(let n=1;n<=5;n++)
    bassLoop(bassPatternsSub[n-1], GM.synth_bass2, 2, 130, d('loops/bass',`bass-sub-0${n}.mp3`));

  // ══════════════════════════════════════════════════════════
  // SYNTH STABS
  // ══════════════════════════════════════════════════════════
  console.log('\n[SYNTH STABS]');

  const sd = (n) => path.join(SAMPLES, 'synths', 'stabs', n);
  fs.mkdirSync(path.join(SAMPLES, 'synths', 'stabs'), { recursive: true });

  // Each stab: short chord hit (1 beat) in a 2-bar loop at 120bpm
  const stabDefs = [
    { name: 'stab-hard-01.mp3',        inst: GM.lead_saw,     vel: 115, notes: [note('A3'), note('C4'), note('E4')] },
    { name: 'stab-airy-01.mp3',        inst: GM.pad_new_age,  vel: 80,  notes: [note('A4'), note('E5')] },
    { name: 'stab-dark-01.mp3',        inst: GM.lead_bass,    vel: 105, notes: [note('A2'), note('C3'), note('E3')] },
    { name: 'stab-bright-01.mp3',      inst: GM.lead_chiffer, vel: 105, notes: [note('A4'), note('C#5'), note('E5')] },
    { name: 'stab-distorted-01.mp3',   inst: GM.guitar_dist,  vel: 110, notes: [note('A2'), note('E3'), note('A3')] },
    { name: 'stab-clean-01.mp3',       inst: GM.guitar_clean, vel: 90,  notes: [note('A3'), note('C4'), note('E4')] },
    { name: 'stab-detuned-01.mp3',     inst: GM.lead_5ths,    vel: 100, notes: [note('A3'), note('E4'), note('A4')] },
    { name: 'stab-vintage-01.mp3',     inst: GM.synth_brass1, vel: 100, notes: [note('C4'), note('E4'), note('G4')] },
    { name: 'stab-digital-01.mp3',     inst: GM.lead_calliope,vel: 105, notes: [note('E4'), note('A4'), note('B4')] },
    { name: 'stab-orchestral-01.mp3',  inst: GM.brass_sect,   vel: 115, notes: [note('A3'), note('C4'), note('E4'), note('A4')] },
  ];

  for (const def of stabDefs) {
    const dest = sd(def.name);
    if (fs.existsSync(dest)) { skip++; continue; }
    const bpm = 120;
    const hitLen  = TPB;        // 1 beat
    const padLen  = TPB * 7;   // 7 beats of silence
    const evts = [{ delta: 0, data: progChange(0, def.inst) }];
    def.notes.forEach(n => evts.push({ delta: 0, data: noteOn(0, n, def.vel) }));
    def.notes.forEach((n, i) => evts.push({ delta: i === 0 ? hitLen : 0, data: noteOff(0, n) }));
    evts.push({ delta: padLen, data: endTrack() });
    const midi = midiFile(bpm, trackChunk(evts));
    render(midi, dest, bpm);
    console.log(`♪ synths/stabs/${def.name}`);
  }

  console.log(`\n${'─'.repeat(56)}`);
  console.log(`Done: ${done} rendered, ${skip} skipped`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
