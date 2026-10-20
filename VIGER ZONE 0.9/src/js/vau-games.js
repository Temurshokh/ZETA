// ===== ZETA v0.9 — VAU Games (Virtual Aurum) =====

const VAUGames = (() => {
    // ===== TRANSLATIONS =====
    const LABELS = {
        uz: {
            section_title: 'VAU O\'yinlar',
            section_sub: 'Virtual Aurum bilan o\'yna',
            balance: 'Balans',
            coin_flip: 'Tanga Tashlash',
            coin_flip_desc: '50/50 imkoniyat',
            mystery_box: 'Sirli Quti',
            mystery_box_desc: '3 tadan 1 ni tanlang',
            risk_ladder: 'Risk Narvon',
            risk_ladder_desc: 'Yuqoriga chiq yoki yoqot',
            bet: 'Stavka',
            play: 'O\'ynash',
            heads: 'Bosh',
            tails: 'Dum',
            you_won: 'Yutdingiz!',
            you_lost: 'Yutqazdingiz!',
            pick_box: 'Qutini tanlang',
            climb: 'Ko\'tarilish',
            cash_out: 'Olish',
            step: 'Qadam',
            fell: 'Yiqildingiz!',
            no_vau: 'VAU yetarli emas!',
            close: 'Yopish',
            reward: 'Mukofot',
            choose_side: 'Tomonni tanlang',
            flip: 'Tashlash!',
            prize: 'Sovrin',
            empty: 'Bo\'sh',
            bonus: 'Bonus',
        },
        en: {
            section_title: 'VAU Games',
            section_sub: 'Play with Virtual Aurum',
            balance: 'Balance',
            coin_flip: 'Coin Flip',
            coin_flip_desc: '50/50 chance',
            mystery_box: 'Mystery Box',
            mystery_box_desc: 'Pick 1 of 3',
            risk_ladder: 'Risk Ladder',
            risk_ladder_desc: 'Climb up or lose',
            bet: 'Bet',
            play: 'Play',
            heads: 'Heads',
            tails: 'Tails',
            you_won: 'You Won!',
            you_lost: 'You Lost!',
            pick_box: 'Pick a box',
            climb: 'Climb',
            cash_out: 'Cash Out',
            step: 'Step',
            fell: 'You  Fell!',
            no_vau: 'Not enough VAU!',
            close: 'Close',
            reward: 'Reward',
            choose_side: 'Choose a side',
            flip: 'Flip!',
            prize: 'Prize',
            empty: 'Empty',
            bonus: 'Bonus',
        },
        ru: {
            section_title: 'VAU Игры',
            section_sub: 'Играй с Virtual Aurum',
            balance: 'Баланс',
            coin_flip: 'Монетка',
            coin_flip_desc: 'Шанс 50/50',
            mystery_box: 'Тайная Коробка',
            mystery_box_desc: 'Выберите 1 из 3',
            risk_ladder: 'Риск Лестница',
            risk_ladder_desc: 'Поднимись или потеряй',
            bet: 'Ставка',
            play: 'Играть',
            heads: 'Орёл',
            tails: 'Решка',
            you_won: 'Вы выиграли!',
            you_lost: 'Вы проиграли!',
            pick_box: 'Выберите коробку',
            climb: 'Подняться',
            cash_out: 'Забрать',
            step: 'Шаг',
            fell: 'Вы упали!',
            no_vau: 'Недостаточно VAU!',
            close: 'Закрыть',
            reward: 'Награда',
            choose_side: 'Выберите сторону',
            flip: 'Бросить!',
            prize: 'Приз',
            empty: 'Пусто',
            bonus: 'Бонус',
        }
    };

    function getLang() {
        try {
            const s = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
            return s.lang || 'uz';
        } catch { return 'uz'; }
    }

    function t(key) {
        const lang = getLang();
        return (LABELS[lang] && LABELS[lang][key]) || LABELS.uz[key] || key;
    }

    function getVAU() {
        return window.ZetaState ? ZetaState.getVAU() : parseInt(localStorage.getItem('zeta_vau') || '200');
    }

    function addVAU(amount) {
        if (window.ZetaState) return ZetaState.addVAU(amount);
        const cur = getVAU();
        const nv = Math.max(0, cur + amount);
        localStorage.setItem('zeta_vau', String(nv));
        return nv;
    }

    function notify(msg, type = 'success') {
        if (typeof showNotification === 'function') showNotification(msg, type);
    }

    function haptic(style = 'light') {
        if (window.ZetaTelegram) ZetaTelegram.hapticImpact(style);
    }

    // ===== RENDER VAU SECTION =====
    function render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="vau-section">
        <div class="vau-header">
          <div class="vau-title-row">
            <h3><i class="fas fa-coins"></i> ${t('section_title')}</h3>
            <div class="vau-balance-pill" id="vau-balance-display">
              <i class="fas fa-gem"></i>
              <span id="vau-balance-num">${getVAU()}</span> VAU
            </div>
          </div>
          <p class="vau-subtitle">${t('section_sub')}</p>
        </div>

        <div class="vau-games-grid">
          <!-- Coin Flip -->
          <div class="glass-panel vau-game-card" id="vau-coin-flip-card" onclick="VAUGames.openCoinFlip()">
            <div class="vau-game-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
              <i class="fas fa-coins"></i>
            </div>
            <h4>${t('coin_flip')}</h4>
            <p>${t('coin_flip_desc')}</p>
            <span class="btn btn-glass btn-sm"><i class="fas fa-play"></i> ${t('play')}</span>
          </div>

          <!-- Mystery Box -->
          <div class="glass-panel vau-game-card" id="vau-mystery-box-card" onclick="VAUGames.openMysteryBox()">
            <div class="vau-game-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);">
              <i class="fas fa-box-open"></i>
            </div>
            <h4>${t('mystery_box')}</h4>
            <p>${t('mystery_box_desc')}</p>
            <span class="btn btn-glass btn-sm"><i class="fas fa-play"></i> ${t('play')}</span>
          </div>

          <!-- Risk Ladder -->
          <div class="glass-panel vau-game-card" id="vau-risk-ladder-card" onclick="VAUGames.openRiskLadder()">
            <div class="vau-game-icon" style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);">
              <i class="fas fa-arrow-trend-up"></i>
            </div>
            <h4>${t('risk_ladder')}</h4>
            <p>${t('risk_ladder_desc')}</p>
            <span class="btn btn-glass btn-sm"><i class="fas fa-play"></i> ${t('play')}</span>
          </div>
        </div>
      </div>

      <!-- MODALS -->
      <div id="vau-modal-overlay" class="vau-modal-overlay" style="display:none;" onclick="VAUGames.closeModal(event)">
        <div class="vau-modal" onclick="event.stopPropagation()">
          <div class="vau-modal-header">
            <h3 id="vau-modal-title"></h3>
            <button class="vau-modal-close" onclick="VAUGames.closeModal()"><i class="fas fa-times"></i></button>
          </div>
          <div id="vau-modal-body" class="vau-modal-body"></div>
        </div>
      </div>
    `;
    }

    function updateBalanceDisplay() {
        const el = document.getElementById('vau-balance-num');
        if (el) {
            const bal = getVAU();
            el.textContent = bal;
            // Pulse animation
            const pill = document.getElementById('vau-balance-display');
            if (pill) {
                pill.classList.add('vau-pulse');
                setTimeout(() => pill.classList.remove('vau-pulse'), 600);
            }
        }
    }

    function openModal(title, bodyHTML) {
        const overlay = document.getElementById('vau-modal-overlay');
        const titleEl = document.getElementById('vau-modal-title');
        const bodyEl = document.getElementById('vau-modal-body');
        if (!overlay) return;
        titleEl.textContent = title;
        bodyEl.innerHTML = bodyHTML;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(e) {
        if (e && e.target && !e.target.classList.contains('vau-modal-overlay')) return;
        const overlay = document.getElementById('vau-modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // ===== COIN FLIP =====
    function openCoinFlip() {
        haptic('light');
        const betOptions = [10, 25, 50, 100];
        const betsHTML = betOptions.map(b =>
            `<button class="vau-bet-btn" onclick="VAUGames.playCoinFlip(${b})" ${getVAU() < b ? 'disabled' : ''}>${b} VAU</button>`
        ).join('');

        openModal(t('coin_flip'), `
      <div class="vau-game-content">
        <div class="vau-coin-display" id="vau-coin">
          <div class="vau-coin-inner">
            <div class="vau-coin-face vau-coin-heads"><i class="fas fa-crown"></i></div>
            <div class="vau-coin-face vau-coin-tails"><i class="fas fa-star"></i></div>
          </div>
        </div>
        <p class="vau-choose-label">${t('choose_side')}</p>
        <div class="vau-side-btns" id="vau-side-btns">
          <button class="vau-side-btn active" id="vau-side-heads" onclick="VAUGames.selectSide('heads')">
            <i class="fas fa-crown"></i> ${t('heads')}
          </button>
          <button class="vau-side-btn" id="vau-side-tails" onclick="VAUGames.selectSide('tails')">
            <i class="fas fa-star"></i> ${t('tails')}
          </button>
        </div>
        <div class="vau-bet-section">
          <span class="vau-bet-label">${t('bet')}:</span>
          <div class="vau-bet-options">${betsHTML}</div>
        </div>
        <div id="vau-coin-result" class="vau-result-area"></div>
      </div>
    `);
    }

    let selectedSide = 'heads';

    function selectSide(side) {
        selectedSide = side;
        document.getElementById('vau-side-heads').classList.toggle('active', side === 'heads');
        document.getElementById('vau-side-tails').classList.toggle('active', side === 'tails');
        haptic('light');
    }

    function playCoinFlip(bet) {
        if (getVAU() < bet) {
            notify(t('no_vau'), 'warning');
            return;
        }
        haptic('medium');

        // Deduct bet
        addVAU(-bet);
        updateBalanceDisplay();

        // Disable buttons
        document.querySelectorAll('.vau-bet-btn, .vau-side-btn').forEach(b => b.disabled = true);

        // Animate coin
        const coin = document.getElementById('vau-coin');
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = result === selectedSide;

        // Spin animation
        coin.classList.add('vau-coin-spinning');
        setTimeout(() => {
            coin.classList.remove('vau-coin-spinning');
            coin.classList.toggle('vau-coin-tails-result', result === 'tails');
            coin.classList.toggle('vau-coin-heads-result', result === 'heads');

            const resultArea = document.getElementById('vau-coin-result');
            if (won) {
                const winAmount = bet * 2;
                addVAU(winAmount);
                updateBalanceDisplay();
                resultArea.innerHTML = `
          <div class="vau-result-win">
            <i class="fas fa-trophy"></i>
            <span>${t('you_won')} +${winAmount} VAU</span>
          </div>`;
                notify(`🎉 +${winAmount} VAU!`, 'success');
                if (typeof addXP === 'function') addXP(5);
            } else {
                resultArea.innerHTML = `
          <div class="vau-result-lose">
            <i class="fas fa-times-circle"></i>
            <span>${t('you_lost')} -${bet} VAU</span>
          </div>`;
                notify(`😢 -${bet} VAU`, 'warning');
            }
            haptic(won ? 'heavy' : 'light');

            // Re-enable after delay
            setTimeout(() => {
                document.querySelectorAll('.vau-bet-btn').forEach(b => {
                    const bVal = parseInt(b.textContent);
                    b.disabled = getVAU() < bVal;
                });
                document.querySelectorAll('.vau-side-btn').forEach(b => b.disabled = false);
                coin.classList.remove('vau-coin-tails-result', 'vau-coin-heads-result');
            }, 1500);
        }, 1200);
    }

    // ===== MYSTERY BOX =====
    function openMysteryBox() {
        haptic('light');
        const cost = 30;

        openModal(t('mystery_box'), `
      <div class="vau-game-content">
        <p class="vau-cost-label">${t('bet')}: <strong>${cost} VAU</strong></p>
        <p class="vau-choose-label">${t('pick_box')}</p>
        <div class="vau-boxes-row" id="vau-boxes">
          <div class="vau-box" onclick="VAUGames.pickBox(0, ${cost})">
            <div class="vau-box-front"><i class="fas fa-gift"></i></div>
            <div class="vau-box-back" id="vau-box-reveal-0"></div>
          </div>
          <div class="vau-box" onclick="VAUGames.pickBox(1, ${cost})">
            <div class="vau-box-front"><i class="fas fa-gift"></i></div>
            <div class="vau-box-back" id="vau-box-reveal-1"></div>
          </div>
          <div class="vau-box" onclick="VAUGames.pickBox(2, ${cost})">
            <div class="vau-box-front"><i class="fas fa-gift"></i></div>
            <div class="vau-box-back" id="vau-box-reveal-2"></div>
          </div>
        </div>
        <div id="vau-box-result" class="vau-result-area"></div>
        ${getVAU() < cost ? `<p class="vau-warn">${t('no_vau')}</p>` : ''}
      </div>
    `);
    }

    let boxPicked = false;

    function pickBox(index, cost) {
        if (boxPicked) return;
        if (getVAU() < cost) {
            notify(t('no_vau'), 'warning');
            return;
        }
        boxPicked = true;
        haptic('medium');

        addVAU(-cost);
        updateBalanceDisplay();

        // Generate prizes: 1 good, 1 decent, 1 bad/empty
        // Randomly shuffle
        const prizes = [
            { vau: Math.floor(cost * 2.5), type: 'prize', icon: 'fa-gem' },     // big win
            { vau: Math.floor(cost * 0.5), type: 'bonus', icon: 'fa-star' },    // small return
            { vau: 0, type: 'empty', icon: 'fa-ghost' }                         // nothing
        ];
        // Shuffle
        for (let i = prizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [prizes[i], prizes[j]] = [prizes[j], prizes[i]];
        }

        const boxes = document.querySelectorAll('.vau-box');
        const picked = prizes[index];

        // Reveal picked box first
        setTimeout(() => {
            boxes[index].classList.add('vau-box-opened', picked.vau > 0 ? 'vau-box-win' : 'vau-box-empty');
            const revealEl = document.getElementById(`vau-box-reveal-${index}`);
            if (picked.vau > 0) {
                revealEl.innerHTML = `<i class="fas ${picked.icon}"></i><span>+${picked.vau}</span>`;
            } else {
                revealEl.innerHTML = `<i class="fas ${picked.icon}"></i><span>${t('empty')}</span>`;
            }
        }, 300);

        // Reveal others after delay
        setTimeout(() => {
            boxes.forEach((box, i) => {
                if (i === index) return;
                box.classList.add('vau-box-opened', 'vau-box-other');
                const rev = document.getElementById(`vau-box-reveal-${i}`);
                if (prizes[i].vau > 0) {
                    rev.innerHTML = `<i class="fas ${prizes[i].icon}"></i><span>+${prizes[i].vau}</span>`;
                } else {
                    rev.innerHTML = `<i class="fas ${prizes[i].icon}"></i><span>${t('empty')}</span>`;
                }
            });

            const resultArea = document.getElementById('vau-box-result');
            if (picked.vau > 0) {
                addVAU(picked.vau);
                updateBalanceDisplay();
                const net = picked.vau - cost;
                resultArea.innerHTML = `
          <div class="vau-result-win">
            <i class="fas fa-trophy"></i>
            <span>${t('you_won')} +${picked.vau} VAU</span>
          </div>`;
                notify(`🎁 +${picked.vau} VAU!`, 'success');
                if (net > 0 && typeof addXP === 'function') addXP(3);
            } else {
                resultArea.innerHTML = `
          <div class="vau-result-lose">
            <i class="fas fa-times-circle"></i>
            <span>${t('you_lost')} -${cost} VAU</span>
          </div>`;
                notify(`📦 -${cost} VAU`, 'warning');
            }
            haptic(picked.vau > 0 ? 'heavy' : 'light');

            // Allow replay after delay
            setTimeout(() => { boxPicked = false; }, 2000);
        }, 1200);
    }

    // ===== RISK LADDER =====
    function openRiskLadder() {
        haptic('light');
        const betOptions = [20, 50, 100];
        const betsHTML = betOptions.map(b =>
            `<button class="vau-bet-btn" onclick="VAUGames.startLadder(${b})" ${getVAU() < b ? 'disabled' : ''}>${b} VAU</button>`
        ).join('');

        openModal(t('risk_ladder'), `
      <div class="vau-game-content">
        <div class="vau-bet-section">
          <span class="vau-bet-label">${t('bet')}:</span>
          <div class="vau-bet-options">${betsHTML}</div>
        </div>
        <div id="vau-ladder-area"></div>
      </div>
    `);
    }

    let ladderStep = 0;
    let ladderBet = 0;
    let ladderCurrent = 0;

    const LADDER_MULTIPLIERS = [1.5, 2, 3, 5, 10];
    const LADDER_FALL_CHANCE = [0.30, 0.35, 0.45, 0.55, 0.65]; // increasing risk

    function startLadder(bet) {
        if (getVAU() < bet) {
            notify(t('no_vau'), 'warning');
            return;
        }
        haptic('medium');
        addVAU(-bet);
        updateBalanceDisplay();

        ladderBet = bet;
        ladderStep = 0;
        ladderCurrent = bet;

        renderLadder();
    }

    function renderLadder() {
        const area = document.getElementById('vau-ladder-area');
        if (!area) return;

        let stepsHTML = '';
        for (let i = LADDER_MULTIPLIERS.length - 1; i >= 0; i--) {
            const mult = LADDER_MULTIPLIERS[i];
            const val = Math.floor(ladderBet * mult);
            const reached = i < ladderStep;
            const current = i === ladderStep;
            const cls = reached ? 'vau-ladder-step reached' : (current ? 'vau-ladder-step current' : 'vau-ladder-step');
            stepsHTML += `
        <div class="${cls}">
          <span class="vau-ladder-label">${t('step')} ${i + 1}</span>
          <span class="vau-ladder-val">x${mult} = ${val} VAU</span>
          ${reached ? '<i class="fas fa-check-circle"></i>' : ''}
        </div>`;
        }

        const nextMult = LADDER_MULTIPLIERS[ladderStep];
        const nextVal = nextMult ? Math.floor(ladderBet * nextMult) : ladderCurrent;

        area.innerHTML = `
      <div class="vau-ladder-container">
        <div class="vau-ladder-current">
          <span>${t('reward')}: <strong>${ladderCurrent} VAU</strong></span>
        </div>
        <div class="vau-ladder-steps">${stepsHTML}</div>
        <div class="vau-ladder-actions">
          ${ladderStep < LADDER_MULTIPLIERS.length ? `
            <button class="vau-btn-climb" onclick="VAUGames.climbLadder()">
              <i class="fas fa-arrow-up"></i> ${t('climb')} (x${nextMult})
            </button>
          ` : ''}
          ${ladderStep > 0 ? `
            <button class="vau-btn-cashout" onclick="VAUGames.cashOutLadder()">
              <i class="fas fa-hand-holding-dollar"></i> ${t('cash_out')} ${ladderCurrent} VAU
            </button>
          ` : ''}
        </div>
        <div id="vau-ladder-result" class="vau-result-area"></div>
      </div>
    `;
    }

    function climbLadder() {
        if (ladderStep >= LADDER_MULTIPLIERS.length) return;
        haptic('medium');

        const fallChance = LADDER_FALL_CHANCE[ladderStep];
        const fell = Math.random() < fallChance;

        if (fell) {
            // Lost everything
            ladderCurrent = 0;
            const area = document.getElementById('vau-ladder-area');
            if (area) {
                // Mark current step as fallen
                const steps = area.querySelectorAll('.vau-ladder-step');
                const stepIdx = LADDER_MULTIPLIERS.length - 1 - ladderStep;
                if (steps[stepIdx]) steps[stepIdx].classList.add('fallen');

                const resultArea = document.getElementById('vau-ladder-result');
                if (resultArea) {
                    resultArea.innerHTML = `
            <div class="vau-result-lose vau-ladder-fell">
              <i class="fas fa-person-falling"></i>
              <span>${t('fell')} -${ladderBet} VAU</span>
            </div>
            <button class="vau-btn-retry" onclick="VAUGames.openRiskLadder()">
              <i class="fas fa-redo"></i> ${t('play')}
            </button>`;
                }
                // Disable actions
                area.querySelectorAll('.vau-btn-climb, .vau-btn-cashout').forEach(b => b.style.display = 'none');
            }
            notify(`💥 ${t('fell')} -${ladderBet} VAU`, 'warning');
            haptic('heavy');
            updateBalanceDisplay();
        } else {
            ladderCurrent = Math.floor(ladderBet * LADDER_MULTIPLIERS[ladderStep]);
            ladderStep++;
            haptic('light');
            renderLadder();

            if (ladderStep >= LADDER_MULTIPLIERS.length) {
                // Reached the top!
                cashOutLadder();
            }
        }
    }

    function cashOutLadder() {
        if (ladderCurrent <= 0) return;
        haptic('heavy');

        addVAU(ladderCurrent);
        updateBalanceDisplay();

        const net = ladderCurrent - ladderBet;
        const resultArea = document.getElementById('vau-ladder-result');
        if (resultArea) {
            resultArea.innerHTML = `
        <div class="vau-result-win">
          <i class="fas fa-trophy"></i>
          <span>${t('you_won')} +${ladderCurrent} VAU</span>
        </div>
        <button class="vau-btn-retry" onclick="VAUGames.openRiskLadder()">
          <i class="fas fa-redo"></i> ${t('play')}
        </button>`;
        }
        // Disable actions
        const area = document.getElementById('vau-ladder-area');
        if (area) area.querySelectorAll('.vau-btn-climb, .vau-btn-cashout').forEach(b => b.style.display = 'none');

        notify(`🏆 +${ladderCurrent} VAU!`, 'success');
        if (net > 0 && typeof addXP === 'function') addXP(5);

        ladderCurrent = 0;
    }

    return {
        render,
        openCoinFlip, selectSide, playCoinFlip,
        openMysteryBox, pickBox,
        openRiskLadder, startLadder, climbLadder, cashOutLadder,
        closeModal,
        getVAU, addVAU, updateBalanceDisplay
    };
})();

if (typeof window !== 'undefined') window.VAUGames = VAUGames;
