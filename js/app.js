/* ═══════════════════════════════════════════
   APP — Entry point / screen router
════════════════════════════════════════════ */
import { initWizard } from './wizard.js';
import { initStudio } from './studio.js';

const wizardScreen = document.getElementById('screen-wizard');
const studioScreen = document.getElementById('screen-studio');

function showWizard() {
  studioScreen.style.display = 'none';
  wizardScreen.style.display = '';
  initWizard(wizardScreen, onCreated);
}

function onCreated(context) {
  wizardScreen.style.display = 'none';
  studioScreen.style.display = '';
  initStudio(studioScreen, {
    ...context,
    onBack: showWizard,
  });
}

showWizard();
