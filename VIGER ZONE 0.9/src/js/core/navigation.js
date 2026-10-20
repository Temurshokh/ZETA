// ===== ZETA v0.9 — Navigation System =====
// Centralized DOM injection for navigation elements to prevent duplication.

const ZetaNav = (() => {
    function injectNavigations() {
        if (typeof document === 'undefined') return;

        // Path detection to figure out depth ("src" vs "src/games/")
        const isGamePage = window.location.pathname.includes('/games/') ||
            window.location.pathname.includes('/crossy-road.html') ||
            window.location.pathname.includes('/lucky-spin.html'); // Add root games

        if (isGamePage) {
            // We still want the BackButton if in Telegram Mini App
            return;
        }

        const isSubdir = window.location.pathname.includes('/tools/');
        const prefix = isSubdir ? '../' : ''; // Relative path adjust

        // Translate helper specifically for navigation loading to avoid flash
        // We load settings synchronously so the language is ready immediately
        const settings = JSON.parse(localStorage.getItem('zeta_settings') || '{"lang": "uz"}');
        const langCode = settings.lang || 'uz';

        const navDict = {
            uz: { home: "Bosh Sahifa", games: "O'yinlar", tools: "Vositalar", settings: "Sozlamalar" },
            en: { home: "Home", games: "Games", tools: "Tools", settings: "Settings" },
            ru: { home: "Главная", games: "Игры", tools: "Инструменты", settings: "Настройки" }
        };
        const t = navDict[langCode] || navDict.uz;

        // Base URLs
        const urls = {
            home: prefix + 'index.html',
            games: prefix + 'games.html',
            tools: prefix + 'tools.html',
            settings: prefix + 'settings.html'
        };

        const navLinksHTML = `
            <a href="${urls.home}" class="nav-link" data-nav="home"><i class="fas fa-home"></i> <span data-trn="nav-home">${t.home}</span></a>
            <a href="${urls.games}" class="nav-link" data-nav="games"><i class="fas fa-gamepad"></i> <span data-trn="nav-games">${t.games}</span></a>
            <a href="${urls.tools}" class="nav-link" data-nav="tools"><i class="fas fa-tools"></i> <span data-trn="nav-tools">${t.tools}</span></a>
            <a href="${urls.settings}" class="nav-link" data-nav="settings"><i class="fas fa-cog"></i></a>
        `;

        const tabBarHTML = `
            <a href="${urls.home}" class="tab-item" data-nav="home">
                <i class="fas fa-home"></i>
                <span data-trn="nav-home">${t.home}</span>
            </a>
            <a href="${urls.games}" class="tab-item" data-nav="games">
                <i class="fas fa-gamepad"></i>
                <span data-trn="nav-games">${t.games}</span>
            </a>
            <a href="${urls.tools}" class="tab-item" data-nav="tools">
                <i class="fas fa-tools"></i>
                <span data-trn="nav-tools">${t.tools}</span>
            </a>
            <a href="${urls.settings}" class="tab-item" data-nav="settings">
                <i class="fas fa-user-cog"></i>
                <span data-trn="nav-settings">${t.settings}</span>
            </a>
        `;

        // Top Navigation - insert into header if no container found
        let headerNavLinks = document.querySelector('header .nav-links');
        if (!headerNavLinks) {
            const header = document.querySelector('header');
            if (header && !window.location.pathname.includes('/games/')) {
                headerNavLinks = document.createElement('nav');
                headerNavLinks.className = 'nav-links';
                header.appendChild(headerNavLinks);
            }
        }
        if (headerNavLinks) {
            headerNavLinks.innerHTML = navLinksHTML;
        }

        // Bottom Tab Bar
        let tabBar = document.querySelector('.tab-bar');
        if (!tabBar && !window.location.pathname.includes('/games/space-tunnel.html')) {
            tabBar = document.createElement('nav');
            tabBar.className = 'tab-bar';
            document.body.appendChild(tabBar);
        }
        if (tabBar) {
            tabBar.innerHTML = tabBarHTML;
        }

        // Apply active classes
        const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
        const inSubdir = window.location.pathname.includes('/games/') || window.location.pathname.includes('/tools/');

        document.querySelectorAll('.nav-link, .tab-item').forEach(el => {
            const elHrefParts = el.getAttribute('href').split('/');
            const targetPage = elHrefParts[elHrefParts.length - 1].toLowerCase() || 'index.html';

            // For subdirectories, all main nav links point up (../)
            // But if we're IN a subdirectory, the active tab shouldn't be the root index.html unless we're actually there.
            // Wait, if we are in /games/snake.html, currentPath is 'snake.html'
            // The nav links href="games.html". They won't match.
            // Actually, if we are in a subdirectory, the active tab should likely be "games" or "tools" based on the folder.
            let match = false;

            if (inSubdir) {
                if (window.location.pathname.includes('/games/') && targetPage === 'games.html') match = true;
                if (window.location.pathname.includes('/tools/') && targetPage === 'tools.html') match = true;
            } else {
                if (targetPage === currentPath || (currentPath === '' && targetPage === 'index.html')) match = true;
            }

            if (match) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    function setupBackButton() {
        const inMiniApp = typeof window.Telegram !== 'undefined' && window.Telegram.WebApp && window.Telegram.WebApp.initData;
        const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

        if (inMiniApp && currentPath !== 'index.html') {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => window.history.back());
        } else if (inMiniApp) {
            window.Telegram.WebApp.BackButton.hide();
        }
    }

    // Attempt injection immediately (before load)
    injectNavigations();

    // DOMContentLoaded setup
    document.addEventListener("DOMContentLoaded", () => {
        injectNavigations(); // Double check inside listener
        setupBackButton();
    });

    return { injectNavigations };
})();
