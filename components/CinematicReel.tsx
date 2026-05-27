'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, ShoppingBag, CheckCircle2, FlameKindling } from 'lucide-react';
import { artProducts } from '@/lib/data';

const galleryReviews = [
  {
    id: "r1",
    name: "Aanya Sharma",
    location: "Collector • Mumbai",
    stars: 5,
    text: "The Sage Vishvamitra Oil Painting is a spiritual masterpiece in my home. The paint texture is breathtaking and catches light differently at sunrise and sunset. Absolutely in love with this original work!",
    product: artProducts[0] || { title: "Sage Vishvamitra Oil Painting", price: "₹22,999", image: "/products/Vishwamitra/20260509_204437.jpg", medium: "Original Oil" },
    date: "May 2026",
    tag: "Verified Collector"
  },
  {
    id: "r2",
    name: "Elena Müller",
    location: "Collector • Berlin",
    stars: 5,
    text: "Outstanding depth and rich colors in the Cosmic Mirage painting. Flawlessly packaged and shipped to Berlin. A great honor to house such premium abstract heritage art.",
    product: artProducts[2] || { title: "Cosmic Mirage Abstract Oil Painting", price: "₹15,999", image: "/products/cosminc mirage/23.png", medium: "Original Oil" },
    date: "April 2026",
    tag: "Premium Buyer"
  },
  {
    id: "r3",
    name: "Marcus Wright",
    location: "Collector • San Francisco",
    stars: 5,
    text: "Mesmerizing texture and balance. Feminine Energy abstract painting is incredibly deep and captures mood and strength wonderfully. You can feel the dedication and soul in each brushstroke.",
    product: artProducts[3] || { title: "Feminine Energy Abstract Oil Painting", price: "₹18,999", image: "/products/feminine energy/20260513_134151.jpg", medium: "Original Oil" },
    date: "May 2026",
    tag: "Fine Art Connoisseur"
  },
  {
    id: "r4",
    name: "Rajesh Iyer",
    location: "Collector • Bangalore",
    stars: 5,
    text: "Purchased the Milkmaid watercolour piece for our reading space. The soft transitions and fine detailing bring immense calm and a serene aura to our living space.",
    product: artProducts[4] || { title: "Milkmaid Watercolour Painting", price: "₹4,999", image: "/products/milkmaid/file_000000003cc471fa952ec68847918a41.png", medium: "Original Watercolour" },
    date: "April 2026",
    tag: "Verified Buyer"
  },
  {
    id: "r5",
    name: "Shorab Roy",
    location: "Collector • Kolkata",
    stars: 5,
    text: "The Village Musician oil painting captures the quiet rhythm and folk soul of rural life. The textures and earthy colors are rich and beautiful. KalaKasturi is my favorite studio.",
    product: artProducts[5] || { title: "The Village Musician Oil Painting", price: "₹22,999", image: "/products/village musician/20.png", medium: "Original Oil" },
    date: "May 2026",
    tag: "Original Collector"
  }
];

export default function CinematicReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryReviews.length) % galleryReviews.length);
  };

  // Touch & Mouse Drag handlers
  const handleStart = (clientX: number) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStart;
    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      setIsDragging(false);
    }
  };

  return (
    <section className="relative w-full py-6 md:py-10 bg-black select-none overflow-hidden border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#C19A6B]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-900/30 blur-[140px] pointer-events-none z-0"></div>

      {/* Floating particles background cinematic simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-screen bg-[url('https://res.cloudinary.com/dwmilzocy/image/upload/v1779777580/kalakasturi_products/fvx5r6j0dz6eu3rtm6qx.png')] bg-cover opacity-[0.03]"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Celluloid Frame Container */}
        <div 
          className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#070707] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.95)] touch-pan-y"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Filmstrip sprocket holes (Top) */}
          <div className="w-full flex justify-between px-6 py-2.5 bg-black border-b border-white/5 opacity-55">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`sprocket-top-${i}`} className="w-5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-950 flex-shrink-0" />
            ))}
          </div>

          <div className="relative p-6 sm:p-8 md:p-12 min-h-[480px] sm:min-h-[420px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
                exit={{ opacity: 0, x: -40, filter: 'blur(5px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Widescreen Cinematic Image (Left - spans 7 columns) */}
                <div className="lg:col-span-7 relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/10 z-10 pointer-events-none" />
                  
                  {/* Subtle Ken Burns Pan */}
                  <Image 
                    src={galleryReviews[currentIndex].product.image} 
                    alt={galleryReviews[currentIndex].product.title} 
                    fill 
                    className="object-cover transition-transform duration-[12000ms] scale-102 group-hover:scale-108 origin-center pointer-events-none"
                    sizes="(max-width: 1024px) 100vw, 700px"
                    priority
                  />

                  {/* Aesthetic film details tag */}
                  <div className="absolute bottom-4 left-4 z-20 bg-black/65 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[9px] text-[#A3A3A3] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    FEATURED HEIRLOOM • CELL {currentIndex + 1}
                  </div>

                  {/* Translucent Price Tag */}
                  <div className="absolute top-4 right-4 z-20 bg-[#050505]/80 border border-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-mono text-white tracking-widest">
                    {galleryReviews[currentIndex].product.price}
                  </div>
                </div>

                {/* Translucent Curator / Collector Card (Right - spans 5 columns) */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full py-2 text-white">
                  <div className="flex flex-col gap-4">
                    
                    {/* Header tags */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex text-[#C19A6B] gap-0.5">
                        {[...Array(galleryReviews[currentIndex].stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#C19A6B]" />
                        <span className="text-[9px] uppercase tracking-wider text-[#C19A6B] font-mono font-semibold">
                          {galleryReviews[currentIndex].tag}
                        </span>
                      </div>
                    </div>

                    {/* Masterpiece Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight font-sans">
                      {galleryReviews[currentIndex].product.title}
                    </h3>

                    {/* Testimonial Quote */}
                    <div className="relative mt-2">
                      <Quote className="absolute -top-3.5 -left-3.5 w-8 h-8 text-[#C19A6B]/5 pointer-events-none" />
                      <p className="text-neutral-300 text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-light italic pl-5 pr-1 select-text">
                        &quot;{galleryReviews[currentIndex].text}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Card Footer details */}
                  <div className="flex flex-col gap-4 mt-8 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-white tracking-wide">
                          {galleryReviews[currentIndex].name}
                        </h4>
                        <span className="text-[10.5px] text-neutral-400 mt-0.5 block">
                          {galleryReviews[currentIndex].location}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                        <FlameKindling className="w-3 h-3 text-[#C19A6B]" />
                        AUTHENTIC ART
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <div className="w-full">
                      <button className="w-full group relative inline-flex overflow-hidden rounded-full p-[1.5px] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(193,154,107,0.15)]">
                        <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="inline-flex h-10 w-full items-center justify-center rounded-full bg-[#050505] px-6 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black border-0">
                          <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-mono tracking-wider">
                            <ShoppingBag className="w-4 h-4 text-[#C19A6B] animate-pulse" />
                            ACQUIRE THIS WORK
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Filmstrip sprocket holes (Bottom) */}
          <div className="w-full flex justify-between px-6 py-2.5 bg-black border-t border-white/5 opacity-55">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={`sprocket-bottom-${i}`} className="w-5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-950 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Compact Navigation & Indicators */}
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-[#0E0E0E]/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-20"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-4 h-4 text-[#C19A6B]" />
          </button>

          {/* Timeline dots indicator */}
          <div className="flex items-center gap-2 z-20">
            {galleryReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#C19A6B]' : 'w-1.5 bg-neutral-700 hover:bg-neutral-600'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-[#0E0E0E]/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-20"
            aria-label="Next Review"
          >
            <ChevronRight className="w-4 h-4 text-[#C19A6B]" />
          </button>
        </div>
      </div>
    </section>
  );
}
