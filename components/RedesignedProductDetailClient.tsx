'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useCartStore } from '../lib/store/cartStore';
import CartDrawer from './CartDrawer';
import { useRouter } from 'next/navigation';

interface Variation {
  id: string;
  name: string;
  price: string;
  originalMrp: string;
  size: string;
  material: string;
  inStock: boolean;
}

interface Product {
  id: string;
  title: string;
  medium: string;
  price: string;
  originalMrp: string;
  size: string;
  material: string;
  image: string;
  images?: string[];
  description: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  inStock: boolean;
  video?: string | null;
  features?: string[];
  variations?: Variation[];
}

export default function RedesignedProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, updateQuantity, isCartOpen, openCart, closeCart, getTotalItems } = useCartStore();

  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const totalImages = images.length;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedVarId, setSelectedVarId] = useState<string | null>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : null
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToIndex = (index: number) => {
    const targetIndex = ((index % totalImages) + totalImages) % totalImages;
    setActiveImgIndex(targetIndex);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    setTimeout(() => {
      if (scrollRef.current) {
        const width = scrollRef.current.clientWidth;
        if (width > 0) {
          scrollRef.current.scrollTo({ left: targetIndex * width, behavior: 'smooth' });
        }
      }
    }, 0);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 600);
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth > 0) {
        const newIndex = Math.round(scrollLeft / clientWidth);
        if (newIndex >= 0 && newIndex < totalImages && newIndex !== activeImgIndex) {
          setActiveImgIndex(newIndex);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const selectedVariation = product.variations?.find(v => v.id === selectedVarId) || null;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentStock = selectedVariation ? selectedVariation.inStock : product.inStock;
  const salesVal = parseInt(currentPrice.replace(/[^\d]/g, ''), 10);

  const handleAddToCart = () => {
    if (!currentStock) return;
    const finalId = selectedVariation ? selectedVariation.id : product.id;
    const cartTitle = selectedVariation
      ? `${product.title} - ${selectedVariation.name}`
      : product.title;
    addItem({
      id: finalId,
      title: cartTitle,
      price: salesVal,
      priceRaw: currentPrice,
      image: images[0] || '',
    });
    updateQuantity(finalId, 1);
    openCart();
  };

  const handleOpenCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col" style={{ fontFamily: 'var(--font-sans, Arial, sans-serif)' }}>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} onOpenCheckout={handleOpenCheckout} />

      {/* ── MAIN PRODUCT LAYOUT ── */}
      <main className="flex-1 flex items-center justify-center px-6 py-10 md:py-0">
        <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16 min-h-[80vh]">

          {/* ── LEFT: Image Gallery ── */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Main image container */}
            <div className="relative w-full max-w-[520px] aspect-square select-none">
              {/* Scroll container */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                    <Image
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="520px"
                      priority={idx === 0}
                      referrerPolicy="no-referrer"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next arrows — bottom center, pill-shaped dark controls */}
              {totalImages > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-0 bg-[#1a1a1a]/90 rounded-full border border-white/10 backdrop-blur-md shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => goToIndex(activeImgIndex - 1)}
                    className="w-11 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer border-r border-white/10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToIndex(activeImgIndex + 1)}
                    className="w-11 h-9 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="flex-1 flex flex-col justify-center gap-5 text-white max-w-[460px] w-full">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white" style={{ color: '#ffffff' }}>
              {product.title}
            </h1>

            {/* Price badge */}
            <div>
              <span className="inline-block bg-[#2563EB] text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                {currentPrice}
              </span>
            </div>

            {/* Divider */}
            <hr className="border-[#2a2a2a]" />

            {/* Variations (if any) */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-widest text-[#888] font-semibold">Edition</span>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => {
                    const isSelected = selectedVarId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVarId(v.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'bg-transparent border-[#3a3a3a] text-[#aaa] hover:border-[#666] hover:text-white'
                        }`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size info */}
            {(selectedVariation?.size || product.size) && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-widest text-[#888] font-semibold">Size</span>
                <p className="text-sm text-[#ccc]">{selectedVariation?.size || product.size}</p>
              </div>
            )}

            {/* Medium / Material short line */}
            <p className="text-sm text-[#999] leading-relaxed">
              {product.medium}
            </p>

            {/* Add To Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!currentStock}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-full text-white font-semibold text-base transition-all duration-200 cursor-pointer ${
                currentStock
                  ? 'bg-[#2563EB] hover:bg-[#1d4fd8] active:scale-[0.98]'
                  : 'bg-[#333] cursor-not-allowed text-[#666]'
              }`}
            >
              <Plus className="w-5 h-5" />
              {currentStock ? 'Add To Cart' : 'Sold Out'}
            </button>

          </div>
        </div>
      </main>
    </div>
  );
}
