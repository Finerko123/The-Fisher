const rodFinishes = [
  ['pine', '#a96848', '#e4ad6b'], ['reed', '#688b6d', '#c6d98d'], ['glass', '#68cdd0', '#e5ffff'], ['salt', '#d3b274', '#fff0bd'], ['moon', '#7c91d2', '#d5ddff'], ['brine', '#a76e56', '#f5ae74'], ['deep', '#385c83', '#8ad8e1'], ['storm', '#5b687c', '#dce6ee'], ['pearl', '#ba9bc6', '#fff0f5'], ['blackcurrent', '#423f5b', '#a5c9e8'], ['leviathan', '#715d41', '#d9bd75'], ['starbreaker', '#665bc0', '#cfb9ff'], ['abyss', '#384b58', '#79e3c2'], ['sovereign', '#9d8060', '#fff1bd'], ['horizon', '#bc644e', '#fbd18d']
];
const baitFinishes = [
  ['worm', '#9b6549', '#dba276'], ['grub', '#a9c66b', '#eff49b'], ['squid', '#7b75c8', '#e8bfff'], ['minnow', '#82b4bc', '#effff1'], ['fly', '#d3a657', '#fff0af'], ['larva', '#d66d47', '#ffc074'], ['bloom', '#5c92a4', '#a9ffe4']
];
const gearVisuals = { rod: '<span class="catalog-art rod-art"><i></i><b></b><em></em></span>', bait: '<span class="catalog-art bait-art"><i></i><b></b><em></em></span>' };
function enhanceCatalog() {
  document.querySelectorAll('.item-card').forEach(card => {
    if (card.querySelector('.catalog-art')) return;
    const button = card.querySelector('.buy-button');
    if (!button) return;
    const type = button.dataset.type === 'rods' ? 'rod' : 'bait';
    const index = Number(button.dataset.index);
    card.classList.add(`${type}-card`, `${type}-finish-${index}`);
    card.insertAdjacentHTML('afterbegin', gearVisuals[type]);
    card.style.setProperty('--gear-a', (type === 'rod' ? rodFinishes : baitFinishes)[index][1]);
    card.style.setProperty('--gear-b', (type === 'rod' ? rodFinishes : baitFinishes)[index][2]);
  });
}
function applyEquippedFinish() {
  const rodIndex = state.rod;
  const baitIndex = state.bait;
  const rod = rodFinishes[rodIndex];
  const bait = baitFinishes[baitIndex];
  document.documentElement.style.setProperty('--equipped-rod-a', rod[1]);
  document.documentElement.style.setProperty('--equipped-rod-b', rod[2]);
  document.documentElement.style.setProperty('--equipped-bait-a', bait[1]);
  document.documentElement.style.setProperty('--equipped-bait-b', bait[2]);
}
const gearObserver = new MutationObserver(() => { enhanceCatalog(); applyEquippedFinish(); });
gearObserver.observe(document.getElementById('panel-modal'), { childList: true, subtree: true });
setInterval(applyEquippedFinish, 350);
