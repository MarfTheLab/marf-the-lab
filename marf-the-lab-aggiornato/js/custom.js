// =========================================
// MARF THE LAB - CUSTOM.JS
// Custom request form
// =========================================

function updateCustomEstimate() {
    const support = document.getElementById('customSupport');
    const detail = document.getElementById('customDetail');
    const estimate = document.getElementById('customPriceEstimate');

    if (!support || !detail || !estimate) return;

    const total =
        parseFloat(support.value) +
        parseFloat(detail.value);

    estimate.innerText = formatPrice(total);
}

async function handleCustomSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!submitBtn) return;

    const originalText = submitBtn.innerText;

    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const supportSelect = document.getElementById('customSupport');
    const detailSelect = document.getElementById('customDetail');
    const fileInput = document.getElementById('fileUpload');

    const supportText =
        supportSelect.options[supportSelect.selectedIndex].text;

    const detailText =
        detailSelect.options[detailSelect.selectedIndex].text;

    const priceEstimate =
        parseFloat(supportSelect.value) +
        parseFloat(detailSelect.value);

    const payload = {
        customerName: name,
        customerEmail: email,
        productType: supportText,
        style: detailText,
        description:
            `Richiesta Custom: ${supportText} con dettaglio ${detailText}`,
        budget: priceEstimate,
        fileName: fileInput?.files?.[0]?.name || null
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Invio in corso...';

        const response = await fetch('/api/custom-request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'Impossibile inviare la richiesta.'
            );
        }

        alert('Richiesta inviata con successo! Salvata nel database.');
        form.reset();
        updateCustomEstimate();
    } catch (error) {
        console.error('Errore Custom Request:', error);
        alert(error.message || 'Errore di connessione con il server.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
    }
}
