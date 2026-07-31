// ===== HISTORY =====
function renderHistoryPage() {
    const container = document.getElementById('page-container');
    const history = JSON.parse(localStorage.getItem('delight_history')) || [];

    let html = `
        <div class="container">
            <h2 class="section-title">📋 Riwayat Pemesanan</h2>
    `;

    if (history.length === 0) {
        html += `
            <div class="empty-state">
                <i class="fas fa-clock-rotate-left"></i>
                <p>Belum ada pesanan. Ayo pesan sekarang!</p>
            </div>
        `;
    } else {
        html += `<div class="history-list">`;
        history.forEach(order => {
            const itemsList = order.items.map(i => `${i.emoji} ${i.name} (${i.qty})`).join(', ');
            html += `
                <div class="history-item">
                    <div class="hdr">
                        <span class="order-id"><i class="fas fa-receipt"></i> ${order.id}</span>
                        <span class="order-date"><i class="far fa-calendar"></i> ${order.date}</span>
                    </div>
                    <div class="details">
                        <span><i class="fas fa-user"></i> ${order.customer}</span>
                        <span><i class="fas fa-phone"></i> ${order.phone}</span>
                        <span class="total">${formatRupiah(order.total)}</span>
                        <span class="status"><i class="fas fa-check-circle"></i> ${order.status}</span>
                    </div>
                    <div style="font-size:0.9rem; color:var(--color-gray); margin-top:5px;">
                        <i class="fas fa-utensils"></i> ${itemsList}
                    </div>
                    ${order.spinPrize ? `<div class="spin-prize"><i class="fas fa-gift"></i> Hadiah Spin: ${order.spinPrize}</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
}
