// =========================================
// MARF THE LAB - PORTFOLIO.JS
// Sezione video dei lavori già realizzati
// Carosello orizzontale: si scorre con i pulsanti-kunai ai lati
// =========================================

function renderPortfolio(videos) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    // ferma eventuali video in riproduzione prima di ridisegnare
    grid.querySelectorAll('video').forEach((v) => v.pause());

    if (!videos.length) {
        grid.innerHTML = `
            <div class="portfolio-empty empty-state text-textMuted">
                Nessun video in questa categoria.
            </div>
        `;
        grid.scrollLeft = 0;
        updatePortfolioNav();
        return;
    }

    grid.innerHTML = videos.map((v) => {
        const title = sanitizeHTML(v.title);
        const hasVideo = Boolean(v.src);

        // Slot 9:16 (aspect-ratio inline: funziona anche senza Tailwind)
        const slot = hasVideo
            ? `
                <video
                    class="absolute inset-0 w-full h-full"
                    style="object-fit: cover; background: #000;"
                    src="${sanitizeHTML(v.src)}#t=0.1"
                    ${v.poster ? `poster="${sanitizeHTML(v.poster)}"` : ''}
                    preload="metadata"
                    playsinline
                    aria-label="${title}"
                ></video>
                <button
                    type="button"
                    data-play
                    class="portfolio-play absolute inset-0 w-full h-full flex items-center justify-center bg-darkBg/30 hover:bg-darkBg/10 transition-colors"
                    aria-label="Riproduci: ${title}"
                >
                    <span class="w-16 h-16 rounded-full bg-gradient-to-r from-neonMagenta to-neonPurple text-white flex items-center justify-center shadow-neon-magenta group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-play text-xl" style="margin-left:3px"></i>
                    </span>
                </button>
            `
            : `
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-4"
                     style="background:
                        linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px) 0 0 / 24px 24px,
                        linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px) 0 0 / 24px 24px,
                        radial-gradient(80% 60% at 50% 40%, rgba(168,85,247,.22), transparent 70%);">
                    <span class="w-14 h-14 rounded-full border border-neonCyan/40 text-neonCyan flex items-center justify-center">
                        <i class="fa-solid fa-film text-lg"></i>
                    </span>
                    <span class="text-[11px] font-mono uppercase tracking-widest text-textMuted">Video in arrivo</span>
                </div>
            `;

        return `
            <article class="portfolio-card glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neonMagenta/50 transition-all group fade-in">
                <div class="relative w-full bg-darkElevated overflow-hidden" style="aspect-ratio: 9 / 16;">
                    ${slot}
                </div>
                <div class="p-4">
                    <div class="text-[10px] font-mono uppercase text-neonMagenta mb-1">
                        ${sanitizeHTML(v.category)}
                    </div>
                    <h3 class="font-display font-bold text-sm sm:text-base text-white leading-snug">
                        ${title}
                    </h3>
                </div>
            </article>
        `;
    }).join('');

    grid.scrollLeft = 0;
    bindPortfolioVideos(grid);
    initPortfolioCarousel();
    updatePortfolioNav();
}

// -----------------------------------------
// Carosello: pulsanti kunai + pallini
// -----------------------------------------

let portfolioCarouselReady = false;
let portfolioPendingTarget = null;
let portfolioPendingTimer = null;

function initPortfolioCarousel() {
    if (portfolioCarouselReady) return;

    const track = document.getElementById('portfolioGrid');
    const prev = document.getElementById('portfolioPrev');
    const next = document.getElementById('portfolioNext');
    if (!track || !prev || !next) return;

    portfolioCarouselReady = true;

    prev.addEventListener('click', () => scrollPortfolio(-1));
    next.addEventListener('click', () => scrollPortfolio(1));

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updatePortfolioNav();
            ticking = false;
        });
    }, { passive: true });

    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollPortfolio(1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollPortfolio(-1); }
    });

    window.addEventListener('resize', updatePortfolioNav);
}

// Larghezza di un "passo" = una card + lo spazio tra le card
function portfolioStep(track) {
    const card = track.querySelector('.portfolio-card');
    if (!card) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
}

function scrollPortfolio(direction) {
    const track = document.getElementById('portfolioGrid');
    if (!track) return;

    const step = portfolioStep(track);
    const maxScroll = track.scrollWidth - track.clientWidth;

    // se si clicca più volte di fila, parte dall'ultima destinazione (non da metà scorrimento)
    const from = portfolioPendingTarget ?? track.scrollLeft;
    const index = Math.round(from / step) + direction;
    const target = Math.max(0, Math.min(index * step, maxScroll));

    portfolioPendingTarget = target;
    clearTimeout(portfolioPendingTimer);
    portfolioPendingTimer = setTimeout(() => { portfolioPendingTarget = null; }, 650);

    track.scrollTo({ left: target, behavior: 'smooth' });

    // piccola animazione di "lancio" del kunai
    const btn = document.getElementById(direction > 0 ? 'portfolioNext' : 'portfolioPrev');
    if (btn) {
        btn.classList.remove('is-throwing');
        void btn.offsetWidth;
        btn.classList.add('is-throwing');
    }
}

function updatePortfolioNav() {
    const track = document.getElementById('portfolioGrid');
    const prev = document.getElementById('portfolioPrev');
    const next = document.getElementById('portfolioNext');
    const dots = document.getElementById('portfolioDots');
    if (!track || !prev || !next) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 2;
    const lastCard = track.querySelector('.portfolio-card:last-child');
    const atEnd = track.scrollLeft >= maxScroll - 2 || (lastCard &&
        lastCard.getBoundingClientRect().right <= track.getBoundingClientRect().right + 2);

    prev.disabled = atStart;
    next.disabled = atEnd || maxScroll <= 2;

    if (!dots) return;

    const cards = track.querySelectorAll('.portfolio-card').length;
    const step = portfolioStep(track);
    const visible = Math.max(1, Math.round((track.clientWidth + 1) / step));
    const pages = Math.max(0, cards - visible + 1);
    const current = atEnd ? pages - 1 : Math.round(track.scrollLeft / step);

    if (dots.childElementCount !== pages) {
        dots.innerHTML = pages > 1
            ? Array.from({ length: pages }, (_, i) =>
                `<button type="button" class="portfolio-dot" data-index="${i}" aria-label="Vai al video ${i + 1}"></button>`
              ).join('')
            : '';
        dots.querySelectorAll('.portfolio-dot').forEach((dot) => {
            dot.addEventListener('click', () => {
                track.scrollTo({ left: Number(dot.dataset.index) * portfolioStep(track), behavior: 'smooth' });
            });
        });
    }

    dots.querySelectorAll('.portfolio-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
    });
}

function bindPortfolioVideos(grid) {
    grid.querySelectorAll('.portfolio-card').forEach((card) => {
        const video = card.querySelector('video');
        const overlay = card.querySelector('[data-play]');
        if (!video || !overlay) return;

        overlay.addEventListener('click', () => {
            video.controls = true;
            video.play();
        });

        video.addEventListener('play', () => {
            overlay.classList.add('hidden');
            // un solo video alla volta
            document.querySelectorAll('#portfolioGrid video').forEach((other) => {
                if (other !== video) other.pause();
            });
        });

        // A schermo intero il video deve restare 9:16 intero (con bande nere ai lati),
        // invece di essere ingrandito e ritagliato in orizzontale.
        const updateFit = () => {
            const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
            video.style.objectFit = fsEl === video ? 'contain' : 'cover';
        };

        document.addEventListener('fullscreenchange', updateFit);
        document.addEventListener('webkitfullscreenchange', updateFit);
        video.addEventListener('webkitbeginfullscreen', () => { video.style.objectFit = 'contain'; }); // iOS
        video.addEventListener('webkitendfullscreen', () => { video.style.objectFit = 'cover'; });      // iOS

        const showOverlay = () => {
            if (video.seeking) return;
            overlay.classList.remove('hidden');
        };

        video.addEventListener('pause', showOverlay);
        video.addEventListener('ended', () => {
            video.controls = false;
            overlay.classList.remove('hidden');
        });
    });
}

function filterPortfolio(category) {
    const ACTIVE = ['bg-gradient-to-r', 'from-neonMagenta', 'to-neonPurple', 'text-white', 'shadow-neon-magenta'];
    const INACTIVE = ['bg-darkElevated', 'text-gray-400', 'border', 'border-white/10'];

    document.querySelectorAll('.portfolio-filter-btn').forEach((button) => {
        const isActive = button.dataset.filter === category;

        button.classList.remove(...(isActive ? INACTIVE : ACTIVE));
        button.classList.add(...(isActive ? ACTIVE : INACTIVE));
    });

    const videos =
        category === 'all'
            ? portfolioVideos
            : portfolioVideos.filter((v) => v.category === category);

    renderPortfolio(videos);
}
