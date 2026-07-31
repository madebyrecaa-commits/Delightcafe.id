// ===== SPIN & WIN =====
let currentOrder = null;
let isSpinning = false;

const prizes = [
    { label: 'Diskon 5%', value: 'diskon5', emoji: '🎉' },
    { label: 'Diskon 10%', value: 'diskon10', emoji: '🎊' },
    { label: 'Diskon 15%', value: 'diskon15', emoji: '✨' },
    { label: 'Diskon 20%', value: 'diskon20', emoji: '🔥' },
    { label: 'Minuman Gratis', value: 'minuman', emoji: '🥤' },
    { label: 'Makanan Gratis', value: 'makanan', emoji: '🍔' },
    { label: 'Voucher Rp 10K', value: 'voucher10k', emoji: '💰' },
    { label: 'Coba Lagi', value: 'coba_lagi', emoji: '😅' }
];

function openSpinModal(order) {
    currentOrder = order;
    const modal = document.getElementById('spin-modal');
    modal.classList.add('active');
    document.getElementById('spin-result').innerHTML = '<p>Tekan tombol SPIN untuk memutar roda!</p>';
    document.getElementById('spin-btn').disabled = false;
    drawWheel(0);
}

function drawWheel(rotation) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const centerX = w/2;
    const centerY = h/2;
    const radius = Math.min(w, h) * 0.42;
    const segmentAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, w, h);

    // Gambar segmen
    for (let i = 0; i < prizes.length; i++) {
        const startAngle = rotation + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Warna selang-seling
        ctx.fillStyle = i % 2 === 0 ? '#F5E6D3' : '#D4A373';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Teks di dalam segmen
        const midAngle = startAngle + segmentAngle / 2;
        const textX = centerX + (radius * 0.65) * Math.cos(midAngle);
        const textY = centerY + (radius * 0.65) * Math.sin(midAngle);
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + (midAngle > Math.PI/2 ? Math.PI : 0));
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillStyle = '#1A1A1A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = prizes[i].label;
        const lines = label.split(' ');
        if (lines.length === 1) {
            ctx.fillText(label, 0, 0);
        } else {
            ctx.fillText(lines[0], 0, -8);
            ctx.fillText(lines[1] || '', 0, 12);
        }
        ctx.restore();
    }

    // Lingkaran tengah
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#6F4E37';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Panah di atas (pointer)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 12);
    ctx.lineTo(centerX - 14, centerY - radius - 30);
    ctx.lineTo(centerX + 14, centerY - radius - 30);
    ctx.closePath();
    ctx.fillStyle = '#D4A373';
    ctx.fill();
    ctx.strokeStyle = '#6F4E37';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    if (!currentOrder) return;

    isSpinning = true;
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('spin-result').innerHTML = '<p>Memutar roda...</p>';

    // Putaran acak: 5-10 putaran penuh + sudut acak
    const extraSpins = 5 + Math.random() * 5;
    const targetAngle = Math.random() * 2 * Math.PI;
    const totalRotation = extraSpins * 2 * Math.PI + targetAngle;

    const canvas = document.getElementById('wheelCanvas');
    const duration = 4000; // 4 detik
    const startTime = performance.now();
    const startRotation = 0;

    function animateSpin(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easing: cubic-bezier
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRotation = totalRotation * eased;
        drawWheel(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            // Selesai, tentukan hadiah
            const finalRotation = totalRotation % (2 * Math.PI);
            // Cari segmen yang berada di posisi panah (atas = -PI/2)
            // Panah menunjuk ke atas, sudut = -PI/2
            // Normalisasi sudut segmen
            let pointerAngle = -Math.PI / 2;
            // Hitung selisih
            let rawIndex = (pointerAngle - finalRotation) / segmentAngle;
            // Normalisasi
            let index = Math.round(((rawIndex % prizes.length) + prizes.length) % prizes.length);
            if (index >= prizes.length) index = 0;
            const prize = prizes[index];
            showSpinResult(prize);
            isSpinning = false;
            document.getElementById('spin-btn').disabled = false;
        }
    }

    requestAnimationFrame(animateSpin);
}

function showSpinResult(prize) {
    const resultDiv = document.getElementById('spin-result');
    let message = '';
    let isWin = prize.value !== 'coba_lagi';

    if (isWin) {
        message = `🎉 Selamat! Anda mendapatkan <span class="prize">${prize.emoji} ${prize.label}</span>!`;
        // Simpan hadiah ke order
        if (currentOrder) {
            currentOrder.spinPrize = prize.label;
            // Update riwayat
            const history = JSON.parse(localStorage.getItem('delight_history')) || [];
            const idx = history.findIndex(o => o.id === currentOrder.id);
            if (idx !== -1) {
                history[idx].spinPrize = prize.label;
                localStorage.setItem('delight_history', JSON.stringify(history));
            }
        }
        // Efek confetti sederhana
        launchConfetti();
    } else {
        message = `😅 ${prize.emoji} Coba lagi ya! Semoga beruntung next time.`;
        if (currentOrder) {
            currentOrder.spinPrize = 'Coba Lagi';
            const history = JSON.parse(localStorage.getItem('delight_history')) || [];
            const idx = history.findIndex(o => o.id === currentOrder.id);
            if (idx !== -1) {
                history[idx].spinPrize = 'Coba Lagi';
                localStorage.setItem('delight_history', JSON.stringify(history));
            }
        }
    }
    resultDiv.innerHTML = `<p>${message}</p>`;
}

// ===== CONFETTI SEDERHANA =====
function launchConfetti() {
    const colors = ['#D4A373', '#6F4E37', '#F5E6D3', '#2D6A4F', '#FFD700', '#FF6B6B'];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        const size = 6 + Math.random() * 8;
        const x = Math.random() * window.innerWidth;
        const y = -20 - Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 2000 + Math.random() * 2000;
        const rotate = Math.random() * 720;
        el.style.cssText = `
            position: fixed; left: ${x}px; top: ${y}px;
            width: ${size}px; height: ${size * 0.5}px;
            background: ${color};
            border-radius: 2px;
            pointer-events: none;
            z-index: 9999;
            transform: rotate(${rotate}deg);
            transition: transform ${duration}ms ease-out, top ${duration}ms ease-out, opacity ${duration}ms ease-out;
        `;
        document.body.appendChild(el);
        requestAnimationFrame(() => {
            el.style.top = (window.innerHeight + 50) + 'px';
            el.style.transform = `rotate(${rotate + 360}deg)`;
            el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), duration + 100);
    }
}

// Event listener spin
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spin-btn').addEventListener('click', spinWheel);
    document.getElementById('spin-close').addEventListener('click', function() {
        document.getElementById('spin-modal').classList.remove('active');
        currentOrder = null;
    });
    // Tutup modal spin jika klik overlay
    document.getElementById('spin-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            currentOrder = null;
        }
    });
});
