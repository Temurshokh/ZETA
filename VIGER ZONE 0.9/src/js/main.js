// ===== ZETA v0.9 Main JS =====

// Enforce Start Page (Strict First-Visit Policy)
(function () {
  try {
    const SESSION_KEY = 'zeta_session_active';
    const path = window.location.pathname;
    const page = path.split("/").pop().toLowerCase();
    const isHomePage = page === 'index.html' || page === '' || page === 'src';

    if (!sessionStorage.getItem(SESSION_KEY)) {
      if (isHomePage) {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } else {
        let targetPath = 'index.html';
        if (path.includes('/games/') || path.includes('/tools/') || path.includes('/css/') || path.includes('/js/')) {
          targetPath = '../index.html';
        }
        window.location.replace(targetPath);
        throw new Error("Redirecting to Home...");
      }
    }
  } catch (e) {
    if (e.message !== "Redirecting to Home...") {
      console.error("Router Guard:", e);
    }
  }
})();

// ===== DAILY TIPS — 30+ tips in 3 languages =====
const DAILY_TIPS = {
  uz: [
    "💡 Bitcoin butun dunyoning birinchi raqamli valyutasidir",
    "💡 Kripto portfelingizni diversifikatsiya qiling",
    "💡 Snake o'yinida devorlardan qo'rqmang — ular o'ldirmaydi!",
    "💡 XP ko'proq to'plash uchun har kuni ZETA'ga kiring",
    "💡 Ethereum smart-kontraktlarni qo'llab-quvvatlaydi",
    "💡 Kripto narxi juda tez o'zgaradi — ehtiyot bo'ling",
    "💡 CoinMarketCap — eng mashhur kripto narx saytlaridan biri",
    "💡 Ko'proq o'yin o'ynasangiz, ko'proq XP to'playsiz",
    "💡 ZETA da hamma narsa telefoningizda saqlanadi",
    "💡 Solana — eng tez blokcheynlardan biri",
    "💡 Sevimli kriptolaringizni ⭐ bilan belgilang",
    "💡 Memory o'yini xotirangizni yaxshilashga yordam beradi",
    "💡 ZETA vositalari: kalkulyator, sekundomer, QR kod va boshqalar",
    "💡 Hech qachon barcha pulingizni bitta tangaga soling",
    "💡 Space Tunnel da o'ng/chapga suring — boshqaruv oson",
    "💡 DYOR — o'z tadqiqotingizni qiling (Do Your Own Research)",
    "💡 Cube Run 3D — cheksiz yugurish o'yini, qanchalik uzoq?",
    "💡 Kripto bozor 24/7 ishlaydi — hech qachon yopilmaydi",
    "💡 Crossy Road — yo'ldan ehtiyotkorlik bilan o'ting!",
    "💡 NFT — bu noyob raqamli san'at asarlaridir",
    "💡 Blockchain — bu tarqatilgan ma'lumotlar bazasi",
    "💡 ZETA har kuni yangi maslahat beradi — kuting!",
    "💡 Neon Pong — klassik stol tennisini neon uslubda o'ynang",
    "💡 Archery 2D — nishonga aniq teg, bal to'plang!",
    "💡 Parol yaratgichdan xavfsiz parollar oling",
    "💡 QR kod yaratgich — har qanday linkni QR ga aylantiring",
    "💡 O'rmon Siri — interaktiv hikoya, har tanlov muhim!",
    "💡 Rang tanlash vositasi — HEX va RGB ranglarni aniqlang",
    "💡 Kripto kalkulyator bilan valyutalarni hisoblang",
    "💡 Escape Road — politsiyadan qochishga tayyormisiz?",
    "💡 Mini City — ochiq dunyo, qurilishlar va sayohat!"
  ],
  en: [
    "💡 Bitcoin is the world's first digital currency",
    "💡 Diversify your crypto portfolio — don't put all eggs in one basket",
    "💡 In Snake, walls don't kill — the snake wraps around!",
    "💡 Visit ZETA daily to earn more XP",
    "💡 Ethereum supports smart contracts and dApps",
    "💡 Crypto prices can be very volatile — be cautious",
    "💡 CoinMarketCap is one of the most popular crypto price trackers",
    "💡 The more games you play, the more XP you earn",
    "💡 All your data in ZETA is stored locally on your device",
    "💡 Solana is one of the fastest blockchains",
    "💡 Mark your favorite cryptos with the ⭐ button",
    "💡 Memory game helps improve your concentration",
    "💡 ZETA tools: calculator, stopwatch, QR code and more",
    "💡 Never invest all your money in a single coin",
    "💡 In Space Tunnel, swipe left/right — controls are simple",
    "💡 DYOR — Do Your Own Research before investing",
    "💡 Cube Run 3D — infinite runner, how far can you go?",
    "💡 Crypto markets operate 24/7 — they never close",
    "💡 Crossy Road — cross carefully and collect points!",
    "💡 NFTs are unique digital collectibles on the blockchain",
    "💡 Blockchain is a distributed, decentralized database",
    "💡 ZETA gives you a new tip every day — come back!",
    "💡 Neon Pong — play classic table tennis with neon style",
    "💡 Archery 2D — aim precisely, score big!",
    "💡 Use the password generator for secure passwords",
    "💡 QR Code Generator — turn any link into a QR code",
    "💡 Forest Story — interactive story, every choice matters!",
    "💡 Color Picker — identify HEX and RGB color values",
    "💡 Use the Crypto Calculator for conversions",
    "💡 Escape Road — are you ready to outrun the police?",
    "💡 Mini City — open world with buildings and exploration!"
  ],
  ru: [
    "💡 Биткоин — первая цифровая валюта в мире",
    "💡 Диверсифицируйте портфель — не ставьте всё на одну монету",
    "💡 В Snake стены не убивают — змейка проходит сквозь!",
    "💡 Заходите в ZETA каждый день для бонусов XP",
    "💡 Ethereum поддерживает смарт-контракты",
    "💡 Крипто цены могут резко меняться — будьте осторожны",
    "💡 CoinMarketCap — один из самых популярных трекеров цен",
    "💡 Чем больше игр вы играете, тем больше XP получаете",
    "💡 Все данные в ZETA хранятся локально на устройстве",
    "💡 Solana — один из самых быстрых блокчейнов",
    "💡 Отмечайте любимые крипто кнопкой ⭐",
    "💡 Игра Memory помогает улучшить концентрацию",
    "💡 Инструменты ZETA: калькулятор, секундомер, QR код и др.",
    "💡 Никогда не вкладывайте все деньги в одну монету",
    "💡 В Space Tunnel свайпните влево/вправо — управление простое",
    "💡 DYOR — проведите собственное исследование перед инвестицией",
    "💡 Cube Run 3D — бесконечный бег, как далеко доберётесь?",
    "💡 Крипто рынок работает 24/7 — никогда не закрывается",
    "💡 Crossy Road — переходите дорогу осторожно!",
    "💡 NFT — уникальные цифровые коллекционные предметы",
    "💡 Блокчейн — распределённая децентрализованная база данных",
    "💡 ZETA даёт новый совет каждый день — заходите!",
    "💡 Neon Pong — классический теннис в неоновом стиле",
    "💡 Archery 2D — целься точно, набирай очки!",
    "💡 Генератор паролей создаёт надёжные пароли",
    "💡 Генератор QR кодов — превратите любую ссылку в QR",
    "💡 Лесная история — интерактивная, каждый выбор важен!",
    "💡 Палитра цветов — определяйте HEX и RGB значения",
    "💡 Крипто калькулятор — конвертируйте валюты",
    "💡 Escape Road — готовы убежать от полиции?",
    "💡 Mini City — открытый мир со зданиями и исследованием!"
  ]
};

// ===== DAILY STREAK SYSTEM =====
function checkDailyStreak() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastDate = localStorage.getItem('zeta_streak_date');
  let streak = parseInt(localStorage.getItem('zeta_streak_count') || '0');

  if (lastDate === today) return streak; // Already counted today

  if (lastDate) {
    const last = new Date(lastDate);
    const now = new Date(today);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else if (diffDays > 1) {
      streak = 1; // Reset
    }
  } else {
    streak = 1; // First visit ever
  }

  localStorage.setItem('zeta_streak_date', today);
  localStorage.setItem('zeta_streak_count', streak.toString());

  // Award XP at milestones
  const milestones = { 1: 5, 3: 15, 7: 50, 14: 100, 30: 300 };
  const milestoneKey = `zeta_streak_milestone_${streak}`;
  if (milestones[streak] && !localStorage.getItem(milestoneKey)) {
    localStorage.setItem(milestoneKey, 'true');
    setTimeout(() => {
      if (typeof addXP === 'function') addXP(milestones[streak]);
    }, 1500);
  }

  return streak;
}

function getDailyTip() {
  let lang = 'uz';
  try {
    const s = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
    lang = s.lang || 'uz';
  } catch (e) { }

  const tips = DAILY_TIPS[lang] || DAILY_TIPS.uz;
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return tips[dayOfYear % tips.length];
}

function injectDailyTip() {
  const container = document.getElementById('daily-tip-container');
  const tipText = document.getElementById('daily-tip-text');
  if (!container || !tipText) return;

  const today = new Date().toISOString().split('T')[0];
  const dismissKey = `zeta_tip_dismissed_${today}`;
  if (localStorage.getItem(dismissKey)) {
    container.style.display = 'none';
    return;
  }

  const tip = getDailyTip();
  tipText.textContent = tip;
  container.style.display = 'block';

  // Award XP for first tip view of the day
  const xpKey = `zeta_tip_xp_${today}`;
  if (!localStorage.getItem(xpKey)) {
    localStorage.setItem(xpKey, 'true');
    setTimeout(() => {
      if (typeof addXP === 'function') addXP(5);
    }, 2000);
  }
}

window.dismissTip = function () {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(`zeta_tip_dismissed_${today}`, 'true');
  const el = document.getElementById('daily-tip-container');
  if (el) {
    el.style.transition = 'all 0.3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    setTimeout(() => el.style.display = 'none', 300);
  }
};

function injectStreakBadge() {
  const streak = checkDailyStreak();
  if (streak < 1) return;

  // Find container: either specific one in Settings or the logo area
  let container = document.getElementById('streak-badge-container');
  if (!container) {
    container = document.querySelector('.logo');
  }
  if (!container) return;

  const existing = document.getElementById('streak-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'streak-badge';
  badge.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(239, 68, 68, 0.2));
    border: 1px solid rgba(251, 146, 60, 0.3);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #fb923c;
    align-self: center;
  `;
  badge.innerHTML = `🔥 ${streak} kun`;

  // Update text based on language
  try {
    const s = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
    const lang = s.lang || 'uz';
    const dayText = lang === 'en' ? (streak === 1 ? 'day' : 'days') :
      lang === 'ru' ? (streak === 1 ? 'день' : (streak < 5 ? 'дня' : 'дней')) :
        'kun';
    badge.innerHTML = `🔥 ${streak} ${dayText}`;
  } catch (e) { }

  container.appendChild(badge);
}

// ===== MAIN DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
  // Highlight Active Link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .tab-item").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // XP System check
  if (typeof updateXPDisplay === "undefined") {
    console.log("Main JS loaded — ZETA v0.9");
  }

  // Daily Streak
  injectStreakBadge();

  // Daily Tip (after short delay for smooth UX)
  setTimeout(injectDailyTip, 800);

  // Track tools used (for achievements)
  const page = window.location.pathname.split("/").pop().toLowerCase();
  const toolPages = ['calculator.html', 'color-picker.html', 'crypto-calc.html', 'password-generator.html', 'qr-generator.html', 'stopwatch.html', 'todo.html'];
  if (toolPages.includes(page)) {
    const toolName = page.replace('.html', '');
    const used = JSON.parse(localStorage.getItem('zeta_tools_used') || '[]');
    if (!used.includes(toolName)) {
      used.push(toolName);
      localStorage.setItem('zeta_tools_used', JSON.stringify(used));
    }
  }

  // Track games played (for achievements)
  const gamePages = ['snake.html', 'cube-run.html', 'space-tunnel.html', 'race.html', 'neon-pong.html', 'memory.html', 'clicker.html', 'story.html', 'city.html', 'archery.html', 'escape-road.html', 'crossy-road.html', 'flappy.html'];
  if (gamePages.includes(page)) {
    const gameName = page.replace('.html', '');
    const played = JSON.parse(localStorage.getItem('zeta_games_played') || '[]');
    if (!played.includes(gameName)) {
      played.push(gameName);
      localStorage.setItem('zeta_games_played', JSON.stringify(played));
    }
  }
});
