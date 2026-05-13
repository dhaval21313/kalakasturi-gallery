
// State
let cart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
let currentPage = 'home';
let currentProduct = null;
let activeFilter = 'all';

function saveCart() {
    localStorage.setItem('kk_cart', JSON.stringify(cart));
    updateCartUI();
}

function formatPrice(n) {
    return 'INR ' + Number(n).toLocaleString('en-IN');
}

function formatUSD(n) {
    return '$' + Number(n).toLocaleString('en-US');
}

function stars(r) {
    return '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));
}

function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:80px;right:24px;background:#D4A843;color:#000;padding:12px 20px;border-radius:6px;font-size:13px;z-index:9000;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function addToCart(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    const existing = cart.find(x => x.id === productId);
    if (!existing) {
        cart.push({...p, qty: 1});
    } else {
        existing.qty++;
    }
    saveCart();
    showToast(`"${p.title}" added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart();
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cartCount').textContent = count;
    const ct = document.getElementById('cartTotal');
    if (ct) ct.textContent = formatPrice(total);
    const ce = document.getElementById('cartEmpty');
    if (ce) ce.style.display = cart.length ? 'none' : 'flex';
    const cf = document.getElementById('cartFooter');
    if (cf) cf.style.display = cart.length ? 'block' : 'none';
    renderCartItems();
}

function renderCartItems() {
    const el = document.getElementById('cartItems');
    if (!el) return;
    if (!cart.length) {
        el.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p></div>';
        return;
    }
    el.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
}

function navigateTo(page, data) {
    currentPage = page;
    currentProduct = data || null;
    window.scrollTo(0, 0);
    render();
}

function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// Render functions
function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    switch(currentPage) {
        case 'home':
            app.innerHTML = renderHome();
            break;
        case 'gallery':
            app.innerHTML = renderGallery();
            break;
        case 'product':
            app.innerHTML = renderProduct();
            break;
        case 'about':
            app.innerHTML = renderAbout();
            break;
        case 'faq':
            app.innerHTML = renderFAQ();
            break;
        case 'checkout':
            app.innerHTML = renderCheckout();
            break;
        case 'contact':
            app.innerHTML = renderContact();
            break;
        default:
            app.innerHTML = renderHome();
    }
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
}

function renderHome() {
    const featured = PRODUCTS.filter(p => p.featured).slice(0, 3);
    return `
        <section class="section">
            <h1>Welcome to KalaKasturi</h1>
            <p>Original Indian Art by Ankita</p>
            <div class="gallery-grid">
                ${featured.map(p => productCard(p)).join('')}
            </div>
            <button class="btn-primary" onclick="navigateTo('gallery')">View Full Gallery</button>
        </section>
    `;
}

function productCard(p) {
    return `
        <div class="art-card" data-tilt onclick="navigateTo('product', ${p.id})">
            <div class="art-card-img">
                <img src="${p.img}" alt="${p.title}" onerror="this.src='https://placehold.co/300x400/0E1117/D4A843?text=Art'"/>
            </div>
            <div class="art-card-info">
                <div class="art-card-title">${p.title}</div>
                <div class="art-price">${formatPrice(p.price)}</div>
                <div class="art-price-usd">Approx. ${formatUSD(p.priceUSD)}</div>
            </div>
        </div>
    `;
}

function renderGallery() {
    const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.collection === activeFilter);
    return `
        <section class="section">
            <h1>Gallery</h1>
            <div class="filters">
                <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="activeFilter='all';render();">All</button>
                <button class="filter-btn ${activeFilter === 'spiritual' ? 'active' : ''}" onclick="activeFilter='spiritual';render();">Spiritual</button>
                <button class="filter-btn ${activeFilter === 'wildlife' ? 'active' : ''}" onclick="activeFilter='wildlife';render();">Wildlife</button>
            </div>
            <div class="gallery-grid">
                ${filtered.map(p => productCard(p)).join('')}
            </div>
        </section>
    `;
}

function renderProduct() {
    const p = PRODUCTS.find(x => x.id === currentProduct);
    if (!p) return 'Product not found';
    return `
        <section class="section">
            <div class="product-hero">
                <div class="product-img-wrap">
                    <img src="${p.img}" alt="${p.title}" onerror="this.src='https://placehold.co/600x750/0E1117/D4A843?text=Art'"/>
                </div>
                <div>
                    <h1>${p.title}</h1>
                    <p>${p.subtitle}</p>
                    <div class="product-price">${formatPrice(p.price)}</div>
                    <div class="product-price-usd">Approx. ${formatUSD(p.priceUSD)}</div>
                    <p>${p.description}</p>
                    <button class="btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
                    <button class="btn-secondary" onclick="navigateTo('contact')">Inquire via Form</button>
                </div>
            </div>
        </section>
    `;
}

function renderAbout() {
    return `
        <section class="section">
            <h1>About Artist Ankita</h1>
            <p>Based in Rishikesh, painting with passion.</p>
        </section>
    `;
}

function renderFAQ() {
    return `
        <section class="section">
            <h1>FAQ</h1>
            <p>Common questions answered here.</p>
        </section>
    `;
}

function renderCheckout() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    return `
        <section class="section">
            <h1>Mock Checkout</h1>
            <p>Total: ${formatPrice(total)}</p>
            <form onsubmit="event.preventDefault(); alert('Order submitted!'); cart=[]; saveCart(); navigateTo('home');">
                <input class="form-input" type="text" placeholder="Name" required /><br/>
                <input class="form-input" type="email" placeholder="Email" required /><br/>
                <button type="submit" class="btn-primary">Submit Order</button>
            </form>
        </section>
    `;
}

function renderContact() {
    return `
        <section class="section">
            <h1>Contact</h1>
            <form onsubmit="event.preventDefault(); alert('Message sent!'); navigateTo('home');">
                <input class="form-input" type="text" placeholder="Name" required /><br/>
                <input class="form-input" type="email" placeholder="Email" required /><br/>
                <textarea class="form-input" placeholder="Message" required></textarea><br/>
                <button type="submit" class="btn-primary">Send Message</button>
            </form>
        </section>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    render();
    updateCartUI();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    render();
    updateCartUI();
}
