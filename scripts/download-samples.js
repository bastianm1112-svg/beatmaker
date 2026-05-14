#!/usr/bin/env node
/**
 * BEATMKR Sample Downloader
 *
 * Drum one-shots: downloaded from Boochi44/free-drum-samples (CC0)
 * Loops & stabs:  synthesised with ffmpeg lavfi (CC0 by generation)
 *
 * Run: node scripts/download-samples.js
 */

'use strict';
const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');
const https = require('https');
const os   = require('os');

const SAMPLES = path.resolve(__dirname, '..', 'samples');
const TMP     = path.join(os.tmpdir(), 'beatmkr-dl');
const BOOCHI  = 'https://raw.githubusercontent.com/Boochi44/free-drum-samples/77ba31428a079dd8f17c8e144c1e649ea0a198b3/drum-samples';
const REF     = '77ba31428a079dd8f17c8e144c1e649ea0a198b3';

fs.mkdirSync(TMP, { recursive: true });
let dl = 0, gen = 0, skip = 0;

// ─── helpers ──────────────────────────────────────────────────
function fetch(url, dest) {
  return new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    const req = https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        f.close();
        return fetch(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        f.close(); fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }
      res.pipe(f);
      f.on('finish', () => { f.close(); resolve(); });
    });
    req.on('error', e => { f.close(); try { fs.unlinkSync(dest); } catch {} reject(e); });
  });
}

function wav2mp3(src, dest, af = '') {
  const afArg = af ? `-af "${af}"` : '';
  execSync(`ffmpeg -y -i "${src}" ${afArg} -codec:a libmp3lame -q:a 4 "${dest}" -loglevel error`, { stdio: 'inherit' });
}

function boochi(pack, cat, file) {
  return `${BOOCHI}/${pack}/${cat}/${file}`;
}

async function dlConvert(url, dest, af = '') {
  if (fs.existsSync(dest)) { skip++; return; }
  const tmp = path.join(TMP, `${Date.now()}-${path.basename(url)}`);
  try {
    await fetch(url, tmp);
    wav2mp3(tmp, dest, af);
    fs.unlinkSync(tmp);
    dl++;
    process.stdout.write(`↓ ${path.relative(SAMPLES, dest)}\n`);
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch {}
    console.warn(`  WARN: ${e.message} — falling back to synth`);
    genTone(dest, 'anoisesrc=color=pink,highpass=f=3000');
  }
}

function genTone(dest, filter, duration = 4) {
  if (fs.existsSync(dest)) { skip++; return; }
  const dur = typeof duration === 'number' ? duration : 4;
  execSync(
    `ffmpeg -y -f lavfi -i "${filter}" -t ${dur} -codec:a libmp3lame -q:a 4 "${dest}" -loglevel error`,
    { stdio: 'inherit' }
  );
  gen++;
  process.stdout.write(`~ ${path.relative(SAMPLES, dest)}\n`);
}

function d(...parts) { return path.join(SAMPLES, ...parts); }

// ──────────────────────────────────────────────────────────────
// Chord frequencies for loop synthesis (root Hz, intervals)
// ──────────────────────────────────────────────────────────────
const CHORDS = {
  // format: [root_hz, p5_ratio, p3_ratio]  (minor = 1.189, major = 1.26)
  'rage-dark':     [55.00,  1.498, 1.189],   // Am — heavy
  'rage-bright':   [55.00,  1.498, 1.260],   // A  — bright heavy
  'melodic-dark':  [73.42,  1.498, 1.189],   // Dm minor
  'melodic-bright':[73.42,  1.498, 1.260],   // D major
  'chill':         [82.41,  1.498, 1.335],   // E sus4
  'gospel':        [130.81, 1.498, 1.260],   // C major
  'psychedelic':   [87.31,  1.587, 1.189],   // F aug/cluster
  'jazz':          [98.00,  1.498, 1.335],   // G sus
  'dark-trap':     [58.27,  1.498, 1.189],   // Bb minor
  'ambient':       [82.41,  2.000, 1.498],   // E open 5th
  'soul':          [92.50,  1.498, 1.260],   // F# major
  'rnb':           [77.78,  1.498, 1.260],   // Eb major
  'drill':         [61.74,  1.498, 1.189],   // B minor
  'cinematic':     [65.41,  1.498, 1.189],   // C minor
  'neo-soul':      [103.83, 1.498, 1.335],   // Ab sus
  'boom-bap':      [73.42,  1.498, 1.260],   // D major
  'euphoric':      [196.00, 1.498, 1.260],   // G major high
  'experimental':  [93.00,  1.335, 1.189],   // cluster
  'emo':           [82.41,  1.498, 1.189],   // E minor
  'orchestral':    [130.81, 1.498, 1.189],   // C minor
};

function chordFilter(vibe, num) {
  const [r, p5, p3] = CHORDS[vibe] || [110, 1.498, 1.189];
  // Slight detune per variant for uniqueness
  const detune = 1 + (num - 1) * 0.002;
  const r2 = r * detune;
  const mod = 0.3 + (num % 3) * 0.1;    // LFO speed variation
  return `aevalsrc='0.18*(sin(2*PI*${r2.toFixed(2)}*t)+0.8*sin(2*PI*${(r2*p3).toFixed(2)}*t)+0.7*sin(2*PI*${(r2*p5).toFixed(2)}*t)+0.5*sin(2*PI*${(r2*2).toFixed(2)}*t))*(0.5+0.5*cos(2*PI*t*${mod.toFixed(2)}))':s=44100:c=mono`;
}

// Melody: use amplitude-modulated sine waves at different rates/offsets per note
// (avoids ternary operators which ffmpeg aevalsrc doesn't support)
const MELODY_FREQS = {
  'dark-synth':   [220.00, 261.63, 311.13, 329.63],
  'bright-synth': [261.63, 329.63, 392.00, 440.00],
  'piano-sad':    [220.00, 246.94, 261.63, 293.66],
  'piano-happy':  [261.63, 293.66, 329.63, 392.00],
  'trap-lead':    [110.00, 130.81, 146.83, 164.81],
  'flute':        [440.00, 493.88, 523.25, 587.33],
  'strings':      [110.00, 138.59, 164.81, 220.00],
  '808-lead':     [82.41,  98.00,  110.00, 130.81],
  'vocal-chop':   [261.63, 311.13, 349.23, 392.00],
  'arp-bright':   [261.63, 329.63, 392.00, 523.25],
  'arp-dark':     [220.00, 261.63, 329.63, 440.00],
  'lo-fi':        [220.00, 261.63, 311.13, 369.99],
  'rage-synth':   [220.00, 246.94, 293.66, 329.63],
  'psychedelic':  [220.00, 277.18, 369.99, 466.16],
  'gospel':       [261.63, 329.63, 392.00, 523.25],
};

function melodyFilter(style, num) {
  const base = MELODY_FREQS[style] || [220, 261.63, 329.63, 392];
  const dt   = 1 + (num - 1) * 0.005;
  const [f1, f2, f3, f4] = base.map(f => (f * dt).toFixed(2));
  const rate = 2 + (num % 3) * 0.5;
  // Offset each note's gate by 0.25 of a cycle for sequential feel
  return `aevalsrc='0.14*sin(2*PI*${f1}*t)*(0.5+0.5*sin(${rate.toFixed(2)}*PI*t))+0.14*sin(2*PI*${f2}*t)*(0.5+0.5*sin(${rate.toFixed(2)}*PI*(t+0.25)))+0.12*sin(2*PI*${f3}*t)*(0.5+0.5*sin(${rate.toFixed(2)}*PI*(t+0.5)))+0.10*sin(2*PI*${f4}*t)*(0.5+0.5*sin(${rate.toFixed(2)}*PI*(t+0.75)))':s=44100:c=mono`;
}

function textureFilter(style, num) {
  const filters = {
    'atmospheric': `anoisesrc=color=pink,highpass=f=${500 + num * 200},lowpass=f=${3000 + num * 500}`,
    'dark-drone':  `aevalsrc='0.2*sin(2*PI*${(55 + num * 2).toFixed(1)}*t)+0.1*sin(2*PI*${(110 + num * 4).toFixed(1)}*t)':s=44100:c=mono`,
    'rain':        `anoisesrc=color=brown,highpass=f=${200 + num * 50},lowpass=f=${2000 + num * 100}`,
    'noise':       `anoisesrc=color=white,highpass=f=${1000 * num},lowpass=f=${5000 + num * 1000}`,
    'ambient':     `aevalsrc='0.15*(sin(2*PI*${(82 + num).toFixed(1)}*t)+sin(2*PI*${(123 + num * 1.5).toFixed(1)}*t))*(0.5+0.5*sin(2*PI*t*0.${num}1))':s=44100:c=mono`,
  };
  return filters[style] || filters['atmospheric'];
}

function drumLoopFilter(style, num) {
  // Synthesise drum loop as mix of kick (pitched sine) + noise bursts (snare/hat)
  const bpms = { 'trap-hard': 140, 'trap-chill': 130, 'boom-bap': 93, 'rage': 145, 'swing': 95 };
  const bpm  = (bpms[style] || 130) * (1 + (num - 1) * 0.01);
  const bp   = 60 / bpm;  // seconds per beat
  const kf   = 60 + num * 3;   // kick base frequency varies per variant
  const sf   = 200 + num * 30; // snare noise center freq
  // Kick: pitched sine with rapid pitch drop, gated at beat 0 and beat 2
  // Snare: bandpassed noise at beat 1 and beat 3
  // Hat: high noise at every 8th note
  return `aevalsrc='0.8*exp(-mod(t,${bp.toFixed(3)})*30)*sin(2*PI*${kf}*exp(-mod(t,${bp.toFixed(3)})*20)*mod(t,${bp.toFixed(3)}))+0.25*(sin(2*PI*${sf}*t)*exp(-mod(t,${bp.toFixed(3)})*60))':s=44100:c=mono`;
}

function bassFilter(style, num) {
  const roots = { '808-dark': 55, '808-melodic': 73, 'funk': 82, 'sub': 41 };
  const r = (roots[style] || 55) * (1 + (num - 1) * 0.03);
  if (style === 'sub') {
    return `aevalsrc='0.6*sin(2*PI*${r.toFixed(2)}*t)*exp(-t*2+floor(t)*2)':s=44100:c=mono`;
  }
  return `aevalsrc='0.4*sin(2*PI*${r.toFixed(2)}*t)+0.15*sin(2*PI*${(r * 2).toFixed(2)}*t)+0.05*sin(2*PI*${(r * 3).toFixed(2)}*t)':s=44100:c=mono`;
}

function guitarFilter(style, num) {
  // Karplus-Strong approximation: noise burst with exponential decay
  const freqs = { 'trap': 110, 'lofi': 82, 'psychedelic': 73, 'clean': 146, 'distorted': 98, 'slide': 87, 'acoustic': 130, 'funk': 92 };
  const f = (freqs[style] || 110) * (1 + (num - 1) * 0.05);
  return `aevalsrc='0.3*sin(2*PI*${f.toFixed(2)}*t)*exp(-t*1.5)+0.15*sin(2*PI*${(f * 2.003).toFixed(2)}*t)*exp(-t*2)+0.08*sin(2*PI*${(f * 3).toFixed(2)}*t)*exp(-t*3)':s=44100:c=mono`;
}

function stabFilter(style) {
  const params = {
    'hard':       [220, 8, 0.4],
    'airy':       [440, 2, 1.0],
    'dark':       [110, 4, 0.5],
    'bright':     [880, 6, 0.3],
    'distorted':  [220, 3, 0.4],
    'clean':      [330, 5, 0.6],
    'detuned':    [218, 4, 0.5],
    'vintage':    [165, 3, 0.7],
    'digital':    [660, 10, 0.2],
    'orchestral': [440, 2, 0.8],
  };
  const [freq, decay, dur] = params[style] || [220, 5, 0.4];
  return [`aevalsrc='0.5*(sin(2*PI*${freq}*t)+0.3*sin(2*PI*${freq * 2}*t)+0.1*sin(2*PI*${freq * 3}*t))*exp(-t*${decay})':s=44100:c=mono`, dur];
}

// ──────────────────────────────────────────────────────────────
async function main() {
  console.log('\nBEATMKR Sample Downloader\n' + '─'.repeat(50));

  // ══ KICKS (10) ════════════════════════════════════════════
  console.log('\n[KICK]');
  await dlConvert(boochi('01-hard-trap','kicks','hard-kick-01.wav'),  d('drums/kick/kick-trap-01.mp3'));
  await dlConvert(boochi('01-hard-trap','kicks','hard-kick-02.wav'),  d('drums/kick/kick-heavy-01.mp3'));
  await dlConvert(boochi('02-bounce','kicks','bounce-kick-03.wav'),   d('drums/kick/kick-distorted-01.mp3'));
  await dlConvert(boochi('01-hard-trap','808s','808-bass-sub.wav'),   d('drums/kick/kick-sub-01.mp3'));
  await dlConvert(boochi('02-bounce','kicks','bounce-kick-01.wav'),   d('drums/kick/kick-punchy-01.mp3'));
  await dlConvert(boochi('02-bounce','kicks','bounce-kick-02.wav'),   d('drums/kick/kick-electronic-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','kicks','vintage-kick-03.wav'), d('drums/kick/kick-boomy-01.mp3'));
  await dlConvert(boochi('01-hard-trap','kicks','hard-kick-03.wav'),  d('drums/kick/kick-clicky-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','kicks','vintage-kick-01.wav'), d('drums/kick/kick-acoustic-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','kicks','vintage-kick-02.wav'), d('drums/kick/kick-layered-01.mp3'));

  // ══ SNARES (6) ════════════════════════════════════════════
  console.log('\n[SNARE]');
  await dlConvert(boochi('01-hard-trap','snares','hard-snare-01.wav'),         d('drums/snare/snare-crisp-01.mp3'));
  await dlConvert(boochi('01-hard-trap','snares','hard-snare-02.wav'),         d('drums/snare/snare-fat-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','snares','vintage-snare-01.wav'),d('drums/snare/snare-wood-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','snares','vintage-snare-02.wav'),d('drums/snare/snare-vinyl-01.mp3'));
  await dlConvert(boochi('02-bounce','snares','bounce-snare-01.wav'),          d('drums/snare/snare-pitched-01.mp3'));
  await dlConvert(boochi('01-hard-trap','snares','hard-snare-03.wav'),         d('drums/snare/snare-rimshot-01.mp3'));

  // ══ CLAPS (6) — 3 real + 3 filter variants ════════════════
  console.log('\n[CLAP]');
  await dlConvert(boochi('01-hard-trap','claps','clap-01.wav'),        d('drums/clap/clap-trap-01.mp3'));
  await dlConvert(boochi('02-bounce','claps','clap-01.wav'),           d('drums/clap/clap-wide-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','claps','vintage-clap-01.wav'), d('drums/clap/clap-tight-01.mp3'));
  await dlConvert(boochi('02-bounce','claps','clap-01.wav'),           d('drums/clap/clap-layered-01.mp3'), 'aecho=0.8:0.9:40:0.4');
  await dlConvert(boochi('01-hard-trap','claps','clap-01.wav'),        d('drums/clap/clap-dry-01.mp3'),    'highpass=f=800,treble=g=6');
  await dlConvert(boochi('03-soulful-vintage','claps','cl-lofi.wav'),  d('drums/clap/clap-reverb-01.mp3'), 'aecho=0.8:0.9:120:0.6');

  // ══ HI-HATS CLOSED (5) ════════════════════════════════════
  console.log('\n[HAT-CLOSED]');
  await dlConvert(boochi('01-hard-trap','hi-hats','hi-hat-closed-01.wav'), d('drums/hat-closed/hat-closed-tight-01.mp3'));
  await dlConvert(boochi('02-bounce','hi-hats','hi-hat-closed-01.wav'),   d('drums/hat-closed/hat-closed-loose-01.mp3'));
  await dlConvert(boochi('01-hard-trap','hi-hats','ch.wav'),              d('drums/hat-closed/hat-closed-sizzle-01.mp3'), 'aecho=0.5:0.7:20:0.3');
  await dlConvert(boochi('03-soulful-vintage','hi-hats','hi-hat-closed-01.wav'), d('drums/hat-closed/hat-closed-crisp-01.mp3'));
  await dlConvert(boochi('02-bounce','hi-hats','hi-hat-closed-01.wav'),   d('drums/hat-closed/hat-closed-muted-01.mp3'),  'lowpass=f=5000');

  // ══ OPEN HATS (4) ═════════════════════════════════════════
  console.log('\n[HAT-OPEN]');
  await dlConvert(boochi('01-hard-trap','open-hats','open-hat-01.wav'),         d('drums/hat-open/hat-open-short-01.mp3'));
  await dlConvert(boochi('02-bounce','open-hats','open-hat-01.wav'),            d('drums/hat-open/hat-open-long-01.mp3'));
  await dlConvert(boochi('03-soulful-vintage','open-hats','oh00-lofi.wav'),     d('drums/hat-open/hat-open-airy-01.mp3'));
  await dlConvert(boochi('01-hard-trap','open-hats','open-hat-01.wav'),         d('drums/hat-open/hat-open-trashy-01.mp3'), 'aecho=0.6:0.7:30:0.5,treble=g=8');

  // ══ HAT ROLLS (4) — synthesised ══════════════════════════
  console.log('\n[HAT-ROLL]');
  genTone(d('drums/hat-roll/hat-roll-stutter-01.mp3'),
    'anoisesrc=color=white,highpass=f=6000,lowpass=f=14000,tremolo=f=16:d=0.9', 2);
  genTone(d('drums/hat-roll/hat-roll-triplet-01.mp3'),
    'anoisesrc=color=white,highpass=f=5000,lowpass=f=12000,tremolo=f=12:d=0.85', 2);
  genTone(d('drums/hat-roll/hat-roll-fast-01.mp3'),
    'anoisesrc=color=white,highpass=f=7000,lowpass=f=15000,tremolo=f=32:d=0.95', 1.5);
  genTone(d('drums/hat-roll/hat-roll-slow-01.mp3'),
    'anoisesrc=color=white,highpass=f=4000,lowpass=f=10000,tremolo=f=8:d=0.8', 2);

  // ══ 808s (5) — 4 real + 1 pitch variant ══════════════════
  console.log('\n[808]');
  await dlConvert(boochi('01-hard-trap','808s','808-bass-sub.wav'),  d('drums/808/808-C0-01.mp3'));
  await dlConvert(boochi('01-hard-trap','808s','808-bass-dist.wav'), d('drums/808/808-C1-01.mp3'));
  await dlConvert(boochi('02-bounce','808s','808-bass-punch.wav'),   d('drums/808/808-G1-01.mp3'));
  await dlConvert(boochi('02-bounce','808s','808-bass-long.wav'),    d('drums/808/808-C2-01.mp3'));
  await dlConvert(boochi('01-hard-trap','808s','808-dist-long.wav'), d('drums/808/808-G2-01.mp3'),
    'asetrate=44100*1.498,aresample=44100');  // pitch up a perfect 5th

  // ══ SYNTH STABS (10) — synthesised ════════════════════════
  console.log('\n[STABS]');
  const stabNames = ['hard','airy','dark','bright','distorted','clean','detuned','vintage','digital','orchestral'];
  for (const s of stabNames) {
    const [filter, dur] = stabFilter(s);
    genTone(d(`synths/stabs/stab-${s}-01.mp3`), filter, dur);
  }

  // ══ LOOPS — CHORDS ════════════════════════════════════════
  console.log('\n[LOOPS/CHORDS]');
  const chordVibes = {
    'rage-dark':     5,
    'rage-bright':   4,
    'melodic-dark':  5,
    'melodic-bright':4,
    'chill':         5,
    'gospel':        4,
    'psychedelic':   4,
    'jazz':          4,
    'dark-trap':     5,
    'ambient':       4,
    'soul':          4,
    'rnb':           4,
    'drill':         4,
    'cinematic':     4,
    'neo-soul':      4,
    'boom-bap':      4,
    'euphoric':      4,
    'experimental':  4,
    'emo':           4,
    'orchestral':    4,
  };
  for (const [vibe, count] of Object.entries(chordVibes)) {
    for (let n = 1; n <= count; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/chords/chord-${vibe}-${num}.mp3`), chordFilter(vibe, n), 4);
    }
  }

  // ══ LOOPS — MELODY ════════════════════════════════════════
  console.log('\n[LOOPS/MELODY]');
  const melodyStyles = {
    'dark-synth':   5,
    'bright-synth': 5,
    'piano-sad':    4,
    'piano-happy':  4,
    'trap-lead':    4,
    'flute':        4,
    'strings':      4,
    '808-lead':     4,
    'vocal-chop':   4,
    'arp-bright':   4,
    'arp-dark':     4,
    'lo-fi':        4,
    'rage-synth':   4,
    'psychedelic':  4,
    'gospel':       5,
  };
  for (const [style, count] of Object.entries(melodyStyles)) {
    for (let n = 1; n <= count; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/melody/melody-${style}-${num}.mp3`), melodyFilter(style, n), 4);
    }
  }

  // ══ LOOPS — GUITAR ════════════════════════════════════════
  console.log('\n[LOOPS/GUITAR]');
  const guitarStyles = ['trap','lofi','psychedelic','clean','distorted','slide','acoustic','funk'];
  for (const style of guitarStyles) {
    for (let n = 1; n <= 5; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/guitar/guitar-${style}-${num}.mp3`), guitarFilter(style, n), 4);
    }
  }

  // ══ LOOPS — TEXTURE ═══════════════════════════════════════
  console.log('\n[LOOPS/TEXTURE]');
  const textureStyles = ['atmospheric','dark-drone','rain','noise','ambient'];
  for (const style of textureStyles) {
    for (let n = 1; n <= 6; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/texture/texture-${style}-${num}.mp3`), textureFilter(style, n), 6);
    }
  }

  // ══ LOOPS — DRUM LOOP ══════════════════════════════════════
  console.log('\n[LOOPS/DRUM-LOOP]');
  const drumStyles = ['trap-hard','trap-chill','boom-bap','rage','swing'];
  for (const style of drumStyles) {
    for (let n = 1; n <= 5; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/drum-loop/drumloop-${style}-${num}.mp3`), drumLoopFilter(style, n), 4);
    }
  }

  // ══ LOOPS — BASS ═══════════════════════════════════════════
  console.log('\n[LOOPS/BASS]');
  const bassStyles = ['808-dark','808-melodic','funk','sub'];
  for (const style of bassStyles) {
    for (let n = 1; n <= 5; n++) {
      const num = String(n).padStart(2, '0');
      genTone(d(`loops/bass/bass-${style}-${num}.mp3`), bassFilter(style, n), 4);
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Done: ${dl} downloaded, ${gen} generated, ${skip} skipped`);

  // Verify count
  const total = walk(SAMPLES).filter(f => f.endsWith('.mp3')).length;
  console.log(`Total MP3s in samples/: ${total}`);
}

function walk(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

main().catch(e => { console.error(e); process.exit(1); });
