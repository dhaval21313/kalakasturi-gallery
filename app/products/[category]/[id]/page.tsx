import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Paintbrush, ArrowLeft } from 'lucide-react';
import RedesignedProductDetailClient from '@/components/RedesignedProductDetailClient';
import { getCategorySlug } from '@/lib/utils';

// Import Google Firestore connection modules
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Force dynamic rendering so pages are not pre-built without Firebase env vars
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

// Fetch helper to retrieve artwork from Firestore by slug ID
async function getProductFromDb(id: string) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("Firestore product retrieval error:", err);
    return null;
  }
}

// 1. Next.js 15 Server-Side Metadata Compiler for Dynamic SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product: any = await getProductFromDb(resolvedParams.id);
  
  if (!product) {
    return {
      title: 'Artwork Not Found | Kala Kasturi',
      description: 'The requested original artwork was not found in our collections.'
    };
  }

  const cleanDesc = product.description.substring(0, 155) + '...';
  const categorySlug = getCategorySlug(product.category || 'gallery');

  return {
    title: `${product.title} | Original Fine Art | Kala Kasturi`,
    description: cleanDesc,
    openGraph: {
      title: `${product.title} | Kala Kasturi Art Gallery`,
      description: cleanDesc,
      url: `https://kalakasturi-art-gallery.vercel.app/products/${categorySlug}/${product.id}`,
      type: 'website',
      images: product.image ? [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: cleanDesc,
      images: product.image ? [product.image] : [],
    }
  };
}

// 2. Next.js Static Params compiler to pre-build routes at compilation time from Firestore
export async function generateStaticParams() {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map((doc) => {
      const product = doc.data();
      return {
        category: getCategorySlug(product.category || 'gallery'),
        id: doc.id,
      };
    });
  } catch (err) {
    console.error("Error compiling static parameters from Firestore:", err);
    return [];
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product: any = await getProductFromDb(resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-neutral-800 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-full border border-red-200 flex items-center justify-center mb-6 bg-red-50 text-red-600">
          <Paintbrush className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#1E3F20] font-serif">Artwork Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-sm">We couldn&apos;t find the curated artwork in our database catalog.</p>
        <Link href="/collections" className="bg-[#1E3F20] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#152e18] transition-all">
          Return to Gallery
        </Link>
      </div>
    );
  }

  // 3. E-commerce Structured JSON-LD Data for Rich Google Search Snippets
  const salesVal = parseInt(product.price.replace(/[^\d]/g, ''), 10);
  const mrpVal = parseInt(product.originalMrp?.replace(/[^\d]/g, '') || product.price.replace(/[^\d]/g, ''), 10);
  const categorySlug = getCategorySlug(product.category || 'gallery');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.image || "",
    "description": product.description,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "Kala Kasturi"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": salesVal,
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://kalakasturi-art-gallery.vercel.app/products/${categorySlug}/${product.id}`,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceType": "https://schema.org/ListPrice",
        "priceCurrency": "INR",
        "price": mrpVal
      }
    }
  };

  return (
    <>
      {/* Dynamic structured data script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="redesigned-product-page-wrapper">
        <RedesignedProductDetailClient product={product} />
      </div>
    </>
  );
}
