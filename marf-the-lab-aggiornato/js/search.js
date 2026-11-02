// =========================================
// MARF THE LAB - SEARCH.JS
// Product search modal
// =========================================

function handleSearch() {
    const input = document.getElementById('searchInput');
    const container = document.getElementById('searchResults');

    if (!input || !container) return;

    const query = input.value.trim().toLowerCase();

    const results = productsDB.filter((p) => {
        return (
            p.title.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    });

    if (!query) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = results.length
        ? results.map((product) => `
            <div
                onclick="addToCart('${sanitizeHTML(product.id)}', this); toggleSearchModal(false);"
                class="search-result p-3 bg-darkElevated rounded-lg text-xs"
            >
                ${sanitizeHTML(product.title)}
                <span class="text-neonCyan ml-1">
                    - ${formatPrice(product.price)}
                </span>
            </div>
        `).join('')
        : `
            <div class="p-3 text-xs text-textMuted">
                Nessun prodotto trovato.
            </div>
        `;
}
