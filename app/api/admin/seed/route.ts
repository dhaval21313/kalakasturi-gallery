import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

// Force dynamic rendering — this route must not be statically pre-rendered at build time
export const dynamic = 'force-dynamic';
import { collection, doc, setDoc } from 'firebase/firestore';
import { artProducts } from '@/lib/data';

export async function GET() {
  try {
    // Basic protection to prevent unauthorized runs in production environments
    if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DB_SEED) {
      return NextResponse.json(
        { error: 'Database seeding is disabled in production environments by default.' },
        { status: 403 }
      );
    }

    const productsRef = collection(db, 'products');

    // Dynamically iterate over static catalogue records and set them in Firestore using their slug IDs
    for (const product of artProducts) {
      const docRef = doc(productsRef, product.id);
      await setDoc(docRef, product);
    }

    return NextResponse.json({
      success: true,
      message: `Database Seed Successful! All ${artProducts.length} masterpieces have been migrated from static data to Google Firestore.`,
      catalog: artProducts.map(p => ({ id: p.id, title: p.title }))
    });
  } catch (error: any) {
    console.error('Firestore seeding error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed database. Ensure your environment variables are configured and database connections are open.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
