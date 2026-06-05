import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Parse .env.local for credentials
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hanuman = {
  id: "hanuman-digital-print",
  title: "Hanuman – Original Art & Prints",
  medium: "Original Charcoal / Fine Art Prints",
  price: "₹4,999",
  originalMrp: "₹6,000",
  size: "12 × 10 inches (Approx. 30.5 × 25.4 cm)",
  material: "Glass acrylic frame with classic white mount",
  image: "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676814/kalakasturi_products/iuqbqatxdhxj8zsgj1ug.png",
  images: [
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676814/kalakasturi_products/iuqbqatxdhxj8zsgj1ug.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676815/kalakasturi_products/acpeohxm1bmrvjfxj0hb.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676817/kalakasturi_products/su3guxv8gisl3wwjh1s6.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676818/kalakasturi_products/u3hk4nsf9geivshi201q.png"
  ],
  description: "Invoke strength, devotion, and divine protection with this powerful Hanuman digital artwork. This monochrome illustration captures the fearless energy and spiritual presence of Lord Hanuman, making it a meaningful addition to meditation rooms, yoga spaces, temples, or peaceful home interiors. Perfect for lovers of Indian mythology, Hindu spiritual art, and sacred decor, this printable artwork blends traditional devotion with modern minimal aesthetics.",
  category: "Pooja Essentials",
  tags: ["Mythology", "Spiritual", "Digital Print", "Hanuman"],
  inStock: true,
  video: "https://res.cloudinary.com/dwmilzocy/video/upload/q_auto,f_auto/v1780402364/kalakasturi_products/omukp6h6f6yqs6tsjq55.mp4",
  features: [
    "High-resolution digital download including pristine JPG & PNG printable files.",
    "Features a striking minimal monochrome design depicting Lord Hanuman's powerful, fearless energy.",
    "Multi-ratio files included supporting standard print frames: 1:2, 2:3, 3:4, 4:5, and 5:7 (ISO).",
    "Instant access after checkout—no physical item will be shipped, offering immediate framing flexibility.",
    "Perfect for home temples, yoga studios, meditation rooms, and spiritual gifting."
  ],
  variations: [
    {
      id: "hanuman-original",
      name: "Original Charcoal Drawing",
      price: "₹4,999",
      originalMrp: "₹6,000",
      size: "12 × 10 inches (Approx. 30.5 × 25.4 cm)",
      material: "Glass acrylic frame with classic white mount",
      inStock: true
    },
    {
      id: "hanuman-digital",
      name: "Digital Download (Printable Art)",
      price: "₹599",
      originalMrp: "₹999",
      size: "Multi-Ratio support (Ratios 1:1, 1:2, 2:3, 3:4, 5:7 ISO)",
      material: "High-Res Digital Download (JPG & PNG)",
      inStock: true
    },
    {
      id: "hanuman-giclee-a4",
      name: "Giclée Print - A4",
      price: "₹1,599",
      originalMrp: "₹1,999",
      size: "A4 (21 × 29.7 cm / 8.3 × 11.7 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "hanuman-giclee-a3",
      name: "Giclée Print - A3",
      price: "₹1,799",
      originalMrp: "₹2,299",
      size: "A3 (29.7 × 42 cm / 11.7 × 16.5 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "hanuman-giclee-a2",
      name: "Giclée Print - A2",
      price: "₹1,899",
      originalMrp: "₹2,499",
      size: "A2 (42 × 59.4 cm / 16.5 × 23.4 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "hanuman-giclee-a1",
      name: "Giclée Print - A1",
      price: "₹1,999",
      originalMrp: "₹2,799",
      size: "A1 (59.4 × 84.1 cm / 23.4 × 33.1 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    }
  ]
};

async function seed() {
  try {
    console.log("Initializing Firebase App for Project:", firebaseConfig.projectId);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = doc(db, 'products', 'hanuman-digital-print');
    console.log("Writing Hanuman data to Firestore...");
    await setDoc(docRef, hanuman);
    console.log("Firestore Seeding Successful for Hanuman!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  }
}

seed();
