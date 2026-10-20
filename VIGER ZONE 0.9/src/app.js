// Supplemental JS for small improvements
// Resume audio on user gesture
document.addEventListener('click', () => {
    try { AudioEngine.init(); } catch (e) { }
}, { once: true });

// Keep game canvases responsive
function resizeGameCanvases() {
    const sc = document.getElementById('snakeCanvas');
    if (sc) {
        const w = Math.min(340, window.innerWidth - 40);
        sc.style.width = w + 'px'; sc.style.height = Math.floor(w * (4 / 3)) + 'px';
    }
}
window.addEventListener('resize', resizeGameCanvases);
window.addEventListener('load', resizeGameCanvases);
