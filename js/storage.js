/* ═══════════════════════════════════════════
   STORAGE — Save/load projects via localStorage
════════════════════════════════════════════ */

const PREFIX = 'beatmkr_project_';

export function saveProject({ artist, album, mood, blueprint, mixerState, bpm }) {
  const key  = PREFIX + Date.now();
  const data = { artist, album, mood, blueprint, mixerState, bpm, savedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(data));
  return key;
}

export function loadProjects() {
  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k.startsWith(PREFIX)) continue;
    try {
      const data = JSON.parse(localStorage.getItem(k));
      projects.push({ key: k, ...data });
    } catch(e) {}
  }
  return projects.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function deleteProject(key) {
  localStorage.removeItem(key);
}

export function loadProject(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e) { return null; }
}
