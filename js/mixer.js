/* ═══════════════════════════════════════════
   MIXER — Per-track faders, mute, solo
════════════════════════════════════════════ */
import { setTrackVolume, setTrackMute, setTrackSolo, setReverb, setDelay, setDistortion } from './engine.js';

const TRACKS = [
  { id: 'kick',    label: 'KICK',    default: 0   },
  { id: 'snare',   label: 'SNARE',   default: -2  },
  { id: 'hat',     label: 'HI-HAT', default: -7  },
  { id: 'openHat', label: 'OPEN HAT', default: -9 },
  { id: 'bass',    label: '808',     default: 1   },
  { id: 'melody',  label: 'MELODY', default: -4  },
  { id: 'sample',  label: 'SAMPLE', default: -5  },
];

const FX = [
  { id: 'reverb',    label: 'REVERB',   min: 0, max: 1, step: 0.01 },
  { id: 'delay',     label: 'DELAY',    min: 0, max: 1, step: 0.01 },
  { id: 'distortion',label: '808 DIST', min: 0, max: 1, step: 0.01 },
];

const VOL_MIN = -24;
const VOL_MAX = 6;

let _soloedTrack = null;

export function initMixer(container, blueprint) {
  container.innerHTML = '';

  const hdr = document.createElement('div');
  hdr.className = 'mixer-section-label';
  hdr.textContent = 'MIXER';
  container.appendChild(hdr);

  TRACKS.forEach(track => {
    const ch = _buildChannel(track);
    container.appendChild(ch);
  });

  const divider = document.createElement('div');
  divider.className = 'mixer-divider';
  container.appendChild(divider);

  const fxLabel = document.createElement('div');
  fxLabel.className = 'mixer-section-label';
  fxLabel.textContent = 'FX';
  container.appendChild(fxLabel);

  FX.forEach(fx => {
    const initVal = fx.id === 'reverb' ? blueprint.effects.reverb
      : fx.id === 'delay' ? blueprint.effects.delay
      : blueprint.bass.distortion;
    const fxEl = _buildFxChannel(fx, initVal);
    container.appendChild(fxEl);
  });
}

function _buildChannel(track) {
  const wrap = document.createElement('div');
  wrap.className = 'mix-ch';
  wrap.dataset.track = track.id;

  const top = document.createElement('div');
  top.className = 'mix-ch-top';

  const name = document.createElement('div');
  name.className = 'mix-ch-name';
  name.textContent = track.label;

  const btns = document.createElement('div');
  btns.className = 'mix-btns';

  const muteBtn = _makeBtn('M');
  const soloBtn = _makeBtn('S');

  let muted = false;

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.classList.toggle('muted', muted);
    setTrackMute(track.id, muted);
  });

  soloBtn.addEventListener('click', () => {
    const isSoloed = soloBtn.classList.contains('soloed');
    document.querySelectorAll('.mix-btn.soloed').forEach(b => b.classList.remove('soloed'));
    if (!isSoloed) {
      soloBtn.classList.add('soloed');
      _soloedTrack = track.id;
      setTrackSolo(track.id, true);
    } else {
      _soloedTrack = null;
      setTrackSolo(track.id, false);
    }
  });

  btns.appendChild(muteBtn);
  btns.appendChild(soloBtn);
  top.appendChild(name);
  top.appendChild(btns);

  const faderRow = document.createElement('div');
  faderRow.className = 'fader-row';

  const track_ = document.createElement('div');
  track_.className = 'fader-track';

  const fill = document.createElement('div');
  fill.className = 'fader-fill';

  const pct = _volToPct(track.default);
  fill.style.width = pct + '%';

  const val = document.createElement('div');
  val.className = 'fader-val';
  val.textContent = track.default + 'dB';

  track_.addEventListener('click', e => {
    const rect = track_.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const db = Math.round(VOL_MIN + ratio * (VOL_MAX - VOL_MIN));
    fill.style.width = _volToPct(db) + '%';
    val.textContent = db + 'dB';
    setTrackVolume(track.id, db);
  });

  track_.appendChild(fill);
  faderRow.appendChild(track_);
  faderRow.appendChild(val);

  wrap.appendChild(top);
  wrap.appendChild(faderRow);
  return wrap;
}

function _buildFxChannel(fx, initVal) {
  const wrap = document.createElement('div');
  wrap.className = 'mix-ch';

  const top = document.createElement('div');
  top.className = 'mix-ch-top';
  const name = document.createElement('div');
  name.className = 'mix-ch-name';
  name.textContent = fx.label;
  top.appendChild(name);

  const faderRow = document.createElement('div');
  faderRow.className = 'fader-row';

  const track_ = document.createElement('div');
  track_.className = 'fader-track';

  const fill = document.createElement('div');
  fill.className = 'fader-fill';
  fill.style.width = (initVal * 100) + '%';
  fill.style.background = 'var(--red-lo)';

  const val = document.createElement('div');
  val.className = 'fader-val';
  val.textContent = initVal.toFixed(2);

  track_.addEventListener('click', e => {
    const rect = track_.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    fill.style.width = (ratio * 100) + '%';
    val.textContent = ratio.toFixed(2);
    if (fx.id === 'reverb')     setReverb(ratio);
    if (fx.id === 'delay')      setDelay(ratio);
    if (fx.id === 'distortion') setDistortion(ratio);
  });

  track_.appendChild(fill);
  faderRow.appendChild(track_);
  faderRow.appendChild(val);

  wrap.appendChild(top);
  wrap.appendChild(faderRow);
  return wrap;
}

function _makeBtn(label) {
  const btn = document.createElement('button');
  btn.className = 'mix-btn';
  btn.textContent = label;
  return btn;
}

function _volToPct(db) {
  return ((db - VOL_MIN) / (VOL_MAX - VOL_MIN)) * 100;
}
