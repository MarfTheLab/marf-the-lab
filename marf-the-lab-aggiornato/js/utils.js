// =========================================
// MARF THE LAB - UTILS.JS
// Small reusable helpers
// =========================================

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = String(str ?? '');
    return temp.innerHTML;
}

function formatPrice(value) {
    return `${Number(value).toFixed(2).replace('.', ',')} €`;
}
