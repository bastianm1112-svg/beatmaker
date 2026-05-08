# BEATMKR — AI Beat Studio: Design Spec
**Date:** 2026-05-07  
**Stack:** Vanilla JS (ES modules) + Tone.js (CDN) + Anthropic API (direct browser call)  
**Deployment:** Multi-file static site → GitHub Pages (github.com/bastianm1112-svg/beatmaker)

---

## 1. Overview

BEATMKR is a browser-based AI beat studio with two screens:

1. **Creation Wizard** — user selects artist → album → mood → optional description/sample → clicks CREATE
2. **Studio Editor** — generated beat plays immediately; user can tune BPM, key, per-track volume, mute/solo, regenerate individual layers, edit step sequencer, and export

The AI (Claude API) outputs only a structured JSON "beat blueprint." The audio engine (Tone.js) interprets that blueprint and renders real audio. No audio is ever generated directly by AI.

---

## 2. Color Theme

- Background: `#060608` (near-black)
- Primary accent: `#cc1111` (deep red)
- Secondary red: `#881111`, `#330000`, `#1a0000`
- Text: `#e0e0e0` (primary), `#888` (secondary), `#330000`–`#550000` (dim)
- Each artist has a subtle accent overlay that tints UI elements when selected (e.g. Cudi = blue-purple, Travis = orange-psychedelic, Ken = neon red). The base red scheme persists but accent color shifts step-indicator dots, active sequencer cells, and waveform color.

---

## 3. File Structure

```
beatmaker/
├── index.html
├── css/
│   ├── base.css          # reset, typography, custom properties
│   ├── wizard.css        # creation screen styles
│   └── studio.css        # studio editor styles
├── js/
│   ├── config.js         # API key, artist/album data, blueprint library
│   ├── app.js            # entry point, screen router
│   ├── wizard.js         # creation wizard UI logic
│   ├── api.js            # Claude API call + fallback blueprint selection
│   ├── engine.js         # Tone.js audio engine (sequencer, instruments)
│   ├── studio.js         # studio UI (sequencer render, mixer, controls)
│   ├── sequencer.js      # 16-step grid logic (render + edit)
│   ├── mixer.js          # per-track volume/mute/solo
│   ├── exporter.js       # WAV export via OfflineAudioContext
│   └── storage.js        # save/load projects to localStorage
├── assets/
│   └── (no audio files — all synthesis)
└── docs/
    └── superpowers/specs/2026-05-07-beatmaker-design.md
```

---

## 4. Artist & Album Data

Defined in `js/config.js`. Each album entry maps to a `preset` object that seeds the beat blueprint with style parameters.

### Artists & Albums

**Kanye West**
- The College Dropout → soul chops, warm swing drums, +swing, vinyl texture
- Late Registration → orchestral stabs, heavy kick, lush reverb
- Graduation → electronic synths, anthemic build, four-on-the-floor kick
- 808s & Heartbreak → sparse drums, emotional synths, heavy reverb, slow tempo (70–90 BPM)
- Yeezus → industrial percussion, distorted 808, minimal hi-hats, aggressive
- The Life of Pablo → gospel chops, chaotic layering, off-beat snares

**Kid Cudi**
- Man on the Moon → dreamy pads, sparse kick, ambient texture, 80–95 BPM
- Man on the Moon II → darker pads, psychedelic fx, sub-bass
- Indicud → glitchy electronic, more hi-hats, synth arps
- Satellite Flight → ultra-minimal, atmospheric, long reverb tails
- Speedin' Bullet 2 Heaven → distorted guitars (synth approximation), punk energy
- Passion Pain Demon Slayin' → orchestral, emotional synths, sweeping pads
- Man on the Moon III → nostalgic, warm, melodic, moderate tempo

**Travis Scott**
- Owl Pharaoh → reverb-drenched early trap, sparse arrangement
- Days Before Rodeo → psychedelic cinematic, dark texture beds
- Rodeo → festival-ready, layered synths, ascending builds
- Birds in the Trap → dark trap, pitched-down 808s, auto-tune melodic
- Astroworld → euphoric carnival swells, bright synths, layered perc
- Utopia → futuristic dense textures, distorted synths, complex patterns

**Drake**
- Thank Me Later → polished trap, clean kick/snare, melodic piano
- Take Care → R&B trap, emotional piano, smooth 808
- Nothing Was the Same → atmospheric pads, crisp hi-hats, minimal
- If You're Reading This → raw, minimal production, acoustic-adjacent
- Views → dancehall-influenced, offbeat hats, melodic synths
- Scorpion → clean commercial trap, polished mix
- Certified Lover Boy → R&B leaning, warm bass, lush chords

**Young Thug**
- Barter 6 → melodic trap, auto-tune inspired melody, flowing pattern
- Slime Season → hard trap, slapping 808s, crisp hats
- Jeffery → experimental, unconventional chord voicings, melodic
- Beautiful Thugger Girls → country-trap fusion, unusual melodic shapes
- So Much Fun → mainstream bouncy trap, radio-ready
- Punk → alternative, unpredictable structure, wide-open mix

**Ken Carson**
- A Great Chaos → hyper-aggressive rage, distorted 808, fast hats
- Project X → distorted synths, rage beat, minimal melodic
- I Am Nothing → melodic rage, raw emotion, heavy distortion
- X → pure rage, minimalist, maximum 808 distortion

### Preset Parameters (per album)
Each preset defines:
```js
{
  bpmRange: [min, max],       // random within range
  swing: 0–1,
  drumDensity: 0–1,
  bassDistortion: 0–1,
  reverbWet: 0–1,
  delayWet: 0–1,
  melodyComplexity: 0–1,
  preferredKeys: ['Am', 'Cm', ...],
  drumStyle: 'sparse' | 'dense' | 'industrial' | 'swing' | 'trap',
  melodyStyle: 'pads' | 'arp' | 'chop' | 'synth-lead' | 'piano',
  bassType: '808' | '808-distorted' | 'sub',
  energyCurve: 'build' | 'flat' | 'drop',
}
```

---

## 5. Beat Blueprint Format

Claude outputs (or the fallback library returns) exactly this JSON:

```json
{
  "tempo": 140,
  "key": "Am",
  "structure": ["intro", "main", "variation", "breakdown", "outro"],
  "drums": {
    "kick":    [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,1],
    "snare":   [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    "hat":     [1,1,0,1, 1,0,1,1, 1,1,0,1, 1,0,1,0],
    "openHat": [0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,0],
    "swing": 0.15,
    "density": 0.7
  },
  "bass": {
    "type": "808",
    "pattern": [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,1,0],
    "notes":   ["A1","C2","A1","E1", "G1","A1","A1","C2"],
    "distortion": 0.3,
    "behavior": "root_following"
  },
  "melody": {
    "style": "pads",
    "pattern": [1,0,1,0, 0,1,0,1, 0,0,1,0, 1,0,0,1],
    "notes":   ["A3","E3","C4","A3", "G3","A3","C4","E4"],
    "complexity": 0.6
  },
  "sample": {
    "mode": "none",
    "slice_count": 0
  },
  "effects": {
    "reverb": 0.6,
    "delay": 0.3
  }
}
```

**Notes array alignment rule:** `notes` length always equals the number of `1`s in the corresponding `pattern` array. The engine iterates through active steps and consumes notes in order (cycling if needed). Drums have no notes array — they always trigger at a fixed pitch defined by instrument defaults.

---

## 6. Claude API Integration (`js/api.js`)

```
generateBlueprint(artist, album, mood, description, preset)
  → try Claude API (claude-haiku-4-5-20251001 for speed + cost)
  → on failure/timeout → return fallback blueprint from library
```

**Prompt strategy:**
- System prompt: "You are a music production AI. Output ONLY valid JSON beat blueprints. No prose."
- User prompt: artist + album + mood + description + preset parameters → request blueprint JSON
- Temperature: 0.7 (creative but consistent)
- Max tokens: 800

**Fallback library:** `js/config.js` exports a `BLUEPRINT_LIBRARY` — a map of `artist:album:mood` → pre-authored blueprint JSON. When API fails or is unavailable, `api.js` picks the closest match and adds small random variation to tempo/notes/patterns.

---

## 7. Audio Engine (`js/engine.js`)

Built on **Tone.js** (loaded via CDN). One global `Tone.Transport` controls BPM.

### Instruments (Tone.js nodes)

| Track | Tone.js Node | Notes |
|-------|-------------|-------|
| Kick | `MembraneSynth` | pitch envelope, low freq |
| Snare | `NoiseSynth` + `MembraneSynth` | layered |
| Hi-Hat | `MetalSynth` | high freq only |
| Open Hat | `MetalSynth` | longer release |
| 808 | `MonoSynth` + `Distortion` | bass range, root-following |
| Melody | `PolySynth` / `AMSynth` | mid-high range |
| Sample | `Player` + `GrainPlayer` | user upload only |

### Signal Chain

```
[Instrument] → [Channel (vol/mute)] → [Effects: Reverb, Delay] → [Limiter] → [Master out]
              ↘ [Analyser] → visualizer canvas
```

### Frequency Separation (Mixing Rules)

- 808: `Filter(lowpass, 200Hz)` — bass range only
- Hi-hats: `Filter(highpass, 8kHz)` 
- Melody: `Filter(bandpass, 500Hz–8kHz)`
- Kick: `Filter(lowpass, 150Hz)` + transient in full range
- No two instruments share the same dominant frequency band

### Sequencer Playback

`Tone.Sequence` for drum tracks (binary on/off, no pitch variation). `Tone.Part` for 808 and melody tracks (each event carries a note value from the notes array). All sequences share `Tone.Transport` at `"16n"` subdivision. Blueprint step arrays map directly to sequence triggers.

### Section Switching

Structure array (`["intro","main","variation","breakdown","outro"]`) maps to different pattern arrays per section. Each section has its own 16-step patterns derived from the blueprint via variation rules (e.g. breakdown = kick + melody only, variation = added syncopation).

---

## 8. Screen 1: Creation Wizard (`js/wizard.js`)

### Flow
1. **Artist grid (6 cards)** — click to select; card highlights in artist accent color; artist's albums appear below with slide-in animation
2. **Album strip** — horizontal scroll chips; each shows name + style tag; selecting reveals mood grid
3. **Mood grid** — 10 emoji+label chips (AGGRESSIVE, SAD, JOYFUL, DARK, CHILL, ENERGETIC, PSYCHEDELIC, MELANCHOLIC, EPIC, HAZY); selecting reveals step 4
4. **Description textarea + sample drop zone** — both optional; sample drop zone accepts audio files and shows MUSICAL CHOP / TEXTURE mode toggle
5. **CREATE BEAT button** — triggers `api.js` → shows loading animation ("GENERATING BLUEPRINT...") → on blueprint received, calls `engine.js` to build instruments → transitions to studio screen

### Artist Accent Colors
Each artist overrides a `--accent` CSS custom property when selected:
- Kanye: gold `#c8a84b`
- Cudi: blue-purple `#5e4b9e`
- Travis: orange `#cc5500`
- Drake: teal `#1a6a6a`
- Young Thug: green `#3a8a2a`
- Ken Carson: neon red `#ff1122`

---

## 9. Screen 2: Studio Editor (`js/studio.js`)

### Layout
- **Top bar:** logo · artist/album/mood metadata · BACK · PLAY · STOP · REGEN ALL · EXPORT WAV
- **Left panel (140px):** BPM display + −/+ buttons · Key display (click to cycle) · Randomness slider · Regen layer buttons (DRUMS / BASS / MELODY / STRUCTURE)
- **Center:** waveform visualizer (canvas, real-time analyser) + 16-step sequencer (7 rows: KICK, SNARE, HI-HAT, OPEN HAT, 808, MELODY, SAMPLE)
- **Right panel (160px):** mixer — per-track fader + M/S buttons + FX sends (REVERB, DELAY, 808 DIST)
- **Bottom bar:** section timeline (INTRO/MAIN/VAR/BREAK/OUTRO, click to jump) · STRICT–CHAOS randomness slider · SAVE / LOAD / EXPORT WAV

### Sequencer Interaction
- Click any step cell to toggle on/off (live — engine updates immediately)
- Playhead animates across active column
- Cells color-coded by track (kick=bright red, hat=dark red, bass=medium red, melody=dim red)

### Mixer
- Per-track volume: `input[type=range]` mapped to `Tone.Channel.volume` (dB)
- Mute: sets `Tone.Channel.mute`
- Solo: mutes all other channels
- FX sends: reverb wet, delay wet, distortion amount

### BPM
- Range: 60–200
- Changes applied to `Tone.Transport.bpm.value` in real time
- Displayed large in left panel

---

## 10. Sample System (`js/engine.js` + `js/wizard.js`)

On file drop/select:
1. Decode audio to `AudioBuffer` via Web Audio API
2. If mode = **MUSICAL CHOP**: slice buffer into N equal chunks (N from blueprint `slice_count`, default 8); load each slice into a `Tone.Player`; arrange in sequence according to blueprint's sample pattern
3. If mode = **TEXTURE**: load full buffer into `Tone.GrainPlayer` with small grain size; play as ambient bed looped behind the beat

---

## 11. Export (`js/exporter.js`)

Uses `OfflineAudioContext` to render the full beat (all sections, ~60–90 seconds) offline at 44.1kHz, then encodes to WAV via a raw PCM writer (no external library needed). File downloaded via `URL.createObjectURL` + `<a download>`.

MP3 export: not included (requires `lamejs` — added complexity for marginal gain; WAV covers the need).

---

## 12. Save/Load (`js/storage.js`)

Saves to `localStorage` as JSON:
```json
{
  "artist": "kanye",
  "album": "808s & Heartbreak",
  "mood": "DARK",
  "blueprint": { ...full blueprint JSON... },
  "mixerState": { "kick": { "vol": -3, "muted": false }, ... },
  "bpm": 140
}
```

Multiple saves supported with timestamp keys. Load shows a list of saved projects.

---

## 13. GitHub Upload

After build: push all files from `beatmaker/` to `github.com/bastianm1112-svg/beatmaker` via GitHub API (MCP) or `git push`. Enable GitHub Pages on `main` branch root.

---

## 14. What's Explicitly Out of Scope

- MP3 export
- Backend / server of any kind
- User accounts or cloud sync
- MIDI export
- Real audio samples for instruments (all synthesis via Tone.js)
- Copying or cloning real artist audio
