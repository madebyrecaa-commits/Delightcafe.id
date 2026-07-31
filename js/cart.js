// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('delight_cart')) || [];

function saveCart() {
    localStorage.setItem('delight_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
    renderCartItems();
    updateCartTotal();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-bag"></i><p>Keranjang kosong</p></div>`;
        return;
    }
    let html = '';
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-info">
                    <h4>${item.emoji} ${item.name}</h4>
                    <div class="item-price">${formatRupiah(item.price)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-minus" data-index="${index}">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-plus" data-index="${index}">+</button>
                </div>
                <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash-can"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;

    // Event untuk qty +/- dan hapus
    container.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            if (cart[idx].qty > 1) {
                cart[idx].qty--;
            } else {
                cart.splice(idx, 1);
            }
            saveCart();
        });
    });
    container.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            cart[idx].qty++;
            saveCart();
        });
    });
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            cart.splice(idx, 1);
            saveCart();
        });
    });
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    document.getElementById('cart-total-price').textContent = formatRupiah(total);
}

function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    saveCart();
    // Notifikasi kecil
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${item.id}"]`);
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Ditambahkan';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-plus"></i> Tambah';
        }, 1000);
    }
    // Buka sidebar jika diinginkan
    // openCartSidebar();
}

function clearCart() {
    if (confirm('Hapus semua item di keranjang?')) {
        cart = [];
        saveCart();
        if (document.getElementById('cart-sidebar').classList.contains('open')) {
            // tetap terbuka
        }
    }
}

// ===== SIDEBAR TOGGLE =====
function openCartSidebar() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.body.style.overflow = '';
}

// Event listeners untuk cart sidebar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cart-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        if (document.getElementById('cart-sidebar').classList.contains('open')) {
            closeCartSidebar();
        } else {
            openCartSidebar();
        }
    });
    document.getElementById('cart-close').addEventListener('click', closeCartSidebar);
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
    // Tutup sidebar jika klik di luar
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('cart-sidebar');
        const toggle = document.getElementById('cart-toggle');
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target)) {
            closeCartSidebar();
        }
    });
});
