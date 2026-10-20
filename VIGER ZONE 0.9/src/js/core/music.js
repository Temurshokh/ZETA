// ===== ZETA v0.9 — Background Music System =====
const ZetaMusic = (() => {
    let audio = null;
    let currentTrack = 'off';
    let volume = 30;

    const tracks = {
        'night-chill': 'audio/night-chill.mp3',
        'ocean-waves': 'audio/ocean-waves.mp3',
        'lofi-beat': 'audio/lofi-beat.mp3'
    };

    function init() {
        if (typeof window === 'undefined') return;

        // Load settings
        const settings = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
        currentTrack = settings.musicTrack || 'off';
        volume = settings.musicVolume !== undefined ? settings.musicVolume : 30;
        const soundEnabled = settings.sound !== false;

        if (currentTrack === 'off' || !soundEnabled) return;

        createAudioElement();
    }

    function createAudioElement() {
        if (!audio) {
            audio = new Audio();
            audio.loop = true;
        }
        audio.volume = volume / 100;
        audio.src = tracks[currentTrack];

        // Handle visibility pause/play
        document.addEventListener('visibilitychange', handleVisibility);

        // Autoplay requires interaction. We listen to first click/touch.
        document.addEventListener('click', startPlay);
        document.addEventListener('touchstart', startPlay);
    }

    function handleVisibility() {
        if (document.hidden) {
            if (audio && !audio.paused) audio.pause();
        } else {
            if (audio && currentTrack !== 'off') {
                audio.play().catch(() => { });
            }
        }
    }

    function startPlay() {
        if (audio && currentTrack !== 'off') {
            audio.play().catch(e => console.log('Autoplay blocked until user interaction:', e));
        }
        document.removeEventListener('click', startPlay);
        document.removeEventListener('touchstart', startPlay);
    }

    function setTrack(trackId) {
        currentTrack = trackId;
        const settings = JSON.parse(localStorage.getItem('zeta_settings') || '{}');
        const soundEnabled = settings.sound !== false;

        if (trackId === 'off' || !soundEnabled) {
            if (audio) {
                audio.pause();
            }
            return;
        }

        if (!audio) {
            createAudioElement();
        } else {
            audio.src = tracks[trackId];
            audio.play().catch(() => { });
        }
        setVolume(volume);
    }

    function setVolume(vol) {
        volume = vol;
        if (audio) {
            audio.volume = volume / 100;
        }
    }

    // Initialize after a slight delay to ensure DOM and Settings are loaded
    setTimeout(init, 500);

    return { setTrack, setVolume, init };
})();

if (typeof window !== 'undefined') window.ZetaMusic = ZetaMusic;
