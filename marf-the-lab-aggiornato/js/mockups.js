// =========================================
// MARF THE LAB - MOCKUPS.JS
// Disegna l'anteprima del prodotto (felpa, t-shirt, quadro su tela)
// con sopra il disegno indicato in data.js -> image.
//
// In data.js ogni prodotto può avere:
//   mockup:    'hoodie' | 'tee' | 'canvas'   (se manca: mostra solo la foto)
//   image:     il disegno da stampare (es. 'img/zoro.jpg')
//   artMono:   true  -> stampa in bianco e nero
//   artZoom:   es. 1.4 -> ingrandisce il disegno dentro la stampa
//   artFocus:  [x, y] da 0 a 1 -> punto del disegno da tenere al centro
// =========================================

function escapeAttr(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const MOCKUP_THEME = {
    Anime:      { glow: '#ff007f', glow2: '#a855f7', accent: '#ff007f' },
    Realistico: { glow: '#00f3ff', glow2: '#3b82f6', accent: '#00f3ff' }
};

// Garment shapes (coordinate 0..400)
const HOODIE_BODY = 'M160 78 C140 82 112 88 100 100 C88 112 72 220 58 305 L56 335 L98 338 L106 305 L124 178 L126 365 L274 365 L276 178 L294 305 L302 338 L344 335 L342 305 C328 220 312 112 300 100 C288 88 260 82 240 78 Z';
const HOODIE_HOOD = 'M146 100 C134 52 166 26 200 26 C234 26 266 52 254 100 C240 84 222 76 200 76 C178 76 160 84 146 100 Z';
const HOODIE_OPEN = 'M166 96 C168 70 184 58 200 58 C216 58 232 70 234 96 C222 88 212 86 200 86 C188 86 178 88 166 96 Z';
const TEE_BODY = 'M152 66 C170 80 230 80 248 66 L322 92 L356 162 L310 182 L292 150 L294 362 L106 362 L108 150 L90 182 L44 162 L78 92 Z';

function artImage(p, box, uid) {
    const zoom = Number(p.artZoom) || 1;
    const [fx, fy] = Array.isArray(p.artFocus) ? p.artFocus : [0.5, 0.5];
    const w = box.w * zoom;
    const h = box.h * zoom;
    const x = box.x - (w - box.w) * fx;
    const y = box.y - (h - box.h) * fy;
    const filter = p.artMono ? `filter="url(#${uid}-mono)"` : '';

    return `
        <g clip-path="url(#${uid}-print)">
            <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="#0b0c10"/>
            <image href="${escapeAttr(p.image)}" x="${x}" y="${y}" width="${w}" height="${h}"
                   preserveAspectRatio="xMidYMid slice" ${filter}/>
        </g>`;
}

function mockupDefs(p, uid, box, theme) {
    return `
        <defs>
            <radialGradient id="${uid}-bg" cx="50%" cy="42%" r="70%">
                <stop offset="0" stop-color="${theme.glow2}" stop-opacity=".30"/>
                <stop offset=".45" stop-color="${theme.glow}" stop-opacity=".10"/>
                <stop offset="1" stop-color="#0b0c10" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="${uid}-light" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#fff" stop-opacity=".10"/>
                <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
                <stop offset="1" stop-color="#000" stop-opacity=".35"/>
            </linearGradient>
            <linearGradient id="${uid}-fold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#000" stop-opacity="0"/>
                <stop offset="1" stop-color="#000" stop-opacity=".35"/>
            </linearGradient>
            <filter id="${uid}-mono"><feColorMatrix type="saturate" values="0"/></filter>
            <filter id="${uid}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
            <clipPath id="${uid}-print"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${box.r || 3}"/></clipPath>
            <pattern id="${uid}-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24 0H0V24" fill="none" stroke="#fff" stroke-opacity=".035"/>
            </pattern>
        </defs>`;
}

function studioBackdrop(uid) {
    return `
        <rect x="-100" width="600" height="336" fill="#0f1017"/>
        <rect x="-100" width="600" height="336" fill="url(#${uid}-grid)"/>
        <rect x="-100" width="600" height="336" fill="url(#${uid}-bg)"/>
        <ellipse cx="200" cy="318" rx="130" ry="12" fill="#000" opacity=".55" filter="url(#${uid}-blur)"/>`;
}

function hoodieMockup(p, uid, theme) {
    const box = { x: 152, y: 110, w: 96, h: 132, r: 4 };
    return `
        ${mockupDefs(p, uid, box, theme)}
        ${studioBackdrop(uid)}
        <g transform="translate(28 4) scale(.86)">
            <path d="${HOODIE_HOOD}" fill="#14151c" stroke="#262836" stroke-width="2"/>
            <path d="${HOODIE_BODY}" fill="#17181f" stroke="#262836" stroke-width="2" stroke-linejoin="round"/>
            <path d="${HOODIE_OPEN}" fill="#07080b"/>
            <!-- cuciture sulle maniche -->
            <path d="M124 178 C118 150 108 122 100 100 M276 178 C282 150 292 122 300 100" stroke="#0b0c10" stroke-width="2" fill="none" opacity=".7"/>
            ${artImage(p, box, uid)}
            <!-- tasca a marsupio -->
            <path d="M148 262 L252 262 L266 332 L134 332 Z" fill="#000" fill-opacity=".18" stroke="#2a2c3a" stroke-width="2" stroke-linejoin="round"/>
            <!-- polsini e fondo a costine -->
            <path d="M56 322 L99 325 M344 322 L301 325 M126 348 H274" stroke="#2a2c3a" stroke-width="2"/>
            <!-- cordini -->
            <g stroke="#d4d4d8" stroke-width="2.4" stroke-linecap="round" fill="none">
                <path d="M186 92 C184 112 185 128 182 146"/>
                <path d="M214 92 C216 112 215 128 218 146"/>
            </g>
            <g fill="${theme.accent}">
                <rect x="179" y="144" width="6" height="11" rx="2"/>
                <rect x="215" y="144" width="6" height="11" rx="2"/>
            </g>
            <path d="${HOODIE_BODY}" fill="url(#${uid}-light)"/>
            <path d="${HOODIE_BODY}" fill="url(#${uid}-fold)" opacity=".6"/>
        </g>`;
}

function teeMockup(p, uid, theme) {
    const box = { x: 150, y: 112, w: 100, h: 132, r: 3 };
    return `
        ${mockupDefs(p, uid, box, theme)}
        ${studioBackdrop(uid)}
        <g transform="translate(28 10) scale(.86)">
            <path d="${TEE_BODY}" fill="#15161d" stroke="#262836" stroke-width="2" stroke-linejoin="round"/>
            <!-- colletto -->
            <path d="M152 66 C170 92 230 92 248 66" fill="none" stroke="#2a2c3a" stroke-width="7" stroke-linecap="round"/>
            <path d="M152 66 C170 80 230 80 248 66" fill="none" stroke="#0b0c10" stroke-width="2"/>
            <!-- cuciture maniche -->
            <path d="M108 150 L104 96 M292 150 L296 96" stroke="#0b0c10" stroke-width="2" opacity=".7"/>
            <path d="M90 182 L44 162 M310 182 L356 162" stroke="#2a2c3a" stroke-width="2"/>
            ${artImage(p, box, uid)}
            <path d="${TEE_BODY}" fill="url(#${uid}-light)"/>
            <path d="${TEE_BODY}" fill="url(#${uid}-fold)" opacity=".5"/>
        </g>`;
}

function canvasMockup(p, uid, theme) {
    // tela 60x80 (3:4) appesa a una parete
    const box = { x: 116, y: 26, w: 168, h: 224, r: 0 };
    return `
        ${mockupDefs(p, uid, box, theme)}
        <defs>
            <linearGradient id="${uid}-wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#1b1d28"/>
                <stop offset="1" stop-color="#11121a"/>
            </linearGradient>
            <radialGradient id="${uid}-spot" cx="50%" cy="0%" r="75%">
                <stop offset="0" stop-color="#fff7e6" stop-opacity=".22"/>
                <stop offset=".5" stop-color="${theme.glow2}" stop-opacity=".08"/>
                <stop offset="1" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="${uid}-floor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#0d0e14"/>
                <stop offset="1" stop-color="#07080b"/>
            </linearGradient>
        </defs>
        <rect x="-100" width="600" height="336" fill="url(#${uid}-wall)"/>
        <ellipse cx="200" cy="30" rx="230" ry="230" fill="url(#${uid}-spot)"/>
        <rect x="-100" y="282" width="600" height="54" fill="url(#${uid}-floor)"/>
        <rect x="-100" y="279" width="600" height="3" fill="#262836"/>
        <!-- ombra della tela -->
        <rect x="${box.x + 8}" y="${box.y + 12}" width="${box.w}" height="${box.h}" fill="#000" opacity=".6" filter="url(#${uid}-blur)"/>
        <!-- bordi laterali (spessore telaio) -->
        <path d="M${box.x + box.w} ${box.y} l7 5 v${box.h} l-7 -5 Z" fill="#0b0c10"/>
        <path d="M${box.x} ${box.y + box.h} h${box.w} l7 5 h-${box.w} Z" fill="#08090d"/>
        ${artImage(p, box, uid)}
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="#fff" stroke-opacity=".08"/>
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="url(#${uid}-light)" opacity=".7"/>
        <!-- riflesso a pavimento -->
        <rect x="${box.x + 20}" y="292" width="${box.w - 40}" height="6" rx="3" fill="${theme.glow}" opacity=".25" filter="url(#${uid}-blur)"/>
        <!-- targhetta formato -->
        <g font-family="Space Grotesk, Inter, sans-serif" font-size="10" letter-spacing="1.5">
            <rect x="${box.x + box.w + 22}" y="${box.y + box.h - 22}" width="54" height="20" rx="4" fill="#0b0c10" stroke="${theme.accent}" stroke-opacity=".5"/>
            <text x="${box.x + box.w + 49}" y="${box.y + box.h - 8.5}" text-anchor="middle" fill="#e2e8f0">60×80</text>
        </g>`;
}

function buildProductMockup(p) {
    const builders = { hoodie: hoodieMockup, tee: teeMockup, canvas: canvasMockup };
    const build = builders[p.mockup];
    const uid = `mk-${String(p.id).replace(/[^a-z0-9_-]/gi, '')}`;
    const theme = MOCKUP_THEME[p.category] || MOCKUP_THEME.Anime;

    if (!build) {
        return `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" class="w-full h-full object-cover" loading="lazy">`;
    }

    return `
        <svg class="product-mockup" viewBox="-40 0 480 336" preserveAspectRatio="xMidYMid slice"
             role="img" aria-label="${escapeAttr(p.title)}" xmlns="http://www.w3.org/2000/svg">
            ${build(p, uid, theme)}
        </svg>`;
}
