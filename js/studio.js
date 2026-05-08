/* ═══════════════════════════════════════════
   STUDIO — Editor screen
════════════════════════════════════════════ */
import { initEngine, play, stop, setBpm, setSection, getBlueprint, isInitialized, regenLayer, setSampleBuffer, getAnalyser } from './engine.js';
import { initSequencer, updateSequencerBlueprint, updateSectionLabel } from './sequencer.js';
import { initMixer } from './mixer.js';
import { startExport, isRecording } from './exporter.js';
import { saveProject, loadProjects, loadProject } from './storage.js';
import { getFallbackBlueprint } from './config.js';

const SECTIONS = ['intro','main','variation','breakdown','outro'];
const KEYS = ['Am','Cm','Dm','Em','Fm','Gm','Bb','Ebm','Dbm','F','G','D'];

let _ctx        = null;
let _playing    = false;
let _currentKey = 'Am';
let _vizFrame   = null;

export async function initStudio(container, context) {
  _ctx     = context;
  _playing = false;

  container.innerHTML = _buildHTML(context);

  await initEngine(context.blueprint);
  _currentKey = context.blueprint.key;

  const root = document.documentElement;
  root.style.setProperty('--accent',       context.artist.accent);
  root.style.setProperty('--accent-hi',    context.artist.accentHi);
  root.style.setProperty('--accent-lo',    context.artist.accentLo);
  root.style.setProperty('--accent-glow',  context.artist.accentGlow);

  const seqWrap = container.querySelector('#seq-wrap');
  initSequencer(seqWrap, context.blueprint, _onRegenLayer);

  const mixWrap = container.querySelector('#mix-wrap');
  initMixer(mixWrap, context.blueprint);

  if (context.sampleBuffer) {
    setSampleBuffer(context.sampleBuffer, context.sampleMode || 'musical');
  }

  _startVisualizer(container.querySelector('#visualizer-canvas'));

  _wireBpm(container);
  _wireKey(container);
  _wireTransport(container);
  _wireSections(container);
  _wireRandomness(container);
  _wireTopButtons(container);
  _wireRegenButtons(container);
}

function _buildHTML(ctx) {
  return `
  <div class="studio-topbar">
    <div class="studio-logo glitch" data-text="BEATMKR">BEATMKR</div>
    <div class="studio-sep"></div>
    <div class="studio-meta">
      <span>${ctx.artist.name.toUpperCase()}</span> ·
      <span>${ctx.album}</span> ·
      <span>${ctx.mood}</span>
    </div>
    <div class="studio-spacer"></div>
    <button class="btn btn-ghost" id="btn-back">← BACK</button>
    <button class="btn" id="btn-regen-all">↻ REGEN ALL</button>
    <button class="btn btn-danger" id="btn-export">↓ EXPORT</button>
  </div>

  <div class="studio-body">
    <div class="studio-left">
      <div class="left-section">
        <div class="left-section-label">BPM</div>
        <div class="bpm-display" id="bpm-display">${ctx.blueprint.tempo}</div>
        <div class="bpm-controls">
          <button class="bpm-btn" id="bpm-down">−</button>
          <button class="bpm-btn" id="bpm-up">+</button>
        </div>
      </div>
      <div class="left-section">
        <div class="left-section-label">KEY</div>
        <div class="key-display" id="key-display">${ctx.blueprint.key}</div>
      </div>
      <div class="left-section">
        <div class="left-section-label">RANDOMNESS</div>
        <div class="randomness-wrap">
          <div class="randomness-labels"><span>STRICT</span><span>CHAOS</span></div>
          <input type="range" class="random-slider" id="randomness-slider" min="0" max="100" value="30">
        </div>
      </div>
      <div class="left-section">
        <div class="left-section-label">REGENERATE</div>
        <button class="regen-btn" data-layer="drums">↻ DRUMS</button>
        <button class="regen-btn" data-layer="bass">↻ BASS / 808</button>
        <button class="regen-btn" data-layer="melody">↻ MELODY</button>
      </div>
    </div>

    <div class="studio-center">
      <div class="visualizer-wrap">
        <canvas id="visualizer-canvas"></canvas>
        <div class="viz-label">FREQUENCY</div>
      </div>
      <div class="sequencer-wrap" id="seq-wrap"></div>
    </div>

    <div class="studio-right" id="mix-wrap"></div>
  </div>

  <div class="studio-bottom">
    <div class="transport-btns">
      <button class="transport-btn" id="btn-rewind" title="Rewind">|◀</button>
      <button class="transport-btn" id="btn-play" title="Play/Stop">▶</button>
      <button class="transport-btn" id="btn-stop" title="Stop">⬛</button>
    </div>
    <div class="time-display" id="time-display">0:00</div>
    <div class="tl-wrap" id="timeline">
      ${SECTIONS.map(s => `
        <div class="tl-seg ${s === 'main' ? 'main active' : ''}" data-section="${s}">${s.toUpperCase()}</div>
      `).join('')}
    </div>
    <div class="random-wrap">
      STRICT
      <input type="range" class="random-slider" id="randomness-slider-2" min="0" max="100" value="30" style="width:60px">
      CHAOS
    </div>
    <div class="studio-actions">
      <button class="btn" id="btn-save">SAVE</button>
      <button class="btn" id="btn-load">LOAD</button>
    </div>
  </div>
  `;
}

function _wireBpm(container) {
  const display = container.querySelector('#bpm-display');
  let bpm = _ctx.blueprint.tempo;

  container.querySelector('#bpm-up').addEventListener('click', () => {
    bpm = Math.min(200, bpm + 1);
    display.textContent = bpm;
    setBpm(bpm);
  });
  container.querySelector('#bpm-down').addEventListener('click', () => {
    bpm = Math.max(55, bpm - 1);
    display.textContent = bpm;
    setBpm(bpm);
  });

  ['#bpm-up','#bpm-down'].forEach(sel => {
    let interval;
    const btn = container.querySelector(sel);
    btn.addEventListener('mousedown', () => { interval = setInterval(() => btn.click(), 80); });
    ['mouseup','mouseleave'].forEach(e => btn.addEventListener(e, () => clearInterval(interval)));
  });
}

function _wireKey(container) {
  const display = container.querySelector('#key-display');
  let idx = KEYS.indexOf(_currentKey);
  if (idx < 0) idx = 0;

  display.addEventListener('click', () => {
    idx = (idx + 1) % KEYS.length;
    _currentKey = KEYS[idx];
    display.textContent = _currentKey;
    const bp = getBlueprint();
    if (bp) bp.key = _currentKey;
  });
}

function _wireTransport(container) {
  const playBtn  = container.querySelector('#btn-play');
  const stopBtn  = container.querySelector('#btn-stop');
  const rewind   = container.querySelector('#btn-rewind');
  const timeDisp = container.querySelector('#time-display');

  let startTime = 0;
  let timer;

  playBtn.addEventListener('click', async () => {
    if (_playing) {
      stop();
      _playing = false;
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing');
      clearInterval(timer);
    } else {
      await play();
      _playing = true;
      playBtn.textContent = '⏸';
      playBtn.classList.add('playing');
      startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        timeDisp.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      }, 500);
    }
  });

  stopBtn.addEventListener('click', () => {
    stop(); _playing = false;
    playBtn.textContent = '▶'; playBtn.classList.remove('playing');
    clearInterval(timer); timeDisp.textContent = '0:00';
  });

  rewind.addEventListener('click', () => {
    stop(); _playing = false;
    playBtn.textContent = '▶'; playBtn.classList.remove('playing');
    clearInterval(timer); timeDisp.textContent = '0:00';
  });
}

function _wireSections(container) {
  container.querySelector('#timeline').addEventListener('click', e => {
    const seg = e.target.closest('[data-section]');
    if (!seg) return;
    const name = seg.dataset.section;
    container.querySelectorAll('.tl-seg').forEach(s => s.classList.remove('active'));
    seg.classList.add('active');
    setSection(name);
    updateSectionLabel(name);
  });
}

function _wireRandomness(container) {
  const s1 = container.querySelector('#randomness-slider');
  const s2 = container.querySelector('#randomness-slider-2');
  if (s1 && s2) {
    s1.addEventListener('input', () => { s2.value = s1.value; });
    s2.addEventListener('input', () => { s1.value = s2.value; });
  }
}

function _wireTopButtons(container) {
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    if (_playing) stop();
    cancelAnimationFrame(_vizFrame);
    _ctx.onBack?.();
  });

  container.querySelector('#btn-export')?.addEventListener('click', async () => {
    if (isRecording()) return;
    const btn = container.querySelector('#btn-export');
    btn.textContent = '⏺ RECORDING 8 bars...';
    btn.disabled = true;
    const bp = getBlueprint();
    await startExport(8, bp?.tempo || 140);
    btn.textContent = '↓ EXPORT';
    btn.disabled = false;
  });

  container.querySelector('#btn-regen-all')?.addEventListener('click', () => { _onRegenLayer('all'); });

  container.querySelector('#btn-save')?.addEventListener('click', () => {
    const bp = getBlueprint();
    saveProject({
      artist: _ctx.artist.id, album: _ctx.album, mood: _ctx.mood,
      blueprint: bp, mixerState: {}, bpm: bp?.tempo || 140,
    });
    const btn = container.querySelector('#btn-save');
    btn.textContent = 'SAVED ✓';
    setTimeout(() => { btn.textContent = 'SAVE'; }, 1500);
  });

  container.querySelector('#btn-load')?.addEventListener('click', () => { _showLoadModal(container); });
}

function _wireRegenButtons(container) {
  container.querySelectorAll('.regen-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.dataset.layer;
      if (layer) _onRegenLayer(layer);
    });
  });
}

async function _onRegenLayer(layer) {
  const bp = getBlueprint();
  if (!bp) return;
  const newBp = getFallbackBlueprint(_ctx.artist.id, _ctx.album, _ctx.mood);

  await regenLayer(layer === 'all' ? 'drums' : layer, newBp);
  if (layer === 'all') {
    await regenLayer('bass',   newBp);
    await regenLayer('melody', newBp);
  }

  updateSequencerBlueprint(getBlueprint());
}

function _startVisualizer(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    _vizFrame = requestAnimationFrame(draw);
    const analyser = getAnalyser();
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!analyser) {
      ctx.fillStyle = 'rgba(200,0,0,0.15)';
      const t = Date.now() / 1000;
      for (let i = 0; i < 64; i++) {
        const h = Math.abs(Math.sin(t * 1.2 + i * 0.3)) * (H * 0.4) + 2;
        ctx.fillRect(i * (W / 64), H - h, W / 64 - 1, h);
      }
      return;
    }

    const data = analyser.getValue();
    const barW = W / data.length;
    for (let i = 0; i < data.length; i++) {
      const norm  = Math.max(0, (data[i] + 100) / 100);
      const h     = norm * H;
      const alpha = 0.3 + norm * 0.7;
      ctx.fillStyle = `rgba(200,0,0,${alpha})`;
      ctx.fillRect(i * barW, H - h, barW - 1, h);
    }

    ctx.strokeStyle = 'rgba(255,50,50,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    data.forEach((v, i) => {
      const norm = Math.max(0, (v + 100) / 100);
      const h = norm * H;
      const x = i * barW + barW / 2;
      if (i === 0) ctx.moveTo(x, H - h); else ctx.lineTo(x, H - h);
    });
    ctx.stroke();
  }

  draw();
}

function _showLoadModal(container) {
  const existing = document.getElementById('load-modal');
  if (existing) { existing.remove(); return; }

  const projects = loadProjects();
  const modal = document.createElement('div');
  modal.id = 'load-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(4,4,6,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;z-index:7000;';

  if (projects.length === 0) {
    modal.innerHTML = `
      <div style="color:var(--text-dim);font-size:11px;letter-spacing:2px;">NO SAVED PROJECTS</div>
      <button onclick="this.closest('#load-modal').remove()" style="margin-top:12px;padding:6px 20px;background:var(--bg3);border:1px solid var(--border);color:var(--text-dim);font-family:var(--font);font-size:10px;letter-spacing:2px;cursor:pointer;">CLOSE</button>
    `;
  } else {
    const list = projects.map(p => `
      <div style="padding:10px 16px;background:var(--bg3);border:1px solid var(--border);min-width:300px;cursor:pointer;"
           onclick="document.getElementById('load-modal').remove()">
        <div style="font-size:9px;color:var(--text-red);letter-spacing:1px;">${p.artist?.toUpperCase() || '?'} · ${p.album || '?'} · ${p.mood || '?'}</div>
        <div style="font-size:8px;color:var(--text-dark);margin-top:3px;">${new Date(p.savedAt).toLocaleString()} · ${p.bpm} BPM</div>
      </div>
    `).join('');
    modal.innerHTML = `
      <div style="font-size:9px;color:var(--accent);letter-spacing:4px;margin-bottom:4px;">SAVED PROJECTS</div>
      ${list}
      <button onclick="this.closest('#load-modal').remove()" style="margin-top:8px;padding:6px 20px;background:var(--bg3);border:1px solid var(--border);color:var(--text-dim);font-family:var(--font);font-size:10px;letter-spacing:2px;cursor:pointer;">CLOSE</button>
    `;
  }

  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
