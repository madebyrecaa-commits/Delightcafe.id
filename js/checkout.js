// ===== CHECKOUT =====
function openCheckoutModal() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');
    // Isi ringkasan
    updateCheckoutSummary();
    // Reset form
    document.getElementById('checkout-form').reset();
    document.getElementById('cust-name').value = '';
    document.getElementById('cust-phone').value = '';
    document.getElementById('cust-address').value = '';
    document.getElementById('cust-note').value = '';
}

function updateCheckoutSummary() {
    const container = document.getElementById('checkout-summary');
    let html = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `<div class="summary-item"><span>${item.emoji} ${item.name} × ${item.qty}</span><span>${formatRupiah(subtotal)}</span></div>`;
    });
    html += `<div class="summary-item summary-total"><span>Total</span><span>${formatRupiah(total)}</span></div>`;
    container.innerHTML = html;
}

function placeOrder(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    if (!name || !phone) {
        alert('Nama dan nomor telepon harus diisi!');
        return;
    }
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }

    // Buat pesanan
    const order = {
        id: generateOrderId(),
        date: getTodayString(),
        customer: name,
        phone: phone,
        address: document.getElementById('cust-address').value.trim() || '-',
        note: document.getElementById('cust-note').value.trim() || '-',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            emoji: item.emoji,
            price: item.price,
            qty: item.qty
        })),
        total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
        status: 'Diproses',
        spinPrize: null // akan diisi setelah spin
    };

    // Simpan ke riwayat
    const history = JSON.parse(localStorage.getItem('delight_history')) || [];
    history.unshift(order);
    localStorage.setItem('delight_history', JSON.stringify(history));

    // Kosongkan keranjang
    cart = [];
    saveCart();

    // Tutup modal checkout
    document.getElementById('checkout-modal').classList.remove('active');
    closeCartSidebar();

    // Buka modal spin
    openSpinModal(order);
}

// Event listener checkout
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('checkout-close').addEventListener('click', function() {
        document.getElementById('checkout-modal').classList.remove('active');
    });
    document.getElementById('checkout-form').addEventListener('submit', placeOrder);
    // Tutup modal jika klik overlay
    document.getElementById('checkout-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
