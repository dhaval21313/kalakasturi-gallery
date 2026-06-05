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

const charlie = {
  id: "charlie",
  title: "Charlie – Original Charcoal Drawing",
  medium: "Original Charcoal on Paper",
  price: "₹4,999",
  originalMrp: "₹6,000",
  size: "12 × 10 inches (Approx. 30.5 × 25.4 cm)",
  material: "Glass acrylic frame with classic white mount",
  image: "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676018/kalakasturi_products/omjygocbfbir10qscvnb.png",
  images: [
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676018/kalakasturi_products/omjygocbfbir10qscvnb.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676039/kalakasturi_products/mf46rizp5c0btkft3aqd.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676040/kalakasturi_products/vqh10nehnasxles1hgdy.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676054/kalakasturi_products/sbfh4unya7omqkdpokfd.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676041/kalakasturi_products/bbpl8px0ege8s0ayvcoe.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780676021/kalakasturi_products/g0g9okidzzpj2fq1vdni.jpg"
  ],
  description: "Charlie is a charcoal drawing on paper that focuses on expression and quiet presence through strong contrasts and subtle tonal shifts. Decisive lines and soft gradients create depth and emotional clarity, allowing the subject’s character to emerge naturally. The restrained monochrome palette gives the artwork a timeless, contemplative quality suited for modern interiors, studios, or curated gallery displays. Original hand-drawn charcoal artwork, not a duplicate or reproduction.",
  category: "Portraits",
  tags: ["Charcoal", "Portrait", "Sketch"],
  inStock: true,
  video: null,
  features: [
    "Charlie is a singular charcoal drawing on paper focusing on expression and quiet presence.",
    "Features strong contrasts, expressive lines, and subtle tonal depth.",
    "Finished with a classic white mount and premium glass acrylic frame.",
    "A timeless monochrome palette suited for modern interiors, studios, or curated gallery displays.",
    "Original hand-drawn charcoal artwork, not a duplicate or reproduction."
  ],
  variations: [
    {
      id: "charlie-original",
      name: "Original Charcoal Drawing",
      price: "₹4,999",
      originalMrp: "₹6,000",
      size: "12 × 10 inches (Approx. 30.5 × 25.4 cm)",
      material: "Glass acrylic frame with classic white mount",
      inStock: true
    },
    {
      id: "charlie-digital",
      name: "Digital Download (Printable Art)",
      price: "₹599",
      originalMrp: "₹999",
      size: "Multi-Ratio support (Ratios 1:1, 1:2, 2:3, 3:4, 5:7 ISO)",
      material: "High-Res Digital Download (JPG & PNG)",
      inStock: true
    },
    {
      id: "charlie-giclee-a4",
      name: "Giclée Print - A4",
      price: "₹1,599",
      originalMrp: "₹1,999",
      size: "A4 (21 × 29.7 cm / 8.3 × 11.7 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "charlie-giclee-a3",
      name: "Giclée Print - A3",
      price: "₹1,799",
      originalMrp: "₹2,299",
      size: "A3 (29.7 × 42 cm / 11.7 × 16.5 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "charlie-giclee-a2",
      name: "Giclée Print - A2",
      price: "₹1,899",
      originalMrp: "₹2,499",
      size: "A2 (42 × 59.4 cm / 16.5 × 23.4 in)",
      material: "Premium Giclée Fine Art Paper",
      inStock: true
    },
    {
      id: "charlie-giclee-a1",
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

    const docRef = doc(db, 'products', 'charlie');
    console.log("Writing Charlie data to Firestore...");
    await setDoc(docRef, charlie);
    console.log("Firestore Seeding Successful for Charlie!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    process.exit(1);
  }
}

seed();
