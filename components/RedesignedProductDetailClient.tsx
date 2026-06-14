'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
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
  const { addItem, updateQuantity, isCartOpen, openCart, closeCart } = useCartStore();

  const images = product.images && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : [];

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedVarId, setSelectedVarId] = useState<string | null>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : null
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToIndex = (index: number) => {
    const target = ((index % images.length) + images.length) % images.length;
    setActiveImgIndex(target);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    setTimeout(() => {
      if (scrollRef.current) {
        const w = scrollRef.current.clientWidth;
        if (w > 0) scrollRef.current.scrollTo({ left: target * w, behavior: 'smooth' });
      }
    }, 0);
    scrollTimeoutRef.current = setTimeout(() => { isProgrammaticScroll.current = false; }, 600);
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth > 0) {
        const idx = Math.round(scrollLeft / clientWidth);
        if (idx >= 0 && idx < images.length && idx !== activeImgIndex) setActiveImgIndex(idx);
      }
    }
  };

  useEffect(() => () => { if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current); }, []);

  const selectedVariation = product.variations?.find(v => v.id === selectedVarId) || null;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentMrp   = selectedVariation ? selectedVariation.originalMrp : product.originalMrp;
  const currentSize  = selectedVariation?.size || product.size;
  const currentStock = selectedVariation ? selectedVariation.inStock : product.inStock;
  const salesVal     = parseInt(currentPrice.replace(/[^\d]/g, ''), 10);
  const mrpVal       = parseInt(currentMrp.replace(/[^\d]/g, ''), 10);
  const discount     = mrpVal > salesVal ? Math.round(((mrpVal - salesVal) / mrpVal) * 100) : 0;

  const handleAddToCart = () => {
    if (!currentStock) return;
    const finalId   = selectedVariation ? selectedVariation.id : product.id;
    const cartTitle = selectedVariation ? `${product.title} - ${selectedVariation.name}` : product.title;
    addItem({ id: finalId, title: cartTitle, price: salesVal, priceRaw: currentPrice, image: images[0] || '' });
    updateQuantity(finalId, 1);
    openCart();
  };

  const handleOpenCheckout = () => { closeCart(); router.push('/checkout'); };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} onOpenCheckout={handleOpenCheckout} />

      {/* ── MAIN LAYOUT ── */}
      <main className="flex-1 flex justify-center px-4 md:px-10">
        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row gap-6 lg:gap-12 items-stretch">

          {/* ════ LEFT: Gallery ════ */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">

            {/* ── Main large image ── */}
            <div className="relative w-full rounded-xl overflow-hidden bg-[#141414] select-none"
                 style={{ aspectRatio: '4/5' }}>
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              >
                {images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                    <Image
                      src={img}
                      alt={`${product.title} view ${idx + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 640px"
                      priority={idx === 0}
                      referrerPolicy="no-referrer"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => goToIndex(activeImgIndex - 1)}
                    className="absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-[#0D0D0D]/80 border border-[#C19A6B]/30 flex items-center justify-center text-[#C19A6B] hover:bg-[#C19A6B] hover:text-black transition-all duration-200 cursor-pointer z-10 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToIndex(activeImgIndex + 1)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-[#0D0D0D]/80 border border-[#C19A6B]/30 flex items-center justify-center text-[#C19A6B] hover:bg-[#C19A6B] hover:text-black transition-all duration-200 cursor-pointer z-10 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Dot indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          i === activeImgIndex ? 'w-5 bg-[#C19A6B]' : 'w-1.5 bg-white/30'
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── Thumbnail row ── */}
            {images.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                      idx === activeImgIndex
                        ? 'border-[#C19A6B] opacity-100 scale-105'
                        : 'border-white/10 opacity-50 hover:opacity-80 hover:border-[#C19A6B]/50'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ════ RIGHT: Details (site theme) ════ */}
          <div className="flex-1 min-w-0 flex flex-col gap-5 py-10 md:py-14 overflow-y-auto">

            {/* Category badge */}
            <span className="text-[11px] uppercase tracking-widest text-[#C19A6B] font-semibold">
              {product.category}{product.subCategory ? ` · ${product.subCategory}` : ''}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-snug text-[#FAF6EE]">
              {product.title}
            </h1>

            {/* Price row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-[#C19A6B]">{currentPrice}</span>
              {mrpVal > salesVal && (
                <>
                  <span className="text-base text-[#D8CCB5]/50 line-through">{currentMrp}</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <hr className="border-[#C19A6B]/20" />

            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] uppercase tracking-widest text-[#D8CCB5]/60 font-semibold">Edition</span>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map(v => {
                    const isSelected = selectedVarId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVarId(v.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#C19A6B] border-[#C19A6B] text-black'
                            : 'bg-transparent border-[#C19A6B]/25 text-[#D8CCB5] hover:border-[#C19A6B]/60 hover:text-[#FAF6EE]'
                        }`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {currentSize && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] uppercase tracking-widest text-[#D8CCB5]/60 font-semibold">Size</span>
                <p className="text-sm text-[#D8CCB5]">{currentSize}</p>
              </div>
            )}

            {/* Medium */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-[#D8CCB5]/60 font-semibold">Medium</span>
              <p className="text-sm text-[#D8CCB5]">{product.medium}</p>
            </div>

            {/* Description excerpt */}
            {product.description && (
              <p className="text-sm text-[#D8CCB5]/75 leading-relaxed line-clamp-4">
                {product.description}
              </p>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!currentStock}
              className={`mt-2 flex items-center justify-center gap-3 w-full py-3.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                currentStock
                  ? 'bg-[#C19A6B] hover:bg-[#b08a5b] text-black active:scale-[0.98]'
                  : 'bg-[#1a1a1a] text-[#D8CCB5]/30 cursor-not-allowed border border-[#2a2a2a]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {currentStock ? 'Add to Cart' : 'Sold Out'}
            </button>

            {/* Features / highlights */}
            {product.features && product.features.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 border border-[#C19A6B]/15 rounded-lg p-4 bg-[#141414]">
                <span className="text-[11px] uppercase tracking-widest text-[#C19A6B] font-semibold mb-1">Highlights</span>
                {product.features.map((f, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="text-[#C19A6B] mt-0.5 flex-shrink-0 text-xs">✦</span>
                    <span className="text-xs text-[#D8CCB5]/80 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
