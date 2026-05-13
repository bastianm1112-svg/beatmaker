/* ═══════════════════════════════════════════
   SEQUENCER — 16-step grid UI
════════════════════════════════════════════ */
import { updateStep, onStep, getBlueprint, swapLoop } from './engine.js';

const TRACKS = [
  { id: 'kick',    label: 'KICK'     },
  { id: 'snare',   label: 'SNARE'    },
  { id: 'hat',     label: 'HI-HAT'  },
  { id: 'openHat', label: 'OPEN HAT' },
  { id: 'hatRoll', label: 'HAT ROLL' },
  { id: 'bass',    label: '808'      },
  { id: 'melody',  label: 'MELODY'  },
  { id: 'sample',  label: 'SAMPLE'  },
];

let _container = null;
let _stepCells = {};   // track → [16 divs]
let _removeOnStep = null;
let _currentSection = 'main';
let _loopAlts = [];
let _loopAltIdx = 0;

export function initSequencer(container, blueprint, onRegenLayer, loopInfo) {
  _container = container;
  _stepCells = {};
  _container.innerHTML = '';
  _loopAlts = loopInfo?.alternatives || [];
  _loopAltIdx = 0;

  // Section header
  const header = document.createElement('div');
  header.className = 'seq-section-header';
  header.innerHTML = `
    <span class="seq-section-name" id="seq-section-name">MAIN</span>
    <div class="seq-section-line"></div>
    <span class="seq-section-info" id="seq-tempo-label">${blueprint.tempo} BPM · ${blueprint.key}</span>
  `;
  _container.appendChild(header);

  // Step numbers
  const nums = document.createElement('div');
  nums.className = 'seq-step-nums';
  for (let i = 0; i < 16; i++) {
    const n = document.createElement('span');
    n.className = 'seq-step-num' + (i % 4 === 0 ? ' beat' : '');
    n.textContent = i + 1;
    nums.appendChild(n);
  }
  _container.appendChild(nums);

  // Track rows
  TRACKS.forEach(track => {
    // Loop info bar above SAMPLE row
    if (track.id === 'sample' && loopInfo?.meta) {
      const loopBar = document.createElement('div');
      loopBar.className = 'seq-loop-bar';
      loopBar.id = 'seq-loop-bar';
      const name = loopInfo.meta.file?.split('/').pop()?.replace('.mp3','') || 'loop';
      loopBar.innerHTML = `
        <span class="seq-loop-icon">◎</span>
        <span class="seq-loop-name" id="seq-loop-name">${name}</span>
        <button class="seq-loop-swap" id="seq-loop-swap">⟳ SWAP</button>
      `;
      loopBar.querySelector('#seq-loop-swap').addEventListener('click', async () => {
        if (!_loopAlts.length) return;
        _loopAltIdx = (_loopAltIdx + 1) % _loopAlts.length;
        const next = _loopAlts[_loopAltIdx];
        await swapLoop(next);
        const newName = next.file?.split('/').pop()?.replace('.mp3','') || 'loop';
        const nameEl = document.getElementById('seq-loop-name');
        if (nameEl) nameEl.textContent = newName;
      });
      _container.appendChild(loopBar);
    }

    const row = document.createElement('div');
    row.className = 'seq-row';
    row.dataset.track = track.id;

    const label = document.createElement('div');
    label.className = 'seq-row-label';
    label.textContent = track.label;

    const steps = document.createElement('div');
    steps.className = 'seq-steps';

    const cells = [];
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'seq-step';
      const isOn = _getStepValue(blueprint, track.id, i);
      if (isOn) cell.classList.add('on');

      cell.addEventListener('click', () => {
        const nowOn = !cell.classList.contains('on');
        cell.classList.toggle('on', nowOn);
        updateStep(track.id, i, nowOn);
      });

      steps.appendChild(cell);
      cells.push(cell);
    }

    _stepCells[track.id] = cells;
    row.appendChild(label);
    row.appendChild(steps);
    _container.appendChild(row);
  });

  // Regen row
  const regenRow = document.createElement('div');
  regenRow.className = 'seq-regen-row';
  ['↻ DRUMS','↻ BASS','↻ MELODY','↻ ALL'].forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'seq-regen-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const layer = label.includes('DRUMS') ? 'drums'
        : label.includes('BASS') ? 'bass'
        : label.includes('MELODY') ? 'melody'
        : 'all';
      onRegenLayer?.(layer);
    });
    regenRow.appendChild(btn);
  });
  _container.appendChild(regenRow);

  // Playhead
  if (_removeOnStep) _removeOnStep();
  _removeOnStep = onStep(step => {
    _highlightStep(step);
  });
}

export function updateSequencerBlueprint(blueprint) {
  TRACKS.forEach(track => {
    const cells = _stepCells[track.id];
    if (!cells) return;
    cells.forEach((cell, i) => {
      const on = _getStepValue(blueprint, track.id, i);
      cell.classList.toggle('on', !!on);
    });
  });
  const tempoLabel = document.getElementById('seq-tempo-label');
  if (tempoLabel) tempoLabel.textContent = `${blueprint.tempo} BPM · ${blueprint.key}`;
}

export function updateSectionLabel(name) {
  _currentSection = name;
  const el = document.getElementById('seq-section-name');
  if (el) el.textContent = name.toUpperCase();
}

function _highlightStep(step) {
  TRACKS.forEach(track => {
    const cells = _stepCells[track.id];
    if (!cells) return;
    cells.forEach((cell, i) => {
      cell.classList.toggle('active-step', i === step);
    });
  });
}

function _getStepValue(bp, trackId, stepIdx) {
  if (trackId === 'bass')   return bp.bass?.pattern?.[stepIdx]   || 0;
  if (trackId === 'melody') return bp.melody?.pattern?.[stepIdx] || 0;
  if (trackId === 'sample') return 0;
  if (trackId === 'hatRoll') return bp.drums?.hatRoll?.[stepIdx] || 0;
  return bp.drums?.[trackId]?.[stepIdx] || 0;
}
