// ===== MAIN APP =====
document.addEventListener('DOMContentLoaded', function() {
    // Navigasi
    const navLinks = document.querySelectorAll('#main-nav a');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navUl = document.querySelector('#main-nav ul');

    // Mobile toggle
    mobileToggle.addEventListener('click', function() {
        navUl.classList.toggle('open');
    });

    // Tutup mobile nav jika klik link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            // Update active class
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Tutup mobile menu
            navUl.classList.remove('open');
            // Render halaman
            navigateTo(page);
        });
    });

    // Fungsi navigasi
    function navigateTo(page) {
        switch(page) {
            case 'home':
                renderHomePage();
                break;
            case 'menu':
                renderMenuPage();
                break;
            case 'history':
                renderHistoryPage();
                break;
            default:
                renderHomePage();
        }
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Tutup sidebar jika terbuka
        closeCartSidebar();
    }

    // Render Home
    function renderHomePage() {
        const container = document.getElementById('page-container');
        // Ambil 4 menu rekomendasi (popular)
        const recs = menuData.filter(m => m.popular).slice(0, 4);
        let recHtml = recs.map(m => `
            <div class="menu-card">
                <div class="card-img">${m.emoji}</div>
                <div class="card-body">
                    <h3>${m.name}</h3>
                    <div class="desc">${m.desc}</div>
                    <div class="price">${formatRupiah(m.price)}</div>
                    <button class="add-to-cart-btn" data-id="${m.id}"><i class="fas fa-plus"></i> Tambah</button>
                </div>
            </div>
        `).join('');

        // Testimoni fiktif
        const testi = [
            { name: 'Andi', text: 'Cappuccino-nya luar biasa! Suasana kafenya juga nyaman banget.' },
            { name: 'Siti', text: 'Matcha Cheesecake-nya lembut dan tidak terlalu manis. Favorit saya!' },
            { name: 'Rizky', text: 'Pelayanan ramah, tempat bersih, dan makanan enak. Recommended!' }
        ];
        let testiHtml = testi.map(t => `
            <div class="testimoni-card">
                <i class="fas fa-quote-right"></i>
                <p>"${t.text}"</p>
                <div class="name">- ${t.name}</div>
            </div>
        `).join('');

        const html = `
            <div class="container">
                <div class="hero">
                    <h1>☕ Delight Café</h1>
                    <p>Rasakan Kebahagiaan dalam Setiap Gigitan</p>
                </div>

                <h2 class="section-title">✨ Menu Rekomendasi</h2>
                <div class="recommend-grid">${recHtml}</div>

                <h2 class="section-title">💬 Testimoni</h2>
                <div class="testimoni-grid">${testiHtml}</div>
            </div>
        `;
        container.innerHTML = html;

        // Event untuk tombol tambah di rekomendasi
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const item = menuData.find(m => m.id === id);
                if (item) addToCart(item);
            });
        });
    }

    // Inisialisasi: render home
    renderHomePage();

    // Set active nav home
    document.querySelector('#main-nav a[data-page="home"]').classList.add('active');

    // Event untuk checkout dari sidebar
    // sudah di checkout.js

    // Inisialisasi cart UI
    updateCartUI();
});
