// ===== ZETA v0.7 — Lucky Spin (100 XP per spin) =====

const LuckySpin = (() => {
  const SPIN_COUNT_KEY = 'zeta_spin_total';
  const SPIN_COST = 100; // XP cost per spin

  // Prize segments: label key, XP value, color, weight (higher = more likely)
  const PRIZES = [
    { key: 'spin_5', xp: 5, color: '#3b82f6', weight: 30 },
    { key: 'spin_10', xp: 10, color: '#8b5cf6', weight: 25 },
    { key: 'spin_15', xp: 15, color: '#06b6d4', weight: 20 },
    { key: 'spin_20', xp: 20, color: '#10b981', weight: 15 },
    { key: 'spin_25', xp: 25, color: '#f59e0b', weight: 12 },
    { key: 'spin_50', xp: 50, color: '#ef4444', weight: 8 },
    { key: 'spin_150', xp: 150, color: '#ec4899', weight: 4 },
    { key: 'spin_300', xp: 300, color: '#fbbf24', weight: 2 },
  ];

  const LABELS = {
    uz: {
      title: 'Lucky Spin',
      subtitle: "Har bir aylantirish — 100 XP",
      spin_btn: 'Aylantirish',
      cost_label: '100 XP',
      spin_5: '+5 XP', spin_10: '+10 XP', spin_15: '+15 XP', spin_20: '+20 XP',
      spin_25: '+25 XP', spin_50: '+50 XP', spin_150: '+150 XP', spin_300: '💎 +300 XP',
      won: 'Tabriklaymiz!',
      won_desc: 'Siz yutdingiz',
      jackpot: 'JACKPOT! 🎉',
      no_xp: 'XP yetarli emas!',
      no_xp_desc: 'Aylantirish uchun kamida 100 XP kerak',
      spinning: 'Aylanmoqda...'
    },
    en: {
      title: 'Lucky Spin',
      subtitle: 'Each spin costs 100 XP',
      spin_btn: 'Spin!',
      cost_label: '100 XP',
      spin_5: '+5 XP', spin_10: '+10 XP', spin_15: '+15 XP', spin_20: '+20 XP',
      spin_25: '+25 XP', spin_50: '+50 XP', spin_150: '+150 XP', spin_300: '💎 +300 XP',
      won: 'Congratulations!',
      won_desc: 'You won',
      jackpot: 'JACKPOT! 🎉',
      no_xp: 'Not enough XP!',
      no_xp_desc: 'You need at least 100 XP to spin',
      spinning: 'Spinning...'
    },
    ru: {
      title: 'Lucky Spin',
      subtitle: 'Каждое вращение — 100 XP',
      spin_btn: 'Крутить!',
      cost_label: '100 XP',
      spin_5: '+5 XP', spin_10: '+10 XP', spin_15: '+15 XP', spin_20: '+20 XP',
      spin_25: '+25 XP', spin_50: '+50 XP', spin_150: '+150 XP', spin_300: '💎 +300 XP',
      won: 'Поздравляем!',
      won_desc: 'Вы выиграли',
      jackpot: 'ДЖЕКПОТ! 🎉',
      no_xp: 'Недостаточно XP!',
      no_xp_desc: 'Нужно минимум 100 XP для вращения',
      spinning: 'Крутится...'
    }
  };

  let isSpinning = false;

  function getLang() {
    try {
      const s = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
      return s.lang || 'uz';
    } catch { return 'uz'; }
  }

  function t(key) {
    const lang = getLang();
    return (LABELS[lang] || LABELS.uz)[key] || key;
  }

  function getCurrentXP() {
    return parseInt(localStorage.getItem('zeta_xp') || '0');
  }

  function canAfford() {
    return getCurrentXP() >= SPIN_COST;
  }

  function deductXP(amount) {
    let xp = getCurrentXP();
    xp = Math.max(0, xp - amount);
    localStorage.setItem('zeta_xp', xp.toString());
    // Update the XP display if available
    if (typeof updateXPDisplay === 'function') updateXPDisplay();
  }

  function incrementSpinCount() {
    const total = parseInt(localStorage.getItem(SPIN_COUNT_KEY) || '0') + 1;
    localStorage.setItem(SPIN_COUNT_KEY, total.toString());
    return total;
  }

  function getSpinCount() {
    return parseInt(localStorage.getItem(SPIN_COUNT_KEY) || '0');
  }

  // Weighted random pick
  function pickPrize() {
    const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0);
    let rnd = Math.random() * totalWeight;
    for (const prize of PRIZES) {
      rnd -= prize.weight;
      if (rnd <= 0) return prize;
    }
    return PRIZES[0];
  }

  // Draw the wheel on a canvas
  function drawWheel(canvas) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 8;
    const segAngle = (2 * Math.PI) / PRIZES.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    PRIZES.forEach((prize, i) => {
      const startAngle = i * segAngle - Math.PI / 2;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = prize.color;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${r < 100 ? 11 : 14}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t(prize.key), r * 0.62, 0);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.18, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a1929';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center icon
    ctx.fillStyle = '#fff';
    ctx.font = `${r < 100 ? 16 : 22}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎰', cx, cy);

    // Pointer (top triangle)
    ctx.beginPath();
    ctx.moveTo(cx - 12, 4);
    ctx.lineTo(cx + 12, 4);
    ctx.lineTo(cx, 24);
    ctx.closePath();
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Animate the spin
  function animateSpin(canvas, prizeIndex, onDone) {
    const segAngle = 360 / PRIZES.length;
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const targetDeg = fullRotations * 360 + (360 - prizeIndex * segAngle - segAngle / 2);

    const duration = 4000;
    const start = performance.now();

    canvas.style.transition = 'none';

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const currentAngle = eased * targetDeg;

      canvas.style.transform = `rotate(${currentAngle}deg)`;

      if (progress < 1) {
        const segsPassed = Math.floor(currentAngle / segAngle);
        if (segsPassed !== animateSpin._lastSeg) {
          animateSpin._lastSeg = segsPassed;
          if (window.ZetaTelegram) {
            ZetaTelegram.hapticImpact('light');
          }
        }
        requestAnimationFrame(frame);
      } else {
        if (window.ZetaTelegram) {
          ZetaTelegram.hapticNotification('success');
        }
        setTimeout(onDone, 300);
      }
    }

    animateSpin._lastSeg = -1;
    requestAnimationFrame(frame);
  }

  // Render the section
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const affordable = canAfford();

    container.innerHTML = `
      <div class="spin-section glass-panel" style="text-align: center; padding: 1.5rem; position: relative; overflow: hidden;">
        <div class="spin-bg-glow"></div>
        <h3 style="margin-bottom: 0.25rem; position: relative; z-index: 1;">
          <i class="fas fa-dice" style="color: #fbbf24;"></i> ${t('title')}
        </h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem; position: relative; z-index: 1;">
          ${t('subtitle')}
        </p>

        <div id="spin-wheel-wrap" style="position: relative; display: inline-block; margin-bottom: 1rem;">
          <canvas id="spin-canvas" width="280" height="280" style="border-radius: 50%;"></canvas>
        </div>

        <div style="position: relative; z-index: 1;">
          <button id="spin-btn" class="btn" style="font-size: 1rem; padding: 0.75rem 2.5rem; border-radius: 30px; ${affordable ? '' : 'opacity: 0.5; cursor: not-allowed;'}">
            <i class="fas fa-sync-alt"></i> ${t('spin_btn')}
            <span style="
              display: inline-block;
              margin-left: 8px;
              background: rgba(0,0,0,0.3);
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 0.75rem;
              font-weight: 700;
            ">-${t('cost_label')}</span>
          </button>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">
            <i class="fas fa-star" style="color: #fbbf24;"></i> ${getLang() === 'en' ? 'Your XP' : getLang() === 'ru' ? 'Ваш XP' : 'Sizning XP'}: <strong>${getCurrentXP()}</strong>
          </div>
        </div>

        <div id="spin-result" style="display: none; position: relative; z-index: 1;"></div>
      </div>
    `;

    // Inject styles once
    if (!document.getElementById('lucky-spin-styles')) {
      const style = document.createElement('style');
      style.id = 'lucky-spin-styles';
      style.textContent = `
        .spin-section {
          margin-bottom: 1.5rem;
        }
        .spin-bg-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        #spin-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #0a1929;
          font-weight: 700;
          border: none;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #spin-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 30px rgba(251, 191, 36, 0.5);
        }
        #spin-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
        #spin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed !important;
          transform: none !important;
        }
        .spin-result-popup {
          animation: spinResultIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes spinResultIn {
          from { opacity: 0; transform: scale(0.7) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .spin-confetti {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
          animation: confettiFall 1.5s ease-out forwards;
        }
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(120px) rotate(720deg) scale(0.3); }
        }
        @media (max-width: 400px) {
          #spin-canvas {
            width: 220px !important;
            height: 220px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Draw the wheel
    const canvas = document.getElementById('spin-canvas');
    if (canvas) {
      const displaySize = Math.min(280, window.innerWidth - 80);
      canvas.style.width = displaySize + 'px';
      canvas.style.height = displaySize + 'px';
      drawWheel(canvas);
    }

    // Bind spin button
    const btn = document.getElementById('spin-btn');
    if (btn) {
      btn.addEventListener('click', () => doSpin(canvas, btn, containerId));
    }
  }

  function spawnConfetti(container) {
    const colors = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'spin-confetti';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.left = (30 + Math.random() * 60) + '%';
      dot.style.top = (20 + Math.random() * 30) + '%';
      dot.style.animationDelay = (Math.random() * 0.5) + 's';
      dot.style.width = (5 + Math.random() * 6) + 'px';
      dot.style.height = dot.style.width;
      container.appendChild(dot);
      setTimeout(() => dot.remove(), 2000);
    }
  }

  function doSpin(canvas, btn, containerId) {
    if (isSpinning) return;

    // Check XP
    if (!canAfford()) {
      // Show not enough XP message
      if (window.ZetaTelegram) ZetaTelegram.hapticNotification('error');
      const resultEl = document.getElementById('spin-result');
      if (resultEl) {
        resultEl.style.display = 'block';
        resultEl.innerHTML = `
          <div class="spin-result-popup" style="
            margin-top: 1rem; padding: 1rem;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            border-radius: 16px;
          ">
            <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">❌</div>
            <div style="font-weight: 700; font-size: 1rem; color: #ef4444;">${t('no_xp')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">${t('no_xp_desc')}</div>
          </div>
        `;
        setTimeout(() => { resultEl.style.display = 'none'; }, 2500);
      }
      return;
    }

    isSpinning = true;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('spinning')}`;

    // Deduct 100 XP
    deductXP(SPIN_COST);

    // Pick prize
    const prize = pickPrize();
    const prizeIndex = PRIZES.indexOf(prize);

    // Haptic start
    if (window.ZetaTelegram) ZetaTelegram.hapticImpact('medium');

    // Reset canvas rotation
    canvas.style.transform = 'rotate(0deg)';

    // Small delay before animation starts (so reset visually applies)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateSpin(canvas, prizeIndex, () => {
          // Increment spin count
          incrementSpinCount();

          // Award prize XP
          if (typeof addXP === 'function') {
            addXP(prize.xp);
          } else {
            let currentXP = getCurrentXP();
            currentXP += prize.xp;
            localStorage.setItem('zeta_xp', currentXP.toString());
          }

          // VAU bonus: jackpot = 15-30 VAU, 50 XP = 5-10 VAU, else 20% chance of 2-5 VAU
          let vauBonus = 0;
          if (prize.xp >= 150) {
            vauBonus = 15 + Math.floor(Math.random() * 16); // 15-30
          } else if (prize.xp >= 50) {
            vauBonus = 5 + Math.floor(Math.random() * 6); // 5-10
          } else if (Math.random() < 0.2) {
            vauBonus = 2 + Math.floor(Math.random() * 4); // 2-5
          }
          if (vauBonus > 0 && window.ZetaState) {
            ZetaState.addVAU(vauBonus);
            if (window.VAUGames) VAUGames.updateBalanceDisplay();
          }

          // Show result
          const resultEl = document.getElementById('spin-result');
          const isJackpot = prize.xp >= 150;
          const netGain = prize.xp - SPIN_COST;
          const isWin = netGain > 0;
          const vauBonusHTML = vauBonus > 0 ? `
            <div style="font-size: 0.8rem; font-weight: 700; color: #fbbf24; margin-top: 0.2rem;">
              <i class="fas fa-gem"></i> +${vauBonus} VAU
            </div>` : '';

          if (resultEl) {
            resultEl.style.display = 'block';
            resultEl.innerHTML = `
              <div class="spin-result-popup" style="
                margin-top: 1rem; padding: 1rem;
                background: ${isJackpot
                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.3))'
                : isWin ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${isJackpot
                ? 'rgba(251, 191, 36, 0.5)'
                : isWin ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'};
                border-radius: 16px;
              ">
                <div style="font-size: 2rem; margin-bottom: 0.3rem;">${isJackpot ? '🎉' : isWin ? '🎁' : '🎰'}</div>
                <div style="font-weight: 700; font-size: 1.1rem; color: ${isJackpot ? '#fbbf24' : '#fff'};">
                  ${isJackpot ? t('jackpot') : t('won')}
                </div>
                <div style="font-size: 1.5rem; font-weight: 800; color: ${prize.color}; margin: 0.3rem 0;">
                  +${prize.xp} XP
                </div>
                ${vauBonusHTML}
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  ${netGain >= 0 ? '📈' : '📉'} ${getLang() === 'en' ? 'Net' : getLang() === 'ru' ? 'Итого' : 'Farq'}: ${netGain >= 0 ? '+' : ''}${netGain} XP
                </div>
              </div>
            `;
          }

          // Confetti on big wins
          if (isJackpot) {
            const section = document.querySelector('.spin-section');
            if (section) spawnConfetti(section);
          }

          // Re-enable after delay
          isSpinning = false;
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = `
              <i class="fas fa-sync-alt"></i> ${t('spin_btn')}
              <span style="
                display: inline-block;
                margin-left: 8px;
                background: rgba(0,0,0,0.3);
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-weight: 700;
              ">-${t('cost_label')}</span>
            `;
            // Update XP display in the section
            render(containerId);
          }, 2500);
        });
      });
    });
  }

  return { render, getSpinCount };
})();

// Export
if (typeof window !== 'undefined') window.LuckySpin = LuckySpin;
