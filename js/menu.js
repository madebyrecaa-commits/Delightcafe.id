// ===== MENU RENDER & FILTER =====
let currentFilter = 'Semua';
let currentSearch = '';

function renderMenuPage() {
    const container = document.getElementById('page-container');
    let filtered = menuData;

    // Filter kategori
    if (currentFilter !== 'Semua') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    // Pencarian
    if (currentSearch.trim() !== '') {
        const q = currentSearch.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(q) || 
            item.desc.toLowerCase().includes(q)
        );
    }

    let html = `
        <div class="container">
            <h2 class="section-title">🍽️ Menu Kami</h2>
            <div class="menu-controls">
                <div class="filter-group">
                    <button class="filter-btn ${currentFilter === 'Semua' ? 'active' : ''}" data-filter="Semua">Semua</button>
                    <button class="filter-btn ${currentFilter === 'Makanan' ? 'active' : ''}" data-filter="Makanan">Makanan</button>
                    <button class="filter-btn ${currentFilter === 'Minuman' ? 'active' : ''}" data-filter="Minuman">Minuman</button>
                    <button class="filter-btn ${currentFilter === 'Snack' ? 'active' : ''}" data-filter="Snack">Snack</button>
                    <button class="filter-btn ${currentFilter === 'Dessert' ? 'active' : ''}" data-filter="Dessert">Dessert</button>
                </div>
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="menu-search" placeholder="Cari menu..." value="${currentSearch}" />
                </div>
            </div>
            <div class="menu-grid">
    `;

    if (filtered.length === 0) {
        html += `<div class="empty-state"><i class="fas fa-utensils"></i><p>Tidak ada menu yang cocok</p></div>`;
    } else {
        filtered.forEach(item => {
            const badges = [];
            if (item.popular) badges.push('<span class="badge">Populer</span>');
            if (item.new) badges.push('<span class="badge new">Baru</span>');
            html += `
                <div class="menu-card" data-id="${item.id}">
                    <div class="card-img">${item.emoji}</div>
                    <div class="card-body">
                        <h3>${item.name}</h3>
                        <div class="desc">${item.desc}</div>
                        <div class="price">${formatRupiah(item.price)}</div>
                        <div class="card-actions">
                            ${badges.join(' ')}
                            <button class="add-to-cart-btn" data-id="${item.id}">
                                <i class="fas fa-plus"></i> Tambah
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    container.innerHTML = html;

    // Event listeners untuk filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            renderMenuPage();
            // update active state di nav
            document.querySelectorAll('#main-nav a').forEach(a => a.classList.remove('active'));
            document.querySelector('#main-nav a[data-page="menu"]').classList.add('active');
        });
    });

    // Event listener untuk pencarian
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            renderMenuPage();
        });
    }

    // Event listener untuk tombol tambah ke keranjang
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const item = menuData.find(m => m.id === id);
            if (item) addToCart(item);
        });
    });
}
