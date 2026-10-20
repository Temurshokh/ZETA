const XP_KEY = "zeta_xp";
const LEVEL_KEY = "zeta_level";

function getXP() {
  return parseInt(localStorage.getItem(XP_KEY) || "0");
}

function getLevel() {
  return parseInt(localStorage.getItem(LEVEL_KEY) || "1");
}

let pendingXP = 0;
let xpNotifyTimeout = null;

function addXP(amount) {
  let currentXP = getXP();
  let currentLevel = getLevel();

  currentXP += amount;
  pendingXP += amount;

  // Simple leveling system: Level * 100 XP required for next level
  const xpNeeded = currentLevel * 100;

  if (currentXP >= xpNeeded) {
    currentXP -= xpNeeded;
    currentLevel++;
    showNotification(`Level Up! ${currentLevel}-daraja! 🎉`, 'achievement');
    localStorage.setItem(LEVEL_KEY, currentLevel);
  }

  localStorage.setItem(XP_KEY, currentXP);
  updateXPDisplay();

  // Throttle XP notifications: sum them up if they come rapidly
  if (xpNotifyTimeout) clearTimeout(xpNotifyTimeout);
  xpNotifyTimeout = setTimeout(() => {
    showNotification(`+${pendingXP} XP`);
    pendingXP = 0;
  }, 300);
}

function updateXPDisplay() {
  const xpContainer = document.getElementById("xp-display");
  if (xpContainer) {
    const level = getLevel();
    const xp = getXP();
    const xpNeeded = level * 100;
    const progress = Math.min(100, (xp / xpNeeded) * 100);

    xpContainer.innerHTML = `
            <div class="xp-pill" style="display: flex; align-items: center; gap: 10px; background: hsla(0, 0%, 100%, 0.05); padding: 6px 16px; border-radius: 30px; border: 1px solid var(--glass-border); backdrop-filter: blur(10px);">
                <div style="display: flex; flex-direction: column; align-items: start;">
                  <span style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Daraja</span>
                  <span style="font-weight: 800; color: var(--primary); font-size: 0.9rem;">Lvl ${level}</span>
                </div>
                <div style="width: 80px; height: 6px; background: hsla(0,0%,100%,0.1); border-radius: 10px; overflow: hidden; position: relative;">
                    <div class="xp-bar-fill" style="width: ${progress}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--success)); transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: end;">
                  <span style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Tajriba</span>
                  <span style="font-size: 0.8rem; color: #fff; font-weight: 600;">${xp} XP</span>
                </div>
            </div>
        `;
  }
}

let activeNotifTimeout = null;

function showNotification(msg, type = 'success') {
  const notifContainer = document.getElementById('notif-stack-container') || createNotifContainer();

  // Clear any existing notifications immediately to prevent stacking (as requested)
  while (notifContainer.firstChild) {
    notifContainer.removeChild(notifContainer.firstChild);
  }
  if (activeNotifTimeout) clearTimeout(activeNotifTimeout);

  const notif = document.createElement("div");
  notif.className = `zeta-notification ${type}`;

  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'achievement') icon = '🏆';
  if (type === 'info') icon = 'ℹ️';
  if (type === 'warning') icon = '⚠️';

  notif.innerHTML = `
    <span class="notif-icon">${icon}</span>
    <span class="notif-msg">${msg}</span>
  `;

  notif.style.cssText = `
    background: hsla(0, 0%, 0%, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    color: white;
    padding: 10px 24px;
    border-radius: 30px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
    font-weight: 700;
    pointer-events: auto;
    animation: notifSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    margin: 0 auto;
    width: fit-content;
    white-space: nowrap;
  `;

  if (type === 'achievement') {
    notif.style.border = '1px solid #fbbf24';
    notif.style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(0,0,0,0.9))';
  }

  notifContainer.appendChild(notif);

  activeNotifTimeout = setTimeout(() => {
    notif.style.animation = 'notifSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      if (notif.parentNode) notif.remove();
    }, 300);
  }, 2000);
}

function createNotifContainer() {
  const container = document.createElement('div');
  container.id = 'notif-stack-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10005;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    width: 100%;
    max-width: 320px;
  `;
  document.body.appendChild(container);

  return container;
}

// Auto init
document.addEventListener("DOMContentLoaded", () => {
  // Inject XP container into header if it exists
  const header = document.querySelector("header");
  if (header) {
    // Create container if not exists
    let xpDiv = document.getElementById("xp-display");
    if (!xpDiv) {
      xpDiv = document.createElement("div");
      xpDiv.id = "xp-display";
      // Insert before nav or at the end
      const nav = header.querySelector("nav");
      if (nav) header.insertBefore(xpDiv, nav);
      else header.appendChild(xpDiv);
    }
    updateXPDisplay();
  }
});
