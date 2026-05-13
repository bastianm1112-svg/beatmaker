/* ═══════════════════════════════════════════
   WIZARD — Creation screen UI
════════════════════════════════════════════ */
import { ARTISTS } from './config.js';
import { generateBlueprint } from './api.js';
import { loadSamples } from './samples.js';

let _selectedArtist = null;
let _selectedAlbum  = null;
let _selectedMood   = null;
let _sampleFile     = null;
let _sampleMode     = 'musical';
let _onCreated      = null;

const MOODS = [
  { id:'AGGRESSIVE', emoji:'🔥' }, { id:'SAD',         emoji:'💔' },
  { id:'JOYFUL',     emoji:'✨' }, { id:'DARK',        emoji:'🌑' },
  { id:'CHILL',      emoji:'🌊' }, { id:'ENERGETIC',   emoji:'⚡' },
  { id:'PSYCHEDELIC',emoji:'🌀' }, { id:'MELANCHOLIC', emoji:'🥀' },
  { id:'EPIC',       emoji:'👑' }, { id:'HAZY',        emoji:'🌫️' },
];

const KEYS = ['Am','Cm','Dm','Em','Fm','Gm','Bbm','Ebm','Bb','Gm','F','C'];

export function initWizard(container, onCreated) {
  _onCreated = onCreated;
  _selectedArtist = null;
  _selectedAlbum  = null;
  _selectedMood   = null;

  container.innerHTML = `
    <div class="wiz-header">
      <div class="wiz-logo glitch" data-text="BEATMKR">BEATMKR</div>
      <div class="wiz-steps">
        <div class="wiz-step-dot active" id="wdot-1"></div>
        <div class="wiz-step-dot" id="wdot-2"></div>
        <div class="wiz-step-dot" id="wdot-3"></div>
        <div class="wiz-step-dot" id="wdot-4"></div>
        <div class="wiz-step-dot" id="wdot-5"></div>
      </div>
    </div>
    <div class="wiz-body">

      <!-- STEP 1: ARTIST -->
      <div class="section-label wiz-artist-heading">01 — SELECT ARTIST</div>
      <div class="wiz-artist-sub">Choose a production style to influence the blueprint</div>
      <div class="artist-grid" id="artist-grid"></div>

      <!-- STEP 2: ALBUM -->
      <div class="album-section" id="album-section">
        <div class="step-divider"></div>
        <div class="section-label">02 — SELECT ALBUM ERA</div>
        <div style="font-size:9px;color:var(--text-dark);letter-spacing:1px;margin-bottom:12px;" id="album-sub">Each album maps to a distinct sonic character</div>
        <div class="album-strip" id="album-strip"></div>
      </div>

      <!-- STEP 3: MOOD -->
      <div class="mood-section" id="mood-section">
        <div class="step-divider"></div>
        <div class="section-label">03 — SET THE MOOD</div>
        <div style="font-size:9px;color:var(--text-dark);letter-spacing:1px;margin-bottom:12px;">Emotional direction shapes the blueprint parameters</div>
        <div class="mood-grid" id="mood-grid"></div>
      </div>

      <!-- STEP 4: EXTRAS -->
      <div class="extras-section" id="extras-section">
        <div class="step-divider"></div>
        <div class="section-label">04 — DESCRIBE &amp; UPLOAD <span style="color:var(--red-dim);font-size:8px;">(OPTIONAL)</span></div>
        <div class="extras-grid">
          <div class="desc-box">
            <div class="desc-inner-label">// DESCRIBE THE BEAT</div>
            <textarea class="desc-textarea" id="desc-textarea" rows="4"
              placeholder="e.g. heavy 808s, sparse drums, dark cinematic, distant melody..."></textarea>
          </div>
          <div class="sample-box" id="sample-box">
            <div class="sample-icon">🎵</div>
            <div class="sample-label" id="sample-label">DROP AUDIO FILE</div>
            <div style="font-size:8px;color:var(--text-dark);">or click to browse</div>
            <div class="sample-modes" id="sample-modes">
              <button class="sample-mode-btn active" data-mode="musical">MUSICAL CHOP</button>
              <button class="sample-mode-btn" data-mode="texture">TEXTURE</button>
            </div>
            <input type="file" id="sample-input" accept="audio/*" style="display:none">
          </div>
        </div>
      </div>

      <!-- STEP 5: CREATE -->
      <div class="create-section" id="create-section">
        <div class="step-divider"></div>
        <button class="create-btn" id="create-btn">⚡ CREATE BEAT</button>
        <div class="create-meta">AI GENERATES BLUEPRINT · TONE.JS RENDERS AUDIO · NO SAMPLES CLONED</div>
      </div>

    </div>
  `;

  _buildArtistGrid(container.querySelector('#artist-grid'));
  _buildMoodGrid(container.querySelector('#mood-grid'));
  _wireExtras(container);
  _wireCreate(container);
}

function _buildArtistGrid(grid) {
  ARTISTS.forEach(artist => {
    const card = document.createElement('div');
    card.className = 'artist-card';
    card.innerHTML = `
      <div class="artist-card-check">✓</div>
      <div class="artist-card-icon">${artist.icon}</div>
      <div class="artist-card-name">${artist.name}</div>
      <div class="artist-card-vibe">${artist.vibe}</div>
    `;
    card.addEventListener('click', () => _selectArtist(artist, card));
    grid.appendChild(card);
  });
}

function _selectArtist(artist, cardEl) {
  document.querySelectorAll('.artist-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  _selectedArtist = artist;
  _selectedAlbum  = null;
  _selectedMood   = null;

  // Apply artist accent color
  const root = document.documentElement;
  root.style.setProperty('--accent',      artist.accent);
  root.style.setProperty('--accent-hi',   artist.accentHi);
  root.style.setProperty('--accent-lo',   artist.accentLo);
  root.style.setProperty('--accent-glow', artist.accentGlow);

  // Build album strip
  const strip = document.getElementById('album-strip');
  const sub   = document.getElementById('album-sub');
  sub.textContent = artist.name + ' — select an album era';

  strip.innerHTML = '';
  artist.albums.forEach(alb => {
    const chip = document.createElement('div');
    chip.className = 'album-chip';
    chip.innerHTML = alb.name + `<span class="album-chip-tag">· ${alb.tag}</span>`;
    chip.addEventListener('click', () => _selectAlbum(alb.name, chip));
    strip.appendChild(chip);
  });

  // Show album section, hide rest
  _show('album-section');
  _hide('mood-section');
  _hide('extras-section');
  _hide('create-section');
  _dot(2);

  document.querySelectorAll('.album-chip').forEach(c => c.classList.remove('selected'));
}

function _selectAlbum(name, chipEl) {
  document.querySelectorAll('.album-chip').forEach(c => c.classList.remove('selected'));
  chipEl.classList.add('selected');
  _selectedAlbum = name;
  _selectedMood  = null;

  _show('mood-section');
  _hide('extras-section');
  _hide('create-section');
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('selected'));
  _dot(3);
}

function _buildMoodGrid(grid) {
  MOODS.forEach(mood => {
    const chip = document.createElement('div');
    chip.className = 'mood-chip';
    chip.innerHTML = `<span class="mood-emoji">${mood.emoji}</span>${mood.id}`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      _selectedMood = mood.id;
      _show('extras-section');
      _show('create-section');
      _dot(5);
    });
    grid.appendChild(chip);
  });
}

function _wireExtras(container) {
  const sampleBox   = container.querySelector('#sample-box');
  const sampleInput = container.querySelector('#sample-input');
  const sampleLabel = container.querySelector('#sample-label');

  sampleBox.addEventListener('click', e => {
    if (e.target.classList.contains('sample-mode-btn')) return;
    sampleInput.click();
  });

  sampleInput.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    _sampleFile = file;
    sampleLabel.textContent = file.name;
    sampleBox.classList.add('has-file');
  });

  sampleBox.addEventListener('dragover', e => {
    e.preventDefault();
    sampleBox.classList.add('drag-over');
  });
  sampleBox.addEventListener('dragleave', () => sampleBox.classList.remove('drag-over'));
  sampleBox.addEventListener('drop', e => {
    e.preventDefault();
    sampleBox.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('audio/')) {
      _sampleFile = file;
      sampleLabel.textContent = file.name;
      sampleBox.classList.add('has-file');
    }
  });

  container.querySelectorAll('.sample-mode-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      container.querySelectorAll('.sample-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _sampleMode = btn.dataset.mode;
    });
  });
}

function _wireCreate(container) {
  const btn = container.querySelector('#create-btn');
  btn.addEventListener('click', async () => {
    if (!_selectedArtist || !_selectedAlbum || !_selectedMood) return;

    const description = container.querySelector('#desc-textarea')?.value || '';
    _showLoading();

    try {
      // Must be called on user gesture to unlock AudioContext
      await window.Tone?.start();

      const blueprint = await generateBlueprint(
        _selectedArtist.id,
        _selectedAlbum,
        _selectedMood,
        description,
        msg => { const lt = document.getElementById('loading-text'); if (lt) lt.textContent = msg; }
      );

      const lt = document.getElementById('loading-text');
      if (lt) lt.textContent = 'Loading sounds...';
      const samples = await loadSamples(
        _selectedArtist.id,
        _selectedAlbum,
        _selectedMood,
        blueprint.key || 'Am'
      );

      // Optionally decode sample
      let sampleBuffer = null;
      if (_sampleFile) {
        try {
          const arrayBuf = await _sampleFile.arrayBuffer();
          const audioCtx = new AudioContext();
          sampleBuffer = await audioCtx.decodeAudioData(arrayBuf);
        } catch(e) { console.warn('Sample decode failed:', e); }
      }

      _hideLoading();
      _onCreated?.({
        blueprint,
        artist: _selectedArtist,
        album:  _selectedAlbum,
        mood:   _selectedMood,
        sampleBuffer,
        sampleMode: _sampleMode,
        samples,
      });
    } catch (err) {
      _hideLoading();
      console.error('Blueprint generation failed:', err);
      alert('Failed to generate blueprint. Check console for details.');
    }
  });
}

function _showLoading() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-logo glitch" data-text="BEATMKR">BEATMKR</div>
    <div class="loading-text" id="loading-text">GENERATING BLUEPRINT...</div>
    <div class="loading-bar-wrap"><div class="loading-bar-fill"></div></div>
  `;
  document.body.appendChild(overlay);
}

function _hideLoading() {
  document.getElementById('loading-overlay')?.remove();
}

function _show(id) { document.getElementById(id)?.classList.add('visible'); }
function _hide(id) { document.getElementById(id)?.classList.remove('visible'); }

function _dot(active) {
  for (let i = 1; i <= 5; i++) {
    const d = document.getElementById(`wdot-${i}`);
    if (!d) continue;
    d.className = 'wiz-step-dot' + (i < active ? ' done' : i === active ? ' active' : '');
  }
}
