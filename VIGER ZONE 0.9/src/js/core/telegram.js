// ===== ZETA v0.7 — Telegram WebApp Integration =====
// Handles SDK initialization, theme sync, haptics, and native UI buttons.

const ZetaTelegram = (() => {
    let tg = null;
    let isReady = false;

    function init() {
        // Attempt to get the Telegram WebApp object
        if (window.Telegram && window.Telegram.WebApp) {
            tg = window.Telegram.WebApp;
            isReady = true;
            document.body.classList.add('tg-webapp');

            // Expand to full height
            tg.expand();

            // Tell Telegram the app is ready
            tg.ready();

            // Apply Telegram theme to CSS variables
            syncTheme();

            // Listen for theme changes (user switches dark/light in TG)
            tg.onEvent('themeChanged', syncTheme);

            // Setup Back Button behavior
            setupBackButton();

            console.log('[ZetaTG] Initialized inside Telegram WebApp');
        } else {
            console.log('[ZetaTG] Not running inside Telegram — standalone mode');
        }
    }

    function syncTheme() {
        if (!tg) return;
        const tc = tg.themeParams;
        if (!tc) return;

        const root = document.documentElement;

        if (tc.bg_color) root.style.setProperty('--tg-theme-bg', tc.bg_color);
        if (tc.text_color) root.style.setProperty('--tg-theme-text', tc.text_color);
        if (tc.hint_color) root.style.setProperty('--tg-theme-hint', tc.hint_color);
        if (tc.button_color) root.style.setProperty('--tg-theme-button', tc.button_color);
        if (tc.button_text_color) root.style.setProperty('--tg-theme-button-text', tc.button_text_color);

        // Apply Telegram-provided CSS vars (some TG versions set these automatically)
        if (tc.bg_color) root.style.setProperty('--bg-color', tc.bg_color);
        if (tc.text_color) root.style.setProperty('--text-color', tc.text_color);
        if (tc.hint_color) root.style.setProperty('--text-muted', tc.hint_color);
        if (tc.button_color) root.style.setProperty('--accent-brand', tc.button_color);
    }

    function setupBackButton() {
        if (!tg) return;

        const page = window.location.pathname.split('/').pop()?.toLowerCase();
        const isHome = page === 'index.html' || page === '' || page === 'src';

        if (!isHome) {
            tg.BackButton.show();
            tg.BackButton.onClick(() => {
                window.history.back();
            });
        } else {
            tg.BackButton.hide();
        }
    }

    // --- Haptic Feedback ---
    function hapticImpact(style = 'light') {
        // style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred(style);
        }
    }

    function hapticNotification(type = 'success') {
        // type: 'error' | 'success' | 'warning'
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred(type);
        }
    }

    function hapticSelection() {
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.selectionChanged();
        }
    }

    // --- Main Button ---
    function showMainButton(text, onClick) {
        if (!tg) return;
        tg.MainButton.text = text;
        tg.MainButton.show();
        tg.MainButton.onClick(onClick);
    }

    function hideMainButton() {
        if (!tg) return;
        tg.MainButton.hide();
    }

    // --- User Info ---
    function getUser() {
        if (!tg || !tg.initDataUnsafe) return null;
        return tg.initDataUnsafe.user || null;
    }

    // --- Utility ---
    function isTelegram() {
        return isReady;
    }

    function close() {
        if (tg) tg.close();
    }

    return {
        init,
        syncTheme,
        hapticImpact,
        hapticNotification,
        hapticSelection,
        showMainButton,
        hideMainButton,
        getUser,
        isTelegram,
        close
    };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ZetaTelegram.init();
});

if (typeof window !== 'undefined') window.ZetaTelegram = ZetaTelegram;
