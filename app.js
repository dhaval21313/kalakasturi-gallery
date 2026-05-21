// ============================================================
// KalaKasturi — Complete SPA Logic (Dark Luxury Theme)
// ============================================================

// ─── State ───────────────────────────────────────────────────
let cart     = JSON.parse(localStorage.getItem('kk_cart')     || '[]');
let wishlist = JSON.parse(localStorage.getItem('kk_wish')     || '[]');
let user     = JSON.parse(localStorage.getItem('kk_user')     || 'null');
let promo    = localStorage.getItem('kk_promo')               || null;

const PROMOS = {
  'ARTLOVER':  { pct: 0.10, label: '10% off' },
  'COLLECTOR': { pct: 0.15, label: '15% off' },
  'RISHIKESH': { pct: 0.08, label: '8% off' },
};

// ─── Formatters ───────────────────────────────────────────────
const INR = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n);

// ─── Persist ─────────────────────────────────────────────────
const saveCart     = () => localStorage.setItem('kk_cart',  JSON.stringify(cart));
const saveWishlist = () => localStorage.setItem('kk_wish',  JSON.stringify(wishlist));
const saveUser     = () => localStorage.setItem('kk_user',  JSON.stringify(user));

// ─── Toast ────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ─── Reveal ───────────────────────────────────────────────────
function runReveal() {
  document.querySelectorAll('.reveal:not(.up)').forEach((el, i) => {
    setTimeout(() => el.classList.add('up'), i * 70);
  });
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress
  window.addEventListener('scroll', () => {
    const el = document.getElementById('scrollProgress');
    if (el) el.style.width = Math.min((window.scrollY / (document.body.scrollHeight - innerHeight)) * 100, 100) + '%';
  });

  // Header shadow on scroll
  window.addEventListener('scroll', () => {
    const h = document.getElementById('siteHeader');
    if (h) h.style.boxShadow = window.scrollY > 30 ? '0 1px 24px rgba(0,0,0,0.5)' : '';
  });

  // Hamburger
  document.getElementById('hamburger')?.addEventListener('click', toggleMobileNav);

  // Cart overlay close
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Router
  window.addEventListener('hashchange', router);
  if (!location.hash || location.hash === '#') location.hash = '#home';
  router();

  updateCartBadge();
  updateWishBadge();
  updateAccountNav();
});

// ─── Mobile Nav ───────────────────────────────────────────────
function toggleMobileNav() {
  document.getElementById('mobileNav')?.classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('mobileNav')?.classList.remove('open');
}

// ─── Cart Controls ────────────────────────────────────────────
function openCart()   { document.getElementById('cartDrawer')?.classList.add('open'); document.getElementById('cartOverlay')?.classList.add('open'); }
function closeCart()  { document.getElementById('cartDrawer')?.classList.remove('open'); document.getElementById('cartOverlay')?.classList.remove('open'); }
function toggleCart() { document.getElementById('cartDrawer')?.classList.toggle('open'); document.getElementById('cartOverlay')?.classList.toggle('open'); }

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
  openCart();
  toast(`"${p.name}" added to collection`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function cartSubtotal() { return cart.reduce((s, i) => s + i.priceINR * i.qty, 0); }
function cartTotal() {
  const sub = cartSubtotal();
  return promo && PROMOS[promo] ? sub * (1 - PROMOS[promo].pct) : sub;
}

function applyPromo() {
  const code = (document.getElementById('promoInput')?.value || '').trim().toUpperCase();
  const msgEl = document.getElementById('promoMsg');
  if (PROMOS[code]) {
    promo = code;
    localStorage.setItem('kk_promo', code);
    if (msgEl) msgEl.textContent = `✓ ${PROMOS[code].label} applied`;
    toast(`Promo applied — ${PROMOS[code].label}!`);
  } else if (!code) {
    promo = null; localStorage.removeItem('kk_promo');
    if (msgEl) msgEl.textContent = '';
  } else {
    if (msgEl) { msgEl.textContent = '✗ Invalid code'; msgEl.style.color = '#ff6b6b'; }
    return;
  }
  if (msgEl) msgEl.style.color = '';
  updateCartUI();
}

function updateCartBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartBadge');
  if (el) el.textContent = count;
}

function updateCartUI() {
  updateCartBadge();
  const body  = document.getElementById('cartBody');
  const foot  = document.getElementById('cartFoot');
  const emptyEl = document.getElementById('cartEmpty');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty-state" id="cartEmpty"><p>Your collection is empty.</p><button class="link-btn" onclick="closeCart();navigateTo('gallery')">Browse Gallery →</button></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }
  if (foot) foot.style.display = 'block';

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-type">${item.type}</div>
        <div class="cart-qty-row">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)" aria-label="Decrease">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">${INR(item.priceINR * item.qty)}</span>
        <button class="cart-remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>`).join('');

  // Totals
  const sub   = cartSubtotal();
  const total = cartTotal();
  const disc  = sub - total;
  const subEl = document.getElementById('cartSubtotal');
  const totEl = document.getElementById('cartTotal');
  const discRow = document.getElementById('discountRow');
  const discAmt = document.getElementById('discountAmt');
  if (subEl) subEl.textContent = INR(sub);
  if (totEl) totEl.textContent = INR(total);
  if (discRow && discAmt) {
    discRow.style.display = disc > 0 ? 'flex' : 'none';
    discAmt.textContent = `− ${INR(disc)}`;
  }
}

// ─── Wishlist ─────────────────────────────────────────────────
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) { wishlist.push(id); toast('Saved to wishlist ♥'); }
  else { wishlist.splice(idx, 1); toast('Removed from wishlist'); }
  saveWishlist(); updateWishBadge();
  // Update any heart buttons on page
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(btn => {
    btn.classList.toggle('on', wishlist.includes(id));
    btn.textContent = wishlist.includes(id) ? '♥' : '♡';
  });
}

function updateWishBadge() {
  const el = document.getElementById('wishBadge');
  if (!el) return;
  el.textContent = wishlist.length;
  el.style.display = wishlist.length > 0 ? 'flex' : 'none';
}

// ─── Auth ─────────────────────────────────────────────────────
function updateAccountNav() {
  const btn = document.getElementById('accountNavBtn');
  if (!btn) return;
  btn.title = user ? `Account: ${user.name}` : 'Sign In';
}

function handleLogin(e) {
  e.preventDefault();
  const name  = document.getElementById('loginName')?.value.trim();
  const email = document.getElementById('loginEmail')?.value.trim();
  if (!name || !email) { toast('Please fill in all fields'); return; }
  user = { name, email, joined: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), points: Math.floor(Math.random()*1400)+300, orders: [{ id:'KK-8841', date:'14 Nov 2024', artwork:'Saraswati Inspired Painting', total:55540, status:'Delivered' }, { id:'KK-7620', date:'02 Sep 2024', artwork:'Ektara Girl', total:45900, status:'Shipped' }] };
  saveUser(); updateAccountNav();
  toast(`Welcome back, ${name}!`);
  renderAccount();
}

function handleRegister(e) {
  e.preventDefault();
  const name  = document.getElementById('regName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  if (!name || !email) { toast('Please fill in all fields'); return; }
  user = { name, email, joined: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), points: 0, orders: [] };
  saveUser(); updateAccountNav();
  toast(`Welcome to KalaKasturi, ${name}!`);
  renderAccount();
}

function logout() {
  user = null; localStorage.removeItem('kk_user');
  updateAccountNav(); toast('You have been signed out.');
  renderAccount();
}

// ─── Router ───────────────────────────────────────────────────
function navigateTo(route) { location.hash = '#' + route; }

function router() {
  const hash = decodeURIComponent(location.hash.slice(1)) || 'home';
  window.scrollTo({ top: 0, behavior: 'instant' });

  document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
  const base = hash.split('/')[0];
  const navMap = { gallery:'gallery', collections:'collections', about:'about', faq:'faq', contact:'contact' };
  const navId = navMap[base];
  if (navId) document.getElementById(`nav-${navId}`)?.classList.add('active');

  if (hash.startsWith('product/')) renderProductDetail(parseInt(hash.split('/')[1]));
  else switch(hash) {
    case 'home':        renderHome();        break;
    case 'gallery':     renderGallery();     break;
    case 'collections': renderCollections(); break;
    case 'about':       renderAbout();       break;
    case 'faq':         renderFAQ();         break;
    case 'contact':     renderContact();     break;
    case 'account':     renderAccount();     break;
    case 'wishlist':    renderWishlist();    break;
    case 'checkout':    renderCheckout();    break;
    case 'success':     renderSuccess();     break;
    default:            renderHome();
  }
  setTimeout(runReveal, 80);
}

// ─── Filter & Search ──────────────────────────────────────────
let activeFilter = 'all';

function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('ft-' + f)?.classList.add('active');
  renderGalleryGrid();
  setTimeout(runReveal, 80);
}

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  let list = products;
  if (activeFilter === 'spiritual') list = products.filter(p => p.collection === 'Spiritual');
  else if (activeFilter === 'wildlife') list = products.filter(p => p.collection === 'Wildlife');
  else if (activeFilter === 'prints')   list = products.filter(p => p.format === 'print');
  grid.innerHTML = list.length ? list.map(artCard).join('') : `<div style="padding:60px;color:var(--text-2);letter-spacing:0.2em;text-transform:uppercase;font-size:12px;">No artworks found.</div>`;
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase();
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  let list = products;
  if (activeFilter !== 'all') {
    if (activeFilter === 'prints') list = list.filter(p => p.format === 'print');
    else list = list.filter(p => p.collection.toLowerCase() === activeFilter);
  }
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.description.toLowerCase().includes(q));
  grid.innerHTML = list.length ? list.map(artCard).join('') : `<div style="padding:60px;color:var(--text-2);letter-spacing:0.2em;text-transform:uppercase;font-size:12px;">No results for "${q}".</div>`;
  setTimeout(runReveal, 80);
}

// ─── Art Card Component ───────────────────────────────────────
function artCard(p) {
  const inWish = wishlist.includes(p.id);
  return `
    <div class="art-card reveal" onclick="navigateTo('product/${p.id}')">
      <div class="art-card-img">
        <div class="art-card-badges">
          <span class="art-badge ${p.format === 'print' ? 'print-badge' : 'original-badge'}">${p.format === 'print' ? 'Print' : 'Original'}</span>
          ${p.featured ? `<span class="art-badge" style="background:rgba(5,5,5,0.8);color:var(--cream);border:1px solid var(--cream)">Featured</span>` : ''}
        </div>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="art-card-overlay">
          <div class="art-card-overlay-actions">
            <button class="primary-btn" onclick="event.stopPropagation();addToCart(${p.id})">Add to Collection</button>
          </div>
        </div>
      </div>
      <div class="art-card-info">
        <span class="art-card-collection">${p.collection}</span>
        <div class="art-card-name">${p.name}</div>
        <div class="art-card-meta">${p.medium} · ${p.size}</div>
        <div class="art-card-footer">
          <div>
            <div class="art-card-price">${INR(p.priceINR)}</div>
            <div class="art-card-price-usd">≈ $${p.priceUSD} USD</div>
          </div>
          <button class="wish-heart ${inWish ? 'on' : ''}" data-wish="${p.id}" onclick="event.stopPropagation();toggleWishlist(${p.id})" aria-label="Wishlist">${inWish ? '♥' : '♡'}</button>
        </div>
      </div>
    </div>`;
}

// ─── Footer ───────────────────────────────────────────────────
function footerHTML() {
  return `
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <div class="footer-brand-name">KalaKasturi</div>
        <p class="footer-brand-desc">Original Indian classical and spiritual art — hand-painted by Ankita in Rishikesh, Uttarakhand. Direct from artist to collector.</p>
        <div style="margin-top:32px;">
          <form onsubmit="handleNewsletter(event)" style="display:flex;gap:0;max-width:320px;">
            <input type="email" class="newsletter-email" placeholder="Your email address" required aria-label="Email">
            <button type="submit" class="newsletter-submit">Subscribe</button>
          </form>
          <p style="font-size:11px;letter-spacing:0.12em;color:var(--text-2);margin-top:10px;text-transform:uppercase;">Join 200+ collectors worldwide</p>
        </div>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>Portfolio</h4>
          <ul>
            <li><button onclick="navigateTo('gallery')">All Artworks</button></li>
            <li><button onclick="navigateTo('collections')">Spiritual Series</button></li>
            <li><button onclick="navigateTo('collections')">Wildlife Series</button></li>
            <li><button onclick="navigateTo('contact')">Commission</button></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Artist</h4>
          <ul>
            <li><button onclick="navigateTo('about')">Biography</button></li>
            <li><button onclick="navigateTo('faq')">Process</button></li>
            <li><button onclick="navigateTo('faq')">Authenticity</button></li>
            <li><button onclick="navigateTo('faq')">Shipping & Returns</button></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://www.etsy.com/shop/KalaKasturi" target="_blank">Etsy Store</a></li>
            <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
            <li><a href="https://youtube.com" target="_blank">YouTube</a></li>
            <li><button onclick="navigateTo('contact')">Contact</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom container">
      <span class="footer-copy">© ${new Date().getFullYear()} KalaKasturi Art Gallery, Rishikesh, India</span>
      <div class="footer-links">
        <a href="#faq">Privacy</a>
        <a href="#faq">Terms</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </footer>`;
}

function handleNewsletter(e) {
  e.preventDefault();
  toast("You're on the collector's list ✦");
  e.target.reset();
}

// ─── HOME ─────────────────────────────────────────────────────
function renderHome() {
  document.getElementById('app').innerHTML = `
    <!-- HERO -->
    <section class="template-hero">
      <div class="template-hero-overlay"></div>
      <div class="template-hero-content">
        <h1 class="template-hero-h1">The Fashion Industry through a Lense</h1>
      </div>
    </section>

    <!-- 4 Columns Links Grid -->
    <section class="template-links-grid">
      <div class="template-link-col" style="background-image: url('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/link-1.png');">
        <div class="template-link-col-overlay"></div>
        <button class="template-link-btn" onclick="navigateTo('gallery')">View Portfolio</button>
      </div>
      <div class="template-link-col" style="background-image: url('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/link-2.png');">
        <div class="template-link-col-overlay"></div>
        <button class="template-link-btn" onclick="navigateTo('about')">Biography</button>
      </div>
      <div class="template-link-col" style="background-image: url('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/link-3.png');">
        <div class="template-link-col-overlay"></div>
        <button class="template-link-btn" onclick="navigateTo('faq')">Services</button>
      </div>
      <div class="template-link-col" style="background-image: url('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/link-4.png');">
        <div class="template-link-col-overlay"></div>
        <button class="template-link-btn" onclick="navigateTo('contact')">Contact</button>
      </div>
    </section>

    <!-- Bio Section -->
    <section class="template-bio-container">
      <div class="template-bio-socials">
        <a href="https://youtube.com" target="_blank" aria-label="YouTube">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
        </a>
        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        </a>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
      </div>
      <div class="template-bio-content">
        <div class="template-bio-text">
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur</p>
          <p>Erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex <br><br>Pharetra sapien, tempor posuere massa neque nec felis. Aliquam sem ipsum, vehicula ac tortor vel, egestas ullamcorper dui. Curabitur at risus sodales, tristique est id, euismod justo. Mauris nec leo non libero sodales lobortis. Quisque a neque pretium, dictum tellus vitae, euismod neque. Nulla facilisi. Phasellus ultricies dignissim nibh ut.<br><br>Nam et quam sit amet turpis finibus maximus tempor eget augue. Aenean at ultricies lorem. Sed egestas ligula tortor, sit amet mattis ex feugiat non. Duis purus diam, dictum et ante at, commodo iaculis urna. Aenean lacinia, nisl id vehicula condimentum, enim massa.</p>
        </div>
        <button class="template-bio-btn" onclick="navigateTo('about')">Read Full Bio</button>
      </div>
      <div></div>
    </section>

    <!-- Portfolio Grid -->
    <section class="template-portfolio-container">
      <div class="template-portfolio-header">
        <h2 class="template-portfolio-title">Portfolio</h2>
        <button class="template-bio-btn" onclick="navigateTo('gallery')">View Portfolio</button>
      </div>
      <div class="template-portfolio-grid">
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/8.png', 'Portfolio Item 1')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/8.png" alt="Portfolio 1" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/4.png', 'Portfolio Item 2')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/4.png" alt="Portfolio 2" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/2.png', 'Portfolio Item 3')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/2.png" alt="Portfolio 3" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/1.png', 'Portfolio Item 4')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/1.png" alt="Portfolio 4" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/6.png', 'Portfolio Item 5')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/6.png" alt="Portfolio 5" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/5.png', 'Portfolio Item 6')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/5.png" alt="Portfolio 6" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/3.png', 'Portfolio Item 7')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/3.png" alt="Portfolio 7" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
        <div class="template-portfolio-item" onclick="openLightbox('https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/7.png', 'Portfolio Item 8')">
          <img src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/7.png" alt="Portfolio 8" loading="lazy">
          <div class="template-portfolio-item-overlay"></div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="template-services-container">
      <h2 class="template-services-title">Services</h2>
      <div class="template-services-grid">
        <div class="template-service-col">
          <div class="template-infobox">
            <h3>Photoshoot</h3>
            <p>Nam et quam sit amet turpis finibus maximus tempor eget augue. Aenean at ultricies lorem. Sed egestas ligula tortor,</p>
            <button class="template-infobox-btn" onclick="navigateTo('faq')">Explore</button>
          </div>
          <div class="template-infobox">
            <h3>Editing</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
            <button class="template-infobox-btn" onclick="navigateTo('faq')">Explore</button>
          </div>
        </div>
        <div class="template-services-center-img-wrap">
          <img class="template-services-center-img" src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/p-9.jpg" alt="Fashion Shoot" loading="lazy">
        </div>
        <div class="template-service-col">
          <div class="template-infobox">
            <h3>Retouching</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna</p>
            <button class="template-infobox-btn" onclick="navigateTo('faq')">Explore</button>
          </div>
          <div class="template-infobox">
            <h3>Lightning</h3>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <button class="template-infobox-btn" onclick="navigateTo('faq')">Explore</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="template-testimonial-container">
      <div class="template-testimonial-grid">
        <div class="template-testimonial-quote-icon">“</div>
        <p class="template-testimonial-text">Erat placerat. In iaculis arcu eros, eget tempus orci facilisis id. Praesent lorem orci, mattis non efficitur id, ultricies vel nibh. Sed volutpat lacus vitae gravida viverra. Fusce vel tempor elit. Proin tempus, magna id scelerisque vestibulum, nulla ex </p>
        <div class="template-testimonial-author">
          <img class="template-testimonial-avatar" src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/face.png" alt="Jenny Raulph" loading="lazy">
          <div class="template-testimonial-meta">
            <span class="template-testimonial-name">Jenny Raulph</span>
            <span class="template-testimonial-title">Owner at Girl Gang</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="template-cta-container">
      <h2 class="template-cta-title">Lets work together</h2>
      <button class="template-cta-btn" onclick="navigateTo('contact')">Get in touch</button>
    </section>

    <!-- Footer Section -->
    <footer class="template-footer-container">
      <img class="template-footer-logo" src="https://websitedemos.net/fashion-photography-04/wp-content/uploads/sites/1169/2023/02/Mason-Leblanc.svg" alt="Mason Leblanc Logo" loading="lazy">
      <div class="template-footer-socials">
        <a href="https://facebook.com" target="_blank">Facebook</a>
        <a href="https://instagram.com" target="_blank">Instagram</a>
        <a href="https://youtube.com" target="_blank">YouTube</a>
        <a href="https://linkedin.com" target="_blank">LinkedIn</a>
      </div>
      <p class="template-footer-copyright">Copyright &copy; ${new Date().getFullYear()} KalaKasturi Premium Art Gallery | Powered by KalaKasturi</p>
    </footer>

    <!-- Lightbox placeholder -->
    <div class="lightbox" id="lightbox" onclick="closeLightbox()">
      <div class="lightbox-img-wrap">
        <button class="lightbox-close" onclick="closeLightbox()">×</button>
        <img id="lightboxImg" src="" alt="">
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    </div>
  `;
}

// ─── GALLERY ──────────────────────────────────────────────────
function renderGallery() {
  activeFilter = 'all';
  document.getElementById('app').innerHTML = `
    <section class="section">
      <div class="container">
        <div style="margin-bottom:48px;" class="reveal">
          <span class="section-eyebrow">All Works</span>
          <h1>Portfolio</h1>
        </div>
        <div class="gallery-controls reveal">
          <div class="filter-tabs">
            <button id="ft-all"       class="filter-tab active" onclick="setFilter('all')">All</button>
            <button id="ft-spiritual" class="filter-tab"        onclick="setFilter('spiritual')">Spiritual</button>
            <button id="ft-wildlife"  class="filter-tab"        onclick="setFilter('wildlife')">Wildlife</button>
            <button id="ft-prints"    class="filter-tab"        onclick="setFilter('prints')">Prints</button>
          </div>
          <input type="search" class="search-input" placeholder="Search artworks…" oninput="handleSearch(event)" aria-label="Search">
        </div>
        <div class="portfolio-grid grid-3" id="galleryGrid">
          ${products.map(artCard).join('')}
        </div>
      </div>
    </section>
    ${footerHTML()}
  `;
}

// ─── COLLECTIONS ──────────────────────────────────────────────
function renderCollections() {
  const spiritual = products.filter(p => p.collection === 'Spiritual');
  const wildlife  = products.filter(p => p.collection === 'Wildlife');
  document.getElementById('app').innerHTML = `
    <section class="section">
      <div class="container">
        <div class="reveal" style="margin-bottom:64px;">
          <span class="section-eyebrow">Curated Series</span>
          <h1>Collections</h1>
        </div>

        <div class="reveal" style="margin-bottom:64px;">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;padding-bottom:18px;border-bottom:1px solid var(--gray);flex-wrap:wrap;gap:14px;">
            <div>
              <span class="section-eyebrow">Series 01</span>
              <h2 style="margin:0;">Spiritual &amp; Devotional</h2>
            </div>
            <button class="link-btn" onclick="setFilter('spiritual');navigateTo('gallery')">View All →</button>
          </div>
          <div class="portfolio-grid grid-3">${spiritual.map(artCard).join('')}</div>
        </div>

        <div style="border-top:1px solid var(--gray);padding-top:64px;" class="reveal">
          <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;padding-bottom:18px;border-bottom:1px solid var(--gray);flex-wrap:wrap;gap:14px;">
            <div>
              <span class="section-eyebrow">Series 02</span>
              <h2 style="margin:0;">Wildlife &amp; Nature</h2>
            </div>
            <button class="link-btn" onclick="setFilter('wildlife');navigateTo('gallery')">View All →</button>
          </div>
          <div class="portfolio-grid grid-3">${wildlife.map(artCard).join('')}</div>
        </div>
      </div>
    </section>
    ${footerHTML()}
  `;
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────
function renderProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) { renderHome(); return; }
  const related = products.filter(x => x.id !== p.id && x.collection === p.collection).slice(0, 3);
  const inWish  = wishlist.includes(p.id);

  document.getElementById('app').innerHTML = `
    <nav class="breadcrumb">
      <button onclick="navigateTo('home')">Home</button>
      <span>/</span>
      <button onclick="navigateTo('gallery')">Portfolio</button>
      <span>/</span>
      <span>${p.name}</span>
    </nav>

    <div class="pdp-layout">
      <div class="pdp-img-col reveal">
        <div class="pdp-main-img" onclick="openLightbox('${p.image}','${p.name}')">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="pdp-img-caption">
          <span class="pdp-format-label">${p.format === 'original' ? 'Original Artwork' : 'Fine Art Print'}</span>
          <span>Click to enlarge</span>
        </div>
        <div class="pdp-trust" style="margin-top:16px;">
          <div class="pdp-trust-item">🔒 Secure</div>
          <div class="pdp-trust-item">📜 Certificate</div>
          <div class="pdp-trust-item">✈️ Free shipping</div>
          <div class="pdp-trust-item">↩️ 14-day return</div>
        </div>
      </div>

      <div class="pdp-detail-col reveal" style="transition-delay:0.15s">
        <span class="pdp-eyebrow">${p.collection} · ${p.type}</span>
        <h1 class="pdp-title">${p.name}</h1>
        <p class="pdp-artist">Original by Ankita · Rishikesh, India</p>
        <div class="pdp-price-wrap">
          <div class="pdp-price">${INR(p.priceINR)}</div>
          <div class="pdp-price-usd">Approx. $${p.priceUSD} USD · Free insured worldwide shipping</div>
        </div>
        ${p.format === 'original' ? `<div class="pdp-one-of-one">⚠ &nbsp;<strong>1 of 1 Original</strong> — Once sold, this exact painting is gone forever.</div>` : ''}
        <p class="pdp-desc">${p.description}</p>
        <div class="pdp-tags">${p.tags.map(t => `<span class="pdp-tag">${t}</span>`).join('')}</div>
        <div class="pdp-specs">
          <div class="pdp-spec-row"><span class="pdp-spec-label">Size</span><span class="pdp-spec-val">${p.size}</span></div>
          <div class="pdp-spec-row"><span class="pdp-spec-label">Medium</span><span class="pdp-spec-val">${p.medium}</span></div>
          <div class="pdp-spec-row"><span class="pdp-spec-label">Year</span><span class="pdp-spec-val">${p.year}</span></div>
          <div class="pdp-spec-row"><span class="pdp-spec-label">Collection</span><span class="pdp-spec-val">${p.collection}</span></div>
          <div class="pdp-spec-row"><span class="pdp-spec-label">Certificate</span><span class="pdp-spec-val">${p.format==='original'?'Hand-signed, included':'N/A for prints'}</span></div>
          <div class="pdp-spec-row"><span class="pdp-spec-label">Shipping</span><span class="pdp-spec-val">Rolled in acid-free tube · Free worldwide</span></div>
        </div>
        <div class="pdp-actions">
          <button class="pdp-add-btn" onclick="addToCart(${p.id})">ADD TO COLLECTION</button>
          <button class="pdp-wish-btn ${inWish?'on':''}" data-wish="${p.id}" onclick="toggleWishlist(${p.id})" aria-label="Wishlist">${inWish?'♥':'♡'}</button>
        </div>
        <button class="outline-btn" style="margin-top:12px;width:100%;" onclick="navigateTo('contact')">INQUIRE ABOUT FRAMING</button>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--gray);display:flex;align-items:center;gap:14px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-2);">
          <span>Share:</span>
          <a href="https://wa.me/?text=${encodeURIComponent(p.name+' — KalaKasturi')}" target="_blank" style="color:var(--cream)">WhatsApp</a>
          <a href="https://instagram.com" target="_blank" style="color:var(--cream)">Instagram</a>
        </div>
      </div>
    </div>

    ${related.length ? `
    <section class="section dark-alt">
      <div class="container">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:14px;" class="reveal">
          <h3 style="margin:0;">More from ${p.collection}</h3>
          <button class="link-btn" onclick="navigateTo('gallery')">View All →</button>
        </div>
        <div class="portfolio-grid grid-3 reveal">${related.map(artCard).join('')}</div>
      </div>
    </section>` : ''}

    ${footerHTML()}

    <!-- Lightbox -->
    <div class="lightbox" id="lightbox" onclick="closeLightbox()">
      <div class="lightbox-img-wrap">
        <button class="lightbox-close" onclick="closeLightbox()">×</button>
        <img id="lightboxImg" src="${p.image}" alt="${p.name}">
        <div class="lightbox-caption" id="lightboxCaption">${p.name}</div>
      </div>
    </div>
  `;
}

function openLightbox(src, cap) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = document.getElementById('lightboxImg');
  const cap2 = document.getElementById('lightboxCaption');
  if (img) img.src = src;
  if (cap2) cap2.textContent = cap;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── ABOUT ────────────────────────────────────────────────────
function renderAbout() {
  document.getElementById('app').innerHTML = `
    <div class="about-hero">
      <div class="about-hero-bg"></div>
      <div class="about-hero-content container">
        <span class="section-eyebrow reveal">The Artist · KalaKasturi</span>
        <h1 class="reveal">Ankita</h1>
      </div>
    </div>

    <!-- Intro -->
    <div class="about-strip section">
      <div class="about-strip-img">
        <img src="https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?w=800&q=80" alt="Ankita at work" loading="lazy">
      </div>
      <div class="about-strip-text">
        <span class="section-eyebrow">Her Story</span>
        <h2 class="section-title reveal">Art as a<br>Sacred Practice</h2>
        <p style="font-size:15px;color:var(--text);line-height:1.9;margin-bottom:14px;" class="reveal">Welcome to KalaKasturi. I'm Ankita — an independent classical painter based in Rishikesh, Uttarakhand. My work is deeply rooted in Indian classical realism and spiritual narratives, heavily inspired by the mastery of Raja Ravi Varma.</p>
        <p style="font-size:15px;color:var(--text);line-height:1.9;margin-bottom:24px;" class="reveal">I specialize in oil and acrylic on canvas. Every painting takes weeks — sometimes months — to complete. When you purchase directly from my gallery, you're supporting independent art and becoming part of this ongoing story.</p>
        <blockquote class="artist-blockquote reveal">"Art is a window to the divine. Through every brushstroke, I try to capture the grace of our rich heritage."</blockquote>
        <button class="primary-btn reveal" onclick="navigateTo('contact')" style="margin-top:28px;">Commission a Painting</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row reveal">
      <div class="stat-cell"><span class="stat-num">5+</span><span class="stat-label">Years Painting</span></div>
      <div class="stat-cell"><span class="stat-num">7</span><span class="stat-label">Works Available</span></div>
      <div class="stat-cell"><span class="stat-num">100%</span><span class="stat-label">Hand Painted</span></div>
      <div class="stat-cell"><span class="stat-num">∞</span><span class="stat-label">Years of Colour</span></div>
    </div>

    <!-- Process -->
    <section class="section dark-alt">
      <div class="container">
        <div class="reveal" style="margin-bottom:52px;">
          <span class="section-eyebrow">Behind the Brush</span>
          <h2 class="section-title">The Creative Process</h2>
        </div>
        <div class="process-grid">
          ${[
            ['01','Concept & Sketch','Research into subject — mythology, posture, expression, symbolism — followed by multiple charcoal studies.'],
            ['02','Ground & Prime','Museum-quality linen canvas is hand-stretched and primed with archival gesso for perfect tooth.'],
            ['03','Underpainting','A monochrome value study in burnt sienna establishes light and shadow before any colour is applied.'],
            ['04','Layered Oil Work','Colour is built in glazes over weeks using the "fat over lean" technique for crack-free, luminous results.'],
            ['05','Sign & Certify','Once complete and varnished, Ankita signs the reverse and issues a physical Certificate of Authenticity.'],
            ['06','Secure Dispatch','Rolled in acid-free glassine, sealed in a PVC tube, and shipped worldwide with full insurance.'],
          ].map(([num,h,p]) => `<div class="process-cell reveal"><div class="process-num">${num}</div><h4>${h}</h4><p>${p}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <div class="full-cta reveal">
      <span class="section-eyebrow">Commission</span>
      <h2>Have Something<br><em>in Mind?</em></h2>
      <p>Ankita occasionally opens commission slots for custom spiritual portraits, deities, ancestors, or wildlife subjects.</p>
      <div class="full-cta-actions">
        <button class="primary-btn" onclick="navigateTo('contact')">Start a Commission</button>
      </div>
    </div>

    ${footerHTML()}
  `;
}

// ─── FAQ ──────────────────────────────────────────────────────
function renderFAQ() {
  const faqs = [
    ['Are the paintings truly original and hand-painted?', 'Absolutely. Every original painting listed on KalaKasturi is 100% hand-painted by Ankita using professional-grade oil or acrylic paints. We never sell AI-generated art or print reproductions as originals. Fine Art Prints are clearly labelled as such.'],
    ['How are the paintings shipped?', 'Original oil paintings on canvas are carefully rolled (with protective glassine paper) and shipped in heavy-duty, crush-proof PVC tubes. They arrive unframed and unstreched, ready for your local framer. Fine art prints are also rolled in tubes.'],
    ['Do you ship internationally?', 'Yes — we offer free fully insured worldwide shipping on every order. We ship from Rishikesh, India. International orders typically arrive within 10–18 business days. Tracking is provided for all orders.'],
    ['Is a Certificate of Authenticity included?', 'Yes, every original painting ships with a hand-signed, physical Certificate of Authenticity. It states the artwork title, dimensions, medium, year of creation, and Ankita\'s signature. Fine art prints do not include a certificate.'],
    ['Do you take custom commissions?', 'Yes! Ankita occasionally opens commission slots for custom portraits — deities, spiritual subjects, ancestors, or wildlife. Each commission is a fully original painting. Please use the Contact page to inquire about current availability and timelines.'],
    ['Can I return or exchange a painting?', 'We offer a 14-day return window if the painting arrives damaged in transit or significantly differs from its description. As original artworks are unique, exchanges are not always possible. Please photograph and report any damage within 48 hours of delivery.'],
    ['How do I care for my painting after purchase?', 'Keep your painting away from direct sunlight and high humidity. For originals, occasional light dusting with a dry soft brush is all that\'s needed. The varnish layer protects the oil paint for decades.'],
    ['What promo codes are available?', 'Try ARTLOVER for 10% off, COLLECTOR for 15% off, or RISHIKESH for 8% off. New codes are announced on Instagram.'],
    ['Can I visit the studio in Rishikesh?', 'Studio visits are possible by appointment only. If you are visiting Rishikesh and would like to see works in person or discuss a commission, please reach out via the Contact page at least a week in advance.'],
  ];

  document.getElementById('app').innerHTML = `
    <section class="section">
      <div class="container">
        <div style="margin-bottom:60px;text-align:center;" class="reveal">
          <span class="section-eyebrow">Questions & Answers</span>
          <h1>FAQ</h1>
          <p class="section-subtitle" style="margin:16px auto 0;">Everything about purchasing, shipping, authenticity and commissions.</p>
        </div>
        <div class="faq-wrap">
          ${faqs.map((f,i) => `
            <div class="faq-item ${i===0?'active':''} reveal" id="faq-${i}">
              <button class="faq-question" onclick="toggleFaq(${i})">
                ${f[0]}
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-answer">${f[1]}</div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:56px;" class="reveal">
          <p style="font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-2);margin-bottom:18px;">Still have a question?</p>
          <button class="primary-btn" onclick="navigateTo('contact')">Contact Ankita Directly</button>
        </div>
      </div>
    </section>
    ${footerHTML()}
  `;

  // Re-expand first item visually
  setTimeout(() => {
    const first = document.getElementById('faq-0');
    if (first) {
      first.querySelector('.faq-answer').style.display = 'block';
      first.querySelector('.faq-icon').style.transform = 'rotate(45deg)';
    }
  }, 100);
}

function toggleFaq(idx) {
  const card = document.getElementById('faq-' + idx);
  if (!card) return;
  const isActive = card.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(c => {
    c.classList.remove('active');
    c.querySelector('.faq-answer').style.display = 'none';
    c.querySelector('.faq-icon').style.transform = '';
  });
  if (!isActive) {
    card.classList.add('active');
    card.querySelector('.faq-answer').style.display = 'block';
    card.querySelector('.faq-icon').style.transform = 'rotate(45deg)';
  }
}

// ─── CONTACT ──────────────────────────────────────────────────
function renderContact() {
  document.getElementById('app').innerHTML = `
    <section class="section">
      <div class="container">
        <div class="contact-layout">
          <div class="reveal">
            <span class="section-eyebrow">Get in Touch</span>
            <h1 style="margin-bottom:16px;">Contact</h1>
            <p class="section-subtitle">Purchase inquiries, commission requests, gallery exhibitions, or just to say hello — Ankita reads every message personally.</p>
            <div class="contact-info-list">
              <div class="contact-info-item"><span class="contact-info-label">Studio</span><div class="contact-info-value"><strong>Rishikesh, Uttarakhand</strong><em>India 249201 · Visits by appointment</em></div></div>
              <div class="contact-info-item"><span class="contact-info-label">Email</span><div class="contact-info-value"><strong>ankita@kalakasturi.art</strong><em>Replies within 24 hours</em></div></div>
              <div class="contact-info-item"><span class="contact-info-label">Etsy</span><div class="contact-info-value"><strong><a href="https://www.etsy.com/shop/KalaKasturi" target="_blank">KalaKasturi on Etsy</a></strong><em>International marketplace</em></div></div>
              <div class="contact-info-item"><span class="contact-info-label">Instagram</span><div class="contact-info-value"><strong>@kalakasturi.art</strong><em>Behind-the-scenes updates</em></div></div>
            </div>
          </div>

          <div class="contact-form-wrap reveal" style="transition-delay:0.15s">
            <h3>Send a Message</h3>
            <form onsubmit="handleContact(event)">
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label">Name *</label>
                  <input type="text" class="form-control" placeholder="Your full name" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" placeholder="you@example.com" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Subject</label>
                <select class="form-control form-select">
                  <option>Purchase Inquiry</option>
                  <option>Commission Request</option>
                  <option>Framing Question</option>
                  <option>Studio Visit</option>
                  <option>General</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Message *</label>
                <textarea class="form-control" rows="6" placeholder="Describe what you're looking for…" required></textarea>
              </div>
              <button type="submit" class="submit-btn">SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </div>
    </section>
    ${footerHTML()}
  `;
}

function handleContact(e) {
  e.preventDefault();
  toast("Message sent! Ankita will reply within 24 hours 🎨");
  e.target.reset();
}

// ─── WISHLIST ─────────────────────────────────────────────────
function renderWishlist() {
  const items = products.filter(p => wishlist.includes(p.id));
  document.getElementById('app').innerHTML = `
    <section class="section">
      <div class="container">
        <div style="margin-bottom:48px;" class="reveal">
          <span class="section-eyebrow">Saved</span>
          <h1>Wishlist</h1>
          <p style="color:var(--text-2);font-size:14px;letter-spacing:0.1em;margin-top:8px;">${items.length} artwork${items.length!==1?'s':''} saved</p>
        </div>
        ${items.length ? `<div class="portfolio-grid grid-3">${items.map(artCard).join('')}</div>` : `
          <div class="wishlist-empty reveal">
            <p>Your wishlist is empty.</p>
            <button class="primary-btn" onclick="navigateTo('gallery')">Browse Portfolio</button>
          </div>`}
      </div>
    </section>
    ${footerHTML()}
  `;
}

// ─── ACCOUNT ──────────────────────────────────────────────────
function renderAccount() {
  const app = document.getElementById('app');

  if (!user) {
    app.innerHTML = `
      <div class="auth-wrap">
        <div class="reveal">
          <span class="section-eyebrow">Collector Account</span>
          <h1 class="auth-heading">Welcome</h1>
        </div>
        <div class="auth-tabs">
          <button id="tab-login"  class="auth-tab active"  onclick="switchTab('login')">Sign In</button>
          <button id="tab-reg"    class="auth-tab"         onclick="switchTab('reg')">New Collector</button>
        </div>
        <div id="auth-login" class="reveal">
          <form onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:20px;">
            <div class="form-group"><label class="form-label">Name</label><input id="loginName" type="text" class="form-control" placeholder="Your name" required></div>
            <div class="form-group"><label class="form-label">Email</label><input id="loginEmail" type="email" class="form-control" placeholder="you@example.com" required></div>
            <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-control" placeholder="••••••••" required></div>
            <button type="submit" class="submit-btn" style="align-self:flex-start;">SIGN IN</button>
          </form>
        </div>
        <div id="auth-reg" style="display:none;" class="reveal">
          <form onsubmit="handleRegister(event)" style="display:flex;flex-direction:column;gap:20px;">
            <div class="form-group"><label class="form-label">Full Name *</label><input id="regName" type="text" class="form-control" placeholder="Your full name" required></div>
            <div class="form-group"><label class="form-label">Email *</label><input id="regEmail" type="email" class="form-control" placeholder="you@example.com" required></div>
            <div class="form-group"><label class="form-label">Password *</label><input type="password" class="form-control" placeholder="Create a password" required></div>
            <button type="submit" class="submit-btn" style="align-self:flex-start;">CREATE ACCOUNT</button>
          </form>
        </div>
      </div>
      ${footerHTML()}`;
    return;
  }

  app.innerHTML = `
    <div class="account-wrap">
      <div class="account-head reveal">
        <div class="account-avatar">${user.name.charAt(0)}</div>
        <div>
          <h1>${user.name}</h1>
          <p>${user.email} · Joined ${user.joined}</p>
        </div>
        <button class="link-btn" onclick="logout()" style="margin-left:auto;">Sign Out</button>
      </div>
      <div class="account-grid reveal">
        <div>
          <div class="loyalty-block">
            <div class="loyalty-points">${user.points}</div>
            <div class="loyalty-label">Collector Points</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:8px;letter-spacing:0.1em;">1 pt per ₹500 spent</div>
          </div>
          <div class="account-panel" style="margin-top:16px;">
            <div class="account-links">
              <button class="account-link" onclick="navigateTo('gallery')">Browse Gallery →</button>
              <button class="account-link" onclick="navigateTo('wishlist')">My Wishlist (${wishlist.length}) →</button>
              <button class="account-link" onclick="navigateTo('contact')">Commission a Painting →</button>
            </div>
          </div>
        </div>
        <div class="account-panel">
          <h3 style="margin-bottom:24px;font-size:20px;">Order History</h3>
          ${user.orders.length === 0 ? `<p style="color:var(--text-2);font-size:14px;letter-spacing:0.1em;">No orders yet. <button onclick="navigateTo('gallery')" style="color:var(--cream);text-decoration:underline;cursor:pointer;background:none;border:none;font:inherit;">Browse gallery →</button></p>` : `
          <div style="overflow-x:auto;">
            <table class="orders-table">
              <thead><tr><th>Order</th><th>Date</th><th>Artwork</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                ${user.orders.map(o => `<tr><td style="font-family:'Fahkwang',sans-serif;font-size:12px;color:var(--cream);">${o.id}</td><td>${o.date}</td><td>${o.artwork}</td><td>${INR(o.total)}</td><td><span class="order-status">${o.status}</span></td></tr>`).join('')}
              </tbody>
            </table>
          </div>`}
        </div>
      </div>
    </div>
    ${footerHTML()}`;
}

function switchTab(tab) {
  document.getElementById('auth-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('auth-reg').style.display   = tab === 'reg'   ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-reg').classList.toggle('active',   tab === 'reg');
}

// ─── CHECKOUT ─────────────────────────────────────────────────
function renderCheckout() {
  if (cart.length === 0) { navigateTo('gallery'); return; }
  const sub   = cartSubtotal();
  const total = cartTotal();
  const disc  = sub - total;

  document.getElementById('app').innerHTML = `
    <div class="checkout-layout">
      <div class="checkout-form-col">
        <h1 class="reveal">Checkout</h1>
        <form onsubmit="handleCheckout(event)">
          <div class="checkout-section reveal">
            <div class="checkout-section-title">Shipping Details</div>
            <div class="form-row-2" style="margin-bottom:18px;">
              <div class="form-group"><label class="form-label">First Name *</label><input type="text" class="form-control" required></div>
              <div class="form-group"><label class="form-label">Last Name *</label><input type="text" class="form-control" required></div>
            </div>
            <div class="form-group" style="margin-bottom:18px;"><label class="form-label">Email *</label><input type="email" class="form-control" required></div>
            <div class="form-group" style="margin-bottom:18px;"><label class="form-label">Phone</label><input type="tel" class="form-control" placeholder="+1 (555) 000-0000"></div>
            <div class="form-group" style="margin-bottom:18px;"><label class="form-label">Address *</label><input type="text" class="form-control" required></div>
            <div class="form-row-2" style="margin-bottom:18px;">
              <div class="form-group"><label class="form-label">City *</label><input type="text" class="form-control" required></div>
              <div class="form-group"><label class="form-label">Postal Code *</label><input type="text" class="form-control" required></div>
            </div>
            <div class="form-group"><label class="form-label">Country *</label>
              <select class="form-control form-select" required>
                <option value="">Select…</option>
                <option>India</option><option>United States</option><option>United Kingdom</option>
                <option>Australia</option><option>Canada</option><option>Germany</option>
                <option>Singapore</option><option>UAE</option><option>Other</option>
              </select>
            </div>
          </div>
          <div class="checkout-section reveal">
            <div class="checkout-section-title">Payment Details</div>
            <div class="form-group" style="margin-bottom:18px;"><label class="form-label">Name on Card *</label><input type="text" class="form-control" required></div>
            <div class="form-group" style="margin-bottom:18px;"><label class="form-label">Card Number *</label><input type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="19" required></div>
            <div class="form-row-2">
              <div class="form-group"><label class="form-label">Expiry *</label><input type="text" class="form-control" placeholder="MM / YY" maxlength="7" required></div>
              <div class="form-group"><label class="form-label">CVV *</label><input type="text" class="form-control" placeholder="123" maxlength="4" required></div>
            </div>
            <div class="payment-secure" style="margin-top:18px;">🔒 256-bit SSL · Your payment details are never stored.</div>
          </div>
          <button type="submit" class="submit-btn" style="width:100%;padding:18px;font-size:14px;letter-spacing:0.2em;">COMPLETE PURCHASE — ${INR(total)}</button>
        </form>
      </div>

      <div class="checkout-summary-col reveal">
        <h3>Order Summary</h3>
        <div class="checkout-items">
          ${cart.map(item => `
            <div class="checkout-item">
              <img src="${item.image}" alt="${item.name}">
              <div>
                <span class="checkout-item-name">${item.name}</span>
                <div class="checkout-item-meta">Qty ${item.qty}</div>
              </div>
              <span class="checkout-item-price">${INR(item.priceINR * item.qty)}</span>
            </div>`).join('')}
        </div>
        <div class="checkout-promo">
          <input type="text" id="promoInput" placeholder="Promo code" class="promo-field" value="${promo||''}">
          <button type="button" class="link-btn" onclick="applyPromo()">Apply</button>
        </div>
        <div id="promoMsg" class="promo-msg">${promo && PROMOS[promo] ? `✓ ${PROMOS[promo].label} applied` : ''}</div>
        <div class="checkout-totals-wrap">
          <div class="checkout-total-row"><span>Subtotal</span><span>${INR(sub)}</span></div>
          ${disc > 0 ? `<div class="checkout-total-row" style="color:var(--cream)"><span>Discount</span><span>− ${INR(disc)}</span></div>` : ''}
          <div class="checkout-total-row"><span>Shipping</span><span style="color:var(--cream)">Free worldwide</span></div>
          <div class="checkout-total-row checkout-grand-total"><span>Total</span><span>${INR(total)}</span></div>
        </div>
        <div class="checkout-includes">
          <div class="checkout-include">✓ Certificate of Authenticity</div>
          <div class="checkout-include">✓ Artist-signed artwork</div>
          <div class="checkout-include">✓ Insured worldwide shipping</div>
          <div class="checkout-include">✓ 14-day return window</div>
        </div>
      </div>
    </div>
    ${footerHTML()}
  `;
}

function handleCheckout(e) {
  e.preventDefault();
  const orderId = 'KK-' + (8000 + Math.floor(Math.random() * 2000));
  const total   = cartTotal();
  sessionStorage.setItem('kk_receipt', JSON.stringify({ orderId, total, items: cart.map(i => i.name) }));
  cart = []; promo = null;
  saveCart(); localStorage.removeItem('kk_promo');
  updateCartUI();
  navigateTo('success');
}

// ─── SUCCESS ──────────────────────────────────────────────────
function renderSuccess() {
  const rec = JSON.parse(sessionStorage.getItem('kk_receipt') || JSON.stringify({ orderId: 'KK-' + (8000 + Math.floor(Math.random()*999)), total: 0, items: [] }));
  document.getElementById('app').innerHTML = `
    <div class="success-page">
      <div class="success-check reveal">✓</div>
      <h1 class="reveal">Order Confirmed</h1>
      <p class="reveal">Thank you for supporting independent Indian art. Ankita will personally prepare your painting for shipment from Rishikesh.</p>
      <div class="receipt-box reveal">
        <div class="receipt-head">
          <span>Order Ref: <strong>${rec.orderId}</strong></span>
          <span>${new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</span>
        </div>
        ${rec.items.map(name => `<div class="receipt-line"><span>${name}</span><span>✓</span></div>`).join('')}
        <div class="receipt-line receipt-grand"><span>Total Paid</span><span>${INR(rec.total)}</span></div>
        <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-2);margin-top:14px;padding-top:14px;border-top:1px solid var(--gray);">Certificate of Authenticity included · Ships within 3 business days</div>
      </div>
      <div class="success-actions reveal">
        <button class="primary-btn" onclick="navigateTo('gallery')">Continue Browsing</button>
        <button class="link-btn" onclick="navigateTo('account')">View Order History</button>
      </div>
    </div>
    ${footerHTML()}
  `;
}
