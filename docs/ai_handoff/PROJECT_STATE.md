# Kala Kasturi Art Gallery - AI Handoff & Project State

This document contains the exact state of the project. Whenever you open a new chat session with an AI, you can point them to this file (`docs/ai_handoff/PROJECT_STATE.md`) so they immediately know what has been built, how the architecture works, and what the next tasks are.

---

## 📅 1. What Has Been Accomplished So Far

### Phase 1: Media Optimization & CDN Migration (Completed)
*   **Media Decoupling & CDN Migration:** Moved ~600MB of heavy video and high-resolution image assets off local storage to **Cloudinary** (Account: `dwmilzocy`).
*   **FFmpeg Local Compression Fallback:** Compiles and compresses large 190MB+ artworks down to under 100MB using custom Node.js helper scripts.
*   **Next.js Dynamic Routing:** Upgraded static views to dynamic product paths (`/products/[id]`), fetching and pre-rendering images/videos using H.264/WebP dynamically via Cloudinary optimized tags (`q_auto,f_auto`).
*   **Next.js Security Hardening:** Confirms Content Security Policies (CSP) and trusted media domains inside `next.config.ts`.
*   **Git Optimization:** Ignores local heavy raw media directories inside `.gitignore` to keep repository push/pull performance fast.

### Phase 2: E-Commerce & Dual-Checkout Integration (Completed)
*   **Zustand Shopping Cart:** Persistent shopping cart store with `localStorage` syncing, quantitative item modifications, and auto-drawer controls.
*   **Sliding Side Cart Drawer:** Visual sliding component displaying selected items, subtotal aggregations, and checkout options.
*   **Global Navbar Badges:** Dynamic notification badges displaying the active cart items count.
*   **Interactive buy Badges:** Clicks on detailed product listings add selected art pieces to the cart and open the drawer automatically.
*   **Responsive Checkout Page:** Forms capturing customer data validated locally, connected to dual-checkout paths:
    1.  **WhatsApp Checkout Engine:** Generates beautifully structured, URL-encoded order details, launching direct conversations with the gallery founder.
    2.  **Stripe API Endpoint:** Pre-wired backend endpoints at `/api/checkout/session` operating in a secure **Prototype Mode**.
*   **Collector Spaces & LoginPage:** Custom Auth views (`/login`) with an administrative demo bypass (`founder@kalakasturi.com` / `admin`).
*   **Successful Build Check:** Passed production type-checking and prerendered **19 routes** flawlessly.

---

## ⚡ 2. Current Project Architecture
*   **Framework:** Next.js 15 (App Router)
*   **State Store:** Zustand 5
*   **Styling:** Tailwind CSS, Framer Motion (via `motion/react`)
*   **Media Host:** Cloudinary CDN
*   **Serverless APIs:** Stripe 14 (Prototype mode active)
*   **Production Host:** Vercel

---

## 🔮 3. Future Roadmap: Firebase DB CMS & Live Stripe Launch

The next major objective is to transition from hardcoded catalog objects to a dynamic document store and connect live payment transactions.

### Tasks for the Next AI Developer:
1.  **Link Firestore DB:** Create collections for `products` and `orders` under Firebase's Forever-Free tier. Migrate hardcoded catalog items from `lib/data.ts` to Firestore.
2.  **Configure Live Stripe Keys:** Add `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` environment variables inside Vercel/Local envs. The backend `/api/checkout/session` is already coded and ready to pick them up!
3.  **Setup Webhook Observers:** Establish a cryptographically verified webhook listener at `/api/webhooks/stripe` to handle post-payment processing.
