const fs = require('fs');
const path = require('path');

const dirs = [
    'c:/Users/tahma/Desktop/gedda/src',
    'c:/Users/tahma/Desktop/gedda/src/games',
    'c:/Users/tahma/Desktop/gedda/src/tools'
];

dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.html')) return;
        const fullPath = path.join(dir, file);
        let content = fs.readFileSync(fullPath, 'utf8');

        let changed = false;
        if (content.includes('<!-- NAV_LINKS_PLACEHOLDER -->')) {
            content = content.replace('<!-- NAV_LINKS_PLACEHOLDER -->', '<nav class="nav-links"></nav>');
            changed = true;
        }

        if (content.includes('<!-- TAB_BAR_PLACEHOLDER -->')) {
            content = content.replace('<!-- TAB_BAR_PLACEHOLDER -->', '<nav class="tab-bar"></nav>');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(fullPath, content);
            console.log('Restored containers in: ' + file);
        }
    });
});
