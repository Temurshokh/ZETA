const fs = require('fs');
let html = fs.readFileSync('c:/Users/tahma/Desktop/gedda/src/settings.html', 'utf8');

const newSectStr = `
    <section class="glass-panel" style="margin-bottom: 1.5rem;">
      <h3 style="color: var(--primary-accent);"><i class="fas fa-globe"></i> <span data-trn="set-group-lang">Tizim va Til</span></h3>
      <div class="setting-item" style="border-bottom: none;">
        <div class="setting-label">
          <i class="fas fa-language"></i>
          <span data-trn="set-lang">Tizim Tili</span>
        </div>
        <div class="custom-select-wrapper">
          <select id="lang-select" onchange="saveSettings()" style="padding: 8px 12px; border-radius: 12px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); outline: none; font-size: 0.9rem; cursor: pointer;">
            <option value="uz" style="color: black;">O'zbek</option>
            <option value="en" style="color: black;">English</option>
            <option value="ru" style="color: black;">Русский</option>
          </select>
        </div>
      </div>
    </section>

    <section class="glass-panel" style="margin-bottom: 1.5rem;">
      <h3 style="color: var(--primary-accent);"><i class="fas fa-music"></i> <span data-trn="set-group-audio">Ovoz va Musiqa</span></h3>
      <div class="setting-item">
        <div class="setting-label">
          <i class="fas fa-volume-up"></i>
          <span data-trn="set-sound">O'yin Tovushlari</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="sound-toggle" checked onchange="saveSettings()" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="setting-item">
        <div class="setting-label">
          <i class="fas fa-headphones"></i>
          <span data-trn="set-bg-music">Fon Musiqasi</span>
        </div>
        <select id="music-select" onchange="saveSettings()" style="padding: 8px 12px; border-radius: 12px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); outline: none; font-size: 0.9rem; cursor: pointer; max-width: 150px;">
          <option value="off" style="color: black;">O'chirilgan</option>
          <option value="night-chill" style="color: black;">🌙 Night Chill</option>
          <option value="ocean-waves" style="color: black;">🌊 Ocean Waves</option>
          <option value="lofi-beat" style="color: black;">🔥 Lo-fi Beat</option>
        </select>
      </div>
      <div class="setting-item" style="border-bottom: none;">
        <div class="setting-label">
          <i class="fas fa-sliders-h"></i>
          <span data-trn="set-music-vol">Musiqa Ovozi</span>
        </div>
        <input type="range" id="music-volume" min="0" max="100" value="30" oninput="saveSettings()" style="width: 120px; accent-color: var(--primary-accent);" />
      </div>
    </section>

    <section class="glass-panel" style="margin-bottom: 1.5rem;">
      <h3 style="color: var(--primary-accent);"><i class="fas fa-cogs"></i> <span data-trn="set-group-extra">Qo'shimcha</span></h3>
      <div class="setting-item">
        <div class="setting-label">
          <i class="fas fa-bell"></i>
          <span data-trn="set-notif">Bildirishnomalar (XP)</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="notif-toggle" checked onchange="saveSettings()" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="setting-item" style="border-bottom: none;">
        <div class="setting-label">
          <i class="fas fa-sync"></i>
          <span data-trn="set-crypto-ref">Kripto Yangilanish</span>
        </div>
        <select id="crypto-refresh" onchange="saveSettings()" style="padding: 8px 12px; border-radius: 12px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); outline: none; font-size: 0.9rem; cursor: pointer;">
          <option value="15" style="color: black;">15 soniya</option>
          <option value="30" selected style="color: black;">30 soniya</option>
          <option value="60" style="color: black;">1 daqiqa</option>
        </select>
      </div>
    </section>

    <section class="glass-panel">
      <h3 style="color: var(--danger);"><i class="fas fa-shield-alt"></i> <span data-trn="set-group-data">Ilova Ma'lumotlari</span></h3>
      <div class="setting-item">
        <div class="setting-label">
          <i class="fab fa-telegram" style="color: #0088cc;"></i>
          <span data-trn="set-founder">Asoschining kanali</span>
        </div>
        <a href="https://t.me/VIGER_ZONE" target="_blank" id="telegram-link" class="btn btn-glass btn-sm" onclick="claimFounderBonus()" style="text-decoration: none;">
          <i class="fab fa-telegram"></i> <span data-trn="set-subscribe">Obuna bo'lish</span> <span id="bonus-badge" class="bonus-badge">+100 XP</span>
        </a>
      </div>
      <div class="mt-4 text-center">
        <button onclick="resetData()" class="btn" style="background: var(--danger); color: white; width: 100%; border-radius: 12px; padding: 12px;">
          <i class="fas fa-trash-alt"></i> <span data-trn="set-reset">Barcha ma'lumotlarni o'chirish</span>
        </button>
      </div>
    </section>`;

html = html.replace(/<section class="glass-panel">[\s\S]*?<!-- Achievements Section -->/m, newSectStr + '\n\n    <!-- Achievements Section -->');

fs.writeFileSync('c:/Users/tahma/Desktop/gedda/src/settings.html', html);
console.log('Done mapping Settings html via node script.');
