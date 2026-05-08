/* ═══════════════════════════════════════════
   EXPORTER — Record live audio output
════════════════════════════════════════════ */
import { play, stop } from './engine.js';

let _recorder = null;
let _recording = false;

export async function startExport(bars = 8, bpm = 140) {
  if (_recording) return;

  const Tone = window.Tone;
  const secondsPerBar = (60 / bpm) * 4;
  const duration = secondsPerBar * bars;

  _recorder = new Tone.Recorder();
  Tone.Destination.connect(_recorder);

  await play();
  _recorder.start();
  _recording = true;

  return new Promise(resolve => {
    setTimeout(async () => {
      const blob = await _recorder.stop();
      stop();
      Tone.Destination.disconnect(_recorder);
      _recorder.dispose();
      _recorder = null;
      _recording = false;

      _downloadBlob(blob, `beat_${Date.now()}.webm`);
      resolve();
    }, duration * 1000 + 200);
  });
}

export function isRecording() { return _recording; }

function _downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: filename,
  });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}
