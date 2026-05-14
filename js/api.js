/* ═══════════════════════════════════════════
   API — Claude API + fallback blueprint
════════════════════════════════════════════ */
import { API_KEY, getFallbackBlueprint, getPreset } from './config.js';

const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';
const MODEL      = 'claude-haiku-4-5-20251001';

export async function generateBlueprint(artistId, albumName, mood, description, onProgress) {
  onProgress?.('Generating blueprint...');

  if (API_KEY && API_KEY.length > 10) {
    try {
      const bp = await _callClaude(artistId, albumName, mood, description);
      onProgress?.('Blueprint received');
      return bp;
    } catch (err) {
      console.warn('Claude API failed, using fallback:', err.message);
    }
  }

  onProgress?.('Loading preset blueprint...');
  await _sleep(600);
  const bp = getFallbackBlueprint(artistId, albumName, mood);
  onProgress?.('Blueprint ready');
  return bp;
}

async function _callClaude(artistId, albumName, mood, description) {
  const preset = getPreset(artistId, albumName);

  const system = `You are a music production AI. Output ONLY valid JSON — no prose, no markdown fences, no explanation. Just raw JSON that matches the exact schema provided.`;

  const user = `Generate a beat blueprint for:
Artist style: ${artistId}
Album era: ${albumName}
Mood: ${mood}
Description: ${description || 'none'}
Album production preset: ${JSON.stringify(preset)}

Return ONLY this exact JSON structure (no extra fields):
{
  "tempo": <integer 55-200>,
  "key": <string like "Am" "Cm" "Gm" "Fm" "Bb" "Ebm">,
  "structure": ["intro","main","variation","breakdown","outro"],
  "drums": {
    "kick":    [<16 values, each 0 or 1>],
    "snare":   [<16 values, each 0 or 1>],
    "hat":     [<16 values, each 0 or 1>],
    "openHat": [<16 values, each 0 or 1>],
    "swing":   <0.0 to 0.5>,
    "density": <0.0 to 1.0>
  },
  "bass": {
    "type": "808",
    "pattern": [<16 values, each 0 or 1>],
    "notes": [<note strings — one per 1-value in pattern, e.g. "A1" "G1" "C1">],
    "distortion": <0.0 to 1.0>,
    "behavior": "root_following"
  },
  "melody": {
    "style": <"pads" or "arp" or "synth-lead" or "piano">,
    "pattern": [<16 values, each 0 or 1>],
    "notes": [<note strings — one per 1-value in pattern, e.g. "A3" "C4">],
    "complexity": <0.0 to 1.0>
  },
  "sample": { "mode": "none", "slice_count": 0 },
  "effects": { "reverb": <0.0 to 1.0>, "delay": <0.0 to 1.0>, "chorus": <0.0 to 1.0>, "phaser": <0.0 to 1.0> }
}

CRITICAL: notes array length MUST equal the count of 1s in the corresponding pattern array.`;

  const res = await fetch(CLAUDE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  // Strip markdown fences if model ignores instructions
  const clean = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/,'').trim();
  const bp = JSON.parse(clean);

  _validateBlueprint(bp);
  return bp;
}

function _validateBlueprint(bp) {
  if (typeof bp.tempo !== 'number') throw new Error('Invalid tempo');
  if (!Array.isArray(bp.drums?.kick) || bp.drums.kick.length !== 16) throw new Error('Invalid kick');
  if (!Array.isArray(bp.bass?.pattern) || bp.bass.pattern.length !== 16) throw new Error('Invalid bass pattern');
  if (!Array.isArray(bp.melody?.pattern) || bp.melody.pattern.length !== 16) throw new Error('Invalid melody pattern');

  // Auto-fix notes length if mismatched
  ['bass','melody'].forEach(layer => {
    const ones = bp[layer].pattern.filter(v => v === 1).length;
    const notes = bp[layer].notes;
    if (notes.length === 0) {
      bp[layer].notes = Array(ones).fill(layer === 'bass' ? 'A1' : 'A3');
    } else if (notes.length < ones) {
      while (bp[layer].notes.length < ones) bp[layer].notes.push(notes[notes.length - 1]);
    } else if (notes.length > ones) {
      bp[layer].notes = notes.slice(0, ones);
    }
  });
}

function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
