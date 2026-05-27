# E-Commerce Blueprint & Implementation Plan (v3.0)

This master plan details the complete upgrade of the **Kala Kasturi Art Gallery** platform. It implements your WhatsApp checkout as the primary active transaction flow, integrates a free Google Firebase database, establishes a secure private Admin Panel (`/admin`) for product and order management, and incorporates rich UI micro-animations.

---

## 🙋‍♂️ 1. Google Firebase Setup Guide (Like You Are 5 Years Old) 🧸

Firebase is a free, secure vault built by Google. It will store your paintings and your customer orders. Let’s set it up together in 6 simple steps!

```
[ Step 1 ] Go to console.firebase.google.com & click "Create a Project"
    │
[ Step 2 ] Name it "Kala Kasturi Gallery" (Turn off Google Analytics)
    │
[ Step 3 ] Click the "Web" icon (looks like this: </>) to create a Web App
    │
[ Step 4 ] Copy the config code block (the list of keys Google gives you)
    │
[ Step 5 ] Go to Build -> "Firestore Database" & click "Create Database"
    │
[ Step 6 ] Select "Start in Test Mode" and pick your nearest server region!
```

### 📋 Detailed Step-by-Step Instructions:

1.  **Open the Sandbox Vault:**
    *   Open your internet browser and go to [console.firebase.google.com](https://console.firebase.google.com/).
    *   Log in using your standard Google/Gmail account.
2.  **Create a New Project:**
    *   Click the big blue button that says **"Add project"** or **"Create a project"**.
    *   Type `Kala Kasturi Gallery` as the project name.
    *   Click **Continue**.
    *   Google will ask if you want to enable "Google Analytics". **Turn this toggle OFF** (we don't need it right now, which makes setup faster).
    *   Click **"Create project"** and wait 10 seconds for the progress circle to fill up.
3.  **Add a Web App to Your Project:**
    *   Once your project is ready, click **Continue**.
    *   On the dashboard screen, you will see a row of circular icons. Click the **Web** icon (it looks like a small coding bracket: `</>`).
    *   Type the App nickname: `Kala Kasturi App`.
    *   Click **Register app**.
4.  **Copy Your Secret Configuration Keys:**
    *   Firebase will display a code block containing your config keys. It will look like this:
        ```javascript
        const firebaseConfig = {
          apiKey: "AIzaSy...",
          authDomain: "...",
          projectId: "...",
          storageBucket: "...",
          messagingSenderId: "...",
          appId: "..."
        };
        ```
    *   **Keep this tab open!** We will copy these exact keys into a new local environment file named `.env.local` inside your project root.
5.  **Create Your Firestore Database (Our Product/Order Cabinet):**
    *   On the left-hand sidebar menu, click the **Build** folder icon, then click **Firestore Database**.
    *   Click the orange button that says **"Create database"**.
    *   **Security Rules:** Select **"Start in test mode"** (this allows us to immediately connect our code to read/write records for testing).
    *   **Location:** Pick a server nearest to you (e.g., `asia-south1` for Mumbai/India or `us-east1` for global).
    *   Click **Create** or **Enable**.
6.  **All Done! 🎉** Your database is ready. You don't need to put any credit card details or pay a single rupee. Google gives you 50,000 free reads and 20,000 free writes *every single day*!

---

## 🛠️ 2. Core Features & Backend Architecture (Phase 3 Execution)

### A. Environment Secret Variables Configuration
We will create a `.env.local` file in your root workspace containing your configurations:
```text
# Active WhatsApp Order Router
NEXT_PUBLIC_WHATSAPP_NUMBER=+919033459353

# Firebase Web App Config (Copied from Step 4)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### B. Firestore Collections Schema
*   **Collection: `/products`**
    *   Stores artwork records dynamically. When you add a new painting in the admin panel, it automatically inserts a document here.
    ```json
    {
      "id": "charlie",
      "title": "Charlie – Original Charcoal Drawing",
      "medium": "Original Charcoal on Paper",
      "price": 4999, // Numeric representation
      "priceRaw": "₹4,999", // Pre-formatted string
      "size": "12 × 10 inches",
      "material": "Glass acrylic frame",
      "image": "https://res.cloudinary.com/...",
      "images": ["https://res.cloudinary.com/..."],
      "description": "Original hand-drawn charcoal artwork...",
      "category": "Portraits",
      "tags": ["Charcoal", "Portrait"],
      "inStock": true, // Dynamic stock toggle!
      "video": null
    }
    ```
*   **Collection: `/orders`**
    *   Whenever a collector fills out the checkout form and clicks "WhatsApp Checkout", the code writes the order document into Firestore *before* redirecting them. This ensures you never lose track of an order even if the customer closes their WhatsApp app.
    ```json
    {
      "orderId": "KK-4829",
      "customerName": "Rahul Sharma",
      "customerPhone": "+919988776655",
      "customerEmail": "rahul@example.com",
      "shippingAddress": "123 Temple Road, Rishikesh, Uttarakhand",
      "items": [{"id": "charlie", "title": "Charlie Charcoal", "quantity": 1}],
      "subtotal": 4999,
      "status": "pending_whatsapp", // pending_whatsapp, shipped, completed
      "createdAt": "timestamp"
    }
    ```

---

## 💻 3. The Secure Admin Portal (`/admin`)

To manage your gallery securely without writing code, we will build a private dashboard under `/admin`.

```
                    ┌───────────────────────────────┐
                    │       Secure Route Guard      │
                    │   (Validates Admin Cookie)    │
                    └───────────────┬───────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│     Product Manager Console     │         │     Order Fulfillment Tracker   │
│  - Form to add new art pieces   │         │  - Chronological list of orders │
│  - Dynamic Cloudinary Uploads   │         │  - Customer shipping coordinates│
│  - Toggle "inStock" status      │         │  - Toggle Status: Paid/Shipped   │
└─────────────────────────────────┘         └─────────────────────────────────┘
```

### 🖥️ Feature 1: The Product Manager Console
*   A clean form to input artwork title, medium, price, dimensions, description, and category.
*   **Browser-Based Direct Cloudinary Uploads:** 
    We will implement secure client-side uploads. When you select an image file from your computer, the admin panel directly compresses the image in the browser and uploads it to your Cloudinary folder using an **Unsigned Upload Preset** (which we will configure on your Cloudinary dashboard). This bypasses Vercel file limits and keeps your private credentials secure!
*   **Stock Toggles:** A simple switch next to each painting. Toggling it OFF immediately updates the product document in Firestore to `inStock: false`.

### 📦 Feature 2: Order Fulfillment Tracker
*   A clean table displaying all pending and completed orders from Firestore.
*   Shows the exact items ordered, customer phone numbers, emails, and full mailing address descriptions.
*   Includes a button to trigger status changes: `Pending ➔ Shipped ➔ Completed` that writes directly back to Firestore.

### 🛡️ Feature 3: Secure Session Route Guard
*   Restricts access to the `/admin` path.
*   If a non-admin tries to navigate there, they are redirected to `/login`.
*   Includes a secure local administrator authentication session that stores authorization tokens dynamically.

---

## 🎨 4. UX & Frontend Refinement Enhancements (Phase 4 Execution)

### A. Live Dynamic Stock Checks
*   When a detailed product view `/products/[id]` loads, it will execute a real-time subscription (Firestore `onSnapshot`) to listen for stock changes.
*   If `inStock` changes to `false` in the DB, the primary CTA button instantly transforms into **"Sold Out / Collector Reserved"** in real-time, disabling additions to the cart and protecting you from duplicate order requests.

### B. Animated Toast Notifications
*   We will implement a custom Toast component (using lightweight Framer Motion/`motion/react`).
*   Adding an item to the cart will trigger a beautiful sliding modal in the top-right corner showing:
    > "🎨 **Sage Vishvamitra** added to your Collector Cart!"
*   Includes automatic slide transitions and exit animations.

### C. Verify Privacy & Legal Pages placeholders
*   Customize static templates for `/privacy`, `/shipping-returns`, and `/terms` with your brand details, providing immediate legal assurances for high-value collectors.

---

## 📈 Verification Plan

### Automated Checks
1. Compile with `npm run build` to verify serverless endpoints and client dashboards compile statically.

### Manual Verification
1.  **Firebase Connection:** Confirm Firestore reads/writes dynamically.
2.  **Cloudinary Browser Uploads:** Select an image file in `/admin`, confirm it uploads to Cloudinary, and verify a new product document is created in Firestore with the new CDN URL.
3.  **Real-Time Stock Lock:** Set a product's stock to `false` in Firebase Console, and confirm the frontend buy button instantly deactivates and changes text in real-time.
