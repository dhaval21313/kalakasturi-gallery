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

async function seed() {
  const tempFilePath = path.join(process.cwd(), 'lib', 'data.temp.mjs');
  try {
    // 1. Read lib/data.ts and write to lib/data.temp.mjs
    const dataTsPath = path.join(process.cwd(), 'lib', 'data.ts');
    const dataContent = fs.readFileSync(dataTsPath, 'utf8');
    fs.writeFileSync(tempFilePath, dataContent, 'utf8');

    // 2. Dynamically import the temporary ES module
    const { artProducts } = await import(`../lib/data.temp.mjs?t=${Date.now()}`);

    console.log(`Found ${artProducts.length} products to seed.`);

    // 3. Initialize Firebase App and Firestore
    console.log("Initializing Firebase App for Project:", firebaseConfig.projectId);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // 4. Save each product to Firestore
    for (const product of artProducts) {
      const docRef = doc(db, 'products', product.id);
      console.log(`Writing product '${product.id}' to Firestore...`);
      await setDoc(docRef, product);
    }
    console.log("Firestore Seeding Successful for all products!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (_) {}
    process.exit(1);
  } finally {
    // 5. Cleanup temp file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log("Cleaned up temporary file.");
      }
    } catch (_) {}
  }
}

seed();
