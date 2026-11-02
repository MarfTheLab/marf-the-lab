// =========================================
// MARF THE LAB - CART.JS
// Cart state, UI and checkout
// =========================================

function addToCart(id, sourceEl) {
    const item = productsDB.find((p) => p.id === id);
    if (!item) return;

    const existing = cartState.find((c) => c.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cartState.push({ ...item, quantity: 1 });
    }

    // Il carrello si aggiorna quando la nuvola arriva a destinazione
    flyCloudToCart(sourceEl).then(() => {
        updateCartUI();
        bumpCartButton();
    });
}

function changeCartQuantity(id, amount) {
    const item = cartState.find((cartItem) => cartItem.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cartState = cartState.filter((cartItem) => cartItem.id !== id);
    }

    updateCartUI();
}

function removeFromCart(id) {
    cartState = cartState.filter((item) => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    const badge = document.getElementById('cartBadge');

    if (!container || !totalEl || !badge) return;

    const quantity = cartState.reduce(
        (total, item) => total + item.quantity,
        0
    );

    badge.innerText = quantity;

    if (cartState.length === 0) {
        container.innerHTML = `
            <div class="empty-state text-textMuted">
                <div>
                    <i class="fa-solid fa-bag-shopping text-3xl mb-3 text-neonCyan"></i>
                    <p>Il tuo carrello è vuoto.</p>
                </div>
            </div>
        `;
        totalEl.innerText = formatPrice(0);
        return;
    }

    let total = 0;

    container.innerHTML = cartState.map((item) => {
        total += item.price * item.quantity;

        return `
            <div class="cart-item flex items-center justify-between p-3 rounded-xl bg-darkElevated">
                <div class="min-w-0">
                    <div class="text-xs font-bold text-white">
                        ${sanitizeHTML(item.title)}
                    </div>

                    <div class="text-[10px] text-neonCyan mt-1">
                        ${formatPrice(item.price)}
                    </div>

                    <div class="cart-item-actions mt-2">
                        <button
                            class="cart-quantity-btn"
                            onclick="changeCartQuantity('${sanitizeHTML(item.id)}', -1)"
                            aria-label="Diminuisci quantità"
                        >−</button>

                        <span class="text-xs text-white min-w-5 text-center">
                            ${item.quantity}
                        </span>

                        <button
                            class="cart-quantity-btn"
                            onclick="changeCartQuantity('${sanitizeHTML(item.id)}', 1)"
                            aria-label="Aumenta quantità"
                        >+</button>

                        <button
                            class="cart-remove-btn ml-2 text-xs"
                            onclick="removeFromCart('${sanitizeHTML(item.id)}')"
                        >
                            Rimuovi
                        </button>
                    </div>
                </div>

                <div class="text-sm font-bold text-white ml-4">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `;
    }).join('');

    totalEl.innerText = formatPrice(total);
}

async function handleCheckout() {
    if (cartState.length === 0) {
        alert('Il tuo carrello è vuoto!');
        return;
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    const originalText = checkoutBtn.innerHTML;

    try {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML =
            '<i class="fa-solid fa-spinner animate-spin"></i> Reindirizzamento...';

        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cartState })
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
            return;
        }

        throw new Error(
            data.error || 'Errore durante la creazione del checkout.'
        );
    } catch (error) {
        console.error('Errore Checkout:', error);
        alert(error.message || 'Si è verificato un errore di connessione con il server.');
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalText;
    }
}
