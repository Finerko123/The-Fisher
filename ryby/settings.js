const settingsState = { motion: true, water: 'high', compact: false, keybinds: { action: 'Space', close: 'Escape' } };
window.getTheFisherKeybinds = () => settingsState.keybinds;
const keyLabels = { Space: 'SPACE', Escape: 'ESC', Enter: 'ENTER' };
function keyLabel(code) { return keyLabels[code] || code.replace('Key', '').replace('Digit', ''); }
const settingsButton = document.getElementById('settings-button');
const modalBackdrop = document.getElementById('modal-backdrop');
const panelModal = document.getElementById('panel-modal');

function settingsMarkup() {
  return `<div class="panel-head"><div><h2>Settings</h2><p>Shape the tide to your liking.</p></div><button class="close-panel" id="settings-close">×</button></div><div class="settings-content"><div class="settings-section"><div><strong>Display mode</strong><small>Choose your preferred atmosphere.</small></div><div class="segmented"><button class="setting-choice ${!settingsState.compact ? 'selected' : ''}" data-setting="display" data-value="wide">WIDE</button><button class="setting-choice ${settingsState.compact ? 'selected' : ''}" data-setting="display" data-value="compact">COMPACT</button></div></div><div class="settings-section"><div><strong>Water detail</strong><small>More layers make the surface feel alive.</small></div><div class="segmented"><button class="setting-choice ${settingsState.water === 'low' ? 'selected' : ''}" data-setting="water" data-value="low">LOW</button><button class="setting-choice ${settingsState.water === 'high' ? 'selected' : ''}" data-setting="water" data-value="high">HIGH</button></div></div><div class="settings-section"><div><strong>Scene motion</strong><small>Animate waves, mist, and floating particles.</small></div><button class="toggle ${settingsState.motion ? 'on' : ''}" id="motion-toggle" aria-label="Toggle scene motion"><span></span></button></div><div class="settings-section"><div><strong>Sound cues</strong><small>Keep audio feedback for bites and catches.</small></div><button class="toggle ${state.sound ? 'on' : ''}" id="settings-sound-toggle" aria-label="Toggle sound cues"><span></span></button></div><div class="keybind-section"><div class="section-kicker">KEYBINDS</div><div class="keybind-row"><div><strong>Cast / reel in</strong><small>Use this key for the fishing action.</small></div><button class="keybind-button" data-keybind="action">${keyLabel(settingsState.keybinds.action)}</button></div><div class="keybind-row"><div><strong>Close panels</strong><small>Dismiss open panels and menus.</small></div><button class="keybind-button" data-keybind="close">${keyLabel(settingsState.keybinds.close)}</button></div><p class="keybind-message" id="keybind-message">Select a key, then press any keyboard key.</p></div><div class="settings-danger"><div><strong>Reset voyage</strong><small>Clear your catch history and return to 120 coins.</small></div><button class="reset-button" id="reset-progress">RESET</button></div></div>`;
}

function openSettings() {
  modalBackdrop.hidden = false;
  panelModal.innerHTML = settingsMarkup();
  panelModal.querySelector('#settings-close').addEventListener('click', closeSettings);
  panelModal.querySelectorAll('[data-setting]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.setting === 'display') settingsState.compact = button.dataset.value === 'compact';
    if (button.dataset.setting === 'water') settingsState.water = button.dataset.value;
    applySettings();
    openSettings();
  }));
  panelModal.querySelector('#motion-toggle').addEventListener('click', () => { settingsState.motion = !settingsState.motion; applySettings(); openSettings(); });
  panelModal.querySelector('#settings-sound-toggle').addEventListener('click', () => { state.sound = !state.sound; document.getElementById('sound-toggle').textContent = state.sound ? '◖' : '—'; openSettings(); });
  panelModal.querySelectorAll('[data-keybind]').forEach(button => button.addEventListener('click', () => { button.textContent = 'PRESS KEY'; button.classList.add('listening'); const capture = event => { if (event.key === 'Tab') return; event.preventDefault(); settingsState.keybinds[button.dataset.keybind] = event.code; button.textContent = keyLabel(event.code); button.classList.remove('listening'); panelModal.querySelector('#keybind-message').textContent = `${button.dataset.keybind === 'action' ? 'Cast / reel in' : 'Close panels'} is now ${keyLabel(event.code)}.`; document.removeEventListener('keydown', capture); }; document.addEventListener('keydown', capture); }));
  panelModal.querySelector('#reset-progress').addEventListener('click', () => { state.coins = 120; state.rod = 0; state.bait = 0; state.ownedRods = new Set([0]); state.ownedBaits = new Set([0]); state.haul = []; state.collection = {}; updateHud(); closeSettings(); toast('Voyage reset. The tide is waiting.'); });
}
function closeSettings() { modalBackdrop.hidden = true; }
function applySettings() { document.body.classList.toggle('compact-view', settingsState.compact); document.body.classList.toggle('low-water', settingsState.water === 'low'); document.body.classList.toggle('still-scene', !settingsState.motion); }
settingsButton.addEventListener('click', openSettings);
applySettings();
