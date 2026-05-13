
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

function updateSEO(page, product) {
    const titleEl = document.querySelector('title');
    const descEl = document.querySelector('meta[name="description"]');
    
    if (page === 'product' && product) {
        if (titleEl) titleEl.textContent = `${product.title} | KalaKasturi`;
        if (descEl) descEl.setAttribute('content', product.description || product.title);
    } else {
        if (titleEl) titleEl.textContent = 'KalaKasturi — Original Indian Art | Buy Direct from the Artist';
        if (descEl) descEl.setAttribute('content', 'Discover original hand-painted Indian classical and spiritual artworks by artist Ankita from Rishikesh. Raja Ravi Varma inspired paintings, wildlife art, and more.');
    }
}

function navigateTo(page, data) {
    currentPage = page;
    currentProduct = data || null;
    
    // SEO Update
    const p = PRODUCTS.find(x => x.id === currentProduct);
    updateSEO(page, p);
    
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
        case 'shop':
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

    // Initialize Swiper for 3D Carousels
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        new Swiper('.mySwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            }
        });
    }
}

function renderHome() {
    const featured = PRODUCTS.filter(p => p.featured).slice(0, 5);
    return `
        <section class="section hero-section">
            <h1 class="glitch-text" data-text="KalaKasturi">KalaKasturi</h1>
            <p class="subtitle">Original Indian Art & Immersive Decor by Ankita</p>
            
            <div class="swiper mySwiper" style="padding-top: 50px; padding-bottom: 50px;">
                <div class="swiper-wrapper">
                    ${featured.map(p => `
                        <div class="swiper-slide" style="width: 300px; height: 400px; background-image: url('${p.img}'); background-size: cover; background-position: center; border-radius: 15px; cursor: pointer;" onclick="navigateTo('product', ${p.id})">
                            <div style="position: absolute; bottom: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.9)); border-radius: 0 0 15px 15px; color: white;">
                                <h3 style="margin: 0; font-size: 18px;">${p.title}</h3>
                                <p style="margin: 5px 0 0; color: #D4A843;">${formatPrice(p.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="swiper-pagination"></div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn-primary" onclick="navigateTo('gallery')">Enter the Gallery</button>
            </div>
        </section>
    `;
}

function renderGallery() {
    const filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.collection === activeFilter);
    return `
        <section class="section">
            <h1 style="text-align: center; margin-bottom: 1rem;">The Collection</h1>
            <div class="filters" style="justify-content: center;">
                <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" onclick="activeFilter='all';render();">All Artworks</button>
                <button class="filter-btn ${activeFilter === 'spiritual' ? 'active' : ''}" onclick="activeFilter='spiritual';render();">Spiritual Series</button>
                <button class="filter-btn ${activeFilter === 'wildlife' ? 'active' : ''}" onclick="activeFilter='wildlife';render();">Wildlife Series</button>
            </div>
            
            <!-- 3D Carousel Gallery -->
            <div class="swiper mySwiper" style="padding-top: 50px; padding-bottom: 50px;">
                <div class="swiper-wrapper">
                    ${filtered.map(p => `
                        <div class="swiper-slide glass-card" style="width: 320px; padding: 15px; border-radius: 20px; cursor: pointer;" onclick="navigateTo('product', ${p.id})">
                            <div style="width: 100%; height: 350px; border-radius: 15px; overflow: hidden; margin-bottom: 15px;">
                                <img src="${p.img}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://placehold.co/300x400/0E1117/D4A843?text=Art'"/>
                            </div>
                            <h3 style="margin: 0 0 10px; font-size: 20px;">${p.title}</h3>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #D4A843; font-weight: bold; font-size: 18px;">${formatPrice(p.price)}</span>
                                <span style="background: rgba(212,168,67,0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #fff;">1 In Stock</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </section>
    `;
}

function renderProduct() {
    const p = PRODUCTS.find(x => x.id === currentProduct);
    if (!p) return '<section class="section"><h1>Product not found</h1></section>';
    return `
        <section class="section">
            <div class="product-hero">
                <div class="product-img-wrap" style="box-shadow: 0 10px 40px rgba(212,168,67,0.2);">
                    <img src="${p.img}" alt="${p.title}" onerror="this.src='https://placehold.co/600x750/0E1117/D4A843?text=Art'"/>
                </div>
                <div>
                    <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 40px; margin-bottom: 10px;">${p.title}</h1>
                    <p style="color: #D4A843; font-style: italic; margin-bottom: 20px;">${p.subtitle}</p>
                    <div style="font-size: 32px; font-weight: bold; margin-bottom: 5px;">${formatPrice(p.price)}</div>
                    <div style="color: var(--muted); margin-bottom: 20px;">Approx. ${formatUSD(p.priceUSD)}</div>
                    
                    <div style="background: rgba(212,168,67,0.1); border: 1px solid rgba(212,168,67,0.3); padding: 10px 15px; border-radius: 8px; margin-bottom: 25px; display: inline-block;">
                        <span style="color: #D4A843; font-weight: bold; font-size: 14px;">🔥 High Demand:</span>
                        <span style="color: var(--text); font-size: 14px;"> Only 1 original piece available.</span>
                    </div>

                    <p style="line-height: 1.8; color: var(--muted); margin-bottom: 30px;">${p.description}</p>
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 40px;">
                        <button class="btn-primary" style="flex: 1; padding: 16px; font-size: 16px;" onclick="addToCart(${p.id})">Add to Cart</button>
                        <button class="btn-secondary" style="flex: 1; padding: 16px; font-size: 16px;" onclick="navigateTo('contact')">Inquire via Form</button>
                    </div>

                    <div style="display: flex; gap: 20px; flex-wrap: wrap; padding-top: 20px; border-top: 1px solid var(--border);">
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px;">
                            <span>🔒</span> 100% Secure Checkout
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px;">
                            <span>✈️</span> Free Global Shipping
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px;">
                            <span>📜</span> Certificate of Authenticity Included
                        </div>
                    </div>
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
