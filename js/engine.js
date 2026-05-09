/* ═══════════════════════════════════════════
   ENGINE — Tone.js audio engine
════════════════════════════════════════════ */

const T = () => window.Tone;

let _blueprint = null;
let _instruments = {};
let _channels    = {};
let _effects     = {};
let _sequences   = {};
let _analyser    = null;
let _section     = 'main';
let _sectionPatterns = {};
let _currentStep = 0;
let _stepListeners = [];
let _initialized = false;

// ─── Public API ────────────────────────────

export async function initEngine(blueprint) {
  const Tone = T();
  if (!Tone) throw new Error('Tone.js not loaded');

  _blueprint = blueprint;
  _section   = 'main';

  _disposeAll();

  // ── Effects chain ──────────────────────
  _effects.reverb = new Tone.Reverb({ decay: 3.0, wet: blueprint.effects.reverb });
  await _effects.reverb.ready;
  _effects.reverb.toDestination();

  _effects.delay = new Tone.FeedbackDelay('8n', 0.35);
  _effects.delay.wet.value = blueprint.effects.delay;
  _effects.delay.connect(_effects.reverb);

  _effects.distortion = new Tone.Distortion(blueprint.bass.distortion);

  _effects.limiter = new Tone.Limiter(-3);
  _effects.limiter.toDestination();

  // ── Analyser ───────────────────────────
  _analyser = new Tone.Analyser('fft', 64);
  Tone.Destination.connect(_analyser);

  // ── Channels (vol/mute) ────────────────
  _channels.kick    = new Tone.Channel({ volume: 0,   pan: 0    }).connect(_effects.limiter);
  _channels.snare   = new Tone.Channel({ volume: -2,  pan: 0    }).connect(_effects.limiter);
  _channels.hat     = new Tone.Channel({ volume: -7,  pan: 0.1  }).connect(_effects.reverb);
  _channels.openHat = new Tone.Channel({ volume: -9,  pan: -0.1 }).connect(_effects.reverb);
  _channels.bass    = new Tone.Channel({ volume: 1,   pan: 0    }).connect(_effects.limiter);
  _channels.melody  = new Tone.Channel({ volume: -4,  pan: 0    }).connect(_effects.delay);
  _channels.sample  = new Tone.Channel({ volume: -5,  pan: 0    }).connect(_effects.reverb);

  // ── Frequency filters ──────────────────
  const bassFilter = new Tone.Filter(220, 'lowpass');
  const hatFilter  = new Tone.Filter(6000, 'highpass');

  // ── Instruments ────────────────────────
  _instruments.kick = new Tone.MembraneSynth({
    pitchDecay: 0.06,
    octaves: 7,
    envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 }
  }).connect(_channels.kick);

  const snareNoise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.05 }
  });
  const snareTone = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }
  });
  snareNoise.connect(_channels.snare);
  snareTone.connect(_channels.snare);
  _instruments.snare = { snareNoise, snareTone };

  _instruments.hat = new Tone.MetalSynth({
    frequency: 400,
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).connect(hatFilter);
  hatFilter.connect(_channels.hat);

  _instruments.openHat = new Tone.MetalSynth({
    frequency: 400,
    envelope: { attack: 0.001, decay: 0.28, release: 0.08 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).connect(hatFilter);

  _instruments.bass = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.001, decay: 0.5, sustain: 0.8, release: 0.6 },
    filterEnvelope: {
      attack: 0.001, decay: 0.15, sustain: 0.8, release: 0.5,
      baseFrequency: 60, octaves: 2.5
    }
  });
  _instruments.bass.connect(_effects.distortion);
  _effects.distortion.connect(bassFilter);
  bassFilter.connect(_channels.bass);

  const melodyOsc = blueprint.melody.style === 'pads' ? 'sine'
    : blueprint.melody.style === 'arp' ? 'square'
    : 'sawtooth';
  _instruments.melody = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: melodyOsc },
    envelope: {
      attack: blueprint.melody.style === 'pads' ? 0.1 : 0.01,
      decay: 0.2, sustain: 0.7, release: 0.9
    },
    volume: -6
  }).connect(_channels.melody);

  _instruments.sample = new Tone.Player().connect(_channels.sample);

  // ── Transport ──────────────────────────
  Tone.Transport.bpm.value = blueprint.tempo;
  Tone.Transport.swing      = blueprint.drums.swing;
  Tone.Transport.swingSubdivision = '16n';

  // ── Section patterns ───────────────────
  _sectionPatterns = _buildSectionPatterns(blueprint);

  // ── Sequences ──────────────────────────
  _buildSequences(_sectionPatterns[_section]);

  _initialized = true;
}

export async function play() {
  const Tone = T();
  await Tone.start();
  Tone.Transport.start();
}

export function stop() {
  const Tone = T();
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  _currentStep = 0;
  _stepListeners.forEach(fn => fn(-1));
}

export function setBpm(bpm) {
  T().Transport.bpm.value = bpm;
  if (_blueprint) _blueprint.tempo = bpm;
}

export function setKey(key) {
  if (_blueprint) _blueprint.key = key;
}

export function setTrackVolume(track, db) {
  if (_channels[track]) _channels[track].volume.value = db;
}

export function setTrackMute(track, muted) {
  if (_channels[track]) _channels[track].mute = muted;
}

export function setTrackSolo(track, soloed) {
  if (!_channels[track]) return;
  if (soloed) {
    Object.entries(_channels).forEach(([k, ch]) => { ch.mute = k !== track; });
  } else {
    Object.values(_channels).forEach(ch => { ch.mute = false; });
  }
}

export function setReverb(wet) {
  if (_effects.reverb) _effects.reverb.wet.value = wet;
  if (_blueprint) _blueprint.effects.reverb = wet;
}

export function setDelay(wet) {
  if (_effects.delay) _effects.delay.wet.value = wet;
  if (_blueprint) _blueprint.effects.delay = wet;
}

export function setDistortion(amount) {
  if (_effects.distortion) _effects.distortion.distortion = amount;
  if (_blueprint) _blueprint.bass.distortion = amount;
}

export function updateStep(track, stepIdx, on) {
  if (!_blueprint) return;
  const section = _sectionPatterns[_section];
  if (!section) return;

  if (track === 'bass' || track === 'melody') {
    section[track].pattern[stepIdx] = on ? 1 : 0;
  } else {
    section.drums[track][stepIdx] = on ? 1 : 0;
  }
  if (_section === 'main') {
    if (track === 'bass')   _blueprint.bass.pattern[stepIdx]        = on ? 1 : 0;
    if (track === 'melody') _blueprint.melody.pattern[stepIdx]      = on ? 1 : 0;
    if (['kick','snare','hat','openHat'].includes(track))
      _blueprint.drums[track][stepIdx] = on ? 1 : 0;
  }

  _rebuildSequences(section);
}

export function setSection(sectionName) {
  if (!_sectionPatterns[sectionName]) return;
  _section = sectionName;
  _rebuildSequences(_sectionPatterns[sectionName]);
}

export function getAnalyser() { return _analyser; }
export function getBlueprint() { return _blueprint; }
export function isInitialized() { return _initialized; }
export function getCurrentStep() { return _currentStep; }

export function onStep(fn) {
  _stepListeners.push(fn);
  return () => { _stepListeners = _stepListeners.filter(f => f !== fn); };
}

export async function regenLayer(layer, blueprint) {
  const Tone = T();
  const wasPlaying = Tone.Transport.state === 'started';
  if (wasPlaying) Tone.Transport.stop();

  if (layer === 'drums')  { _blueprint.drums  = blueprint.drums;  }
  if (layer === 'bass')   { _blueprint.bass   = blueprint.bass;   }
  if (layer === 'melody') { _blueprint.melody = blueprint.melody; }

  _sectionPatterns = _buildSectionPatterns(_blueprint);
  _rebuildSequences(_sectionPatterns[_section]);

  if (wasPlaying) { await Tone.start(); Tone.Transport.start(); }
}

export function setSampleBuffer(audioBuffer, mode) {
  const Tone = T();
  if (!_instruments.sample || !audioBuffer) return;
  if (mode === 'texture') {
    _instruments.sample.dispose();
    _instruments.sample = new Tone.GrainPlayer({
      url: audioBuffer,
      grainSize: 0.2,
      overlap: 0.05,
      loop: true,
      playbackRate: 1,
    }).connect(_channels.sample);
    _instruments.sample.start();
  } else {
    _instruments.sample.buffer = audioBuffer;
  }
}

// ─── Section Patterns ──────────────────────
function _buildSectionPatterns(bp) {
  const main = {
    drums: {
      kick:    [...bp.drums.kick],
      snare:   [...bp.drums.snare],
      hat:     [...bp.drums.hat],
      openHat: [...bp.drums.openHat],
    },
    bass:   { ...bp.bass,   pattern: [...bp.bass.pattern],   notes: [...bp.bass.notes]   },
    melody: { ...bp.melody, pattern: [...bp.melody.pattern], notes: [...bp.melody.notes] },
  };

  // intro: kick + sparse hat only
  const intro = JSON.parse(JSON.stringify(main));
  intro.drums.snare   = intro.drums.snare.map(() => 0);
  intro.drums.hat     = intro.drums.hat.map((v, i) => i % 4 === 0 ? v : 0);
  intro.drums.openHat = intro.drums.openHat.map(() => 0);
  intro.melody.pattern = intro.melody.pattern.map(() => 0);
  intro.bass.pattern  = intro.bass.pattern.map((v, i) => i < 8 ? v : 0);

  // variation: extra hat syncopation
  const variation = JSON.parse(JSON.stringify(main));
  variation.drums.hat = variation.drums.hat.map((v, i) =>
    v || (i % 2 === 1 ? (Math.random() > 0.5 ? 1 : 0) : 0)
  );

  // breakdown: kick + melody only
  const breakdown = JSON.parse(JSON.stringify(main));
  breakdown.drums.snare   = breakdown.drums.snare.map(() => 0);
  breakdown.drums.hat     = breakdown.drums.hat.map(() => 0);
  breakdown.drums.openHat = breakdown.drums.openHat.map(() => 0);
  breakdown.bass.pattern  = breakdown.bass.pattern.map(() => 0);

  // outro: sparse, fade out feel
  const outro = JSON.parse(JSON.stringify(intro));

  return { intro, main, variation, breakdown, outro };
}

function _stepToTime(step) {
  const beat = Math.floor(step / 4);
  const sixteenth = step % 4;
  return `0:${beat}:${sixteenth}`;
}

function _buildEvents(pattern, notes) {
  const events = [];
  let noteIdx = 0;
  for (let i = 0; i < 16; i++) {
    if (pattern[i]) {
      events.push({ time: _stepToTime(i), step: i, note: notes[noteIdx % notes.length] });
      noteIdx++;
    }
  }
  return events;
}

function _buildSequences(section) {
  const Tone = T();
  const { drums, bass, melody } = section;

  // ── Tick sequence for playhead ─────────
  const tickEvents = Array.from({length:16}, (_, i) => ({ time: _stepToTime(i), step: i }));
  _sequences.ticker = new Tone.Part((time, ev) => {
    _currentStep = ev.step;
    Tone.Draw.schedule(() => {
      _stepListeners.forEach(fn => fn(ev.step));
    }, time);
  }, tickEvents);
  _sequences.ticker.loop = true;
  _sequences.ticker.loopEnd = '1m';
  _sequences.ticker.start(0);

  // ── Drums ──────────────────────────────
  _sequences.kick = new Tone.Sequence((time, v) => {
    if (v) _instruments.kick.triggerAttackRelease('C2', '8n', time);
  }, drums.kick, '16n');
  _sequences.kick.loop = true;

  _sequences.snare = new Tone.Sequence((time, v) => {
    if (v) {
      _instruments.snare.snareNoise.triggerAttackRelease('8n', time);
      _instruments.snare.snareTone.triggerAttackRelease('D2', '8n', time);
    }
  }, drums.snare, '16n');
  _sequences.snare.loop = true;

  _sequences.hat = new Tone.Sequence((time, v) => {
    if (v) _instruments.hat.triggerAttackRelease('16n', time);
  }, drums.hat, '16n');
  _sequences.hat.loop = true;

  _sequences.openHat = new Tone.Sequence((time, v) => {
    if (v) _instruments.openHat.triggerAttackRelease('8n', time);
  }, drums.openHat, '16n');
  _sequences.openHat.loop = true;

  // ── 808 ────────────────────────────────
  const bassEvents = _buildEvents(bass.pattern, bass.notes);
  _sequences.bass = new Tone.Part((time, ev) => {
    _instruments.bass.triggerAttackRelease(ev.note, '8n', time);
  }, bassEvents);
  _sequences.bass.loop = true;
  _sequences.bass.loopEnd = '1m';

  // ── Melody ─────────────────────────────
  const melodyEvents = _buildEvents(melody.pattern, melody.notes);
  _sequences.melody = new Tone.Part((time, ev) => {
    _instruments.melody.triggerAttackRelease(ev.note, '4n', time);
  }, melodyEvents);
  _sequences.melody.loop = true;
  _sequences.melody.loopEnd = '1m';

  // Start all
  ['kick','snare','hat','openHat'].forEach(k => _sequences[k].start(0));
  ['bass','melody'].forEach(k => _sequences[k].start(0));
}

function _rebuildSequences(section) {
  const Tone = T();
  const wasPlaying = Tone.Transport.state === 'started';
  const pos = Tone.Transport.position;

  Object.values(_sequences).forEach(s => { if (s && !s.disposed) s.dispose(); });
  _sequences = {};

  _buildSequences(section);

  if (wasPlaying) {
    Tone.Transport.position = pos;
    Object.values(_sequences).forEach(s => s.start(0));
  }
}

function _disposeAll() {
  const Tone = T();
  if (Tone) Tone.Transport.stop();

  Object.values(_sequences).forEach(s => { try { if (s && !s.disposed) s.dispose(); } catch(e){} });
  Object.values(_instruments).forEach(i => {
    try {
      if (!i) return;
      if (i.snareNoise) { i.snareNoise.dispose(); i.snareTone.dispose(); }
      else if (!i.disposed) i.dispose();
    } catch(e){}
  });
  Object.values(_channels).forEach(c => { try { if (c && !c.disposed) c.dispose(); } catch(e){} });
  Object.values(_effects).forEach(e => { try { if (e && !e.disposed) e.dispose(); } catch(e){} });
  try { if (_analyser && !_analyser.disposed) _analyser.dispose(); } catch(e){}

  _sequences   = {};
  _instruments = {};
  _channels    = {};
  _effects     = {};
  _analyser    = null;
  _initialized = false;
}
