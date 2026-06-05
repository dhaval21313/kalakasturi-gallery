'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/ProductCard';

// Import Firestore connection modules
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CinematicReel = dynamic(() => import('@/components/CinematicReel'), { ssr: false });

const categories = ["All", "Abstracts", "Portraits", "Wabi-Sabi", "Pooja Essentials"];

// High-fidelity shimmering skeleton loader that exactly mimics the real ProductCard layout to prevent Cumulative Layout Shift
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 select-none animate-pulse">
      {/* 4:5 Aspect Ratio Image Frame with discrete golden loader center accent */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#C19A6B]/50 animate-spin" />
        </div>
      </div>
      
      {/* Information Row Skeleton reflecting original titles, category chips, and buy flow outline */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col min-w-0 flex-grow gap-2">
          {/* Main Title Shimmer */}
          <div className="h-4 bg-neutral-800 rounded-md w-[80%] border border-white/5" />
          {/* Artistic Medium String Shimmer */}
          <div className="h-3 bg-neutral-900 rounded-md w-[55%] border border-[#1a1a1a]" />
          
          {/* Custom tags / buy flow outline */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
            <div className="h-[18px] bg-neutral-900 rounded-sm w-10 border border-white/5" />
            <div className="h-[18px] bg-neutral-900 rounded-sm w-14 border border-white/5" />
          </div>
        </div>
        
        {/* Curated pricing layout box */}
        <div className="h-7 bg-neutral-900 rounded-lg w-12 border border-white/5 flex-shrink-0" />
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Dynamic product loading states from Firestore
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product catalogue in real-time from Firestore on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
        setIsLoading(false);
      } catch (error) {
        console.error("Firestore loading error:", error);
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-dark-charcoal text-light-sand min-h-screen pt-[72px] md:pt-[138px] pb-24 px-4 sm:px-6 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top-Tier: Cinematic Spotlight Filmstrip */}
        <div className="mb-14">
          <CinematicReel />
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex flex-wrap items-center gap-2 bg-[#0A0A0A] p-1.5 rounded-full border border-white/10"
          >
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-white text-black font-semibold shadow-lg' 
                    : 'text-[#A3A3A3] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <button 
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center justify-center gap-2 bg-[#0A0A0A] border border-white/10 py-3 px-6 rounded-full font-medium"
          >
            <Filter className="w-4 h-4 text-[#C19A6B]" /> Filter Artworks
          </button>
        </div>

        {/* Mobile Filter Drawer Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className="fixed inset-0 z-50 bg-dark-charcoal p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-12 mt-10">
                <span className="text-2xl font-bold tracking-tight text-white">Filters</span>
                <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setIsFilterOpen(false); }}
                    className={`text-left text-2xl font-medium py-4 border-b border-white/10 ${
                      activeCategory === cat ? 'text-white border-[#C19A6B]' : 'text-[#A3A3A3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom-Tier: Responsive Product Grid — 2 cols mobile / 3 cols tablet / 4 cols desktop */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={`skeleton-wrap-${idx}`} className="block">
                  <ProductCardSkeleton />
                </div>
              ))
            ) : (
              filteredProducts.map((product) => (
                <motion.div 
                  layout
                  key={product.id} 
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`block rounded-2xl border transition-all duration-500 will-change-[transform,opacity,border-color,box-shadow] ${
                    hoveredId === product.id 
                      ? 'border-[#C19A6B]/50 scale-[1.02] shadow-[0_20px_40px_rgba(193,154,107,0.1)] opacity-100 z-20' 
                      : hoveredId !== null 
                        ? 'border-transparent opacity-35 scale-[0.98] z-0' 
                        : 'border-transparent opacity-100'
                  }`}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-semibold mb-2">No artworks found</h3>
            <p className="text-[#A3A3A3]">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
