// =========================================
// MARF THE LAB - APP.JS
// Application bootstrap
// =========================================

window.addEventListener('DOMContentLoaded', () => {
    renderCatalog(productsDB);
    renderPortfolio(portfolioVideos);
    updateCartUI();
    updateCustomEstimate();
    initHeroCanvas();
});
