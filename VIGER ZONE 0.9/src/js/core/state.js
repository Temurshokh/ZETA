// ===== ZETA v0.7 — Centralized State Manager =====
// All localStorage operations go through this module for consistency.

const ZetaState = (() => {
    const PREFIX = 'zeta_';

    // --- Data Migration (v0.7 -> v0.8) ---
    function migrate() {
        if (localStorage.getItem('zeta_migrated_v08')) return;

        const migrations = {
            'viger_xp': 'zeta_xp',
            'viger_level': 'zeta_level',
            'viger_settings': 'zeta_settings',
            'crypto_favorites': 'zeta_favorites',
            'snake_highscore': 'zeta_snake_highscore'
        };

        for (const [oldKey, newKey] of Object.entries(migrations)) {
            const val = localStorage.getItem(oldKey);
            if (val !== null && localStorage.getItem(newKey) === null) {
                localStorage.setItem(newKey, val);
            }
        }
        localStorage.setItem('zeta_migrated_v08', 'true');
        console.log('[ZetaState] Migrated legacy keys to v0.8 standards');
    }

    // Run migration immediately
    migrate();

    // --- Core Getters/Setters ---
    function get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch {
            return localStorage.getItem(PREFIX + key) || fallback;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.warn('[ZetaState] Storage write failed:', e.message);
        }
    }

    function remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    // --- Settings ---
    function getSettings() {
        return get('settings', { lang: 'uz', sound: true, notif: true });
    }

    function saveSetting(key, value) {
        const s = getSettings();
        s[key] = value;
        set('settings', s);
        return s;
    }

    function getLang() {
        return getSettings().lang || 'uz';
    }

    // --- XP & Level (Aliases for legacy keys) ---
    function getXP() {
        return parseInt(localStorage.getItem('zeta_xp') || '0');
    }

    function getLevel() {
        return parseInt(localStorage.getItem('zeta_level') || '1');
    }

    function setXP(val) {
        localStorage.setItem('zeta_xp', String(val));
    }

    function setLevel(val) {
        localStorage.setItem('zeta_level', String(val));
    }

    // --- Favorites ---
    function getFavorites() {
        return get('favorites', []);
    }

    function setFavorites(list) {
        set('favorites', list);
    }

    // --- Portfolio ---
    function getPortfolio() {
        return get('portfolio', {});
    }

    function setPortfolio(data) {
        set('portfolio', data);
    }

    // --- Achievements ---
    function getAchievements() {
        return get('achievements', []);
    }

    function setAchievements(list) {
        set('achievements', list);
    }

    // --- VAU (Virtual Aurum) ---
    function getVAU() {
        const val = localStorage.getItem(PREFIX + 'vau');
        if (val === null) {
            // New user: start with 200 VAU
            localStorage.setItem(PREFIX + 'vau', '200');
            return 200;
        }
        return parseInt(val);
    }

    function setVAU(amount) {
        localStorage.setItem(PREFIX + 'vau', String(Math.max(0, Math.floor(amount))));
    }

    function addVAU(amount) {
        const current = getVAU();
        const newVal = Math.max(0, current + amount);
        setVAU(newVal);
        return newVal;
    }

    // --- Streak ---
    function getStreak() {
        return {
            date: localStorage.getItem(PREFIX + 'streak_date'),
            count: parseInt(localStorage.getItem(PREFIX + 'streak_count') || '0')
        };
    }

    function setStreak(date, count) {
        localStorage.setItem(PREFIX + 'streak_date', date);
        localStorage.setItem(PREFIX + 'streak_count', String(count));
    }

    // --- Games / Tools tracking ---
    function getGamesPlayed() {
        return get('games_played', []);
    }

    function trackGame(name) {
        const list = getGamesPlayed();
        if (!list.includes(name)) {
            list.push(name);
            set('games_played', list);
        }
    }

    function getToolsUsed() {
        return get('tools_used', []);
    }

    function trackTool(name) {
        const list = getToolsUsed();
        if (!list.includes(name)) {
            list.push(name);
            set('tools_used', list);
        }
    }

    // --- Full Reset ---
    function resetAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
            if (k.startsWith(PREFIX) || k.startsWith('viger_')) {
                localStorage.removeItem(k);
            }
        });
    }

    // --- Storage Health ---
    function getStorageUsage() {
        let total = 0;
        for (let k in localStorage) {
            if (localStorage.hasOwnProperty(k)) {
                total += localStorage[k].length + k.length;
            }
        }
        return { bytes: total * 2, kb: ((total * 2) / 1024).toFixed(1), pct: ((total * 2) / (5 * 1024 * 1024) * 100).toFixed(1) };
    }

    return {
        get, set, remove,
        getSettings, saveSetting, getLang,
        getXP, getLevel, setXP, setLevel,
        getVAU, setVAU, addVAU,
        getFavorites, setFavorites,
        getPortfolio, setPortfolio,
        getAchievements, setAchievements,
        getStreak, setStreak,
        getGamesPlayed, trackGame,
        getToolsUsed, trackTool,
        resetAll, getStorageUsage
    };
})();

// Export for both module and global usage
if (typeof window !== 'undefined') window.ZetaState = ZetaState;
