'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Paintbrush, 
  Play, 
  Pause, 
  BadgeCheck, 
  Truck, 
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCartStore } from '../lib/store/cartStore';

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
  tags?: string[];
  inStock: boolean;
  video?: string | null;
  features?: string[];
  variations?: Variation[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [activeMedia, setActiveMedia] = useState<'photo' | 'video'>('photo');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });
  
  // Variations state support
  const [selectedVarId, setSelectedVarId] = useState<string | null>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : null
  );

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const guideImages = [
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780677291/kalakasturi_guide/hry0cellfu4zccp0vepp.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780677294/kalakasturi_guide/trgcopr3ngdfhdvbkajw.png",
    "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1780677297/kalakasturi_guide/vhmciox9gzbmhfmlddzs.png"
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  const rId = useRef<number | null>(null);

  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  
  // Slide total count
  const totalItems = images.length + (product.video ? 1 : 0);
  const activeIndex = activeMedia === 'video' ? images.length : activeImgIndex;

  const goToIndex = (index: number) => {
    const targetIndex = (index + totalItems) % totalItems;
    if (product.video && targetIndex === images.length) {
      setActiveMedia('video');
    } else {
      setActiveMedia('photo');
      setActiveImgIndex(targetIndex);
    }
  };

  const handleNext = () => goToIndex(activeIndex + 1);
  const handlePrev = () => goToIndex(activeIndex - 1);

  // Swipe touch tracking
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Compute selected variation
  const selectedVariation = product.variations?.find(v => v.id === selectedVarId) || null;

  // Calculate discount percentage dynamically based on selected variation or root product
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentMrp = selectedVariation ? selectedVariation.originalMrp : product.originalMrp;

  const salesVal = parseInt(currentPrice.replace(/[^\d]/g, ''), 10);
  const mrpVal = parseInt(currentMrp.replace(/[^\d]/g, ''), 10);
  const discountPct = mrpVal > 0 ? Math.round(((mrpVal - salesVal) / mrpVal) * 100) : 0;
  const savings = mrpVal - salesVal;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Throttling mouse tracking updates with requestAnimationFrame for 60Hz/120Hz smooth scrolling
    if (rId.current) cancelAnimationFrame(rId.current);
    rId.current = requestAnimationFrame(() => {
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(1.25)'
      });
    });
  };

  const handleMouseLeave = () => {
    if (rId.current) cancelAnimationFrame(rId.current);
    setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Clean up animation frames
  useEffect(() => {
    return () => {
      if (rId.current) cancelAnimationFrame(rId.current);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      
      {/* LEFT SIDEBAR: Dynamic Media Gallery Component (Lg: 7 Columns) */}
      <div className="lg:col-span-7 flex flex-col gap-6 w-full">
        
        {/* Visual View Stage Frame */}
        <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {images.length > 0 ? (
            <div 
              className="w-full h-full relative group/stage select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              
              {/* Premium Progress Indicators */}
              {totalItems > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md z-30 shadow-md">
                  {Array.from({ length: totalItems }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-[#C19A6B] w-3.5' : 'bg-white/30 hover:bg-white/60'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Prev / Next Swipe Arrows */}
              {totalItems > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-black/40 hover:bg-[#C19A6B] hover:text-black border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 z-30 opacity-80 md:opacity-0 md:group-hover/stage:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-[#C19A6B] hover:text-black border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 z-30 opacity-80 md:opacity-0 md:group-hover/stage:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                {activeMedia === 'photo' ? (
                  <motion.div
                    key={`photo-${activeImgIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative cursor-zoom-in overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src={images[activeImgIndex]}
                      alt={`${product.title} detailed angle view ${activeImgIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-200 ease-out"
                      style={zoomStyle}
                      priority
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 1024px) 100vw, 800px"
                      draggable="false"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/60 p-2.5 rounded-full border border-white/10 backdrop-blur-md z-20 pointer-events-none">
                      <Maximize2 className="w-4 h-4 text-neutral-300" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative bg-black"
                  >
                    {product.video && (
                      <video
                        ref={videoRef}
                        src={product.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    )}
                    {/* Custom video control bar overlaid dynamically */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/75 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md z-20">
                      <button onClick={togglePlay} className="flex items-center gap-2 hover:text-[#C19A6B] transition-colors">
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        <span className="text-[10px] uppercase tracking-wider font-semibold">{isPlaying ? 'Pause Preview' : 'Play Preview'}</span>
                      </button>
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[8px] tracking-widest uppercase font-mono text-emerald-400">Live Studio Capture</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* High-Fidelity Custom Artistic Placeholder for Charlie */
            <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1E140C] flex flex-col items-center justify-center p-8 text-center relative border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,154,107,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="w-20 h-20 rounded-full border border-dashed border-[#C19A6B]/40 flex items-center justify-center mb-6 bg-black/50 shadow-inner">
                <Paintbrush className="w-8 h-8 text-[#C19A6B]" />
              </div>
              <h4 className="text-white text-base sm:text-lg font-semibold uppercase tracking-widest mb-3 font-sans text-[#E5E5E5]">Charcoal Artwork Original</h4>
              <p className="text-xs text-neutral-400 max-w-[280px] leading-relaxed font-light mb-6">
                This singular original drawing is currently being mounted inside a custom wabi-sabi glass acrylic mount. Visual preview will release upon completion of the frame setting.
              </p>
              <div className="px-5 py-2 bg-[#C19A6B]/10 border border-[#C19A6B]/30 rounded-full text-xs uppercase tracking-widest text-[#C19A6B] font-medium backdrop-blur-md">
                Collector Reserve Preview
              </div>
            </div>
          )}
        </div>

        {/* Media Tabs (Photo vs Video Preview Toggles) */}
        {product.video && (
          <div className="flex justify-center gap-3 mt-1">
            <button
              onClick={() => goToIndex(0)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all ${activeMedia === 'photo' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white'}`}
            >
              📸 High-Res Photo
            </button>
            <button
              onClick={() => goToIndex(images.length)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all ${activeMedia === 'video' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-neutral-400 hover:text-white'}`}
            >
              🎥 Studio Video View
            </button>
          </div>
        )}

        {/* Slider Thumbnail list */}
        {totalItems > 1 && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 justify-center lg:justify-start">
            {Array.from({ length: totalItems }).map((_, i) => {
              const isVideoItem = product.video && i === images.length;
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border bg-neutral-900 transition-all duration-300 ${isActive ? 'border-[#C19A6B] scale-105 shadow-[0_0_10px_rgba(193,154,107,0.3)]' : 'border-white/10 hover:border-white/20'}`}
                >
                  {isVideoItem ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 hover:bg-black transition-colors text-[#C19A6B]">
                      <Play className="w-5 h-5 fill-current mb-1" />
                      <span className="text-[8px] uppercase tracking-wider font-semibold">Video</span>
                    </div>
                  ) : (
                    <Image
                      src={images[i]}
                      alt={`View detail thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: Comprehensive Product Information (Lg: 5 Columns) */}
      <div className="lg:col-span-5 flex flex-col gap-6 text-white w-full">
        
        {/* Header description */}
        <div>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C19A6B] font-bold block mb-2">
            {selectedVariation ? selectedVariation.name : "Original Art Piece"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 leading-tight">{product.title}</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] italic">{product.medium}</p>
        </div>

        {/* Product Variations Option Selector */}
        {product.variations && product.variations.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Select Edition / Size</span>
            <div className="flex flex-col gap-2">
              {product.variations.map((v) => {
                const isSelected = selectedVarId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVarId(v.id)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#C19A6B]/10 border-[#C19A6B] text-white shadow-[0_0_15px_rgba(193,154,107,0.15)]'
                        : 'bg-[#050505] border-white/5 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#C19A6B]' : 'text-neutral-200'}`}>
                        {v.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-light truncate max-w-[200px] sm:max-w-[280px]">
                        {v.size} • {v.material}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0">
                      <span className="text-sm font-bold font-mono text-white">{v.price}</span>
                      {v.originalMrp !== v.price && (
                        <span className="text-[9px] text-neutral-500 font-mono line-through leading-none mt-0.5">
                          {v.originalMrp}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Dynamic Printing Guide Button for Digital Prints */}
            {(selectedVarId?.includes("digital") || product.id.includes("digital")) && (
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C19A6B] hover:text-white transition-colors cursor-pointer border border-[#C19A6B]/25 hover:border-[#C19A6B]/50 bg-[#C19A6B]/5 hover:bg-[#C19A6B]/10 px-4 py-2.5 rounded-full mt-3 w-fit"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View Printing Guide
              </button>
            )}
          </div>
        )}

        {/* Luxury Price Matrix Panel */}
        <div className="p-5 sm:p-6 bg-[#080808] border border-white/10 rounded-2xl flex flex-col gap-3.5 shadow-md">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-white">{currentPrice}</span>
              {currentMrp !== currentPrice && (
                <span className="text-sm sm:text-base text-neutral-500 font-mono line-through">{currentMrp}</span>
              )}
            </div>
            {discountPct > 0 && (
              <span className="px-3 py-1 bg-[#C19A6B]/15 border border-[#C19A6B]/30 rounded-full text-[10px] sm:text-xs uppercase tracking-wider text-[#C19A6B] font-bold">
                {discountPct}% Off
              </span>
            )}
          </div>
          <div className="text-[11px] text-neutral-400 font-medium">
            ✨ You save <span className="font-bold text-[#C19A6B] font-mono">₹{savings.toLocaleString('en-IN')}</span> on this collector selection.
          </div>
        </div>

        {/* Specs Summary Table */}
        <div className="flex flex-col border border-white/5 rounded-2xl bg-neutral-950/40 divide-y divide-white/5 overflow-hidden">
          <div className="grid grid-cols-3 p-4 text-xs">
            <span className="text-neutral-400">Dimensions</span>
            <span className="col-span-2 font-medium text-light-sand">
              {selectedVariation ? selectedVariation.size : product.size}
            </span>
          </div>
          <div className="grid grid-cols-3 p-4 text-xs">
            <span className="text-neutral-400">Material / Delivery</span>
            <span className="col-span-2 font-medium text-light-sand">
              {selectedVariation ? selectedVariation.material : product.material}
            </span>
          </div>
          <div className="grid grid-cols-3 p-4 text-xs">
            <span className="text-neutral-400">Medium</span>
            <span className="col-span-2 font-medium text-light-sand">{product.medium}</span>
          </div>
        </div>

        {/* CTA checkout flow section */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              const isStockActive = selectedVariation ? selectedVariation.inStock : product.inStock;
              if (!isStockActive) return;
              
              const finalId = selectedVariation ? selectedVariation.id : product.id;
              const finalPrice = salesVal;
              const finalPriceRaw = currentPrice;
              
              // Formatting cart item title to be clean and accurate
              const cartTitle = selectedVariation 
                ? (selectedVariation.id === `${product.id}-original` || selectedVariation.name.toLowerCase().includes("original")
                    ? product.title
                    : `${product.title} - ${selectedVariation.name}`)
                : product.title;

              addItem({
                id: finalId,
                title: cartTitle,
                price: finalPrice,
                priceRaw: finalPriceRaw,
                image: images[0] || '',
              });
            }}
            disabled={!(selectedVariation ? selectedVariation.inStock : product.inStock)}
            className="group relative inline-flex w-full overflow-hidden rounded-full p-[2px] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] h-14 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] font-bold text-light-sand backdrop-blur-2xl transition-all duration-300 group-hover:bg-black border-0">
              <span className="relative z-10 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest text-[#C19A6B]">
                <ShoppingBag className="w-4 h-4 text-[#C19A6B]" />
                {selectedVariation 
                  ? (selectedVariation.inStock ? `Add ${selectedVariation.name} to Cart` : 'Sold Out') 
                  : (product.inStock ? 'Purchase Original Painting' : 'Sold Out / Reserve')}
              </span>
            </div>
          </button>
          
          <div className="text-[10px] text-center text-neutral-400">
            🔒 Secure transaction processed via encrypted payment systems.
          </div>
        </div>

        {/* Luxury Shipping Trust Badges */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-5">
          <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-neutral-950/20 rounded-xl border border-white/5">
            <BadgeCheck className="w-5 h-5 text-[#C19A6B]" />
            <span className="text-[9px] uppercase tracking-wider text-neutral-300 font-semibold leading-tight">Certified</span>
            <span className="text-[7.5px] text-neutral-500 font-light leading-tight">Original Art</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-neutral-950/20 rounded-xl border border-white/5">
            <Truck className="w-5 h-5 text-[#C19A6B]" />
            <span className="text-[9px] uppercase tracking-wider text-neutral-300 font-semibold leading-tight">Tracked</span>
            <span className="text-[7.5px] text-neutral-500 font-light leading-tight">Global Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 p-2 bg-neutral-950/20 rounded-xl border border-white/5">
            <ShieldCheck className="w-5 h-5 text-[#C19A6B]" />
            <span className="text-[9px] uppercase tracking-wider text-neutral-300 font-semibold leading-tight">Wrapped</span>
            <span className="text-[7.5px] text-neutral-500 font-light leading-tight">Museum Grade</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-4 border-t border-white/5 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C19A6B]" />
            Artistic Narrative
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light text-justify select-text">
            {product.description}
          </p>
        </div>

        {/* Premium Bullet point features card */}
        {product.features && product.features.length > 0 && (
          <div className="p-5 bg-neutral-950/30 border border-white/5 rounded-2xl mt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#C19A6B] mb-3">Collector Details</h3>
            <ul className="flex flex-col gap-2.5">
              {product.features.map((feature, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs font-light text-neutral-400">
                  <span className="text-[#C19A6B] text-sm leading-[8px]">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

    </div>

      {/* Printing Guide Modal Overlay */}
      <AnimatePresence>
        {isGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-neutral-950 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative shadow-[0_30px_70px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-black/40">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#C19A6B]">Art Printing & Ratio Guide</h3>
                  <p className="text-[10px] text-neutral-400 mt-1">Guidelines for standard frames, proportions, and home printing setups</p>
                </div>
                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body: Scrollable Image Grid */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guideImages.map((img, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-md">
                        <Image
                          src={img}
                          alt={`Art printing guide page ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                          referrerPolicy="no-referrer"
                          draggable="false"
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-center text-neutral-400 font-medium">
                        Guide Page {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Print instructions detail card */}
                <div className="p-5 bg-neutral-900/60 border border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C19A6B]" />
                    How to Print Your Digital Art File
                  </h4>
                  <ul className="space-y-2 text-xs font-light text-neutral-400">
                    <li className="flex gap-2.5 items-start">
                      <span className="text-[#C19A6B] font-bold">•</span>
                      <span><strong>At Home:</strong> Use high-quality heavyweight matte cardstock or photo paper. Disable auto-scaling in printer properties.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-[#C19A6B] font-bold">•</span>
                      <span><strong>Local Print Shop:</strong> Take files on a USB or upload them to local print stores and request matte finish poster paper.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-[#C19A6B] font-bold">•</span>
                      <span><strong>Online Framing:</strong> Use online services to upload, print, frame, and ship to your doorstep.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
