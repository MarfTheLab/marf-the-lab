// =========================================
// MARF THE LAB - CART-ANIMATION.JS
// La nuvola vola dal prodotto al carrello
// (tutto in JS: non dipende da nessun file CSS)
// =========================================

function flyCloudToCart(sourceEl) {
    return new Promise((resolve) => {
        const target = document.getElementById('cartButton');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!sourceEl || !target || reduceMotion) {
            resolve();
            return;
        }

        const size = 64;
        const s = sourceEl.getBoundingClientRect();
        const t = target.getBoundingClientRect();

        if (!s.width || !t.width) {
            resolve();
            return;
        }

        const startX = s.left + s.width / 2 - size / 2;
        const startY = s.top + s.height / 2 - size / 2;
        const endX = t.left + t.width / 2 - size / 2;
        const endY = t.top + t.height / 2 - size / 2;

        // punto alto dell'arco, così la nuvola "vola" invece di scivolare
        const midX = (startX + endX) / 2;
        const midY = Math.min(startY, endY) - 90;

        const cloud = document.createElement('div');
        cloud.setAttribute('aria-hidden', 'true');
        cloud.style.cssText =
            'position:fixed;top:0;left:0;z-index:9999;pointer-events:none;' +
            `width:${size}px;height:${size * 0.69}px;will-change:transform,opacity;` +
            'filter:drop-shadow(0 0 10px rgba(255,0,60,.6));opacity:0;';
        cloud.innerHTML =
            '<svg viewBox="0 0 290 200" width="100%" height="100%"><use href="#akatsukiCloud"/></svg>';
        document.body.appendChild(cloud);

        const frame = (x, y, scale, rot, opacity, offset) => ({
            transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
            opacity,
            offset
        });

        const animation = cloud.animate(
            [
                frame(startX, startY, 0.3, -8, 0, 0),
                frame(startX, startY - 10, 1.1, -4, 1, 0.12),
                frame(midX, midY, 1, 4, 1, 0.55),
                frame(endX, endY, 0.35, 10, 1, 0.92),
                frame(endX, endY, 0.15, 10, 0, 1)
            ],
            { duration: 950, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' }
        );

        animation.onfinish = () => {
            cloud.remove();
            resolve();
        };
    });
}

function bumpCartButton() {
    ['cartButton', 'cartBadge'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.3)', offset: 0.35 },
                { transform: 'scale(0.95)', offset: 0.7 },
                { transform: 'scale(1)' }
            ],
            { duration: 450, easing: 'ease' }
        );
    });
}
