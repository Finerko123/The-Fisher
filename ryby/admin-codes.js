const adminPassword = 'rybadev';
const redeemedCodes = new Set();
const rewardCodes = {
  RYBA20: { label: 'Ryba20 bonus', coins: 200 }
};

function managedPanel(markup, bind) {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('panel-modal');
  backdrop.hidden = false;
  modal.innerHTML = markup;
  modal.querySelector('.close-panel').addEventListener('click', closePanel);
  if (bind) bind(modal);
}
function codesPanel() {
  managedPanel(`<div class="panel-head"><div><h2>Redeem code</h2><p>Enter a tideway code to add rewards to your voyage.</p></div><button class="close-panel">×</button></div><div class="code-content"><form class="code-form" id="code-form"><label for="code-input">VOYAGE CODE</label><div class="code-entry"><input id="code-input" autocomplete="off" placeholder="TYPE CODE" maxlength="24"><button type="submit">REDEEM</button></div><p class="form-message" id="code-message">Codes are case-insensitive.</p></form><div class="code-rewards"><span class="section-kicker">AVAILABLE REWARDS</span>${Object.entries(rewardCodes).map(([code, reward]) => `<div class="code-reward"><strong>${code}</strong><span>${reward.label}</span><b>◆ ${reward.coins}</b></div>`).join('')}</div></div>`, modal => {
    modal.querySelector('#code-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = modal.querySelector('#code-input');
      const message = modal.querySelector('#code-message');
      const code = input.value.trim().toUpperCase();
      const reward = rewardCodes[code];
      if (!reward) { message.textContent = 'That code is not recognized.'; message.className = 'form-message error'; return; }
      if (redeemedCodes.has(code)) { message.textContent = 'That code has already been redeemed.'; message.className = 'form-message error'; return; }
      redeemedCodes.add(code);
      state.coins += reward.coins;
      updateHud();
      message.textContent = `${reward.label} added: ◆ ${reward.coins} coins.`;
      message.className = 'form-message success';
      input.value = '';
      toast(`Code redeemed for ${reward.coins} coins.`);
    });
  });
}
function adminLogin() {
  managedPanel(`<div class="panel-head"><div><h2>Admin access</h2><p>Private tools for The Fisher operator.</p></div><button class="close-panel">×</button></div><div class="admin-login"><div class="admin-seal">⌁</div><strong>RESTRICTED HARBOR SYSTEM</strong><small>Enter the administrator password to continue.</small><form id="admin-login-form"><input id="admin-password" type="password" autocomplete="off" placeholder="PASSWORD"><button type="submit">UNLOCK PANEL</button><p class="form-message" id="admin-message"></p></form><span class="security-note">Local prototype access</span></div>`, modal => {
    modal.querySelector('#admin-login-form').addEventListener('submit', event => {
      event.preventDefault();
      const password = modal.querySelector('#admin-password');
      const message = modal.querySelector('#admin-message');
      if (password.value !== adminPassword) { message.textContent = 'Incorrect password.'; message.className = 'form-message error'; password.value = ''; return; }
      adminPanel();
    });
    modal.querySelector('#admin-password').focus();
  });
}
function adminPanel() {
  managedPanel(`<div class="panel-head"><div><h2>Admin console</h2><p>Operator tools for balancing this local voyage.</p></div><button class="close-panel">×</button></div><div class="admin-content"><div class="admin-status"><span class="status-dot"></span><div><strong>ACCESS GRANTED</strong><small>Local operator session active</small></div><b>ADMIN</b></div><div class="admin-stats"><div><small>COINS</small><strong>${state.coins.toLocaleString()}</strong></div><div><small>RODS OWNED</small><strong>${state.ownedRods.size} / ${rods.length}</strong></div><div><small>BAIT OWNED</small><strong>${state.ownedBaits.size} / ${baits.length}</strong></div></div><div class="admin-actions"><button data-admin-action="coins"><span>◆</span><div><strong>Grant 1,000 coins</strong><small>Add currency for testing shop progression.</small></div><b>RUN</b></button><button data-admin-action="gear"><span>✦</span><div><strong>Unlock all gear</strong><small>Own every rod and bait immediately.</small></div><b>RUN</b></button><button data-admin-action="reset"><span>↺</span><div><strong>Reset voyage</strong><small>Restore the starting state.</small></div><b>RUN</b></button></div></div>`, modal => {
    modal.querySelectorAll('[data-admin-action]').forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.adminAction;
      if (action === 'coins') { state.coins += 1000; toast('Admin grant added: 1,000 coins.'); }
      if (action === 'gear') { rods.forEach(item => state.ownedRods.add(item.index)); baits.forEach(item => state.ownedBaits.add(item.index)); toast('All rods and bait unlocked.'); }
      if (action === 'reset') { state.coins = 120; state.rod = 0; state.bait = 0; state.ownedRods = new Set([0]); state.ownedBaits = new Set([0]); state.haul = []; state.collection = {}; toast('Voyage reset by admin.'); }
      updateHud();
      adminPanel();
    }));
  });
}
document.getElementById('codes-button').addEventListener('click', codesPanel);
document.getElementById('admin-button').addEventListener('click', adminLogin);
