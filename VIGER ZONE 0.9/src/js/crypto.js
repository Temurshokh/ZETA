// ===== ZETA v0.7 Crypto Market System =====

// State
let selectedCoin = null;
let cryptoData = {};
let chartData = {};
let favorites = JSON.parse(localStorage.getItem('zeta_favorites') || '[]');
let portfolio = JSON.parse(localStorage.getItem('zeta_portfolio') || '{}');
let showOnlyFavorites = false;
let isFirstLoad = true;
let chartModal = null;
let priceUpdateInterval = null;
let portfolioModal = null;

// Chart Themes
const chartThemes = {
  dark: {
    name: 'Dark',
    bg: '#0f172a',
    text: '#ffffff',
    grid: 'rgba(255, 255, 255, 0.05)',
    axis: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(255, 255, 255, 0.1)',
    tooltipBg: 'rgba(0,0,0,0.9)',
    tooltipBorder: 'rgba(255,255,255,0.2)'
  },
  light: {
    name: 'Light',
    bg: '#ffffff',
    text: '#1e293b',
    grid: 'rgba(0, 0, 0, 0.05)',
    axis: 'rgba(30, 41, 59, 0.6)',
    border: 'rgba(0, 0, 0, 0.1)',
    tooltipBg: 'rgba(255,255,255,0.95)',
    tooltipBorder: 'rgba(0,0,0,0.1)'
  },
  navy: {
    name: 'Deep Blue',
    bg: '#001e3c',
    text: '#e0e0e0',
    grid: 'rgba(255, 255, 255, 0.05)',
    axis: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
    tooltipBg: 'rgba(10, 25, 41, 0.95)',
    tooltipBorder: 'rgba(255,255,255,0.2)'
  }
};
let currentChartTheme = localStorage.getItem('zeta_chart_theme') || 'dark';

// Symbols to fetch
// Top symbols for main dashboard
// Top symbols for main dashboard
const symbols = [
  "BTCUSDT", "ETHUSDT", "LTCUSDT", "SOLUSDT", "BNBUSDT", "DOGEUSDT",
  "TONUSDT", "XRPUSDT", "TRXUSDT", "ADAUSDT", "AVAXUSDT"
];

// Extended list including memecoins and mid-caps
const extendedSymbols = [
  ...symbols,
  "SHIBUSDT", "PEPEUSDT", "FLOKIUSDT", "BONKUSDT", "WIFUSDT",
  "TURBOUSDT", "POPCATUSDT", "BRETTUSDT", "MOGUSDT",
  "JUPUSDT", "PYTHUSDT", "TIAUSDT", "SEIUSDT", "ORDIUSDT",
  "SATSUSDT", "1000SATSUSDT", "ENAUSDT", "POLUSDT", "DOTUSDT",
  "AXSUSDT", "FPIUSDT", "XAXUSDT"
];


// Coin metadata with icons
const coinMeta = {
  BTCUSDT: { name: "Bitcoin", icon: "₿", color: "#f7931a" },
  ETHUSDT: { name: "Ethereum", icon: "Ξ", color: "#627eea" },
  BNBUSDT: { name: "BNB", icon: "🟡", color: "#f3ba2f" },
  SOLUSDT: { name: "Solana", icon: "◎", color: "#00ffa3" },
  XRPUSDT: { name: "XRP", icon: "✕", color: "#23292f" },
  DOGEUSDT: { name: "Dogecoin", icon: "Ð", color: "#c2a633" },
  ADAUSDT: { name: "Cardano", icon: "₳", color: "#0033ad" },
  AVAXUSDT: { name: "Avalanche", icon: "🔺", color: "#e84142" },
  TRXUSDT: { name: "Tron", icon: "♦", color: "#ff0013" },
  DOTUSDT: { name: "Polkadot", icon: "●", color: "#e6007a" },
  LINKUSDT: { name: "Chainlink", icon: "🔗", color: "#2a5ada" },
  MATICUSDT: { name: "Polygon", icon: "💜", color: "#8247e5" },
  LTCUSDT: { name: "Litecoin", icon: "Ł", color: "#bfbbbb" },
  BCHUSDT: { name: "Bitcoin Cash", icon: "Ƀ", color: "#8dc351" },
  UNIUSDT: { name: "Uniswap", icon: "🦄", color: "#ff007a" },
  XLMUSDT: { name: "Stellar", icon: "🚀", color: "#14b6e7" },
  ATOMUSDT: { name: "Cosmos", icon: "⚛", color: "#2e3148" },
  TONUSDT: { name: "Toncoin", icon: "💎", color: "#0098ea" },
  NEARUSDT: { name: "NEAR", icon: "∞", color: "#00c08b" },
  APTUSDT: { name: "Aptos", icon: "🌐", color: "#4cd7d0" },
  POLUSDT: { name: "Polygon", icon: "💜", color: "#8247e5" },
  SHIBUSDT: { name: "Shiba Inu", icon: "🐕", color: "#ffa500" },
  PEPEUSDT: { name: "Pepe", icon: "🐸", color: "#00ff00" },
  FLOKIUSDT: { name: "Floki", icon: "⚔️", color: "#cf0000" },
  BONKUSDT: { name: "Bonk", icon: "🐶", color: "#ff8c00" },
  WIFUSDT: { name: "dogwifhat", icon: "Cap", color: "#b08d57" },
  NOTUSDT: { name: "Notcoin", icon: "⬛", color: "#ffffff" },
  TURBOUSDT: { name: "Turbo", icon: "🐌", color: "#ffd700" },
  POPCATUSDT: { name: "Popcat", icon: "🐱", color: "#ffffff" },
  BRETTUSDT: { name: "Brett", icon: "🔵", color: "#0000ff" },
  MOGUSDT: { name: "Mog", icon: "😸", color: "#ffff00" },
  AXSUSDT: { name: "Axie", icon: "⚔️", color: "#00bba8" },
  FPIUSDT: { name: "FPI", icon: "⚡", color: "#6a5acd" },
  XAXUSDT: { name: "XAX", icon: "💎", color: "#ff00ff" }
};

// Format price smartly based on value
function formatPrice(price) {
  const num = parseFloat(price);
  if (isNaN(num) || num === 0) return 'N/A';
  if (num >= 1000) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (num >= 1) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  } else {
    return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  }
}

// Generate Sparkline SVG based on change
function generateSparkline(change) {
  const isPositive = change >= 0;
  const color = isPositive ? 'var(--success)' : 'var(--danger)';
  const points = [];
  const count = 10;

  // Create a randomized but trending path
  let current = 50;
  for (let i = 0; i <= count; i++) {
    const x = (i / count) * 100;
    // Bias towards the change
    const bias = (change / 10) * (i / count);
    current += (Math.random() - 0.5) * 15 + bias;
    current = Math.max(10, Math.min(90, current));
    points.push(`${x},${100 - current}`);
  }

  return `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%;">
      <defs>
        <linearGradient id="grad-${Math.random().toString(36).substr(2, 9)}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="M 0,100 L ${points.join(' L ')} L 100,100 Z" fill="url(#grad-${Math.random().toString(36).substr(2, 9)})" />
      <path d="M ${points.join(' L ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

// Format volume
function formatVolume(volume) {
  const num = parseFloat(volume);
  if (isNaN(num)) return '---';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}



// Top Gainers Only (v0.6 Optimization)
function renderGainersLosers() {
  const container = document.getElementById('gainers-losers');
  if (!container || Object.keys(cryptoData).length === 0) return;

  const sorted = Object.values(cryptoData).sort((a, b) =>
    parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
  );

  const gainers = sorted.slice(0, 4);

  container.innerHTML = `
    <div style="width: 100%;">
        <div style="font-size: 0.85rem; color: var(--success); margin-bottom: 0.6rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
          <i class="fas fa-fire"></i> Top Gainers (24s)
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
          ${gainers.map(t => {
    const info = coinMeta[t.symbol] || { name: t.symbol, icon: '💰' };
    return `
              <div onclick="selectCoin('${t.symbol}')" style="
                display: flex; justify-content: space-between; align-items: center;
                padding: 10px 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.1); border-radius: 12px;
                cursor: pointer; transition: all 0.2s;
              ">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.1rem;">${info.icon}</span>
                  <span style="font-weight: 600; font-size: 0.9rem;">${t.symbol.replace('USDT', '')}</span>
                </span>
                <span style="color: var(--success); font-weight: 700; font-size: 0.85rem;">
                  +${parseFloat(t.priceChangePercent).toFixed(1)}%
                </span>
              </div>
            `;
  }).join('')}
        </div>
    </div>
  `;
}

// Check if coin is favorite
function isFavorite(symbol) {
  return favorites.includes(symbol);
}

// Toggle favorite
function toggleFavorite(symbol) {
  if (isFavorite(symbol)) {
    favorites = favorites.filter(s => s !== symbol);
  } else {
    favorites.push(symbol);
    if (window.showNotification) showNotification(`Sevgililarga qo'shildi: ${symbol.replace('USDT', '')}`, 'success');
  }
  localStorage.setItem('zeta_favorites', JSON.stringify(favorites));
  updateFavoriteUI(symbol);

  // Re-order cards in DOM: favorites first
  const container = document.getElementById('crypto-container');
  if (container) {
    symbols.sort((a, b) => {
      const fa = isFavorite(a);
      const fb = isFavorite(b);
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      return 0;
    });
    symbols.forEach(sym => {
      const card = document.getElementById(`coin-${sym.replace('USDT', '')}`);
      if (card) container.appendChild(card);
    });
  }

  applyFilters();
}

// Update favorite UI on card
function updateFavoriteUI(symbol) {
  const btn = document.querySelector(`#coin-${symbol.replace('USDT', '')} .card-favorite`);
  if (btn) {
    btn.classList.toggle('active', isFavorite(symbol));
    btn.querySelector('i').className = isFavorite(symbol) ? 'fas fa-star' : 'far fa-star';
  }
}

// Create skeleton card for loading state
function createSkeletonCard(container, sym) {
  const symbol = sym.replace('USDT', '');
  const info = coinMeta[sym] || { name: symbol, icon: "💰" };

  const card = document.createElement('div');
  card.id = `coin-${symbol}`;
  card.className = 'glass-panel crypto-card loading';
  // Styles moved to CSS class for better responsiveness and stability

  card.innerHTML = `
    <button class="card-favorite ${isFavorite(sym) ? 'active' : ''}" 
            onclick="event.stopPropagation(); toggleFavorite('${sym}')" 
            title="Sevgilim">
      <i class="${isFavorite(sym) ? 'fas' : 'far'} fa-star"></i>
    </button>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 600; color: white; display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-size: 1.2rem;">${info.icon}</span>
        ${info.name}
      </span>
      <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${symbol}</span>
    </div>
    <div class="skeleton-text" style="height: 1.4rem; width: 60%; background: rgba(255,255,255,0.1); border-radius: 4px; animation: pulse 1.5s infinite;"></div>
    <div class="skeleton-text" style="height: 0.9rem; width: 40%; background: rgba(255,255,255,0.08); border-radius: 4px; animation: pulse 1.5s infinite;"></div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-favorite')) return;
    if (cryptoData[sym]) {
      selectCoin(sym);
    }
  });

  container.appendChild(card);
  return card;
}

// Render a single crypto card
function renderCard(container, ticker) {
  const symbol = ticker.symbol.replace('USDT', '');
  const info = coinMeta[ticker.symbol] || { name: symbol, icon: "💰", color: "#888" };
  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;
  const priceNum = parseFloat(ticker.lastPrice);

  let card = document.getElementById(`coin-${symbol}`);

  if (!card) {
    card = document.createElement('div');
    card.id = `coin-${symbol}`;
    card.className = 'glass-panel crypto-card';

    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-favorite')) return;
      selectCoin(ticker.symbol);
    });
  }

  // Re-append to ensure DOM order matches logic (e.g. favorites first)
  container.appendChild(card);

  card.classList.remove('loading');

  const isSelected = selectedCoin && selectedCoin.symbol === ticker.symbol;
  card.classList.toggle('selected', isSelected);

  card.innerHTML = `
    <button class="card-favorite ${isFavorite(ticker.symbol) ? 'active' : ''}" 
            onclick="event.stopPropagation(); toggleFavorite('${ticker.symbol}')" 
            title="Sevgilim">
      <i class="${isFavorite(ticker.symbol) ? 'fas' : 'far'} fa-star"></i>
    </button>
    <div style="display: flex; justify-content: space-between; align-items: start;">
      <span style="font-weight: 600; color: white; display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-size: 1.2rem;">${info.icon}</span>
        ${info.name}
      </span>
      <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">${symbol}</span>
    </div>
    
    <div style="margin: 0.75rem 0;">
      <div class="price-container" style="display: flex; align-items: baseline; gap: 4px;">
        <span style="font-size: 1.4rem; font-weight: 700; color: #fff;">$${formatPrice(priceNum)}</span>
        <div class="update-pulse ${Math.random() > 0.5 ? 'active' : ''}"></div>
      </div>
      <div style="font-size: 0.85rem; color: ${isPositive ? 'var(--success)' : 'var(--danger)'}; font-weight: 600; display: flex; align-items: center; gap: 4px;">
        ${isPositive ? '<i class="fas fa-caret-up"></i>' : '<i class="fas fa-caret-down"></i>'} 
        ${Math.abs(parseFloat(ticker.priceChangePercent)).toFixed(2)}%
      </div>
    </div>

    <!-- Sparkline Simulator -->
    <div style="height: 35px; width: 100%; margin-top: 5px; opacity: 0.8;">
      ${generateSparkline(parseFloat(ticker.priceChangePercent))}
    </div>
  `;
}

// Select a coin and show details
function selectCoin(symbol) {
  const ticker = cryptoData[symbol];
  if (!ticker) return;

  selectedCoin = ticker;

  document.querySelectorAll('.crypto-card').forEach(card => {
    card.classList.remove('selected');
  });
  const selectedCard = document.getElementById(`coin-${symbol.replace('USDT', '')}`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  updateMarketDetails(ticker);
}

// Update market details panel with chart button
function updateMarketDetails(ticker) {
  const panel = document.getElementById('market-details');
  if (!panel) return;

  const info = coinMeta[ticker.symbol] || { name: ticker.symbol, icon: "💰" };
  const symbol = ticker.symbol.replace('USDT', '');
  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;
  const priceNum = parseFloat(ticker.lastPrice);

  panel.style.display = 'block';

  document.getElementById('detail-name').innerHTML = `${info.icon} ${info.name} — <span style="color: var(--text-muted)">${symbol}</span>`;

  const priceEl = document.getElementById('detail-price');
  priceEl.textContent = `$${formatPrice(priceNum)}`;
  priceEl.style.cursor = 'pointer';
  priceEl.title = 'Nusxalash uchun bosing';
  priceEl.onclick = () => copyPrice(priceNum);

  const changeEl = document.getElementById('detail-change');
  changeEl.textContent = `${isPositive ? '▲' : '▼'} ${Math.abs(parseFloat(ticker.priceChangePercent)).toFixed(2)}%`;
  changeEl.className = `detail-value ${isPositive ? 'positive' : 'negative'}`;

  document.getElementById('detail-high').textContent = `$${formatPrice(ticker.highPrice)}`;
  document.getElementById('detail-low').textContent = `$${formatPrice(ticker.lowPrice)}`;
  document.getElementById('detail-volume').textContent = formatVolume(parseFloat(ticker.volume) * priceNum);
  document.getElementById('detail-updated').textContent = new Date().toLocaleTimeString();

  // Add chart button if not exists
  let chartBtn = document.getElementById('open-chart-btn');
  if (!chartBtn) {
    const actionsDiv = document.querySelector('.market-details-actions');
    if (actionsDiv) {
      actionsDiv.innerHTML = `
        <button id="open-chart-btn" class="btn btn-glass" onclick="openChartModal('${ticker.symbol}')">
          <i class="fas fa-chart-line"></i> Grafik
        </button>
        <button class="btn btn-glass" onclick="openPortfolioModal('${ticker.symbol}')" style="border-color: var(--success); color: var(--success);">
          <i class="fas fa-wallet"></i> Portfolio
        </button>
        <button class="btn btn-glass btn-icon" onclick="copyPrice(${priceNum})">
          <i class="fas fa-copy"></i>
        </button>
      `;
    }
  } else {
    chartBtn.onclick = () => openChartModal(ticker.symbol);
    // Update portfolio button handler too if it exists, though usually it regenerates
    const pfBtn = document.querySelector('.market-details-actions button:nth-child(2)');
    if (pfBtn) pfBtn.onclick = () => openPortfolioModal(ticker.symbol);
  }
}

// Portfolio Modal System
function openPortfolioModal(symbol) {
  const ticker = cryptoData[symbol];
  if (!ticker) return;
  const currentPrice = parseFloat(ticker.lastPrice);
  const info = coinMeta[symbol] || { name: symbol, icon: "💰" };
  const currentData = portfolio[symbol] || { amount: 0 };

  // Create modal if needed
  if (!portfolioModal) {
    portfolioModal = document.createElement('div');
    portfolioModal.id = 'portfolio-modal';
    portfolioModal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10001;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(portfolioModal);
  }

  portfolioModal.innerHTML = `
    <div class="glass-panel" style="width: 90%; max-width: 380px; padding: 24px; border: 1px solid var(--glass-border); box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: scale(0.95); transition: transform 0.3s; background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="margin:0; display: flex; align-items: center; gap: 10px; color: white;">
                <span style="font-size: 1.5rem;">${info.icon}</span> ${info.name} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">${symbol.replace('USDT', '')}</span>
            </h3>
            <button onclick="closePortfolioModal()" style="background:none; border:none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; padding: 5px;"><i class="fas fa-times"></i></button>
        </div>
        
        <div style="margin-bottom: 24px;">
            <label style="display: block; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500;">Joriy Miqdor (Amount)</label>
            <div style="position: relative;">
                <input type="number" id="portfolio-amount" value="${currentData.amount > 0 ? currentData.amount : ''}" placeholder="0.00" 
                    style="width: 100%; padding: 14px; padding-right: 60px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 12px; color: white; font-size: 1.2rem; outline: none; transition: border-color 0.2s;"
                    onfocus="this.style.borderColor='var(--primary-accent)'" onblur="this.style.borderColor='var(--glass-border)'"
                    oninput="calculatePortfolioValue(${currentPrice})">
                <span style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">${symbol.replace('USDT', '')}</span>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 0.95rem; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px;">
            <span style="color: var(--text-muted);">Joriy qiymat:</span>
            <span id="portfolio-calc-value" style="font-weight: 700; color: white;">$${formatPrice(currentData.amount * currentPrice)}</span>
        </div>
        
        <div id="portfolio-error" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 15px; display: none; padding: 10px; background: rgba(239,68,68,0.1); border-radius: 8px;">
            <i class="fas fa-exclamation-triangle"></i> Qiymat $1.1M dan oshmasligi kerak!
        </div>
        
        <div style="display: flex; gap: 10px;">
             ${currentData.amount > 0 ? `
            <button onclick="document.getElementById('portfolio-amount').value = 0; savePortfolio('${symbol}')" style="flex: 1; background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); padding: 12px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: background 0.2s;">
                <i class="fas fa-trash-alt"></i> O'chirish
            </button>
            ` : ''}
            <button onclick="savePortfolio('${symbol}')" class="btn btn-primary" style="flex: 2; justify-content: center; padding: 12px; font-size: 1rem;">
                <i class="fas fa-check"></i> Saqlash
            </button>
        </div>
    </div>
  `;

  portfolioModal.style.display = 'flex';
  setTimeout(() => {
    portfolioModal.style.opacity = '1';
    portfolioModal.querySelector('.glass-panel').style.transform = 'scale(1)';
    const input = document.getElementById('portfolio-amount');
    input.focus();
    // Select all text if exists
    if (input.value) input.select();
    calculatePortfolioValue(currentPrice);
  }, 10);
}

function closePortfolioModal() {
  if (portfolioModal) {
    portfolioModal.style.opacity = '0';
    portfolioModal.querySelector('.glass-panel').style.transform = 'scale(0.95)';
    setTimeout(() => portfolioModal.style.display = 'none', 300);
  }
}

function calculatePortfolioValue(price) {
  const input = document.getElementById('portfolio-amount');
  const valEl = document.getElementById('portfolio-calc-value');
  const errEl = document.getElementById('portfolio-error');

  let amount = parseFloat(input.value);
  if (isNaN(amount) || amount < 0) amount = 0;

  const value = amount * price;
  valEl.textContent = `$${formatPrice(value)}`;

  // Validate max value (approx 1.1M USD)
  if (value > 1100000) {
    errEl.style.display = 'block';
    valEl.style.color = '#ef4444';
    input.style.borderColor = '#ef4444';
  } else {
    errEl.style.display = 'none';
    valEl.style.color = 'white';
    input.style.borderColor = 'var(--glass-border)';
  }
}

function savePortfolio(symbol) {
  const input = document.getElementById('portfolio-amount');
  let amount = parseFloat(input.value);
  if (isNaN(amount) || amount < 0) amount = 0;

  const ticker = cryptoData[symbol];
  const price = parseFloat(ticker.lastPrice);

  if (amount * price > 1100000) {
    // Block save if invalid
    const errEl = document.getElementById('portfolio-error');
    errEl.style.display = 'block';
    const panel = portfolioModal.querySelector('.glass-panel');
    // Shake effect
    panel.style.transform = 'translateX(5px)';
    setTimeout(() => panel.style.transform = 'translateX(-5px)', 50);
    setTimeout(() => panel.style.transform = 'translateX(5px)', 100);
    setTimeout(() => panel.style.transform = 'translateX(0) scale(1)', 150);
    return;
  }

  if (amount === 0) {
    if (portfolio[symbol]) {
      delete portfolio[symbol];
      if (window.showNotification) showNotification(`O'chirildi: ${symbol.replace('USDT', '')}`, 'success');
    }
  } else {
    // "Set" logic with weighted avg update
    let oldData = portfolio[symbol] || { amount: 0, avgPrice: 0 };
    let oldAmount = oldData.amount;
    let delta = amount - oldAmount;

    if (oldAmount === 0 || portfolio[symbol] === undefined) {
      // New entry
      portfolio[symbol] = { amount: amount, avgPrice: price };
    } else {
      if (delta > 0) {
        // Bought more: update avg price
        let oldCost = oldAmount * oldData.avgPrice;
        let addCost = delta * price;
        let newAvg = (oldCost + addCost) / amount;
        portfolio[symbol] = { amount: amount, avgPrice: newAvg };
      } else {
        // Sold/Reduced: keep old avg price
        portfolio[symbol] = { amount: amount, avgPrice: oldData.avgPrice };
      }
    }
    if (window.showNotification) showNotification(`Saqlandi: ${amount} ${symbol.replace('USDT', '')}`, 'success');
  }

  localStorage.setItem('zeta_portfolio', JSON.stringify(portfolio));
  renderPortfolio();
  closePortfolioModal();
}

function renderPortfolio() {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  const symbols = Object.keys(portfolio);
  if (symbols.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  let totalValue = 0;
  let totalCost = 0;

  const html = symbols.map(sym => {
    const data = portfolio[sym];
    const ticker = cryptoData[sym];
    const currentPrice = ticker ? parseFloat(ticker.lastPrice) : data.avgPrice;
    const value = data.amount * currentPrice;
    const cost = data.amount * data.avgPrice;
    const profit = value - cost;
    const profitPerc = cost > 0 ? (profit / cost) * 100 : 0;

    totalValue += value;
    totalCost += cost;

    const info = coinMeta[sym] || { icon: '💰' };

    return `
      <div class="portfolio-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--glass-border); margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">${info.icon}</span>
          <div>
            <div style="font-weight: 600;">${sym.replace('USDT', '')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${data.amount.toFixed(4)}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700;">$${formatPrice(value)}</div>
          <div style="font-size: 0.75rem; color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'};">
            ${profit >= 0 ? '+' : ''}${profitPerc.toFixed(1)}% ($${Math.abs(profit).toFixed(2)})
          </div>
        </div>
      </div>
    `;
  }).join('');

  const totalProfit = totalValue - totalCost;
  const totalProfitPerc = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  container.innerHTML = `
    <div class="glass-panel" style="margin-bottom: 1.5rem; padding: 1.2rem; border-color: hsla(280, 80%, 60%, 0.3);">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.2rem;">
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Sizning Portfelingiz</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 2px;">$${formatPrice(totalValue)}</div>
        </div>
        <div style="text-align: right;">
           <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Umumiy Foyda</div>
           <div style="padding: 4px 10px; background: ${totalProfit >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; color: ${totalProfit >= 0 ? 'var(--success)' : 'var(--danger)'}; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block;">
             ${totalProfit >= 0 ? '▲' : '▼'} ${totalProfitPerc.toFixed(2)}%
           </div>
        </div>
      </div>
      <div class="portfolio-list" style="max-height: 200px; overflow-y: auto; padding-right: 5px;">
        ${html}
      </div>
    </div>
  `;
}

// Copy price to clipboard
function copyPrice(price) {
  const text = `$${formatPrice(price)}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Narx nusxalandi: ' + text);
  });
}

// Show toast notification
function showToast(message) {
  let toast = document.getElementById('crypto-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'crypto-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 500;
      z-index: 10000;
      transition: transform 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 2000);
}

// Chart Modal System
function openChartModal(symbol) {
  const ticker = cryptoData[symbol];
  if (!ticker) return;

  const info = coinMeta[symbol] || { name: symbol, icon: "💰" };
  const isPositive = parseFloat(ticker.priceChangePercent) >= 0;

  // Create modal if not exists
  if (!chartModal) {
    chartModal = document.createElement('div');
    chartModal.id = 'chart-modal';
    chartModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transition: opacity 0.3s ease, background 0.3s ease;
    `;
    document.body.appendChild(chartModal);
  }

  // Apply Theme
  const theme = chartThemes[currentChartTheme];
  chartModal.style.background = theme.bg;
  chartModal.style.color = theme.text;

  // Disable body scroll
  document.body.style.overflow = 'hidden';

  chartModal.innerHTML = `
    <div style="padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${theme.border};">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">${info.icon}</span>
        <div>
          <div style="font-weight: 600; font-size: 1.1rem;">${info.name}</div>
          <div style="opacity: 0.7; font-size: 0.85rem;">${symbol.replace('USDT', '')}/USDT</div>
        </div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <button onclick="toggleChartTheme()" class="btn btn-glass" style="padding: 6px 12px; font-size: 0.8rem; background: rgba(125,125,125,0.1); border-color: ${theme.border}; color: inherit;">
           <i class="fas fa-palette"></i> ${theme.name}
        </button>
        <button onclick="closeChartModal()" style="background: rgba(125,125,125,0.1); border: none; color: inherit; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    <!-- Price Info -->
    <div style="padding: 15px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <div style="font-size: 2rem; font-weight: 700;" id="modal-price">$${formatPrice(ticker.lastPrice)}</div>
        <div style="color: ${isPositive ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">
          ${isPositive ? '▲' : '▼'} ${Math.abs(parseFloat(ticker.priceChangePercent)).toFixed(2)}%
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        <div style="text-align: center; padding: 8px 15px; background: rgba(16,185,129,0.1); border-radius: 8px;">
          <div style="font-size: 0.7rem; color: var(--text-muted);">24h High</div>
          <div style="font-weight: 600; color: var(--success);">$${formatPrice(ticker.highPrice)}</div>
        </div>
        <div style="text-align: center; padding: 8px 15px; background: rgba(239,68,68,0.1); border-radius: 8px;">
          <div style="font-size: 0.7rem; color: var(--text-muted);">24h Low</div>
          <div style="font-weight: 600; color: var(--danger);">$${formatPrice(ticker.lowPrice)}</div>
        </div>
      </div>
    </div>
    
    <!-- Time Period Selector -->
    <div style="padding: 0 15px; display: flex; gap: 8px; margin-bottom: 10px;">
      <button class="chart-period active" data-period="1h" onclick="loadChartData('${symbol}', '1h', this)">1H</button>
      <button class="chart-period" data-period="24h" onclick="loadChartData('${symbol}', '24h', this)">24H</button>
      <button class="chart-period" data-period="7d" onclick="loadChartData('${symbol}', '7d', this)">7D</button>
      <button class="chart-period" data-period="1m" onclick="loadChartData('${symbol}', '1m', this)">1M</button>
    </div>
    
    <!-- Chart Container -->
    <div style="flex: 1; padding: 15px; position: relative; min-height: 250px;">
      <div id="chart-loading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--text-muted);">
        <i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...
      </div>
      <canvas id="price-chart" style="width: 100%; height: 100%;"></canvas>
      <div id="chart-tooltip" style="
        display: none;
        position: absolute;
        background: ${theme.tooltipBg};
        border: 1px solid ${theme.tooltipBorder};
        padding: 10px;
        border-radius: 8px;
        pointer-events: none;
        z-index: 100;
        font-size: 0.85rem;
      "></div>
    </div>
    
    <!-- Actions -->
    <div style="padding: 15px; display: flex; gap: 10px; border-top: 1px solid ${theme.border};">
      <button class="btn btn-glass" style="flex: 1; border-color: ${theme.border}; color: inherit;" onclick="toggleChartMode()">
        <i class="fas fa-chart-bar" id="chart-mode-icon"></i> <span id="chart-mode-text">Candles</span>
      </button>
      <button class="btn btn-glass" style="flex: 1; border-color: ${theme.border}; color: inherit;" onclick="resetChartView()">
        <i class="fas fa-undo"></i> Reset
      </button>
      <button class="btn btn-glass" style="border-color: ${theme.border}; color: inherit;" onclick="toggleFullscreen()">
        <i class="fas fa-expand"></i>
      </button>
    </div>
  `;

  // Add chart period button styles with theme awareness
  const style = document.createElement('style');
  style.textContent = `
    .chart-period {
      background: rgba(125,125,125,0.1);
      border: 1px solid ${theme.border};
      color: inherit;
      opacity: 0.7;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }
    .chart-period:hover {
      background: rgba(125,125,125,0.2);
    }
    .chart-period.active {
      background: var(--primary-accent);
      color: white;
      border-color: var(--primary-accent);
    }
  `;
  chartModal.appendChild(style);

  chartModal.style.display = 'flex';
  setTimeout(() => chartModal.style.opacity = '1', 10);

  // Load initial chart data
  loadChartData(symbol, '1h');
}

function closeChartModal() {
  if (chartModal) {
    chartModal.style.opacity = '0';
    setTimeout(() => {
      chartModal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scroll
    }, 300);
  }
}

// Chart rendering state
let chartMode = 'line'; // 'line' or 'candle'
let currentChartData = [];

function toggleChartMode() {
  chartMode = chartMode === 'line' ? 'candle' : 'line';
  document.getElementById('chart-mode-text').textContent = chartMode === 'line' ? 'Candles' : 'Line';
  document.getElementById('chart-mode-icon').className = chartMode === 'line' ? 'fas fa-chart-bar' : 'fas fa-chart-line';
  renderChart();
}

function resetChartView() {
  renderChart();
}

function toggleFullscreen() {
  if (chartModal) {
    if (!document.fullscreenElement) {
      chartModal.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}

function toggleChartTheme() {
  const themes = ['dark', 'light', 'navy'];
  const nextIndex = (themes.indexOf(currentChartTheme) + 1) % themes.length;
  currentChartTheme = themes[nextIndex];
  localStorage.setItem('zeta_chart_theme', currentChartTheme);

  // Re-open/update modal logic without full reload if possible, but simplest is to just re-render content
  // Actually, let's just update styles and header to avoid api re-fetch if not needed
  // But openChartModal does weird innerHTML replacement. 
  // Let's just update the DOM elements directly if they exist

  const theme = chartThemes[currentChartTheme];
  if (chartModal) {
    chartModal.style.background = theme.bg;
    chartModal.style.color = theme.text;

    // Update border colors
    chartModal.querySelectorAll('[style*="border-bottom"]').forEach(el => {
      el.style.borderBottomColor = theme.border;
    });

    // Update buttons
    const themeBtn = chartModal.querySelector('button i.fa-palette').parentNode;
    themeBtn.innerHTML = `<i class="fas fa-palette"></i> ${theme.name}`;
    themeBtn.style.borderColor = theme.border;

    // Re-render chart to update canvas colors
    renderChart();
  }
}

// Load chart data from Binance
async function loadChartData(symbol, period, btn) {
  // Update active button
  if (btn) {
    document.querySelectorAll('.chart-period').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  const loading = document.getElementById('chart-loading');
  if (loading) loading.style.display = 'block';

  // Map period to Binance interval and limit
  const periodMap = {
    '1h': { interval: '1m', limit: 60 },
    '24h': { interval: '15m', limit: 96 },
    '7d': { interval: '1h', limit: 168 },
    '1m': { interval: '4h', limit: 180 }
  };

  const { interval, limit } = periodMap[period] || periodMap['24h'];

  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    const data = await response.json();

    currentChartData = data.map(k => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5])
    }));

    renderChart();
  } catch (error) {
    console.error('Chart data error:', error);
    // Generate mock data as fallback
    generateMockChartData(symbol, limit);
    renderChart();
  }

  if (loading) loading.style.display = 'none';
}

function generateMockChartData(symbol, count) {
  const ticker = cryptoData[symbol];
  const basePrice = ticker ? parseFloat(ticker.lastPrice) : 1000;
  currentChartData = [];

  let price = basePrice * (0.95 + Math.random() * 0.1);
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const change = (Math.random() - 0.5) * (price * 0.02);
    const open = price;
    price += change;
    const close = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    currentChartData.push({
      time: now - i * 60000,
      open, high, low, close,
      volume: Math.random() * 1000000
    });
  }
}

function renderChart() {
  const canvas = document.getElementById('price-chart');
  if (!canvas || currentChartData.length === 0) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height - 20;

  const width = canvas.width;
  const height = canvas.height;
  const padding = { top: 20, right: 60, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  // Find min/max
  let minPrice = Infinity, maxPrice = -Infinity;
  currentChartData.forEach(d => {
    minPrice = Math.min(minPrice, d.low);
    maxPrice = Math.max(maxPrice, d.high);
  });

  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1;
  minPrice -= pricePadding;
  maxPrice += pricePadding;

  const xScale = chartWidth / (currentChartData.length - 1 || 1);
  const yScale = chartHeight / (maxPrice - minPrice);

  // Determine color based on overall trend
  const isUp = currentChartData[currentChartData.length - 1].close >= currentChartData[0].open;
  const mainColor = isUp ? '#10b981' : '#ef4444';

  if (chartMode === 'line') {
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);

    currentChartData.forEach((d, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + (maxPrice - d.close) * yScale;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(padding.left + (currentChartData.length - 1) * xScale, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    currentChartData.forEach((d, i) => {
      const x = padding.left + i * xScale;
      const y = padding.top + (maxPrice - d.close) * yScale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    ctx.stroke();

  } else {
    // Candlestick mode
    const candleWidth = Math.max(2, xScale * 0.6);

    currentChartData.forEach((d, i) => {
      const x = padding.left + i * xScale;
      const isGreen = d.close >= d.open;
      const color = isGreen ? '#10b981' : '#ef4444';

      const highY = padding.top + (maxPrice - d.high) * yScale;
      const lowY = padding.top + (maxPrice - d.low) * yScale;
      const openY = padding.top + (maxPrice - d.open) * yScale;
      const closeY = padding.top + (maxPrice - d.close) * yScale;

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });
  }

  // Draw price axis
  const theme = chartThemes[currentChartTheme];
  ctx.fillStyle = theme.axis;
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';

  const priceSteps = 5;
  for (let i = 0; i <= priceSteps; i++) {
    const price = minPrice + (maxPrice - minPrice) * (1 - i / priceSteps);
    const y = padding.top + i * (chartHeight / priceSteps);
    ctx.fillText('$' + formatPrice(price), width - 5, y + 3);

    // Grid line
    ctx.strokeStyle = theme.grid;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  // Setup tooltip
  setupChartTooltip(canvas, currentChartData, xScale, yScale, minPrice, maxPrice, padding);
}

function setupChartTooltip(canvas, data, xScale, yScale, minPrice, maxPrice, padding) {
  const tooltip = document.getElementById('chart-tooltip');
  if (!tooltip) return;

  const showTooltip = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const index = Math.round((x - padding.left) / xScale);

    if (index >= 0 && index < data.length) {
      const d = data[index];
      const change = ((d.close - d.open) / d.open * 100).toFixed(2);
      const isUp = d.close >= d.open;

      tooltip.innerHTML = `
        <div style="margin-bottom: 5px; color: var(--text-muted);">
          ${new Date(d.time).toLocaleString()}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
          <span>Open:</span><span>$${formatPrice(d.open)}</span>
          <span>High:</span><span style="color: var(--success);">$${formatPrice(d.high)}</span>
          <span>Low:</span><span style="color: var(--danger);">$${formatPrice(d.low)}</span>
          <span>Close:</span><span>$${formatPrice(d.close)}</span>
        </div>
        <div style="margin-top: 5px; color: ${isUp ? 'var(--success)' : 'var(--danger)'};">
          ${isUp ? '▲' : '▼'} ${Math.abs(change)}%
        </div>
      `;

      tooltip.style.display = 'block';
      tooltip.style.left = Math.min(x + 10, rect.width - 150) + 'px';
      tooltip.style.top = '50px';

      const theme = chartThemes[currentChartTheme];
      tooltip.style.background = theme.tooltipBg;
      tooltip.style.borderColor = theme.tooltipBorder;
      tooltip.querySelector('div').style.color = theme.text;
    }
  };

  const hideTooltip = () => {
    tooltip.style.display = 'none';
  };

  canvas.onmousemove = showTooltip;
  canvas.ontouchmove = showTooltip;
  canvas.onmouseleave = hideTooltip;
  canvas.ontouchend = hideTooltip;
}

// Apply search filter (v0.6 Optimized)
function applyFilters() {
  const searchInput = document.getElementById('crypto-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  symbols.forEach((sym, index) => {
    const symbol = sym.replace('USDT', '').toLowerCase();
    const card = document.getElementById(`coin-${sym.replace('USDT', '')}`);
    if (!card) return;

    const info = coinMeta[sym] || { name: symbol };
    const matchesSearch = !searchTerm ||
      symbol.includes(searchTerm) ||
      info.name.toLowerCase().includes(searchTerm);

    // v0.6 Rule: Initially show only top 8 if no search active
    const isInitialSet = index < 8;
    const isVisible = matchesSearch && (searchTerm !== '' || isInitialSet);

    card.classList.toggle('hidden', !isVisible);
  });
}

// Create initial skeleton cards
function createInitialSkeletons(container) {
  container.innerHTML = '';
  symbols.forEach(sym => {
    createSkeletonCard(container, sym);
  });
}

// Fetch crypto prices from Binance API
async function fetchCryptoPrices() {
  const container = document.getElementById('crypto-container');
  if (!container) return;

  if (isFirstLoad && container.querySelector('.skeleton-loader')) {
    createInitialSkeletons(container);
  }

  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(extendedSymbols)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    // Sort main symbols list: favorites first
    symbols.sort((a, b) => {
      const fa = isFavorite(a);
      const fb = isFavorite(b);
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      return 0;
    });

    extendedSymbols.forEach(sym => {
      const ticker = data ? data.find(item => item.symbol === sym) : null;

      if (!ticker) {
        if (sym === "FPIUSDT") {
          cryptoData[sym] = {
            symbol: sym,
            lastPrice: "1.00",
            priceChangePercent: "0.00",
            highPrice: "1.02",
            lowPrice: "0.98",
            volume: "1000000"
          };
        }
        return;
      }
      cryptoData[sym] = ticker;
    });

    // Render in sorted order
    symbols.forEach(sym => {
      if (cryptoData[sym]) {
        renderCard(container, cryptoData[sym]);
      }
    });

    if (selectedCoin && cryptoData[selectedCoin.symbol]) {
      selectedCoin = cryptoData[selectedCoin.symbol];
      updateMarketDetails(selectedCoin);
    }

    applyFilters();
    renderGainersLosers();
    renderPortfolio();

    isFirstLoad = false;

  } catch (error) {
    console.warn('API Error, using mock data:', error);
    if (Object.keys(cryptoData).length === 0) {
      startDynamicMockData(container);
    }
  }
}

// Dynamic mock data for offline/demo mode
let mockInterval;
function startDynamicMockData(container) {
  if (mockInterval) clearInterval(mockInterval);

  const mockPrices = {};
  extendedSymbols.forEach(sym => {
    let base = 100;

    if (sym.startsWith('BTC')) base = 87000;
    else if (sym.startsWith('ETH')) base = 3200;
    else if (sym.startsWith('SOL')) base = 180;
    else if (sym.startsWith('TON')) base = 5.5;
    else if (sym.startsWith('BNB')) base = 650;
    else if (sym.startsWith('DOGE')) base = 0.12;
    else if (sym.startsWith('XRP')) base = 2.5;
    else if (sym.startsWith('ADA')) base = 0.75;

    else if (sym.startsWith('NOT')) base = 0.007;
    else if (sym.startsWith('FPI')) base = 1.0;
    else if (sym.startsWith('XAX')) base = 0.05;

    mockPrices[sym] = {
      symbol: sym,
      lastPrice: base.toString(),
      priceChangePercent: (Math.random() * 10 - 5).toString(),
      highPrice: (base * 1.05).toString(),
      lowPrice: (base * 0.95).toString(),
      volume: (Math.random() * 1000000000).toString()
    };
  });

  const update = () => {
    extendedSymbols.forEach(sym => {
      const current = mockPrices[sym];
      if (!current) return;
      const move = (Math.random() - 0.5) * (parseFloat(current.lastPrice) * 0.005);
      current.lastPrice = (parseFloat(current.lastPrice) + move).toString();
      current.priceChangePercent = (parseFloat(current.priceChangePercent) + (Math.random() - 0.5) * 0.1).toString();

      cryptoData[sym] = current;
      if (symbols.includes(sym)) {
        renderCard(container, current);
      }
    });

    if (selectedCoin && cryptoData[selectedCoin.symbol]) {
      selectedCoin = cryptoData[selectedCoin.symbol];
      updateMarketDetails(selectedCoin);
    }

    applyFilters();
    renderGainersLosers();
    renderPortfolio();
  };

  update();
  mockInterval = setInterval(update, 3000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('crypto-container');
  if (!container) return;

  createInitialSkeletons(container);
  fetchCryptoPrices();

  // Auto-refresh every 30 seconds (configurable)
  const refreshInterval = parseInt(localStorage.getItem('zeta_crypto_refresh') || '30') * 1000;
  priceUpdateInterval = setInterval(fetchCryptoPrices, refreshInterval);

  // Search input handler
  const searchInput = document.getElementById('crypto-search');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Favorites toggle handler
  const favToggle = document.getElementById('favorites-toggle');
  if (favToggle) {
    favToggle.addEventListener('click', () => {
      showOnlyFavorites = !showOnlyFavorites;
      favToggle.classList.toggle('active', showOnlyFavorites);
      favToggle.querySelector('i').className = showOnlyFavorites ? 'fas fa-star' : 'far fa-star';
      applyFilters();
    });
  }
});

// Add CSS animation for skeleton pulse
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  .crypto-card.loading {
    pointer-events: none;
  }
  .recent-chip:hover {
    background: rgba(255,255,255,0.1) !important;
    border-color: var(--primary-accent) !important;
  }
`;
document.head.appendChild(style);

// Expose functions globally

window.selectCoin = selectCoin;
window.toggleFavorite = toggleFavorite;
window.openChartModal = openChartModal;
window.closeChartModal = closeChartModal;
window.loadChartData = loadChartData;
window.toggleChartMode = toggleChartMode;
window.resetChartView = resetChartView;
window.toggleFullscreen = toggleFullscreen;
window.copyPrice = copyPrice;
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;
window.savePortfolio = savePortfolio;
window.calculatePortfolioValue = calculatePortfolioValue;
// Full List Modal Functionality
function openFullListModal() {
  const modal = document.getElementById('all-coins-modal');
  const container = document.getElementById('all-coins-container');
  if (!modal || !container) return;

  container.innerHTML = '';

  // Render ALL extended symbols and sort
  const sortedSymbols = [...extendedSymbols]
    .sort((a, b) => {
      const nameA = (coinMeta[a]?.name || a).toLowerCase();
      const nameB = (coinMeta[b]?.name || b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  sortedSymbols.forEach(sym => {
    const ticker = cryptoData[sym];
    if (!ticker) return;

    const symbol = ticker.symbol.replace('USDT', '');
    const info = coinMeta[ticker.symbol] || { name: symbol, icon: "💰" };
    const priceNum = parseFloat(ticker.lastPrice);
    const isPositive = parseFloat(ticker.priceChangePercent) >= 0;

    const miniCard = document.createElement('div');
    miniCard.className = 'all-coins-item';
    miniCard.innerHTML = `
      <div class="coin-main">
        <span class="coin-icon">${info.icon}</span>
        <div class="coin-names">
          <span class="coin-name">${info.name}</span>
          <span class="coin-symbol">${symbol}</span>
        </div>
      </div>
      <div class="coin-market">
        <span class="coin-price-mini">$${formatPrice(priceNum)}</span>
        <span class="coin-percent-mini ${isPositive ? 'positive' : 'negative'}">
          ${isPositive ? '+' : ''}${parseFloat(ticker.priceChangePercent).toFixed(2)}%
        </span>
      </div>
    `;

    miniCard.addEventListener('click', () => {
      closeFullListModal();
      selectCoin(sym);
      window.scrollTo({ top: document.getElementById('market-details')?.offsetTop - 100, behavior: 'smooth' });
    });

    container.appendChild(miniCard);
  });

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeFullListModal() {
  const modal = document.getElementById('all-coins-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Initializing hooks
document.addEventListener('DOMContentLoaded', () => {
  const viewAllBtn = document.getElementById('view-all-coins');
  const closeBtn = document.querySelector('#all-coins-modal .close-modal');
  const modalOverlay = document.getElementById('all-coins-modal');

  if (viewAllBtn) viewAllBtn.addEventListener('click', openFullListModal);
  if (closeBtn) closeBtn.addEventListener('click', closeFullListModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeFullListModal();
    });
  }
});
