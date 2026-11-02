// =========================================
// MARF THE LAB - UI.JS
// Drawers, modals and mobile menu
// =========================================

function toggleCartDrawer(open) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;

    if (open === true) {
        drawer.classList.remove('hidden');
    } else if (open === false) {
        drawer.classList.add('hidden');
    } else {
        drawer.classList.toggle('hidden');
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;

    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

function toggleSearchModal(open) {
    const modal = document.getElementById('searchModal');
    if (!modal) return;

    if (open === true) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        const input = document.getElementById('searchInput');
        setTimeout(() => input?.focus(), 50);
        return;
    }

    if (open === false) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        return;
    }

    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');

    if (!modal.classList.contains('hidden')) {
        document.getElementById('searchInput')?.focus();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    toggleCartDrawer(false);
    toggleSearchModal(false);

    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    }
});
