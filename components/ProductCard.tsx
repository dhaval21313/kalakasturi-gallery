'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Paintbrush } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  medium: string;
  price: string;
  image: string;
  images?: string[];
  description: string;
  category: string;
  tags?: string[];
  inStock: boolean;
  video?: string | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || images.length === 0) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left; 
    const percent = Math.max(0, Math.min(1, x / width));
    
    // Divide card width evenly into columns for each image
    const totalImages = images.length;
    const newIndex = Math.min(totalImages - 1, Math.floor(percent * totalImages));
    if (newIndex >= 0 && newIndex < totalImages && newIndex !== imgIndex) {
      setImgIndex(newIndex);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setImgIndex(0);
  };

  // Support mobile swipe gesture mapping
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || images.length === 0) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setImgIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        setImgIndex((prev) => (prev + 1) % images.length);
      }
      touchStartX.current = currentX; 
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col gap-3 sm:gap-4 text-white"
    >
      {/* Dynamic Link wrapper around product images for details routing */}
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-white/5 cursor-crosshair group/box">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-full"
        >
          {images.length > 0 ? (
            <div className="absolute inset-0 w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full overflow-hidden"
                >
                  <Image 
                    src={images[imgIndex]} 
                    alt={`${product.title} image view ${imgIndex + 1}`} 
                    fill 
                    className="object-cover transition-transform duration-700 ease-out scale-100 group-hover/box:scale-110"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={product.id === 'vishwamitra'}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* High-Fidelity Custom Artistic Placeholder for Charlie or missing images */
            <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#0D0D0D] to-[#1F170F] flex flex-col items-center justify-center p-6 text-center relative border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,154,107,0.08)_0%,transparent_70%)] pointer-events-none" />
              <div className="w-14 h-14 rounded-full border border-dashed border-[#C19A6B]/35 flex items-center justify-center mb-4 bg-black/40 shadow-inner">
                <Paintbrush className="w-5.5 h-5.5 text-[#C19A6B] animate-pulse" />
              </div>
              <h4 className="text-white text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1.5 font-sans text-[#E5E5E5]">Charcoal Original</h4>
              <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[190px] leading-relaxed font-light mb-4">
                Mounting in museum-grade acrylic frame. Inquire for a private showing.
              </p>
              <div className="px-3.5 py-1.5 bg-[#C19A6B]/10 border border-[#C19A6B]/25 rounded-full text-[8px] sm:text-[9px] uppercase tracking-widest text-[#C19A6B] font-medium backdrop-blur-md">
                Collection Portrait
              </div>
            </div>
          )}

          {/* Premium Smooth Video Overlay on Hover */}
          {product.video && isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full z-10 bg-black"
            >
              <video
                ref={videoRef}
                src={product.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
              />
              {/* Visual Indicator that it is a live video preview */}
              <div className="absolute top-4 left-4 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 backdrop-blur-md z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 left-2.5" />
                <span className="text-[8px] uppercase tracking-widest text-neutral-300 font-mono pl-1.5">Studio Video</span>
              </div>
            </motion.div>
          )}

          {/* Dynamic page dots */}
          {images.length > 1 && !isHovered && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
              {images.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-4 bg-[#C19A6B]' : 'w-1 bg-neutral-500'}`} 
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      
      {/* Information Row */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col min-w-0 flex-grow">
          {/* Linked Title for easy navigation */}
          <Link href={`/products/${product.id}`} className="hover:text-[#C19A6B] transition-colors duration-200 truncate">
            <h3 className="text-sm sm:text-base md:text-lg font-medium tracking-tight mb-0.5 sm:mb-1 truncate text-white">{product.title}</h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-[#A3A3A3] mb-1.5 sm:mb-2 italic truncate">{product.medium}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 w-full">
            {product.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-neutral-300">{tag}</span>
            ))}
            {/* Buy Now button linked to the dynamic product detail page */}
            <Link href={`/products/${product.id}`} className="group relative inline-flex overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] h-[22px] ml-auto sm:ml-2">
              <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="inline-flex h-full items-center justify-center rounded-full bg-[#050505] px-3 font-bold text-[#F5F5F5] backdrop-blur-xl transition-all duration-300 group-hover:bg-black border-0">
                <span className="relative z-10 flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider whitespace-nowrap text-[#C19A6B]">
                  Buy
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-xs sm:text-sm md:text-base font-semibold bg-[#121212] px-2.5 py-1 rounded-lg border border-white/10 text-white font-mono">{product.price}</span>
          {!product.inStock && <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-red-400 bg-red-400/5 px-2 py-0.5 rounded-md border border-red-400/10">Sold Out</span>}
        </div>
      </div>
    </motion.div>
  );
}
