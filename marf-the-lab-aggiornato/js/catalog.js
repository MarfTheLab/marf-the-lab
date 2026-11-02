// =========================================
// MARF THE LAB - CATALOG.JS
// Catalog rendering and filters
// =========================================

function renderCatalog(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!products.length) {
        grid.innerHTML = `
            <div class="col-span-full empty-state text-textMuted">
                Nessun prodotto trovato.
            </div>
        `;
        return;
    }

    products.forEach((p) => {
        const card = document.createElement('div');

        card.className =
            'product-card glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neonMagenta/50 transition-all flex flex-col group fade-in';

        card.innerHTML = `
            <div class="product-card-image relative overflow-hidden bg-darkElevated">
                ${buildProductMockup(p)}
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <div class="text-[10px] font-mono uppercase text-neonMagenta mb-1">
                        ${sanitizeHTML(p.category)}
                    </div>

                    <h3 class="font-display font-bold text-base text-white">
                        ${sanitizeHTML(p.title)}
                    </h3>

                    <p class="text-xs text-textMuted mt-1">
                        ${sanitizeHTML(p.description)}
                    </p>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-white/10">
                    <span class="text-lg font-bold font-display text-white">
                        ${formatPrice(p.price)}
                    </span>

                    <button
                        onclick="addToCart('${sanitizeHTML(p.id)}', this)"
                        class="px-4 py-2 rounded-xl bg-gradient-to-r from-neonMagenta/20 to-neonCyan/20 hover:from-neonMagenta hover:to-neonCyan text-white text-xs uppercase font-bold transition-all"
                    >
                        Aggiungi
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterCatalog(category) {
    const ACTIVE = ['bg-gradient-to-r', 'from-neonMagenta', 'to-neonPurple', 'text-white', 'shadow-neon-magenta'];
    const INACTIVE = ['bg-darkElevated', 'text-gray-400', 'border', 'border-white/10'];

    document.querySelectorAll('.filter-btn').forEach((button) => {
        const isActive = button.dataset.filter === category;

        button.classList.toggle('active', isActive);
        button.classList.remove(...(isActive ? INACTIVE : ACTIVE));
        button.classList.add(...(isActive ? ACTIVE : INACTIVE));
    });

    const products =
        category === 'all'
            ? productsDB
            : productsDB.filter((p) => p.category === category);

    renderCatalog(products);
}
