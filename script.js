// Mock data
const categories = ["Fruits & Veg", "Dairy", "Beverages", "Snacks", "Bakery", "Household", "Personal Care"];
const products = [
    { id: 1, name: "Banana (1 Dozen)", price: 59, img: "images/banana.jpg", cat: "Fruits & Veg" },
    { id: 2, name: "Whole Milk (1L)", price: 59, img: "images/milk1.jpg", cat: "Dairy" },
    { id: 3, name: "Orange Juice (1L)", price: 129, img: "images/drink.jpg", cat: "Beverages" },
    { id: 4, name: "Potato Chips (150g)", price: 49, img: "images/chips.jpg", cat: "Snacks" },
    { id: 5, name: "Brown Bread", price: 39, img: "images/bread.jpg", cat: "Bakery" },
];

// State
let activeCategory = null;
const cart = new Map();

// Helpers
function formatINR(x) {
    return "₹" + x.toFixed(0);
}

// Elements
const catContainer = document.getElementById('categories');
const prodContainer = document.getElementById('products');
const qInput = document.getElementById('q');
const cartBtn = document.getElementById('cartBtn');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartBody = document.getElementById('cartBody');
const cartTotalEl = document.getElementById('cartTotal');

// Render categories
function renderCategories() {
    catContainer.innerHTML = '';
    categories.forEach(c => {
        const el = document.createElement('div');
        el.className = 'chip' + (c === activeCategory ? ' active' : '');
        el.textContent = c;
        el.onclick = () => {
            activeCategory = (c === activeCategory ? null : c);
            renderProducts();
            renderCategories();
        };
        catContainer.appendChild(el);
    });
}

// Render products
function renderProducts() {
    const q = qInput.value.trim().toLowerCase();
    prodContainer.innerHTML = '';
    const list = products.filter(p => {
        if (activeCategory && p.cat !== activeCategory) return false;
        if (q && !(p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))) return false;
        return true;
    });

    if (list.length === 0) {
        prodContainer.innerHTML = '<div style="padding:18px; text-align:center; color:#777;">🔍 No products found.</div>';
        return;
    }

    list.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <div class="img"><img src="${p.img}" alt="${p.name}"></div>
      <div class="pname">${p.name}</div>
      <div style="font-size:13px; color:#666">${p.cat}</div>
      <div class="price-row">
        <div class="price">${formatINR(p.price)}</div>
        <button class="add" data-id="${p.id}">+ Add</button>
      </div>`;
        prodContainer.appendChild(card);
    });

    document.querySelectorAll('.add').forEach(btn => {
        btn.onclick = e => addToCart(+e.target.dataset.id);
    });
}

// Cart UI
function updateCartUI() {
    let count = 0,
        total = 0;
    for (const [id, qty] of cart.entries()) {
        const p = products.find(x => x.id === id);
        count += qty;
        total += qty * p.price;
    }
    cartCountEl.textContent = count;
    cartTotalEl.textContent = formatINR(total);

    cartBody.innerHTML = '';
    if (cart.size === 0) {
        cartBody.innerHTML = '<div class="muted">🛒 Your cart is empty.</div>';
        return;
    }

    for (const [id, qty] of cart.entries()) {
        const p = products.find(x => x.id === id);
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
      <div style="width:40px;height:40px;"><img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;"></div>
      <div class="meta">
        <div style="font-weight:600">${p.name}</div>
        <div style="font-size:13px; color:#666">${formatINR(p.price)} × ${qty}</div>
      </div>
      <div style="margin-left:auto; display:flex; gap:6px;">
        <button class="icon-btn dec" data-id="${id}">−</button>
        <span>${qty}</span>
        <button class="icon-btn inc" data-id="${id}">+</button>
      </div>`;
        cartBody.appendChild(item);
    }

    cartBody.querySelectorAll('.inc').forEach(b => b.onclick = e => {
        const id = +e.target.dataset.id;
        cart.set(id, (cart.get(id) || 0) + 1);
        updateCartUI();
    });

    cartBody.querySelectorAll('.dec').forEach(b => b.onclick = e => {
        const id = +e.target.dataset.id;
        const q = (cart.get(id) || 0) - 1;
        if (q <= 0) cart.delete(id);
        else cart.set(id, q);
        updateCartUI();
    });
}

function addToCart(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    updateCartUI();
}

// Events
qInput.addEventListener('input', () => renderProducts());
cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
document.getElementById('closeCart').addEventListener('click', () => cartDrawer.classList.remove('open'));

document.getElementById('checkout').addEventListener('click', () => {
    if (cart.size === 0) return alert('🛒 Your cart is empty!');
    alert('🎉 Order placed successfully!');
    cart.clear();
    updateCartUI();
    cartDrawer.classList.remove('open');
});

document.getElementById('signin').addEventListener('click', () => {
    alert('👤 Sign in feature will be integrated later.');
});

document.getElementById('nearby').addEventListener('click', () => {
    alert('📍 Location feature will be integrated later.');
});

// Init
renderCategories();
renderProducts();
updateCartUI();