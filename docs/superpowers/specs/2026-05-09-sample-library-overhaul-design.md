# BEATMKR Sample Library & Blueprint Overhaul — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all synthesized instruments with a large royalty-free sample library, add an auto-selected loop system, and overhaul per-artist/album drum patterns so every combination sounds distinctly correct.

**Architecture:** A new `js/samples.js` module owns the sample manifest, loop metadata, artist profiles, and all loading logic. `engine.js` calls `loadSamples()` and receives ready-to-use Tone.js instrument instances — no paths or manifest logic leak into the engine. `config.js` gains per-album drum patterns and sample profile mappings. All files are hosted in `/samples/` and served via jsDelivr CDN.

**Tech Stack:** Tone.js 14.7.77 (`Tone.Sampler`, `Tone.Player`, `Tone.GrainPlayer`), jsDelivr CDN (`cdn.jsdelivr.net/gh/bastianm1112-svg/beatmaker`), CC0/royalty-free MP3 samples sourced from freesound.org and looperman.com.

---

## 1. Sample Library Structure

All samples live in `/samples/` committed to the GitHub repo. Served via jsDelivr for global CDN caching.

```
samples/
  drums/
    kick/           20 files  (sub, trap, distorted, punchy, acoustic,
                               clicky, boomy, 808-kick, layered, electronic
                               — 2 variations each)
    snare/          15 files  (crisp, fat, wood, vinyl, pitched — 3 each)
    clap/           12 files  (trap, wide, tight, layered, dry, reverb-tail — 2 each)
    hat-closed/     15 files
    hat-open/       12 files
    hat-roll/       10 files  (stutter rolls, triplet rolls, 32nd rolls)
    808/            25 files  (pitched: C0 through B2 covering the Sampler range)
    perc/           15 files  (shakers, tambourines, rimshots, cowbells, toms)
    cymbal/          8 files  (crashes, rides)
  loops/
    chords/         80 files  (rage, dark, melodic, chill, psychedelic, gospel,
                               jazz, emo, cinematic, drill, soul, ambient,
                               orchestral, trap, lo-fi, boom-bap, R&B,
                               experimental, neo-soul, euphoric...)
    melody/         60 files  (melodic phrases across moods and keys)
    guitar/         40 files  (trap guitar, lo-fi, psychedelic, clean,
                               distorted, slide, acoustic, funk)
    texture/        30 files  (atmospheric pads, drones, ambient washes)
    drum-loop/      25 files  (full drum loops for layering)
    bass/           20 files  (bass-heavy loop layers)
  synths/
    stabs/          60 files  (hard, airy, dark, bright, distorted, clean,
                               detuned, vintage, digital, orchestral...)
    leads/          40 files  (synth lead phrases across styles)
    pads/           30 files  (pad one-shots and short phrases)
    fx/             25 files  (risers, impacts, downlifters, whooshes, glitches)
```

**Total:** ~550 files, estimated 80–120MB compressed MP3.

**CDN base URL:**
```
https://cdn.jsdelivr.net/gh/bastianm1112-svg/beatmaker@main/samples/
```

**File naming convention:** `{category}-{vibe}-{number}.mp3`
Examples: `kick-distorted-01.mp3`, `chord-rage-dark-01.mp3`, `guitar-psychedelic-02.mp3`

---

## 2. Sample Manifest (`js/samples.js`)

### 2a. Loop Manifest

Each loop entry:
```js
{
  file: 'loops/chords/chord-rage-dark-01.mp3',
  bpm: 150,
  key: 'Cm',
  mood: ['AGGRESSIVE', 'DARK'],
  artists: ['carti', 'ken', 'uzi'],
  tags: ['rage', 'dark', 'distorted']
}
```

All ~255 loops are listed in a `LOOP_MANIFEST` array exported from `samples.js`.

### 2b. Loop Selection Algorithm

`selectLoop(artistId, mood, key)` scores every entry in `LOOP_MANIFEST`:
- +3 if `artists` includes `artistId`
- +2 if `mood` array includes current mood
- +1 if `key` matches (or is relative minor/major)
- Shuffles among tied top scores for variety

Returns top match plus 3 alternatives (for the SWAP button).

### 2c. Drum Sample Manifest

```js
const DRUM_SAMPLES = {
  kick: {
    trap:       'drums/kick/kick-trap-01.mp3',
    heavy:      'drums/kick/kick-heavy-01.mp3',
    distorted:  'drums/kick/kick-distorted-01.mp3',
    sub:        'drums/kick/kick-sub-01.mp3',
    punchy:     'drums/kick/kick-punchy-01.mp3',
    // ... 15 more
  },
  snare: { crisp, fat, wood, vinyl, pitched, ... },
  clap:  { trap, wide, tight, layered, dry, ... },
  hatClosed: { tight, loose, sizzle, ... },
  hatOpen:   { short, long, airy, ... },
  hatRoll:   { stutter, triplet, fast, ... },
  perc:      { shaker, tambourine, rimshot, ... },
}
```

### 2d. Artist Sample Profiles

Each artist has a `sampleProfile` in `samples.js` specifying which drum variations to use. Selected by the `loadSamples()` function:

```js
const ARTIST_PROFILES = {
  carti: {
    'Whole Lotta Red': {
      kick: 'distorted', snare: 'crisp', clap: 'trap',
      hatClosed: 'sizzle', hatOpen: 'short', hatRoll: 'stutter',
      loopMoods: ['AGGRESSIVE', 'DARK', 'ENERGETIC'],
      kickAlt: 'heavy',   // used when mood = AGGRESSIVE
    },
    'Die Lit': {
      kick: 'punchy', snare: 'fat', clap: 'wide',
      hatClosed: 'loose', hatOpen: 'airy', hatRoll: 'triplet',
      loopMoods: ['ENERGETIC', 'JOYFUL'],
    },
    'Playboi Carti': {
      kick: 'sub', snare: 'pitched', clap: 'wide',
      hatClosed: 'loose', hatOpen: 'airy', hatRoll: 'triplet',
      loopMoods: ['CHILL', 'PSYCHEDELIC', 'MELANCHOLIC'],
    },
    // ... Music album
  },
  kanye: {
    'The College Dropout': {
      kick: 'punchy', snare: 'fat', clap: 'layered',
      hatClosed: 'loose', hatOpen: 'long', hatRoll: 'triplet',
      loopMoods: ['JOYFUL', 'EPIC', 'SAD'],
    },
    // ... all Kanye albums
  },
  // ... all 12 artists x all albums
};
```

### 2e. `loadSamples(artistId, albumName, mood, key)`

Returns a Promise resolving to:
```js
{
  kick:     Tone.Player,
  snare:    Tone.Player,
  clap:     Tone.Player,
  hatClosed: Tone.Player,
  hatOpen:  Tone.Player,
  hatRoll:  Tone.Player,
  bass:     Tone.Sampler,   // 808s, pitch-shifts automatically
  melody:   Tone.Sampler,   // synth stabs, triggered by step sequencer
  loop:     { player: Tone.Player, meta: loopEntry, alternatives: loopEntry[] }
}
```

All URLs prefixed with the jsDelivr CDN base. Loads all files in parallel via `Promise.all`.

---

## 3. Engine Changes (`js/engine.js`)

### 3a. Instrument Replacement

| Old | New |
|---|---|
| `Tone.MembraneSynth` (kick) | `Tone.Player` → `_instruments.kick` |
| `Tone.NoiseSynth` + `Tone.MembraneSynth` (snare) | Two `Tone.Player`s → `_instruments.snare` (body), `_instruments.clap` |
| `Tone.MetalSynth` × 2 (hats) | `Tone.Player` × 3 → `_instruments.hatClosed`, `_instruments.hatOpen`, `_instruments.hatRoll` |
| `Tone.MonoSynth` (808) | `Tone.Sampler` → `_instruments.bass` |
| `Tone.PolySynth` (melody) | `Tone.Sampler` → `_instruments.melody` |
| `Tone.Player` (sample) | `Tone.Player` with `loop: true` → `_instruments.loop` |

### 3b. `initEngine(blueprint)` signature change

```js
export async function initEngine(blueprint, samples)
```

`samples` is the object returned by `loadSamples()`. The engine assigns each instrument directly:
```js
_instruments.kick      = samples.kick;
_instruments.snare     = samples.snare;
_instruments.clap      = samples.clap;
_instruments.hatClosed = samples.hatClosed;
_instruments.hatOpen   = samples.hatOpen;
_instruments.hatRoll   = samples.hatRoll;
_instruments.bass      = samples.bass;
_instruments.melody    = samples.melody;
_instruments.loop      = samples.loop.player;
```

Then connects each to its channel (same channel/effects structure as before).

### 3c. Sequence Changes

- `_sequences.snare` triggers both `_instruments.snare` and `_instruments.clap` (layered hit)
- `_sequences.hat` triggers `_instruments.hatClosed` for steps in `drums.hat`, `_instruments.hatOpen` for steps in `drums.openHat`
- `_sequences.hatRoll` triggers `_instruments.hatRoll` for steps in `drums.hatRoll` — a new optional 16-step array added to the blueprint schema (defaults to all zeros if absent). Per-album patterns populate it for artists known for roll patterns (Carti, Ken, Uzi).
- `_instruments.melody` (`Tone.Sampler`) uses `triggerAttackRelease(note, '8n', time)` — same API as before, Sampler handles the pitch mapping
- Loop player: `_instruments.loop.start(0)` on transport start, `_instruments.loop.stop()` on transport stop. Loop does NOT auto-start on beat creation — it waits for the user to press play.

### 3d. BPM Sync for Loops

```js
export function setBpm(bpm) {
  T().Transport.bpm.value = bpm;
  if (_blueprint) _blueprint.tempo = bpm;
  if (_instruments.loop && _currentLoopMeta) {
    _instruments.loop.playbackRate = bpm / _currentLoopMeta.bpm;
  }
}
```

### 3e. Loop Swap

```js
export function swapLoop(loopEntry) {
  // stop and dispose current loop player
  // create new Tone.Player from loopEntry.file
  // connect to _channels.sample
  // start if transport is running
}
```

---

## 4. Studio UI Changes (`js/studio.js`)

The SAMPLE row in the step sequencer gets a loop info bar above it:

```
[ ◎ chord-rage-dark-01  ⟳ SWAP ]   ← shown when loop is active
```

- Loop name displayed (truncated)
- **SWAP** button cycles through the 3 alternatives returned by `selectLoop()`
- Clicking the existing drop zone still allows manual override
- No other UI changes — mixer, FX, sections, transport all stay the same

---

## 5. Blueprint Accuracy (`js/config.js`)

### 5a. Per-Album Drum Patterns

`BASE_BLUEPRINTS` expands from 12 artist entries to ~60 artist+album entries. Each album gets a distinct kick/snare/hat pattern. Examples:

**carti:Whole Lotta Red** (rage):
```js
kick:    [1,0,1,0, 1,0,0,1, 1,0,1,0, 0,1,0,1],
snare:   [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
hat:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,0,1,1],  // relentless
openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
```

**carti:Playboi Carti** (dreamy):
```js
kick:    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],  // sparse, floaty
snare:   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
hat:     [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],  // loose 8th feel
openHat: [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
```

**kanye:Yeezus** (industrial):
```js
kick:    [1,0,0,1, 1,0,0,0, 1,0,0,1, 0,0,1,0],
snare:   [0,0,1,0, 0,0,0,0, 1,0,0,0, 0,0,0,1],  // off-beat industrial
hat:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],  // sparse, harsh
openHat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
```

Full patterns defined for all ~60 album combinations.

### 5b. Fix `densityMult` Bug

`getFallbackBlueprint` currently calculates `densityMult` but never applies it. Fix:

```js
if (moodMod.densityMult) {
  const dm = moodMod.densityMult;
  ['kick','snare','hat','openHat'].forEach(track => {
    base.drums[track] = base.drums[track].map(v => {
      if (dm > 1 && v === 0) return Math.random() < (dm - 1) * 0.3 ? 1 : 0;
      if (dm < 1 && v === 1) return Math.random() < (1 - dm) * 0.4 ? 0 : 1;
      return v;
    });
  });
}
```

AGGRESSIVE (`densityMult: 1.4`) adds hits. CHILL (`densityMult: 0.5`) removes them. Biased toward kick doubles for rage moods, hat removals for chill moods.

### 5c. `getFallbackBlueprint` Lookup Change

Instead of looking up by `artistId` only:
```js
const key = `${artistId}:${albumName}`;
const base = BASE_BLUEPRINTS[key] || BASE_BLUEPRINTS[artistId] || BASE_BLUEPRINTS.kanye;
```

---

## 6. Wizard / App Flow Changes (`js/wizard.js`, `js/app.js`)

`onCreated` in `app.js` currently calls `initEngine(blueprint)` via `initStudio`. New flow:

```
generateBlueprint() → blueprint
loadSamples(artistId, albumName, mood, blueprint.key) → samples   ← parallel fetches internally
initEngine(blueprint, samples)
```

A loading state in the wizard shows "Loading sounds..." while samples fetch. Since samples are CDN-cached after first load, subsequent beats for the same artist are near-instant.

---

## 7. Files Created / Modified

| File | Action |
|---|---|
| `samples/**` | Create — ~550 audio files sourced from CC0 packs |
| `js/samples.js` | Create — manifest, profiles, loader, loop selector |
| `js/engine.js` | Modify — replace synths with sample players, add loop swap |
| `js/config.js` | Modify — expand BASE_BLUEPRINTS to per-album, fix densityMult |
| `js/api.js` | Modify — minor: pass albumName to getFallbackBlueprint lookup |
| `js/wizard.js` | Modify — pass samples loading into onCreated flow |
| `js/studio.js` | Modify — loop info bar + SWAP button in SAMPLE row |

---

## 8. Out of Scope

- Audio export format changes (stays as-is)
- Claude API blueprint generation changes (schema unchanged)
- Any UI redesign beyond the SAMPLE row loop bar
- Paid or licensed sample content
