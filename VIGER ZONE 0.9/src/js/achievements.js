// ===== ZETA v0.9 Achievement System =====

const ACHIEVEMENT_VAU_REWARD = 5; // Each achievement gives 5 VAU

const ACHIEVEMENTS = [
    {
        id: 'snake_master',
        icon: '🐍',
        title: { uz: "Ilon Ustasi", en: "Snake Master", ru: "Мастер Змейки" },
        desc: { uz: "Snake da 100 ball to'plang", en: "Score 100 in Snake", ru: "Набери 100 очков в Snake" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => parseInt(localStorage.getItem('zeta_snake_highscore') || '0') >= 100
    },
    {
        id: 'gamer',
        icon: '🎮',
        title: { uz: "Geymer", en: "Gamer", ru: "Геймер" },
        desc: { uz: "Barcha 13 ta o'yinni o'ynang", en: "Play all 13 games", ru: "Сыграй во все 13 игр" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => {
            const r = JSON.parse(localStorage.getItem('zeta_games_played') || '[]');
            return r.length >= 13;
        }
    },
    {
        id: 'crypto_fan',
        icon: '💎',
        title: { uz: "Kriptoman", en: "Crypto Fan", ru: "Криптоман" },
        desc: { uz: "20 ta turli kriptoni ko'ring", en: "View 20 different cryptos", ru: "Просмотри 20 разных крипто" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => {
            const v = JSON.parse(localStorage.getItem('zeta_viewed_cryptos') || '[]');
            return v.length >= 20;
        }
    },
    {
        id: 'collector',
        icon: '⭐',
        title: { uz: "Kolleksioner", en: "Collector", ru: "Коллекционер" },
        desc: { uz: "10 ta kriptoni sevimlilaringizga qo'shing", en: "Add 10 cryptos to favorites", ru: "Добавь 10 крипто в избранное" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => {
            const f = JSON.parse(localStorage.getItem('zeta_favorites') || '[]');
            return f.length >= 10;
        }
    },
    {
        id: 'level5',
        icon: '🏅',
        title: { uz: "5-Daraja", en: "Level 5", ru: "Уровень 5" },
        desc: { uz: "5-darajaga yeting", en: "Reach level 5", ru: "Достигни 5-го уровня" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => parseInt(localStorage.getItem('zeta_level') || '1') >= 5
    },
    {
        id: 'toolbox',
        icon: '🔧',
        title: { uz: "Usta", en: "Tool Master", ru: "Инструментальщик" },
        desc: { uz: "Barcha 12 ta vositani ishlating", en: "Use all 12 tools", ru: "Используй все 12 инструментов" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => {
            const t = JSON.parse(localStorage.getItem('zeta_tools_used') || '[]');
            return t.length >= 12;
        }
    },
    {
        id: 'reader',
        icon: '📖',
        title: { uz: "Kitobxon", en: "Reader", ru: "Читатель" },
        desc: { uz: "Yangiliklar sahifasini o'qing", en: "Read the changelog", ru: "Прочитай страницу новостей" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => localStorage.getItem('zeta_changelog_reward_0.7') === 'true'
    },
    {
        id: 'streak7',
        icon: '🔥',
        title: { uz: "Fidoyi", en: "Dedicated", ru: "Преданный" },
        desc: { uz: "7 kun ketma-ket kiring", en: "Login 7 days in a row", ru: "Заходи 7 дней подряд" },
        xp: 100,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => parseInt(localStorage.getItem('zeta_streak_count') || '0') >= 7
    },
    {
        id: 'lucky7',
        icon: '🎰',
        title: { uz: "Omadli", en: "Lucky", ru: "Везунчик" },
        desc: { uz: "Lucky Spin ni 7 marta aylantiring", en: "Spin the Lucky Spin 7 times", ru: "Крутите Lucky Spin 7 раз" },
        xp: 50,
        vau: ACHIEVEMENT_VAU_REWARD,
        check: () => parseInt(localStorage.getItem('zeta_spin_total') || '0') >= 7
    }
];

function getAchievementLang() {
    try {
        const s = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
        return s.lang || 'uz';
    } catch { return 'uz'; }
}

function getUnlockedAchievements() {
    return JSON.parse(localStorage.getItem('zeta_achievements') || '[]');
}

function checkAchievements() {
    const unlocked = getUnlockedAchievements();
    let newUnlocks = [];

    ACHIEVEMENTS.forEach(a => {
        if (!unlocked.includes(a.id) && a.check()) {
            unlocked.push(a.id);
            newUnlocks.push(a);
        }
    });

    if (newUnlocks.length > 0) {
        localStorage.setItem('zeta_achievements', JSON.stringify(unlocked));
        newUnlocks.forEach((a, i) => {
            setTimeout(() => showAchievementPopup(a), i * 1500);
        });
    }
}

function showAchievementPopup(achievement) {
    const lang = getAchievementLang();
    const popup = document.createElement('div');
    popup.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.3));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(251, 191, 36, 0.5);
    border-radius: 16px;
    padding: 14px 22px;
    color: white;
    z-index: 10001;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: calc(100vw - 2rem);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    animation: achieveSlide 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    font-family: "Inter", sans-serif;
  `;
    const vauAmount = achievement.vau || 0;
    popup.innerHTML = `
    <span style="font-size: 2rem;">${achievement.icon}</span>
    <div>
      <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #fbbf24; font-weight: 700;">🏆 ${lang === 'ru' ? 'Достижение' : lang === 'en' ? 'Achievement' : 'Yutuq'}!</div>
      <div style="font-weight: 700; font-size: 1rem;">${achievement.title[lang]}</div>
      <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span>+${achievement.xp} XP</span>
        ${vauAmount > 0 ? `<span style="color: #fbbf24;"><i class="fas fa-gem" style="font-size: 0.7rem;"></i> +${vauAmount} VAU</span>` : ''}
      </div>
    </div>
  `;

    // Add keyframes
    if (!document.getElementById('achieve-style')) {
        const style = document.createElement('style');
        style.id = 'achieve-style';
        style.innerHTML = `
      @keyframes achieveSlide {
        0% { opacity: 0; transform: translate(-50%, -30px) scale(0.9); }
        10% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        85% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -15px) scale(1.02); }
      }
    `;
        document.head.appendChild(style);
    }

    document.body.appendChild(popup);

    // Award XP
    if (typeof addXP === 'function') {
        setTimeout(() => addXP(achievement.xp), 300);
    }

    // Award VAU
    if (vauAmount > 0 && window.ZetaState) {
        setTimeout(() => {
            ZetaState.addVAU(vauAmount);
            if (window.VAUGames) VAUGames.updateBalanceDisplay();
        }, 400);
    }

    setTimeout(() => popup.remove(), 3200);
}

function renderAchievementsSection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lang = getAchievementLang();
    const unlocked = getUnlockedAchievements();

    container.innerHTML = ACHIEVEMENTS.map(a => {
        const isUnlocked = unlocked.includes(a.id);
        const vauText = a.vau ? ` + ${a.vau} VAU` : '';
        return `
      <div style="
        display: flex; align-items: center; gap: 12px;
        padding: 12px; border-radius: 12px;
        background: ${isUnlocked ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
        border: 1px solid ${isUnlocked ? 'rgba(251, 191, 36, 0.3)' : 'var(--glass-border)'};
        opacity: ${isUnlocked ? '1' : '0.5'};
        transition: all 0.3s;
      ">
        <span style="font-size: 1.5rem; ${isUnlocked ? '' : 'filter: grayscale(1);'}">${a.icon}</span>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${a.title[lang]}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis;">${a.desc[lang]}</div>
        </div>
        <span style="font-size: 0.7rem; font-weight: 700; color: ${isUnlocked ? '#fbbf24' : 'var(--text-muted)'}; white-space: nowrap; text-align: right; line-height: 1.4;">
          ${isUnlocked ? '✓' : `+${a.xp} XP<br><span style="color: #fbbf24;"><i class="fas fa-gem" style="font-size: 0.6rem;"></i> +${a.vau || 0} VAU</span>`}
        </span>
      </div>
    `;
    }).join('');
}

// Auto-check on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkAchievements, 2000);
});
