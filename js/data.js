// ===== DATA MENU =====
const menuData = [
    {
        id: 1,
        name: 'Classic Croissant',
        category: 'Makanan',
        price: 25000,
        desc: 'Croissant mentega dengan lapisan renyah dan lembut.',
        emoji: '🥐',
        popular: true,
        new: false
    },
    {
        id: 2,
        name: 'Iced Caramel Latte',
        category: 'Minuman',
        price: 32000,
        desc: 'Espresso dengan karamel dan susu dingin yang menyegarkan.',
        emoji: '🧋',
        popular: true,
        new: false
    },
    {
        id: 3,
        name: 'Matcha Cheesecake',
        category: 'Dessert',
        price: 38000,
        desc: 'Cheesecake lembut dengan sentuhan matcha autentik.',
        emoji: '🍰',
        popular: false,
        new: true
    },
    {
        id: 4,
        name: 'Truffle Fries',
        category: 'Snack',
        price: 28000,
        desc: 'Kentang goreng dengan truffle oil dan parmesan.',
        emoji: '🍟',
        popular: false,
        new: false
    },
    {
        id: 5,
        name: 'Avocado Toast',
        category: 'Makanan',
        price: 35000,
        desc: 'Roti panggang dengan alpukat, telur, dan rempah.',
        emoji: '🥑',
        popular: false,
        new: true
    },
    {
        id: 6,
        name: 'Strawberry Milkshake',
        category: 'Minuman',
        price: 29000,
        desc: 'Susu kocok stroberi dengan topping whipped cream.',
        emoji: '🥤',
        popular: false,
        new: false
    },
    {
        id: 7,
        name: 'Chocolate Lava Cake',
        category: 'Dessert',
        price: 42000,
        desc: 'Kue cokelat dengan lelehan cokelat di dalamnya.',
        emoji: '🍫',
        popular: true,
        new: false
    },
    {
        id: 8,
        name: 'Nachos Supreme',
        category: 'Snack',
        price: 33000,
        desc: 'Nachos dengan keju, salsa, dan guacamole.',
        emoji: '🌮',
        popular: false,
        new: false
    },
    {
        id: 9,
        name: 'Pancake Stack',
        category: 'Makanan',
        price: 39000,
        desc: 'Tumpukan pancake dengan madu dan buah segar.',
        emoji: '🥞',
        popular: false,
        new: false
    },
    {
        id: 10,
        name: 'Mango Smoothie',
        category: 'Minuman',
        price: 26000,
        desc: 'Smoothie mangga segar dengan yogurt.',
        emoji: '🥭',
        popular: false,
        new: false
    },
    {
        id: 11,
        name: 'Tiramisu',
        category: 'Dessert',
        price: 40000,
        desc: 'Tiramisu klasik dengan kopi dan mascarpone.',
        emoji: '🍮',
        popular: true,
        new: false
    },
    {
        id: 12,
        name: 'Onion Rings',
        category: 'Snack',
        price: 22000,
        desc: 'Cincin bawang renyah dengan saus pedas manis.',
        emoji: '🧅',
        popular: false,
        new: false
    }
];

// ===== UTILITY =====
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

function generateOrderId() {
    return 'DEL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
}

function getTodayString() {
    return new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
