/**
 * Two Leaves and a Bud — Advanced SPA Application Logic
 */

// 1. App State
let currentPage = 'home';
let currentProduct = null;
let cart = [];
let currentUser = null;
let appliedPromo = null;
let quizStep = 1;
let quizAnswers = {};
let steepTimerInterval = null;
let steepTimerTotalSeconds = 0;
let steepTimerRemainingSeconds = 0;
let steepTimerIsRunning = false;

// 2. Local Storage Sync
function loadState() {
    const savedCart = localStorage.getItem('twoleaves_cart');
    if (savedCart) cart = JSON.parse(savedCart);

    const savedUser = localStorage.getItem('twoleaves_user');
    if (savedUser) currentUser = JSON.parse(savedUser);

    const savedPromo = localStorage.getItem('twoleaves_promo');
    if (savedPromo) appliedPromo = savedPromo;
}

function saveState() {
    localStorage.setItem('twoleaves_cart', JSON.stringify(cart));
    localStorage.setItem('twoleaves_user', JSON.stringify(currentUser));
    if (appliedPromo) {
        localStorage.setItem('twoleaves_promo', appliedPromo);
    } else {
        localStorage.removeItem('twoleaves_promo');
    }
}

// 3. Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initLeaves();
    initScrollTracker();
    updateCartCount();
    updateUserGreeting();
    
    // Simple deep link router
    const hash = window.location.hash.substring(1);
    const routes = ['home', 'shop', 'quiz', 'about', 'faq', 'contact', 'account', 'checkout'];
    if (routes.includes(hash)) {
        navigateTo(hash);
    } else if (hash.startsWith('product-')) {
        const id = parseInt(hash.split('-')[1]);
        navigateTo('pdp', id);
    } else {
        navigateTo('home');
    }
    
    // Live viewers count randomizer
    setInterval(() => {
        const countEl = document.getElementById('visitorCount');
        if (countEl) {
            const current = parseInt(countEl.textContent);
            const delta = Math.floor(Math.random() * 5) - 2;
            const newCount = Math.max(10, Math.min(60, current + delta));
            countEl.textContent = newCount;
        }
    }, 5000);
});

// 4. Floating Leaf Micro-animations (Replacing WebGL Particles)
function initLeaves() {
    const container = document.getElementById('leaves-container');
    if (!container) return;
    
    // Initial leaves
    for (let i = 0; i < 5; i++) {
        spawnLeaf(container, true);
    }
    
    // Constant slow generation
    setInterval(() => {
        spawnLeaf(container, false);
    }, 4000);
}

function spawnLeaf(container, initial) {
    const leaf = document.createElement('div');
    leaf.className = 'floating-leaf';
    leaf.style.left = Math.random() * 95 + 'vw';
    const duration = 12 + Math.random() * 10; // 12-22 seconds
    leaf.style.animationDuration = duration + 's';
    const scale = 0.4 + Math.random() * 0.7;
    leaf.style.transform = `scale(${scale})`;
    
    if (initial) {
        // Offset starting height
        const startHeight = Math.random() * 90;
        leaf.style.bottom = startHeight + 'vh';
        // Adjust animation remaining time accordingly
        leaf.style.animationDelay = `-${(startHeight / 100) * duration}s`;
    }
    
    container.appendChild(leaf);
    setTimeout(() => leaf.remove(), duration * 1000);
}

// 5. Scroll Tracker & Sticky Navbar
function initScrollTracker() {
    const scrollBar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Progress Bar
        const windowScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + '%';
        
        // Sticky Nav class
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// 6. SPA Routing & View Controller
function navigateTo(page, data = null) {
    currentPage = page;
    currentProduct = data;
    
    // Stop steep timer if moving away from PDP
    if (page !== 'pdp') {
        stopSteepTimer();
    }
    
    // Close mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    if (mobileMenu) mobileMenu.classList.remove('active');
    
    // Dynamic Active Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.getElementById(`nav-${page}`);
    if (activeLink) activeLink.classList.add('active');
    
    // Update hash for basic bookmarking
    if (page === 'pdp') {
        window.location.hash = `product-${data}`;
    } else {
        window.location.hash = page;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update Document Title & SEO
    updateSEO(page);
    
    // Render matching view
    render();
}

function updateSEO(page) {
    let title = "Two Leaves and a Bud — Premium Organic Whole Leaf Tea";
    if (page === 'shop') title = "Shop Teas | Two Leaves and a Bud";
    else if (page === 'quiz') title = "Interactive Tea Finder Quiz | Two Leaves and a Bud";
    else if (page === 'about') title = "Our Organic Sourcing Story | Two Leaves and a Bud";
    else if (page === 'faq') title = "Frequently Asked Questions | Two Leaves and a Bud";
    else if (page === 'contact') title = "Inquire or Get in Touch | Two Leaves and a Bud";
    else if (page === 'account') title = "My Account & History | Two Leaves and a Bud";
    else if (page === 'checkout') title = "Secure Checkout | Two Leaves and a Bud";
    else if (page === 'pdp' && currentProduct) {
        const p = PRODUCTS.find(x => x.id === currentProduct);
        if (p) title = `${p.title} - ${p.subtitle} | Two Leaves and a Bud`;
    }
    document.title = title;
}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');
    if (mobileMenu && navbar) {
        mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        navbar.classList.toggle('menu-open');
    }
}

// 7. Navigation Actions (Cart Toggle)
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        if (cartSidebar.classList.contains('active')) {
            renderCartItems();
        }
    }
}

// 8. E-Commerce Cart Logic
function addToCart(productId, quantity = 1) {
    const item = cart.find(x => x.productId === productId);
    if (item) {
        item.qty += quantity;
    } else {
        cart.push({ productId, qty: quantity });
    }
    saveState();
    updateCartCount();
    
    // Open sidebar automatically on addition
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar && !cartSidebar.classList.contains('active')) {
        toggleCart();
    } else {
        renderCartItems();
    }
}

function updateCartQty(productId, delta) {
    const item = cart.find(x => x.productId === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(x => x.productId !== productId);
    }
    saveState();
    updateCartCount();
    renderCartItems();
}

function removeCartItem(productId) {
    cart = cart.filter(x => x.productId !== productId);
    saveState();
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        const count = cart.reduce((total, item) => total + item.qty, 0);
        cartCountEl.textContent = count;
    }
}

function applyPromo() {
    const input = document.getElementById('promoCodeInput');
    const feedback = document.getElementById('promoFeedback');
    if (!input || !feedback) return;
    
    const val = input.value.trim().toUpperCase();
    if (val === 'TEALOVER') {
        appliedPromo = 'TEALOVER';
        feedback.style.color = '#10B981';
        feedback.textContent = 'Coupon applied: 15% discount!';
    } else {
        appliedPromo = null;
        feedback.style.color = '#DC2626';
        feedback.textContent = 'Invalid coupon code';
    }
    saveState();
    renderCartItems();
}

function getCartCalculations() {
    let subtotal = 0;
    cart.forEach(item => {
        const p = PRODUCTS.find(x => x.id === item.productId);
        if (p) subtotal += p.price * item.qty;
    });
    
    let discount = 0;
    if (appliedPromo === 'TEALOVER') {
        discount = subtotal * 0.15;
    }
    
    // Free shipping limit is $35
    const shippingThreshold = 35;
    let shipping = 0;
    if (subtotal > 0 && subtotal < shippingThreshold) {
        shipping = 4.99; // Flat rate shipping
    }
    
    const total = subtotal - discount + shipping;
    return { subtotal, discount, shipping, total, shippingThreshold };
}

function renderCartItems() {
    const itemsContainer = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDiscountEl = document.getElementById('cartDiscount');
    const discountLine = document.getElementById('discountLine');
    const cartShippingEl = document.getElementById('cartShipping');
    const cartTotalEl = document.getElementById('cartTotal');
    const shippingTracker = document.getElementById('shippingTracker');
    const trackerText = document.getElementById('trackerText');
    const trackerBarFill = document.getElementById('trackerBarFill');
    
    if (!itemsContainer) return;
    
    // Clear dynamic items
    const dynamicItems = itemsContainer.querySelectorAll('.cart-item');
    dynamicItems.forEach(el => el.remove());
    
    const calcs = getCartCalculations();
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'flex';
        if (cartFooter) cartFooter.style.display = 'none';
        if (shippingTracker) shippingTracker.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
    if (shippingTracker) shippingTracker.style.display = 'block';
    
    // Render list
    cart.forEach(item => {
        const p = PRODUCTS.find(x => x.id === item.productId);
        if (!p) return;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img class="cart-item-img" src="${p.img}" alt="${p.title}">
            <div class="cart-item-info">
                <h4>${p.title}</h4>
                <p>${p.subtitle}</p>
                <div class="cart-qty-row">
                    <button class="cart-qty-btn" onclick="updateCartQty(${p.id}, -1)">-</button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="cart-qty-btn" onclick="updateCartQty(${p.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-side">
                <span class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</span>
                <button class="cart-item-remove" onclick="removeCartItem(${p.id})">Remove</button>
            </div>
        `;
        itemsContainer.appendChild(itemEl);
    });
    
    // Update summaries
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${calcs.subtotal.toFixed(2)}`;
    if (calcs.discount > 0) {
        if (discountLine) discountLine.style.display = 'flex';
        if (cartDiscountEl) cartDiscountEl.textContent = `-$${calcs.discount.toFixed(2)}`;
    } else {
        if (discountLine) discountLine.style.display = 'none';
    }
    
    if (cartShippingEl) {
        cartShippingEl.textContent = calcs.shipping === 0 ? 'FREE' : `$${calcs.shipping.toFixed(2)}`;
    }
    if (cartTotalEl) cartTotalEl.textContent = `$${calcs.total.toFixed(2)}`;
    
    // Update promo input
    const input = document.getElementById('promoCodeInput');
    const feedback = document.getElementById('promoFeedback');
    if (input) input.value = appliedPromo || '';
    if (feedback && appliedPromo) {
        feedback.style.color = '#10B981';
        feedback.textContent = 'Coupon applied: 15% discount!';
    }
    
    // Update shipping tracker
    if (trackerText && trackerBarFill) {
        if (calcs.subtotal >= calcs.shippingThreshold) {
            trackerText.textContent = "🎉 You've unlocked FREE Shipping!";
            trackerBarFill.style.width = '100%';
        } else {
            const needed = calcs.shippingThreshold - calcs.subtotal;
            trackerText.textContent = `Spend $${needed.toFixed(2)} more for FREE Shipping!`;
            const pct = (calcs.subtotal / calcs.shippingThreshold) * 100;
            trackerBarFill.style.width = `${pct}%`;
        }
    }
}

// 9. Interactive Steeping Timer
function startSteepTimer(seconds) {
    if (steepTimerIsRunning) {
        clearInterval(steepTimerInterval);
    }
    
    steepTimerTotalSeconds = seconds;
    steepTimerRemainingSeconds = seconds;
    steepTimerIsRunning = true;
    
    updateTimerUI();
    
    steepTimerInterval = setInterval(() => {
        steepTimerRemainingSeconds--;
        updateTimerUI();
        
        if (steepTimerRemainingSeconds <= 0) {
            clearInterval(steepTimerInterval);
            steepTimerIsRunning = false;
            triggerTimerAlarm();
        }
    }, 1000);
}

function pauseSteepTimer() {
    if (steepTimerIsRunning) {
        clearInterval(steepTimerInterval);
        steepTimerIsRunning = false;
        const startBtn = document.getElementById('timerStartBtn');
        if (startBtn) startBtn.innerHTML = '▶';
    }
}

function resumeSteepTimer() {
    if (!steepTimerIsRunning && steepTimerRemainingSeconds > 0) {
        steepTimerIsRunning = true;
        const startBtn = document.getElementById('timerStartBtn');
        if (startBtn) startBtn.innerHTML = '⏸';
        
        steepTimerInterval = setInterval(() => {
            steepTimerRemainingSeconds--;
            updateTimerUI();
            
            if (steepTimerRemainingSeconds <= 0) {
                clearInterval(steepTimerInterval);
                steepTimerIsRunning = false;
                triggerTimerAlarm();
            }
        }, 1000);
    }
}

function stopSteepTimer() {
    clearInterval(steepTimerInterval);
    steepTimerIsRunning = false;
    steepTimerRemainingSeconds = 0;
}

function updateTimerUI() {
    const display = document.getElementById('timerDisplay');
    const circleProgress = document.getElementById('timerCircleProgress');
    
    if (display) {
        const m = Math.floor(steepTimerRemainingSeconds / 60);
        const s = steepTimerRemainingSeconds % 60;
        display.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }
    
    if (circleProgress) {
        const circumference = 2 * Math.PI * 40; // r=40
        circleProgress.style.strokeDasharray = circumference;
        const pct = steepTimerRemainingSeconds / steepTimerTotalSeconds;
        circleProgress.style.strokeDashoffset = circumference * (1 - pct);
    }
}

function triggerTimerAlarm() {
    const widget = document.getElementById('brewTimerWidget');
    if (widget) {
        widget.style.border = '2.5px solid var(--accent)';
        widget.style.animation = 'pulse-ring 1s 5 ease-in-out';
    }
    alert("☕ Time is up! Pour your tea and enjoy the perfect brew.");
    if (widget) {
        widget.style.border = '1px solid var(--border)';
        widget.style.animation = 'none';
    }
}

// 10. Multi-step Tea Quiz Logic
function selectQuizOption(question, value) {
    quizAnswers[question] = value;
    
    // Highlight choice
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(el => el.classList.remove('selected'));
    
    const selectedEl = document.querySelector(`.quiz-option[data-val="${value}"]`);
    if (selectedEl) selectedEl.classList.add('selected');
    
    // Enable Next
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.removeAttribute('disabled');
}

function nextQuizStep() {
    if (quizStep < 4) {
        quizStep++;
        render();
    } else {
        showQuizRecommendation();
    }
}

function prevQuizStep() {
    if (quizStep > 1) {
        quizStep--;
        render();
    }
}

function getQuizRecommendation() {
    // Basic decision tree
    const caffeine = quizAnswers['caffeine']; // yes, no, free
    const temp = quizAnswers['temp']; // morning, afternoon, evening
    const flavor = quizAnswers['flavor']; // bold, refreshing, sweet
    
    // Defaults
    let recommendedId = 1; // Earl Grey
    
    if (caffeine === 'no') {
        if (flavor === 'refreshing') recommendedId = 3; // Peppermint
        else if (flavor === 'bold') recommendedId = 9; // Turmeric Ginger
        else recommendedId = 4; // Chamomile
    } else if (caffeine === 'free') {
        recommendedId = 6; // Alpine Berry Iced
    } else {
        if (flavor === 'bold') {
            if (temp === 'morning') recommendedId = 7; // Matcha
            else recommendedId = 1; // Earl Grey
        } else if (flavor === 'refreshing') {
            recommendedId = 5; // Jasmine Petal Green
        } else {
            recommendedId = 8; // Spiced Chai
        }
    }
    
    return PRODUCTS.find(x => x.id === recommendedId) || PRODUCTS[0];
}

function showQuizRecommendation() {
    const recommendedProduct = getQuizRecommendation();
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    appEl.innerHTML = `
        <div class="quiz-container reveal">
            <div class="section-header">
                <h2>Your Perfect Tea Match</h2>
                <p>Based on your tasting quiz, we highly recommend trying this premium blend:</p>
            </div>
            
            <div class="quiz-result-card">
                <img class="quiz-result-img" src="${recommendedProduct.img}" alt="${recommendedProduct.title}">
                <div class="quiz-result-info">
                    <span class="product-type">${recommendedProduct.type}</span>
                    <h3>${recommendedProduct.title}</h3>
                    <p>${recommendedProduct.subtitle}</p>
                    <div class="product-price">$${recommendedProduct.price.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="quiz-actions" style="justify-content: center; gap: 20px;">
                <button class="btn-secondary" onclick="navigateTo('quiz')">Retake Quiz</button>
                <button class="btn-primary" onclick="addToCart(${recommendedProduct.id}); navigateTo('shop');">Add to Cart & Shop</button>
            </div>
        </div>
    `;
    
    // Reset quiz state
    quizStep = 1;
    quizAnswers = {};
}

// 11. Mock User Portal Logic
function toggleAuthTab(tab) {
    const signinBox = document.getElementById('authSigninBox');
    const registerBox = document.getElementById('authRegisterBox');
    const tabSignin = document.getElementById('tabSignin');
    const tabRegister = document.getElementById('tabRegister');
    
    if (tab === 'signin') {
        if (signinBox) signinBox.style.display = 'block';
        if (registerBox) registerBox.style.display = 'none';
        if (tabSignin) tabSignin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
    } else {
        if (signinBox) signinBox.style.display = 'none';
        if (registerBox) registerBox.style.display = 'block';
        if (tabSignin) tabSignin.classList.remove('active');
        if (tabRegister) tabRegister.classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const name = email.split('@')[0];
    
    currentUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        points: 150,
        orders: [
            { id: "ORD-94819", date: "2026-04-12", items: "Organic Peppermint (Sachets)", total: 17.98, status: "shipped" },
            { id: "ORD-93721", date: "2026-05-01", items: "Ceremonial Matcha", total: 24.99, status: "shipped" }
        ]
    };
    saveState();
    updateUserGreeting();
    navigateTo('account');
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    
    currentUser = {
        name: name,
        email: email,
        points: 50, // signup bonus points
        orders: []
    };
    saveState();
    updateUserGreeting();
    navigateTo('account');
}

function handleLogout() {
    currentUser = null;
    saveState();
    updateUserGreeting();
    navigateTo('home');
}

function updateUserGreeting() {
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
        greeting.textContent = currentUser ? `Hello, ${currentUser.name}` : 'Sign In';
    }
}

// 12. Checkout Form Submission
function handleCheckoutSubmit(event) {
    event.preventDefault();
    const calcs = getCartCalculations();
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toISOString().split('T')[0];
    
    // Add to order history if user is logged in
    if (currentUser) {
        currentUser.orders.unshift({
            id: orderId,
            date: orderDate,
            items: cart.map(x => {
                const p = PRODUCTS.find(p => p.id === x.productId);
                return p ? `${p.title} x${x.qty}` : 'Organic Tea';
            }).join(', '),
            total: parseFloat(calcs.total.toFixed(2)),
            status: "processing"
        });
        currentUser.points += Math.floor(calcs.subtotal); // earn points on subtotal
    }
    
    // Capture details for receipt
    const customerName = document.getElementById('checkoutName').value;
    const customerAddress = `${document.getElementById('checkoutAddress').value}, ${document.getElementById('checkoutCity').value}, ${document.getElementById('checkoutZip').value}`;
    const orderItemsHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.productId);
        return p ? `<div class="receipt-line"><span>${p.title} (x${item.qty})</span><span>$${(p.price * item.qty).toFixed(2)}</span></div>` : '';
    }).join('');
    
    // Clear cart
    cart = [];
    appliedPromo = null;
    saveState();
    updateCartCount();
    
    // Show success view
    const appEl = document.getElementById('app');
    if (appEl) {
        appEl.innerHTML = `
            <div class="success-card reveal">
                <div class="success-check-icon">✓</div>
                <h2>Thank You for Your Order!</h2>
                <p>Your tea order has been placed. We are preparing your fresh whole-leaf shipment.</p>
                
                <div class="receipt-box">
                    <div class="receipt-header">
                        <span>Receipt ID: ${orderId}</span>
                        <span>Date: ${orderDate}</span>
                    </div>
                    <div class="form-group" style="margin-bottom:16px;">
                        <label>Ship To:</label>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:0;">${customerName}<br/>${customerAddress}</p>
                    </div>
                    <div style="border-bottom:1px dashed var(--border); margin-bottom:12px;"></div>
                    ${orderItemsHTML}
                    <div class="receipt-line" style="margin-top:12px;"><span>Subtotal</span><span>$${calcs.subtotal.toFixed(2)}</span></div>
                    ${calcs.discount > 0 ? `<div class="receipt-line" style="color:var(--accent);"><span>Discount</span><span>-$${calcs.discount.toFixed(2)}</span></div>` : ''}
                    <div class="receipt-line"><span>Shipping</span><span>${calcs.shipping === 0 ? 'FREE' : `$${calcs.shipping.toFixed(2)}`}</span></div>
                    <div class="receipt-line total"><span>Total Paid</span><span>$${calcs.total.toFixed(2)}</span></div>
                </div>
                
                <button class="btn-primary" onclick="navigateTo('shop')">Continue Shopping</button>
            </div>
        `;
    }
}

// 13. Dynamic HTML Renderer (Routing logic)
function render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;
    
    // Clear previous timer intervals
    stopSteepTimer();
    
    // Global Header & Title Render Check
    switch (currentPage) {
        case 'home':
            renderHome(appEl);
            break;
        case 'shop':
            renderShop(appEl);
            break;
        case 'pdp':
            renderPdp(appEl);
            break;
        case 'quiz':
            renderQuiz(appEl);
            break;
        case 'about':
            renderAbout(appEl);
            break;
        case 'faq':
            renderFAQ(appEl);
            break;
        case 'contact':
            renderContact(appEl);
            break;
        case 'account':
            renderAccount(appEl);
            break;
        case 'checkout':
            renderCheckout(appEl);
            break;
        default:
            renderHome(appEl);
    }
    
    // Attach VanillaTilt to cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 8,
            speed: 400,
            glare: true,
            "max-glare": 0.1
        });
    }
}

// 14. Page Rendering Components
function renderHome(appEl) {
    const featuredTeas = PRODUCTS.filter(p => p.featured);
    const featuredHTML = featuredTeas.map(p => `
        <div class="product-card" data-tilt>
            ${p.organic ? `<span class="product-badge organic">Organic</span>` : `<span class="product-badge">Whole Leaf</span>`}
            <div class="product-img-container" onclick="navigateTo('pdp', ${p.id})">
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="product-info">
                <span class="product-type">${p.type}</span>
                <h3 onclick="navigateTo('pdp', ${p.id})">${p.title}</h3>
                <p class="product-subtitle">${p.subtitle}</p>
                <div class="product-footer-row">
                    <span class="product-price">$${p.price.toFixed(2)}</span>
                    <button class="btn-card-add" onclick="addToCart(${p.id})" aria-label="Add to cart">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    appEl.innerHTML = `
        <!-- Hero Section -->
        <section class="hero reveal">
            <div class="hero-content">
                <span class="hero-badge">USDA Organic & Fair Trade</span>
                <h1>Better Tea Starts with Two Leaves and a Bud</h1>
                <p>We source whole leaf teas directly from single estate organic tea gardens. Packed in fully compostable plant-based bags for a clean taste and clean footprint.</p>
                <div class="hero-actions">
                    <button class="btn-accent" onclick="navigateTo('shop')">Shop Our Teas</button>
                    <button class="btn-secondary" onclick="navigateTo('quiz')">Take the Tea Quiz</button>
                </div>
            </div>
            <div class="hero-image-wrap">
                <div class="hero-circle-bg"></div>
                <img class="hero-image" src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80" alt="Fresh Organic Green Tea Brewing">
            </div>
        </section>

        <!-- Features/Benefits Section -->
        <section class="section reveal" style="background:#FFF; border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
            <div class="section-header">
                <h2>The Whole Leaf Difference</h2>
                <p>Why whole leaf tea in open sachets outperforms dust-filled grocery store tea bags.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🌿</div>
                    <h3>Two Leaves & a Bud</h3>
                    <p>We only pluck the top two leaves and the tender bud where all the natural oils, aromatics, and nutrients are concentrated.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">✨</div>
                    <h3>Whole Leaf Sachets</h3>
                    <p>Our spacious pyramidal sachets allow the whole leaves to fully expand and release their rich, complex flavor profiles.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">♻️</div>
                    <h3>100% Compostable</h3>
                    <p>Made from non-GMO plant materials. No plastic, no microplastics, just clean tea that returns safely back to nature.</p>
                </div>
            </div>
        </section>

        <!-- Bestsellers Section -->
        <section class="section reveal">
            <div class="section-header">
                <h2>Our Organic Bestsellers</h2>
                <p>Taste the purity of whole-leaf teas sourced directly from estate gardens.</p>
            </div>
            <div class="product-grid">
                ${featuredHTML}
            </div>
            <div style="text-align:center; margin-top:50px;">
                <button class="btn-primary" onclick="navigateTo('shop')">View All Collections</button>
            </div>
        </section>
        
        <!-- Tea Finder Quiz CTA Banner -->
        <section class="section reveal" style="background:var(--primary); color:white; border-radius:var(--radius-lg); margin-bottom:80px; padding: 60px;">
            <div style="max-width:700px; margin: 0 auto; text-align:center;">
                <h2 style="color:white; font-size:42px; margin-bottom:16px;">Unsure Where to Start?</h2>
                <p style="color:rgba(255,255,255,0.85); font-size:16px; margin-bottom:30px;">Answer 4 simple tasting questions, and our Tea Sommelier algorithm will recommend the perfect organic whole leaf sachet or matcha blend for you.</p>
                <button class="btn-accent" onclick="navigateTo('quiz')">Start Tea Finder Quiz</button>
            </div>
        </section>

        <!-- Footer -->
        ${renderFooter()}
    `;
}

function renderShop(appEl) {
    // Dynamic Filter values
    const selectedTypes = Array.from(document.querySelectorAll('.filter-checkbox[data-group="type"]:checked')).map(el => el.value);
    const selectedFormats = Array.from(document.querySelectorAll('.filter-checkbox[data-group="format"]:checked')).map(el => el.value);
    const organicOnly = document.getElementById('filterOrganic') ? document.getElementById('filterOrganic').checked : false;
    const caffeineLevels = Array.from(document.querySelectorAll('.filter-checkbox[data-group="caffeine"]:checked')).map(el => el.value);
    
    // Sort value
    const sortVal = document.getElementById('shopSort') ? document.getElementById('shopSort').value : 'featured';
    
    // Filter Products
    let filtered = PRODUCTS.filter(p => {
        if (selectedTypes.length > 0 && !selectedTypes.includes(p.type)) return false;
        if (selectedFormats.length > 0 && !selectedFormats.includes(p.format)) return false;
        if (organicOnly && !p.organic) return false;
        if (caffeineLevels.length > 0 && !caffeineLevels.includes(p.caffeine)) return false;
        return true;
    });
    
    // Sort Products
    if (sortVal === 'price-asc') {
        filtered.sort((a,b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
        filtered.sort((a,b) => b.price - a.price);
    } else if (sortVal === 'title') {
        filtered.sort((a,b) => a.title.localeCompare(b.title));
    }
    
    const productCardsHTML = filtered.map(p => `
        <div class="product-card" data-tilt>
            ${p.organic ? `<span class="product-badge organic">Organic</span>` : `<span class="product-badge">Whole Leaf</span>`}
            <div class="product-img-container" onclick="navigateTo('pdp', ${p.id})">
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div class="product-info">
                <span class="product-type">${p.type}</span>
                <h3 onclick="navigateTo('pdp', ${p.id})">${p.title}</h3>
                <p class="product-subtitle">${p.subtitle}</p>
                <div class="product-footer-row">
                    <span class="product-price">$${p.price.toFixed(2)}</span>
                    <button class="btn-card-add" onclick="addToCart(${p.id})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    appEl.innerHTML = `
        <div class="section shop-container">
            <!-- Filter Sidebar -->
            <aside class="filter-panel">
                <div class="filter-group">
                    <h3>Tea Variety</h3>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="type" value="black" ${selectedTypes.includes('black') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Black Tea
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="type" value="green" ${selectedTypes.includes('green') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Green Tea
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="type" value="herbal" ${selectedTypes.includes('herbal') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Herbal Infusion
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="type" value="matcha" ${selectedTypes.includes('matcha') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Matcha
                    </label>
                </div>
                
                <div class="filter-group">
                    <h3>Packaging Format</h3>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="format" value="sachet" ${selectedFormats.includes('sachet') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Sachets (Boxes)
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="format" value="loose" ${selectedFormats.includes('loose') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Loose Leaf Bags
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="format" value="powder" ${selectedFormats.includes('powder') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Powders & Solubles
                    </label>
                </div>
                
                <div class="filter-group">
                    <h3>Caffeine Content</h3>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="caffeine" value="high" ${caffeineLevels.includes('high') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Caffeinated (High)
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="caffeine" value="medium" ${caffeineLevels.includes('medium') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Caffeinated (Medium)
                    </label>
                    <label class="filter-option">
                        <input type="checkbox" class="filter-checkbox" data-group="caffeine" value="none" ${caffeineLevels.includes('none') ? 'checked' : ''} onchange="renderShopTrigger()">
                        Caffeine-Free
                    </label>
                </div>
                
                <div class="filter-group">
                    <h3>Certifications</h3>
                    <label class="filter-option">
                        <input type="checkbox" id="filterOrganic" ${organicOnly ? 'checked' : ''} onchange="renderShopTrigger()">
                        Certified Organic Only
                    </label>
                </div>
            </aside>
            
            <!-- Products Wrap -->
            <div class="product-grid-wrap">
                <div class="shop-controls">
                    <span class="results-count">Showing ${filtered.length} of ${PRODUCTS.length} teas</span>
                    <select class="sort-select" id="shopSort" onchange="renderShopTrigger()">
                        <option value="featured" ${sortVal === 'featured' ? 'selected' : ''}>Featured Selection</option>
                        <option value="price-asc" ${sortVal === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                        <option value="price-desc" ${sortVal === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                        <option value="title" ${sortVal === 'title' ? 'selected' : ''}>Alphabetical (A-Z)</option>
                    </select>
                </div>
                
                <div class="product-grid">
                    ${filtered.length > 0 ? productCardsHTML : `<div style="grid-column:1/-1; text-align:center; padding: 60px 0; color:var(--text-muted);">No organic teas match your current filters.</div>`}
                </div>
            </div>
        </div>
        
        ${renderFooter()}
    `;
}

// Wrapper function to trigger shop render without navigation resets
function renderShopTrigger() {
    const appEl = document.getElementById('app');
    if (appEl) renderShop(appEl);
}

function renderPdp(appEl) {
    const p = PRODUCTS.find(x => x.id === currentProduct);
    if (!p) {
        appEl.innerHTML = `<div class="section text-center" style="padding-top:140px;"><h2>Tea blend not found</h2><button class="btn-primary" onclick="navigateTo('shop')">Back to Shop</button></div>`;
        return;
    }
    
    // Tasting Notes HTML
    const notesHTML = p.tastingNotes.map(n => `<span class="tasting-bubble">${n}</span>`).join('');
    
    appEl.innerHTML = `
        <div class="section pdp-container reveal">
            <div class="pdp-grid">
                <!-- Image & Certifications -->
                <div>
                    <div class="pdp-image-wrap">
                        <img class="pdp-image" src="${p.img}" alt="${p.title}">
                    </div>
                    <div class="pdp-cert-badges">
                        ${p.organic ? `
                            <div class="pdp-badge-item">
                                <svg class="pdp-badge-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                USDA Certified Organic
                            </div>
                        ` : ''}
                        <div class="pdp-badge-item">
                            <svg class="pdp-badge-icon" viewBox="0 0 24 24" style="fill: #E68E36;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            Fair Trade Sourced
                        </div>
                    </div>
                </div>
                
                <!-- Product Details -->
                <div class="pdp-details">
                    <span class="product-type">${p.type} • ${p.format}</span>
                    <h1>${p.title}</h1>
                    <p class="pdp-subtitle">${p.subtitle}</p>
                    
                    <div class="pdp-price-row">
                        <span class="pdp-price">$${p.price.toFixed(2)}</span>
                        <span class="pdp-tag" style="text-transform: uppercase;">caffeine: ${p.caffeine}</span>
                    </div>
                    
                    <p class="pdp-desc">${p.description}</p>
                    
                    <!-- Tasting Notes -->
                    <div class="tasting-notes-wrap">
                        <h4>Tasting Notes</h4>
                        <div class="tasting-bubbles">
                            ${notesHTML}
                        </div>
                    </div>
                    
                    <!-- Ingredients -->
                    <div class="tasting-notes-wrap">
                        <h4>Ingredients</h4>
                        <p style="font-size:14px; color:var(--text-muted);">${p.ingredients}</p>
                    </div>
                    
                    <!-- Steeping Guide Widget & Timer -->
                    ${p.steepTime > 0 ? `
                        <div class="brew-timer-widget" id="brewTimerWidget">
                            <div class="timer-circle-wrap">
                                <svg class="timer-circle-svg" viewBox="0 0 100 100">
                                    <circle class="timer-circle-bg" cx="50" cy="50" r="40" />
                                    <circle class="timer-circle-progress" id="timerCircleProgress" cx="50" cy="50" r="40" />
                                </svg>
                                <span class="timer-display" id="timerDisplay">0:00</span>
                            </div>
                            <div class="timer-controls-wrap">
                                <h4>Interactive Brew Timer</h4>
                                <p>Brew at ${p.steepTemp} for ${Math.floor(p.steepTime / 60)} minutes.</p>
                                <div class="timer-btn-row">
                                    <button class="timer-btn" id="timerStartBtn" onclick="steepTimerIsRunning ? pauseSteepTimer() : (steepTimerRemainingSeconds > 0 ? resumeSteepTimer() : startSteepTimer(${p.steepTime}))">▶</button>
                                    <button class="timer-btn btn-reset" onclick="stopSteepTimer(); startSteepTimer(${p.steepTime});">↺</button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <button class="btn-accent btn-full" onclick="addToCart(${p.id})">Add to Shopping Cart</button>
                </div>
            </div>
        </div>
        
        ${renderFooter()}
    `;
    
    // Set initial timer UI on page load
    if (p.steepTime > 0) {
        steepTimerTotalSeconds = p.steepTime;
        steepTimerRemainingSeconds = p.steepTime;
        updateTimerUI();
    }
}

function renderQuiz(appEl) {
    const steps = [
        {
            q: "How do you prefer your caffeine kick?",
            p: "Choose how energized you want to feel after drinking your tea.",
            options: [
                { val: "yes", title: "Bold & Caffeinated", desc: "High caffeine black teas or energy-filled matcha." },
                { val: "medium", title: "Balanced Medium", desc: "Delicate green teas with light, focused alertness." },
                { val: "no", title: "Caffeine-Free comfort", desc: "Completely caffeine-free soothing herbal teas." },
                { val: "free", title: "Iced & Refreshing", desc: "Perfect iced infusions for hot weather cooling." }
            ]
        },
        {
            q: "What time of day are you brewing?",
            p: "Sipping times affect what chemical compounds and herbs best serve your body.",
            options: [
                { val: "morning", title: "Sunrise Vitality", desc: "Waking up, active alertness, boosting metabolism." },
                { val: "afternoon", title: "Mid-Day Focus", desc: "Overcoming the afternoon slump without jitters." },
                { val: "evening", title: "Rest & Unwind", desc: "Calming herbs to prepare the nervous system for sleep." }
            ]
        },
        {
            q: "What flavor notes sound best to you?",
            p: "Select the dominant flavor profile you are craving today.",
            options: [
                { val: "bold", title: "Bold, Earthy & Robust", desc: "Strong single-estate malty flavors, ginger, or matcha umami." },
                { val: "refreshing", title: "Light, Floral & Minty", desc: "Delicate jasmine florals or clean crisp peppermint leaves." },
                { val: "sweet", title: "Naturally Sweet & Spiced", desc: "Cinnamon, sweet apples, cardamom spices, or chamomile honey." }
            ]
        }
    ];
    
    const currentStepData = steps[quizStep - 1];
    const progressPct = (quizStep / 3) * 100;
    
    const optionsHTML = currentStepData.options.map(opt => {
        const isSelected = quizAnswers[quizStep === 1 ? 'caffeine' : (quizStep === 2 ? 'temp' : 'flavor')] === opt.val;
        return `
            <div class="quiz-option ${isSelected ? 'selected' : ''}" data-val="${opt.val}" onclick="selectQuizOption('${quizStep === 1 ? 'caffeine' : (quizStep === 2 ? 'temp' : 'flavor')}', '${opt.val}')">
                <div class="quiz-radio"></div>
                <div class="quiz-option-text">
                    <h4>${opt.title}</h4>
                    <p>${opt.desc}</p>
                </div>
            </div>
        `;
    }).join('');
    
    const activeAnswer = quizAnswers[quizStep === 1 ? 'caffeine' : (quizStep === 2 ? 'temp' : 'flavor')];
    
    appEl.innerHTML = `
        <div class="quiz-container reveal">
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
            </div>
            
            <div class="quiz-step">
                <h2>${currentStepData.q}</h2>
                <p>${currentStepData.p}</p>
                
                <div class="quiz-options">
                    ${optionsHTML}
                </div>
            </div>
            
            <div class="quiz-actions">
                <button class="btn-secondary" onclick="prevQuizStep()" ${quizStep === 1 ? 'disabled style="opacity:0.3; cursor:default;"' : ''}>Back</button>
                <button class="btn-primary" id="quizNextBtn" onclick="nextQuizStep()" ${!activeAnswer ? 'disabled' : ''}>Next Step</button>
            </div>
        </div>
    `;
}

function renderAccount(appEl) {
    if (currentUser) {
        // User Dashboard View
        const ordersHTML = currentUser.orders.map(o => `
            <tr>
                <td style="font-weight:600; color:var(--primary);">${o.id}</td>
                <td>${o.date}</td>
                <td>${o.items}</td>
                <td>$${o.total.toFixed(2)}</td>
                <td><span class="order-status-tag ${o.status}">${o.status}</span></td>
            </tr>
        `).join('');
        
        appEl.innerHTML = `
            <div class="section account-container reveal">
                <div class="account-dashboard">
                    <!-- Sidebar Loyalty Stats -->
                    <div class="account-sidebar-box">
                        <div class="account-avatar">${currentUser.name.charAt(0)}</div>
                        <h4 style="font-size:20px; color:var(--primary); margin-bottom:4px;">${currentUser.name}</h4>
                        <p style="font-size:13px; color:var(--text-muted);">${currentUser.email}</p>
                        
                        <div class="loyalty-widget">
                            <div class="loyalty-points">${currentUser.points}</div>
                            <div class="loyalty-label">Steep Rewards Points</div>
                            <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">You earn 1 point per $1 spent! Redeem points at checkout for free sachets.</p>
                        </div>
                        
                        <button class="btn-secondary btn-full" style="margin-top:20px;" onclick="handleLogout()">Sign Out</button>
                    </div>
                    
                    <!-- Content (Order history) -->
                    <div class="account-content-box">
                        <h3>Order History</h3>
                        <div class="orders-table-wrap">
                            ${currentUser.orders.length > 0 ? `
                                <table class="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Teas Purchased</th>
                                            <th>Total Paid</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${ordersHTML}
                                    </tbody>
                                </table>
                            ` : `<p style="color:var(--text-muted); font-size:14px;">You haven't ordered any organic teas yet.</p><button class="btn-primary" onclick="navigateTo('shop')">Shop Our Teas</button>`}
                        </div>
                    </div>
                </div>
            </div>
            
            ${renderFooter()}
        `;
    } else {
        // Login / Register Form View
        appEl.innerHTML = `
            <div class="section account-container reveal" style="max-width:540px;">
                <div class="account-tabs">
                    <button class="account-tab active" id="tabSignin" onclick="toggleAuthTab('signin')">Sign In</button>
                    <button class="account-tab" id="tabRegister" onclick="toggleAuthTab('register')">Register</button>
                </div>
                
                <!-- Sign In Box -->
                <div class="account-auth-box" id="authSigninBox">
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label for="loginEmail">Email Address</label>
                            <input class="form-input" type="email" id="loginEmail" placeholder="you@domain.com" required>
                        </div>
                        <div class="form-group" style="margin-bottom:30px;">
                            <label for="loginPass">Password</label>
                            <input class="form-input" type="password" id="loginPass" placeholder="••••••••" required>
                        </div>
                        <button class="btn-primary btn-full" type="submit">Sign Into Account</button>
                    </form>
                </div>
                
                <!-- Register Box -->
                <div class="account-auth-box" id="authRegisterBox" style="display:none;">
                    <form onsubmit="handleRegister(event)">
                        <div class="form-group">
                            <label for="regName">Your Full Name</label>
                            <input class="form-input" type="text" id="regName" placeholder="Ankita" required>
                        </div>
                        <div class="form-group">
                            <label for="regEmail">Email Address</label>
                            <input class="form-input" type="email" id="regEmail" placeholder="ankita@domain.com" required>
                        </div>
                        <div class="form-group" style="margin-bottom:30px;">
                            <label for="regPass">Create Password</label>
                            <input class="form-input" type="password" id="regPass" placeholder="At least 6 characters" minlength="6" required>
                        </div>
                        <button class="btn-primary btn-full" type="submit">Create Organic Account</button>
                    </form>
                </div>
            </div>
            
            ${renderFooter()}
        `;
    }
}

function renderCheckout(appEl) {
    if (cart.length === 0) {
        appEl.innerHTML = `<div class="section text-center" style="padding-top:140px;"><h2>Your cart is empty.</h2><button class="btn-primary" onclick="navigateTo('shop')">Explore Shop</button></div>`;
        return;
    }
    
    const calcs = getCartCalculations();
    
    // Checkout Summary items
    const summaryHTML = cart.map(item => {
        const p = PRODUCTS.find(x => x.id === item.productId);
        return p ? `
            <div class="checkout-summary-item">
                <span>${p.title} (x${item.qty})</span>
                <span>$${(p.price * item.qty).toFixed(2)}</span>
            </div>
        ` : '';
    }).join('');
    
    appEl.innerHTML = `
        <div class="section checkout-container reveal">
            <!-- Details Form -->
            <div class="checkout-form-box">
                <h2>Secure Checkout</h2>
                <form onsubmit="handleCheckoutSubmit(event)">
                    <h3 style="font-size:18px; color:var(--primary); margin-bottom:16px;">Shipping Address</h3>
                    <div class="form-group">
                        <label for="checkoutName">Recipient Name</label>
                        <input class="form-input" type="text" id="checkoutName" placeholder="Ankita" required value="${currentUser ? currentUser.name : ''}">
                    </div>
                    <div class="form-group">
                        <label for="checkoutAddress">Street Address</label>
                        <input class="form-input" type="text" id="checkoutAddress" placeholder="123 Tea Leaf Rd" required>
                    </div>
                    <div class="form-group-row">
                        <div class="form-group">
                            <label for="checkoutCity">City</label>
                            <input class="form-input" type="text" id="checkoutCity" placeholder="Basalt" required>
                        </div>
                        <div class="form-group">
                            <label for="checkoutZip">Zip/Postal Code</label>
                            <input class="form-input" type="text" id="checkoutZip" placeholder="81621" required>
                        </div>
                    </div>
                    
                    <h3 style="font-size:18px; color:var(--primary); margin-top:30px; margin-bottom:16px;">Payment Details</h3>
                    <div class="form-group">
                        <label for="checkoutCard">Credit Card Number</label>
                        <input class="form-input" type="text" id="checkoutCard" placeholder="4111 2222 3333 4444" pattern="[0-9\\s]{13,19}" required>
                    </div>
                    <div class="form-group-row">
                        <div class="form-group">
                            <label for="checkoutExpiry">Expiry Date</label>
                            <input class="form-input" type="text" id="checkoutExpiry" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="checkoutCvv">CVV</label>
                            <input class="form-input" type="password" id="checkoutCvv" placeholder="•••" maxlength="4" required>
                        </div>
                    </div>
                    
                    <button class="btn-accent btn-full" style="margin-top:30px;" type="submit">Place Order — $${calcs.total.toFixed(2)}</button>
                </form>
            </div>
            
            <!-- Summary Sidebar -->
            <div class="checkout-summary-box">
                <h3>Order Summary</h3>
                <div class="checkout-summary-items">
                    ${summaryHTML}
                </div>
                
                <div class="cart-summary-lines" style="margin-top:20px;">
                    <div class="summary-line">
                        <span>Subtotal</span>
                        <span>$${calcs.subtotal.toFixed(2)}</span>
                    </div>
                    ${calcs.discount > 0 ? `
                        <div class="summary-line" style="color:var(--accent);">
                            <span>Promo Discount</span>
                            <span>-$${calcs.discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="summary-line">
                        <span>Shipping</span>
                        <span>${calcs.shipping === 0 ? 'FREE' : `$${calcs.shipping.toFixed(2)}`}</span>
                    </div>
                    <div class="summary-line total-line">
                        <span>Grand Total</span>
                        <span>$${calcs.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${renderFooter()}
    `;
}

function renderAbout(appEl) {
    appEl.innerHTML = `
        <div class="about-hero reveal">
            <h1>Our Organic Tea Sourcing</h1>
            <p>From single garden estates to your cup — pure, transparent whole leaf tea.</p>
        </div>
        
        <div class="section reveal">
            <div class="about-intro-grid">
                <div>
                    <h2 style="font-size:36px; color:var(--primary); margin-bottom:20px;">What is 'Two Leaves and a Bud'?</h2>
                    <p style="color:var(--text-muted); line-height:1.8;">Historically, tea pluckers were trained to harvest only the top two leaves and the tender growth bud of the Camellia sinensis tea plant. This selective plucking yields the sweetest, most flavor-dense brew with none of the bitter stems or twigs found in mass-market tea brands.</p>
                    <p style="color:var(--text-muted); line-height:1.8;">We founded our tea company on this exact principle. We travel the world visiting organic gardens to source whole-leaf teas, matcha, and premium botanicals that reflect their native terroir.</p>
                </div>
                <img class="about-image" src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80" alt="Beautiful organic tea fields">
            </div>
            
            <div class="about-sustainability-section">
                <div style="text-align:center; max-width:600px; margin: 0 auto 40px auto;">
                    <h2 style="color:var(--primary);">Committed to Eco-Friendly Operations</h2>
                    <p style="color:var(--text-muted);">We believe premium tea shouldn't compromise the planet. That's why we led the industry in transitioning to plant-based compostable sachets.</p>
                </div>
                
                <div class="certifications-row">
                    <div class="cert-item">
                        <div class="cert-circle">🌱</div>
                        <h4>100% Plant-Based</h4>
                    </div>
                    <div class="cert-item">
                        <div class="cert-circle">📦</div>
                        <h4>Fully Compostable</h4>
                    </div>
                    <div class="cert-item">
                        <div class="cert-circle">☀️</div>
                        <h4>USDA Organic</h4>
                    </div>
                    <div class="cert-item">
                        <div class="cert-circle">🤝</div>
                        <h4>Fair Trade Sourced</h4>
                    </div>
                </div>
            </div>
        </div>
        
        ${renderFooter()}
    `;
}

function renderFAQ(appEl) {
    const faqData = [
        {
            q: "What makes whole leaf tea sachets better than paper tea bags?",
            a: "Standard paper tea bags are packed with tea 'dust' or fannings—leftover particles after whole leaves are processed. Dust oxidizes quickly, losing natural oils and tasting bitter. Our spacious pyramidal sachets contain actual whole tea leaves, which have room to fully expand in water, delivering a smoother, more complex, and sweeter infusion."
        },
        {
            q: "Are your pyramid tea bags made of plastic?",
            a: "No. Unlike other pyramid tea bags made of nylon or PET plastic, our sachets are constructed entirely from a compostable, plant-based material called polylactic acid (PLA) derived from sugarcane. They contain no oil-based plastics and do not shed microplastics into your cup."
        },
        {
            q: "How do I compost the tea sachets?",
            a: "Because they are made from 100% plant material, you can discard them in municipal composting systems where they break down fully in commercial facilities. They are also suitable for backyard compost piles, though they will take longer to decompose depending on local heat and moisture levels."
        },
        {
            q: "How do I redeem my loyalty rewards points?",
            a: "Make sure you register for a customer account. For every dollar you spend, you earn 1 reward point. In your dashboard, you can view your balance and unlock discounts on future orders, such as free shipping or complimentary sachet samplers."
        }
    ];
    
    const faqHTML = faqData.map((faq, idx) => `
        <div class="faq-card" id="faqCard-${idx}">
            <div class="faq-question" onclick="document.getElementById('faqCard-${idx}').classList.toggle('active')">
                ${faq.q}
                <span>+</span>
            </div>
            <div class="faq-answer">
                <p style="margin-bottom:0;">${faq.a}</p>
            </div>
        </div>
    `).join('');
    
    appEl.innerHTML = `
        <div class="section reveal" style="padding-top:140px; margin-bottom:80px;">
            <div class="section-header">
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about our organic whole-leaf teas, materials, and shipping policies.</p>
            </div>
            
            <div class="faq-grid">
                ${faqHTML}
            </div>
        </div>
        
        ${renderFooter()}
    `;
}

function renderContact(appEl) {
    appEl.innerHTML = `
        <div class="section reveal" style="padding-top:140px; margin-bottom:80px;">
            <div class="section-header">
                <h2>Get in Touch</h2>
                <p>Have questions about bulk wholesale pricing, custom sampler orders, or tea guidelines? Reach out directly.</p>
            </div>
            
            <div class="contact-grid">
                <!-- Info cards -->
                <div class="contact-info-box">
                    <div class="contact-item-row">
                        <div class="contact-icon-circle">📍</div>
                        <div class="contact-item-text">
                            <h4>Headquarters</h4>
                            <p>Two Leaves and a Bud<br/>Basalt, Colorado, 81621, USA</p>
                        </div>
                    </div>
                    
                    <div class="contact-item-row">
                        <div class="contact-icon-circle">📧</div>
                        <div class="contact-item-text">
                            <h4>Email Enquiries</h4>
                            <p>support@twoleavesandabud.com<br/>wholesale@twoleavesandabud.com</p>
                        </div>
                    </div>
                    
                    <div class="contact-item-row">
                        <div class="contact-icon-circle">📞</div>
                        <div class="contact-item-text">
                            <h4>Phone Support</h4>
                            <p>+1 (800) 555-TEA-LEAF<br/>Mon - Fri, 9:00 AM - 5:00 PM MST</p>
                        </div>
                    </div>
                </div>
                
                <!-- Contact Form -->
                <div class="contact-form-box">
                    <form onsubmit="event.preventDefault(); alert('Thank you for contacting us! A Tea Specialist will get back to you shortly.'); navigateTo('home');">
                        <div class="form-group">
                            <label for="contactName">Your Name</label>
                            <input class="form-input" type="text" id="contactName" placeholder="Ankita" required value="${currentUser ? currentUser.name : ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="contactEmail">Email Address</label>
                            <input class="form-input" type="email" id="contactEmail" placeholder="you@domain.com" required value="${currentUser ? currentUser.email : ''}">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:24px;">
                            <label for="contactMsg">Message</label>
                            <textarea class="form-input" id="contactMsg" rows="5" placeholder="How can we help you brew today?" required></textarea>
                        </div>
                        
                        <button class="btn-primary btn-full" type="submit">Submit Form</button>
                    </form>
                </div>
            </div>
        </div>
        
        ${renderFooter()}
    `;
}

// 15. Shared Footer Template
function renderFooter() {
    return `
        <footer class="footer reveal">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>two leaves <span class="brand-sub">& a bud</span></h3>
                    <p>Pioneers in whole-leaf organic tea sachets. USDA Organic, Fair Trade certified, B-Corp standards.</p>
                    <div class="footer-newsletter-row">
                        <input type="email" placeholder="Join our steep list..." required>
                        <button onclick="alert('Thanks for joining our steep list!')">Join</button>
                    </div>
                </div>
                
                <div class="footer-col">
                    <h4>Shop Collections</h4>
                    <ul>
                        <li><a href="#" onclick="navigateTo('shop')">Organic Black Teas</a></li>
                        <li><a href="#" onclick="navigateTo('shop')">Organic Green Teas</a></li>
                        <li><a href="#" onclick="navigateTo('shop')">Herbal Infusions</a></li>
                        <li><a href="#" onclick="navigateTo('shop')">Matcha Ceremonial</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#" onclick="navigateTo('about')">Our Story</a></li>
                        <li><a href="#" onclick="navigateTo('about')">Sustainability</a></li>
                        <li><a href="#" onclick="navigateTo('faq')">FAQ / Help</a></li>
                        <li><a href="#" onclick="navigateTo('contact')">Contact Us</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h4>Brew Better</h4>
                    <ul>
                        <li><a href="#" onclick="navigateTo('quiz')">Tea Finder Quiz</a></li>
                        <li><a href="#" onclick="navigateTo('shop')">Glass Teaware</a></li>
                        <li><a href="#" onclick="navigateTo('account')">Steep Rewards</a></li>
                        <li><a href="#" onclick="navigateTo('contact')">Wholesale Partners</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <span>© 2026 Two Leaves and a Bud Tea Company. All Rights Reserved.</span>
                <span>Designed with Organic Aesthetics • Basalt, Colorado</span>
            </div>
        </footer>
    `;
}
