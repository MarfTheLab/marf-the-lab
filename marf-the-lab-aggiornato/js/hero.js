// =========================================
// MARF THE LAB - HERO.JS
// Oggetti anime che cadono e ruotano nella hero
// (al posto dei vecchi pallini)
// =========================================

function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Sprite SVG (ognuno è autonomo, niente riferimenti esterni) ----------
    const svg = (w, h, inner, defs = '') =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
        (defs ? `<defs>${defs}</defs>` : '') + inner + '</svg>';

    const starPts = '0,-9 2.6,-3.4 8.6,-2.8 4.2,1.3 5.3,7.3 0,4.4 -5.3,7.3 -4.2,1.3 -8.6,-2.8 -2.6,-3.4';
    const star = (x, y, s) =>
        `<polygon points="${starPts}" transform="translate(${x} ${y}) scale(${s})" fill="#c1121f"/>`;

    const dbGrad =
        '<radialGradient id="g" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe08a"/>' +
        '<stop offset=".45" stop-color="#ff9f1c"/><stop offset="1" stop-color="#d9480f"/></radialGradient>';
    const dbBase =
        '<circle cx="50" cy="50" r="46" fill="url(#g)"/>' +
        '<ellipse cx="34" cy="28" rx="14" ry="8" fill="#fff" opacity=".35" transform="rotate(-30 34 28)"/>';

    const spiral = (cx, cy, turns, step, grow) => {
        const pts = [];
        const n = 140;
        for (let i = 0; i <= n; i++) {
            const t = (i / n) * turns * 2 * Math.PI;
            const r = grow + t * step;
            pts.push(`${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`);
        }
        return 'M' + pts.join(' L');
    };

    const tomoe = [0, 120, 240].map((a) =>
        `<g transform="rotate(${a} 50 50)"><circle cx="50" cy="26" r="6.5" fill="#000"/>` +
        '<path d="M44 27 C40 36 46 40 50 38 C46 36 47 31 50 30Z" fill="#000"/></g>'
    ).join('');

    const cloudBody =
        'M14 112 C42 104 62 98 72 82 C74 56 102 40 127 51 C137 25 177 14 202 35 C217 21 248 29 253 56 ' +
        'C279 66 284 102 258 120 C252 143 216 153 196 138 C176 164 130 164 115 143 C95 159 60 149 55 128 C40 131 26 128 14 112 Z';

    const SPRITES = [
        { // Dragon Ball 4 stelle
            w: 100, h: 100,
            svg: svg(100, 100, dbBase + star(40, 40, 1.1) + star(62, 40, 1.1) + star(40, 62, 1.1) + star(62, 62, 1.1), dbGrad)
        },
        { // Dragon Ball 1 stella
            w: 100, h: 100,
            svg: svg(100, 100, dbBase + star(50, 50, 2.1), dbGrad)
        },
        { // Sharingan
            w: 100, h: 100,
            svg: svg(100, 100,
                '<circle cx="50" cy="50" r="46" fill="#d90429" stroke="#000" stroke-width="4"/>' +
                '<circle cx="50" cy="50" r="30" fill="none" stroke="#000" stroke-width="1.5" opacity=".6"/>' +
                tomoe + '<circle cx="50" cy="50" r="7" fill="#000"/>')
        },
        { // Rasengan
            w: 100, h: 100,
            svg: svg(100, 100,
                '<circle cx="50" cy="50" r="46" fill="url(#r)"/>' +
                `<path d="${spiral(50, 50, 2.6, 2.6, 2)}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>`,
                '<radialGradient id="r" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/>' +
                '<stop offset=".4" stop-color="#7dd3fc"/><stop offset="1" stop-color="#1d4ed8"/></radialGradient>')
        },
        { // Fascia Konoha
            w: 100, h: 100,
            svg: svg(100, 100,
                '<rect x="4" y="22" width="92" height="56" rx="8" fill="#2b3a67"/>' +
                '<rect x="14" y="30" width="72" height="40" rx="5" fill="#c9d3e0" stroke="#8d99ae" stroke-width="2"/>' +
                `<path d="${spiral(50, 50, 3.2, 0.83, 0.9)}" fill="none" stroke="#2b3a67" stroke-width="3.5" stroke-linecap="round"/>`)
        },
        { // Kunai
            w: 100, h: 130,
            svg: svg(100, 130,
                '<circle cx="50" cy="12" r="9" fill="none" stroke="#aab4c5" stroke-width="5"/>' +
                '<rect x="45" y="21" width="10" height="34" rx="2" fill="#1b1f2b" stroke="#3a4156"/>' +
                '<polygon points="50,52 70,78 50,126 30,78" fill="#c9d3e0" stroke="#8d99ae" stroke-width="2"/>' +
                '<line x1="50" y1="58" x2="50" y2="116" stroke="#8d99ae" stroke-width="2"/>')
        },
        { // Shuriken
            w: 100, h: 100,
            svg: svg(100, 100,
                '<path d="M50 4 L60 38 L96 50 L60 62 L50 96 L40 62 L4 50 L40 38 Z" fill="#b8c2d1" stroke="#1b1f2b" stroke-width="3" stroke-linejoin="round"/>' +
                '<circle cx="50" cy="50" r="7" fill="#0b0c10"/>')
        },
        { // Cappello di paglia
            w: 100, h: 70,
            svg: svg(100, 70,
                '<ellipse cx="50" cy="48" rx="47" ry="15" fill="#e9b949" stroke="#8a5a14" stroke-width="2"/>' +
                '<path d="M22 46 C20 12 80 12 78 46 C62 53 38 53 22 46Z" fill="#f4cf6a" stroke="#8a5a14" stroke-width="2"/>' +
                '<path d="M22.5 38 C38 46 62 46 77.5 38 L78 46 C62 53 38 53 22 46Z" fill="#d62828"/>')
        },
        { // Poké Ball
            w: 100, h: 100,
            svg: svg(100, 100,
                '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#111" stroke-width="5"/>' +
                '<path d="M4 50 A46 46 0 0 1 96 50 Z" fill="#e63946" stroke="#111" stroke-width="5" stroke-linejoin="round"/>' +
                '<line x1="4" y1="50" x2="96" y2="50" stroke="#111" stroke-width="7"/>' +
                '<circle cx="50" cy="50" r="13" fill="#fff" stroke="#111" stroke-width="6"/>')
        },
        { // Nuvola Akatsuki
            w: 290, h: 200,
            svg: svg(290, 200,
                `<path d="${cloudBody}" fill="#000" stroke="#000" stroke-width="16" stroke-linejoin="round"/>` +
                `<path d="${cloudBody}" fill="#c8102e" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>` +
                '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">' +
                '<path d="M138 66 C172 56 182 96 158 104 C142 108 132 92 146 84"/>' +
                '<path d="M206 92 C230 84 240 112 220 120 C208 123 200 109 211 104"/>' +
                '<path d="M100 138 C80 128 88 104 110 112"/></g>')
        }
    ];

    // ---------- Caricamento sprite ----------
    const loadSprite = (sprite) =>
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ img, ratio: sprite.h / sprite.w });
            img.onerror = () => resolve(null);
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sprite.svg);
        });

    // ---------- Canvas ----------
    let width = 0;
    let height = 0;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    Promise.all(SPRITES.map(loadSprite)).then((loaded) => {
        const sprites = loaded.filter(Boolean);
        if (!sprites.length) return;

        const rand = (min, max) => min + Math.random() * (max - min);
        const count = Math.max(10, Math.min(20, Math.round(width / 70)));

        const particles = Array.from({ length: count }, (_, i) => ({
            sprite: sprites[i % sprites.length],       // ogni oggetto compare almeno una volta
            x: rand(0, width),
            y: rand(0, height),
            size: rand(34, 62) * (sprites[i % sprites.length].ratio < 0.8 ? 1.3 : 1),  // nuvola e cappello sono piatti: un po' più grandi
            vy: rand(0.25, 0.7),                        // cadono lentamente
            vx: rand(-0.15, 0.15),
            sway: rand(10, 28),                         // oscillazione laterale
            phase: rand(0, Math.PI * 2),
            angle: rand(0, Math.PI * 2),
            spin: rand(-0.012, 0.012),
            alpha: rand(0.55, 0.9),
            fade: 1
        }));

        // zone del testo: lì gli oggetti sfumano per non disturbare la lettura
        const content = parent.querySelector('.z-10');
        let textBoxes = [];

        function measureText() {
            textBoxes = [];
            if (!content) return;

            const p = parent.getBoundingClientRect();
            const pad = 24;
            const add = (rect) => {
                if (!rect.width || !rect.height) return;
                textBoxes.push({
                    l: rect.left - p.left - pad,
                    r: rect.right - p.left + pad,
                    t: rect.top - p.top - pad,
                    b: rect.bottom - p.top + pad
                });
            };

            // il titolo occupa tutta la larghezza: misuro solo il testo vero
            const heading = content.querySelector('h1');
            if (heading) {
                const range = document.createRange();
                range.selectNodeContents(heading);
                add(range.getBoundingClientRect());
            }

            content.querySelectorAll('div.inline-flex, p, a').forEach((el) =>
                add(el.getBoundingClientRect())
            );
        }

        measureText();

        function draw() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                const { img, ratio } = p.sprite;
                const w = ratio <= 1 ? p.size : p.size / ratio;
                const h = ratio <= 1 ? p.size * ratio : p.size;

                const px = p.x + Math.sin(p.phase) * p.sway;
                const overText = textBoxes.some((b) =>
                    px > b.l && px < b.r && p.y > b.t && p.y < b.b);
                p.fade += ((overText ? 0.12 : 1) - p.fade) * 0.08;

                ctx.save();
                ctx.globalAlpha = p.alpha * p.fade;
                ctx.translate(px, p.y);
                ctx.rotate(p.angle);
                ctx.drawImage(img, -w / 2, -h / 2, w, h);
                ctx.restore();
            });
        }

        let last = performance.now();
        let running = true;

        function animate(now) {
            const dt = Math.min(50, now - last) / 16.67;
            last = now;

            particles.forEach((p) => {
                p.y += p.vy * dt;
                p.x += p.vx * dt;
                p.phase += 0.01 * dt;
                p.angle += p.spin * dt;

                if (p.y - p.size > height) {            // uscito in basso: riparte dall'alto
                    p.y = -p.size;
                    p.x = rand(0, width);
                }
                if (p.x < -p.size) p.x = width + p.size;
                if (p.x > width + p.size) p.x = -p.size;
            });

            draw();
            if (running) requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            measureText();
            if (reduceMotion) draw();
        });

        if (reduceMotion) {
            draw();                                      // niente movimento: un solo fotogramma
            return;
        }

        // si ferma quando la hero non è visibile
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                const visible = entry.isIntersecting;
                if (visible && !running) {
                    running = true;
                    last = performance.now();
                    requestAnimationFrame(animate);
                } else if (!visible) {
                    running = false;
                }
            }).observe(parent);
        }

        requestAnimationFrame(animate);
    });
}
