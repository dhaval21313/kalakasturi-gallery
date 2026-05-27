# E-Commerce Upgrade Checklist

## 🎨 Phase 1: Media Optimization & CDN Migration (Completed)
- `[x]` Install `cloudinary` package and configure client variables.
- `[x]` Develop local media compressor (`compress_and_upload.mjs`) using `ffmpeg` to reduce heavy artwork video captures to under 100MB.
- `[x]` Bulk-upload all assets to Cloudinary directory (`kalakasturi_products`) using automatic transcoding parameters (`q_auto,f_auto`).
- `[x]` Update hardcoded image and video directories in `lib/data.ts` to utilize global CDN URLs.
- `[x]` Restrict Git tracking via `.gitignore` to bypass heavy asset limits.
- `[x]` Harden Next.js security remote patterns within `next.config.ts`.
- `[x]` Run `npm run build` and verify 100% static routing generation.

## 🛒 Phase 2: Zustand Shopping Cart & Dual Checkout UI (Pending Approval)
- `[ ]` Install `zustand` state store package.
- `[ ]` Build persistent Zustand store (`lib/store/cartStore.ts`) tracking items, quantities, and precision-paise subtotals with `localStorage` syncing.
- `[ ]` Develop interactive Cart Sliding Drawer element (`components/CartDrawer.tsx`) featuring slide transitions and item controls.
- `[ ]` Construct responsive, multi-column Checkout View controller (`app/checkout/page.tsx`).
- `[ ]` Integrate **WhatsApp Checkout action** compiling URL-encoded checkout details for direct seller message routing.
- `[ ]` Integrate **Prototype Stripe Backend API** router (`app/api/checkout/session/route.ts`) demonstrating session creation workflows.
- `[ ]` Deploy Firebase Free Tier Firestore schemas and write transactional order-logging functions.
- `[ ]` Validate the custom local cookie-based session authorization manager.
- `[ ]` Execute build checks to confirm stable static/serverless rendering.
