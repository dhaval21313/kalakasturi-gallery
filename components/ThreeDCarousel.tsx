'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import { artProducts } from '@/lib/data';

// Custom rich review data paired with art products
const galleryReviews = [
  {
    id: "r1",
    name: "Aanya Sharma",
    location: "Mumbai, India",
    stars: 5,
    text: "The Sage Vishvamitra Oil Painting is a total spiritual masterpiece in my living room. The paint texture is breathtaking and catches light differently at sunrise and sunset. Absolutely in love with this original work!",
    product: artProducts[0] || { title: "Sage Vishvamitra Oil Painting", price: "₹22,999", image: "/products/Vishwamitra/20260509_204437.jpg", medium: "Original Oil" },
    date: "May 12, 2026",
    tag: "Verified Collector"
  },
  {
    id: "r2",
    name: "Elena Müller",
    location: "Berlin, Germany",
    stars: 5,
    text: "Outstanding depth and colors in the Cosmic Mirage Abstract Oil Painting. Extremely well-packaged, arriving flawlessly in Berlin. A great honor to house such premium abstract heritage art.",
    product: artProducts[2] || { title: "Cosmic Mirage Abstract Oil Painting", price: "₹15,999", image: "/products/cosminc mirage/23.png", medium: "Original Oil" },
    date: "April 28, 2026",
    tag: "Premium Buyer"
  },
  {
    id: "r3",
    name: "Marcus Wright",
    location: "San Francisco, USA",
    stars: 5,
    text: "Mesmerizing texture and balance. Feminine Energy abstract painting is incredibly deep and captures mood and strength wonderfully. You can immediately feel the deep dedication and soul put into this hand-painted oil canvas.",
    product: artProducts[3] || { title: "Feminine Energy Abstract Oil Painting", price: "₹18,999", image: "/products/feminine energy/20260513_134151.jpg", medium: "Original Oil" },
    date: "May 02, 2026",
    tag: "Fine Art Connoisseur"
  },
  {
    id: "r4",
    name: "Rajesh Iyer",
    location: "Bangalore, India",
    stars: 5,
    text: "Purchased the Milkmaid watercolour piece for our reading space. The soft transitions and fine detailing bring immense calm and positive aura to our home.",
    product: artProducts[4] || { title: "Milkmaid Watercolour Painting", price: "₹4,999", image: "/products/milkmaid/file_000000003cc471fa952ec68847918a41.png", medium: "Original Watercolour" },
    date: "April 15, 2026",
    tag: "Verified Buyer"
  },
  {
    id: "r5",
    name: "Shorab Roy",
    location: "Kolkata, India",
    stars: 5,
    text: "The Village Musician oil painting captures the quiet rhythm and folk soul of rural life. The textures and earthy colors are rich and beautiful. Kalakasturi is my favorite studio now.",
    product: artProducts[5] || { title: "The Village Musician Oil Painting", price: "₹22,999", image: "/products/village musician/20.png", medium: "Original Oil" },
    date: "May 19, 2026",
    tag: "Original Collector"
  }
];

export default function ThreeDCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryReviews.length) % galleryReviews.length);
  };

  // Draggable support on Touch/Drag
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - dragStart;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev(); // Drag right -> show previous
      } else {
        handleNext(); // Drag left -> show next
      }
    }
  };

  return (
    <div id="three-d-review-section" className="relative w-full py-12 flex flex-col items-center justify-center overflow-hidden bg-black select-none">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neutral-900/40 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none z-0"></div>

      {/* Main Reviews Track Viewport */}
      <div 
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        className="relative w-full max-w-[1300px] h-[530px] sm:h-[480px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10 touch-pan-y"
        style={{ perspective: '1100px' }}
      >
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {galleryReviews.map((review, idx) => {
            // Compute offset from centered index
            let offset = idx - currentIndex;
            
            // Handle wrapping for infinite feel
            const len = galleryReviews.length;
            if (offset < -len / 2) offset += len;
            if (offset > len / 2) offset -= len;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2; // Only render/show nearest 2 cards for gorgeous depth look
            
            if (!isVisible) return null;

            // Compute gorgeous 3D Coverflow properties: scale, rotate, placement
            const scale = isActive ? 1 : 0.83;
            const rotateY = offset * 24; // Curved look
            const translateX = offset * 280; // Offset separation
            const translateZ = isActive ? 50 : -200; // Push back adjacent cards in 3D
            const opacity = isActive ? 1 : 0.45;
            const zIndex = 100 - Math.abs(offset);

            return (
              <motion.div
                key={review.id}
                initial={false}
                animate={{
                  x: translateX,
                  scale: scale,
                  rotateY: rotateY,
                  z: translateZ,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                className="absolute w-[290px] sm:w-[380px] md:w-[620px] rounded-[2rem] overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.08)] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch select-none pointer-events-auto"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  zIndex: zIndex,
                }}
              >
                {/* Visual Artwork Thumbnail on the Left (or Top for small mobile) */}
                <div className="relative w-full md:w-[42%] aspect-[4/3] md:aspect-auto rounded-xl md:rounded-[1.25rem] overflow-hidden bg-black border border-white/5 flex-shrink-0">
                  <Image 
                    src={review.product.image} 
                    alt={review.product.title} 
                    fill 
                    className="object-cover transition-transform duration-700 pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority={idx === 0}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Floating Price Tag */}
                  <span className="absolute top-3 right-3 bg-[#0A0A0A]/90 border border-white/10 text-white font-mono text-[10px] md:text-xs px-2.5 py-1 rounded-full backdrop-blur-md">
                    {review.product.price}
                  </span>

                  {/* Artwork title brief overlay on mobile inside image */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#A3A3A3] font-light">Collector Piece</span>
                    <span className="text-white text-[12px] md:text-sm font-bold tracking-tight truncate">{review.product.title}</span>
                  </div>
                </div>

                {/* Review Message & Shop Actions on the Right */}
                <div className="flex flex-col justify-between flex-grow text-white">
                  <div>
                    {/* Header: Verified & Stars */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex gap-0.5 text-[#C19A6B]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-current" />
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#C19A6B]" />
                        <span className="text-[9px] uppercase tracking-wider text-[#C19A6B] font-semibold">
                          {review.tag}
                        </span>
                      </div>
                    </div>

                    {/* Review Quote Block */}
                    <div className="relative mt-2">
                      <Quote className="absolute -top-1.5 -left-1.5 w-7 h-7 text-white/[0.04] pointer-events-none" />
                      <p className="text-neutral-300 text-xs md:text-[14.5px] leading-relaxed md:leading-relaxed font-light italic pl-5 pr-2 mb-4 line-clamp-4 select-text">
                        &quot;{review.text}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Footer metadata & Action Button */}
                  <div className="flex flex-col gap-4 mt-auto border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-xs md:text-sm tracking-wide text-white">
                          {review.name}
                        </h4>
                        <span className="text-[10.5px] text-neutral-400 mt-0.5 block">
                          {review.location}
                        </span>
                      </div>
                      <span className="text-[9.5px] font-mono text-neutral-500">
                        {review.date}
                      </span>
                    </div>

                    {/* Premium Conic Border Spin Action Button requested for all pages/all sections */}
                    <div className="w-full">
                      <button className="w-full group relative inline-flex overflow-hidden rounded-full p-[1.5px] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(255,255,255,0.12)]">
                        <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="inline-flex h-8 md:h-9 w-full items-center justify-center rounded-full bg-[#050505] px-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black border-0">
                          <span className="relative z-10 flex items-center justify-center gap-1.5 text-[10px] md:text-[11px] tracking-wide whitespace-nowrap">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#C19A6B]" />
                            Add to Cart
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modern Compact Indicators & Navigation Controller */}
      <div className="flex items-center gap-6 mt-6 z-20">
        <button 
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-[#0E0E0E]/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Previous Review"
        >
          <ChevronLeft className="w-4 h-4 text-[#C19A6B]" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2">
          {galleryReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#C19A6B]' : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-[#0E0E0E]/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Next Review"
        >
          <ChevronRight className="w-4 h-4 text-[#C19A6B]" />
        </button>
      </div>
    </div>
  );
}
