
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

    // Initialize Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function renderHome() {
    const heroProduct = PRODUCTS[0]; // Featured single product (Saraswati)
    
    return `
        <!-- Section 1: Hero -->
        <section class="section hero-section reveal" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding-top: 120px;">
            <div style="margin-bottom: 2rem;">
                <h1 class="glitch-text" data-text="KalaKasturi">KalaKasturi</h1>
            </div>
            
            <div style="font-family: 'Cormorant Garamond', serif; font-size: 24px; font-style: italic; color: var(--gold); margin-bottom: 3rem; text-align: center; max-width: 600px; line-height: 1.5;">
                "Art is the whisper of history, captured in color and preserved in soul."
            </div>
            
            <div class="art-card glass-card" data-tilt style="width: 100%; max-width: 400px; border-radius: 15px; cursor: pointer; margin-bottom: 3rem;" onclick="navigateTo('product', ${heroProduct.id})">
                <div style="width: 100%; height: 500px; border-radius: 15px 15px 0 0; overflow: hidden; position: relative;">
                    <img src="${heroProduct.img}" alt="${heroProduct.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <div style="position: absolute; top: 15px; right: 15px; background: var(--gold); color: #000; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 12px;">Featured</div>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <h3 style="margin: 0 0 10px; font-size: 22px; font-family: 'Cormorant Garamond', serif;">${heroProduct.title}</h3>
                    <p style="color: var(--gold); font-weight: bold; font-size: 18px; margin: 0;">${formatPrice(heroProduct.price)}</p>
                </div>
            </div>

            <button class="btn-primary" style="font-size: 16px; padding: 16px 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(212,168,67,0.3); transition: transform 0.3s ease;" onclick="navigateTo('gallery')" onmouseover="this.style.transform='scale(1.05) translateY(-5px)'" onmouseout="this.style.transform='scale(1) translateY(0)'">
                Enter The 3D Gallery
            </button>
            
            <div class="scroll-hint" style="margin-top: 4rem; position: relative; bottom: auto;">
                <span>Scroll to Explore</span>
                <span>↓</span>
            </div>
        </section>

        <!-- Section 2: Features -->
        <section class="section reveal" style="padding-top: 50px; padding-bottom: 100px;">
            <h2 style="text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 40px; margin-bottom: 3rem; color: var(--gold);">The KalaKasturi Promise</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                
                <div class="glass-card" data-tilt style="padding: 30px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 15px;">✈️</div>
                    <h3 style="font-size: 20px; margin-bottom: 10px;">Free Global Shipping</h3>
                    <p style="color: var(--muted); font-size: 14px; line-height: 1.6;">Secure, insured delivery worldwide at no extra cost to you.</p>
                </div>

                <div class="glass-card" data-tilt style="padding: 30px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 15px;">🖼️</div>
                    <h3 style="font-size: 20px; margin-bottom: 10px;">Museum Quality Prints</h3>
                    <p style="color: var(--muted); font-size: 14px; line-height: 1.6;">Premium print-on-demand reproduction that captures every brushstroke.</p>
                </div>

                <div class="glass-card" data-tilt style="padding: 30px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 15px;">📜</div>
                    <h3 style="font-size: 20px; margin-bottom: 10px;">Authenticity Certified</h3>
                    <p style="color: var(--muted); font-size: 14px; line-height: 1.6;">Every original piece includes a signed Certificate of Authenticity.</p>
                </div>

                <div class="glass-card" data-tilt style="padding: 30px; border-radius: 15px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 15px;">🎧</div>
                    <h3 style="font-size: 20px; margin-bottom: 10px;">24/7 VIP Support</h3>
                    <p style="color: var(--muted); font-size: 14px; line-height: 1.6;">Direct communication with our team for inquiries and commissions.</p>
                </div>

            </div>
        </section>

        <!-- Section 3: Reviews -->
        <section class="section reveal" style="padding-top: 50px; padding-bottom: 100px;">
            <h2 style="text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 40px; margin-bottom: 3rem; color: var(--text);">Loved by Collectors Worldwide</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                
                <div class="glass-card" style="padding: 30px; border-radius: 15px; border-top: 3px solid var(--gold);">
                    <div style="color: var(--gold); font-size: 18px; margin-bottom: 15px;">★★★★★</div>
                    <p style="color: var(--text); font-style: italic; font-size: 15px; line-height: 1.8; margin-bottom: 20px;">"The detail in the Saraswati painting is absolutely breathtaking. It has brought such a serene and divine energy to my living room. Fast shipping to the UK!"</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-weight: bold;">E</div>
                        <div>
                            <div style="font-weight: bold; font-size: 14px;">Eleanor M.</div>
                            <div style="color: var(--muted); font-size: 12px;">London, UK</div>
                        </div>
                    </div>
                </div>

                <div class="glass-card" style="padding: 30px; border-radius: 15px; border-top: 3px solid var(--gold);">
                    <div style="color: var(--gold); font-size: 18px; margin-bottom: 15px;">★★★★★</div>
                    <p style="color: var(--text); font-style: italic; font-size: 15px; line-height: 1.8; margin-bottom: 20px;">"I purchased the leopard oil painting and it is even more stunning in person. The brushwork is phenomenal. A true centerpiece for our home."</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-weight: bold;">J</div>
                        <div>
                            <div style="font-weight: bold; font-size: 14px;">James L.</div>
                            <div style="color: var(--muted); font-size: 12px;">New York, USA</div>
                        </div>
                    </div>
                </div>

                <div class="glass-card" style="padding: 30px; border-radius: 15px; border-top: 3px solid var(--gold);">
                    <div style="color: var(--gold); font-size: 18px; margin-bottom: 15px;">★★★★★</div>
                    <p style="color: var(--text); font-style: italic; font-size: 15px; line-height: 1.8; margin-bottom: 20px;">"Excellent communication from Ankita. The Ektara Girl painting arrived perfectly packaged. It's a gorgeous reflection of Indian culture."</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-weight: bold;">S</div>
                        <div>
                            <div style="font-weight: bold; font-size: 14px;">Siddharth R.</div>
                            <div style="color: var(--muted); font-size: 12px;">Mumbai, India</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Section 4: Footer -->
        <footer class="footer reveal" style="margin-top: 50px;">
            <div class="footer-grid">
                <div>
                    <div class="footer-brand-name">KalaKasturi</div>
                    <p class="footer-tagline">Original Indian art bridging classical heritage with modern spaces.</p>
                </div>
                <div>
                    <div class="footer-heading">Explore</div>
                    <div class="footer-links">
                        <a href="#" onclick="navigateTo('gallery')">Gallery</a>
                        <a href="#" onclick="navigateTo('about')">About Ankita</a>
                        <a href="#" onclick="navigateTo('faq')">FAQ</a>
                    </div>
                </div>
                <div>
                    <div class="footer-heading">Support</div>
                    <div class="footer-links">
                        <a href="#" onclick="navigateTo('contact')">Contact Us</a>
                        <a href="#">Shipping Policy</a>
                        <a href="#">Returns</a>
                    </div>
                </div>
                <div>
                    <div class="footer-heading">Newsletter</div>
                    <p style="color: var(--muted); font-size: 13px; margin-bottom: 10px;">Stay updated on new collections.</p>
                    <form class="newsletter-input" onsubmit="event.preventDefault(); alert('Subscribed!');">
                        <input type="email" placeholder="Email Address" required />
                        <button type="submit">→</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <div>© 2026 KalaKasturi. All rights reserved.</div>
                <div style="display: flex; gap: 20px;">
                    <a href="#">Instagram</a>
                    <a href="#">Pinterest</a>
                    <a href="#">Etsy Shop</a>
                </div>
            </div>
        </footer>
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
    initCursor();
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    render();
    updateCartUI();
    initCursor();
}

// Figma Style Cursor tracking
function initCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    
    let isVisible = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!isVisible) {
            cursor.style.opacity = '1';
            isVisible = true;
        }
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        isVisible = false;
    });
}
