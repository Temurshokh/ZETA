class GameUIController {
  constructor() {
    this.injectStyles();
    if (document.body) {
      this.createModalDOM();
    } else {
      window.addEventListener("DOMContentLoaded", () => this.createModalDOM());
    }
    // Bind switchTab to this instance and expose it globally for HTML access
    window.switchTab = this.switchTab.bind(this);
  }

  injectStyles() {
    if (document.getElementById("game-ui-styles")) return;
    const style = document.createElement("style");
    style.id = "game-ui-styles";
    style.textContent = `
            /* Game UI Overlay */
            #game-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
                z-index: 10000; display: none; align-items: center; justify-content: center;
            }
            .game-modal {
                background: rgba(15, 23, 42, 0.95);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 2rem;
                max-width: 90%;
                width: 400px;
                text-align: center;
                color: white;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .game-modal h2 { margin-top: 0; font-size: 2rem; margin-bottom: 0.5rem; }
            .game-modal p { color: #94a3b8; margin-bottom: 1.5rem; }
            .modal-content { margin-bottom: 1.5rem; }
            
            .g-btn {
                background: #3b82f6; color: white; border: none; padding: 12px 24px;
                border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 1rem;
                transition: transform 0.1s, background 0.2s;
                margin: 5px;
            }
            .g-btn:active { transform: scale(0.95); }
            .g-btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); }
            
            /* In-Game Settings Button */
            #game-settings-btn {
                position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
                width: 40px; height: 40px;
                background: rgba(0,0,0,0.5); border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: white; cursor: pointer; z-index: 9000;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            /* Settings Specifics */
            .setting-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
            .tab-btn { background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:1rem; padding:5px 10px; }
            .tab-btn.active { color:white; border-bottom: 2px solid #3b82f6; }
            .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #3b82f6; }
            input:checked + .slider:before { transform: translateX(20px); }
            .glass-select { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 5px; border-radius: 5px; }
            .glass-select option { background: #1e293b; }

            @keyframes popIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
    document.head.appendChild(style);
  }

  createModalDOM() {
    if (document.getElementById("game-modal-overlay")) return;
    if (!document.body) return; // Safety check

    this.overlay = document.createElement("div");
    this.overlay.id = "game-modal-overlay";
    this.overlay.innerHTML = `
            <div class="game-modal" id="game-modal-box">
                <h2 id="gm-title">Game Over</h2>
                <div id="gm-content" class="modal-content">Score: 0</div>
                <div id="gm-actions">
                    <button class="g-btn" id="gm-primary">Restart</button>
                    <button class="g-btn g-btn-outline" id="gm-secondary">Exit</button>
                </div>
            </div>
        `;
    document.body.appendChild(this.overlay);

    if (!document.getElementById("game-settings-btn")) {
      const gear = document.createElement("div");
      gear.id = "game-settings-btn";
      gear.innerHTML = '<i class="fas fa-cog"></i>';
      gear.onclick = () => this.showSettings();
      document.body.appendChild(gear);
    }
  }

  show(
    title,
    content,
    onPrimary,
    primaryText = "Restart",
    onSecondary,
    secondaryText = "Chiqish",
  ) {
    document.getElementById("gm-title").textContent = title;
    document.getElementById("gm-content").innerHTML = content;

    const pBtn = document.getElementById("gm-primary");
    pBtn.textContent = primaryText;
    pBtn.onclick = () => {
      this.hide();
      if (onPrimary) onPrimary();
    };

    const sBtn = document.getElementById("gm-secondary");
    sBtn.textContent = secondaryText;
    sBtn.onclick = () => {
      this.hide();
      if (onSecondary) onSecondary();
      else window.location.href = "../games.html";
    };

    this.overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Lock scroll
  }

  hide() {
    this.overlay.style.display = "none";
    document.body.style.overflow = ""; // Unlock scroll
    window.onSettingChange = null;
  }

  showGameOver(score, onRestart) {
    this.show(
      "O'yin Tugadi!",
      `<p style="font-size: 1.2rem;">Sizning natijangiz: <strong style="color:var(--primary-accent);">${score}</strong></p>`,
      onRestart,
      "Qayta O'ynash",
    );
  }

  getSettings() {
    const saved = localStorage.getItem("gameSettings");
    return saved
      ? JSON.parse(saved)
      : {
        audio: true,
        music: true,
        graphics: "high",
        shadows: true,
        difficulty: "normal",
      };
  }

  saveSettings(settings) {
    localStorage.setItem("gameSettings", JSON.stringify(settings));
    window.dispatchEvent(
      new CustomEvent("gameSettingsChanged", { detail: settings }),
    );
  }

  showSettings() {
    const settings = this.getSettings();

    window.onSettingChange = (key, value) => {
      const current = this.getSettings();
      current[key] = value;
      this.saveSettings(current);
    };

    this.show(
      "Sozlamalar",
      `
            <div class="settings-tabs" style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
                <button onclick="switchTab('audio')" class="tab-btn active" id="tab-audio">Ovoz</button>
                <button onclick="switchTab('graphics')" class="tab-btn" id="tab-graphics">Grafika</button>
                <button onclick="switchTab('difficulty')" class="tab-btn" id="tab-difficulty">Qiyinchilik</button>
            </div>

            <div id="panel-audio" class="settings-panel">
                <div class="setting-row">
                    <span>Ovoz Effekti</span>
                    <label class="switch"><input type="checkbox" ${settings.audio ? "checked" : ""} onchange="window.onSettingChange('audio', this.checked)"><span class="slider round"></span></label>
                </div>
                <div class="setting-row">
                    <span>Musiqa</span>
                    <label class="switch"><input type="checkbox" ${settings.music ? "checked" : ""} onchange="window.onSettingChange('music', this.checked)"><span class="slider round"></span></label>
                </div>
            </div>

            <div id="panel-graphics" class="settings-panel" style="display:none;">
                <div class="setting-row">
                    <span>Sifat</span>
                    <select class="glass-select" onchange="window.onSettingChange('graphics', this.value)">
                        <option value="high" ${settings.graphics === "high" ? "selected" : ""}>Yuqori</option>
                        <option value="medium" ${settings.graphics === "medium" ? "selected" : ""}>O'rta</option>
                        <option value="low" ${settings.graphics === "low" ? "selected" : ""}>Past</option>
                    </select>
                </div>
                <div class="setting-row">
                    <span>Soyalar</span>
                    <label class="switch"><input type="checkbox" ${settings.shadows ? "checked" : ""} onchange="window.onSettingChange('shadows', this.checked)"><span class="slider round"></span></label>
                </div>
            </div>

            <div id="panel-difficulty" class="settings-panel" style="display:none;">
                <div class="setting-row">
                    <span>Daraja</span>
                    <select class="glass-select" onchange="window.onSettingChange('difficulty', this.value)">
                        <option value="easy" ${settings.difficulty === "easy" ? "selected" : ""}>Oson</option>
                        <option value="normal" ${settings.difficulty === "normal" ? "selected" : ""}>O'rta</option>
                        <option value="hard" ${settings.difficulty === "hard" ? "selected" : ""}>Qiyin</option>
                    </select>
                </div>
            </div>
            `,
      null,
      "Yopish",
      null,
      "Chiqish",
    );
  }

  switchTab(tabName) {
    document
      .querySelectorAll(".settings-panel")
      .forEach((el) => (el.style.display = "none"));
    document
      .querySelectorAll(".tab-btn")
      .forEach((el) => el.classList.remove("active"));

    const panel = document.getElementById(`panel-${tabName}`);
    const tab = document.getElementById(`tab-${tabName}`);

    if (panel) panel.style.display = "block";
    if (tab) tab.classList.add("active");
  }
}

// Global Instance
window.GameUI = new GameUIController();
