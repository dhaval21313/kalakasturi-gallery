'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const DigitalSerenity = () => {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
  });
  const [ripples, setRipples] = useState<{id: number; x: number; y: number}[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<Element[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll('.word-animate');
      wordElements.forEach(word => {
        const delay = parseInt(word.getAttribute('data-delay') || '0', 10) || 0;
        setTimeout(() => {
          if (word) (word as HTMLElement).style.animation = 'word-appear 0.8s ease-out forwards';
        }, delay);
      });
    };
    const timeoutId = setTimeout(animateWords, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let rId: number;
    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rId) cancelAnimationFrame(rId);
      rId = requestAnimationFrame(() => {
        setMouseGradientStyle({
          left: `${clientX}px`,
          top: `${clientY}px`,
          opacity: 1,
        });
      });
    };
    const handleMouseLeave = () => {
      if (rId) cancelAnimationFrame(rId);
      setMouseGradientStyle(prev => ({ ...prev, opacity: 0 }));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      if (rId) cancelAnimationFrame(rId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  useEffect(() => {
    const wordElements = document.querySelectorAll('.word-animate');
    const handleMouseEnter = (e: Event) => { if (e.target) (e.target as HTMLElement).style.textShadow = '0 0 20px rgba(203, 213, 225, 0.5)'; };
    const handleMouseLeave = (e: Event) => { if (e.target) (e.target as HTMLElement).style.textShadow = 'none'; };
    wordElements.forEach(word => {
      word.addEventListener('mouseenter', handleMouseEnter);
      word.addEventListener('mouseleave', handleMouseLeave);
    });
    return () => {
      wordElements.forEach(word => {
        if (word) {
          word.removeEventListener('mouseenter', handleMouseEnter);
          word.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.floating-element-animate');
    floatingElementsRef.current = Array.from(elements);
    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            if (el) {
              (el as HTMLElement).style.animationPlayState = 'running';
              (el as HTMLElement).style.opacity = ''; 
            }
          }, (parseFloat((el as HTMLElement).style.animationDelay || "0") * 1000) + index * 100);
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px; /* rounded-full */
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%); /* slate-400/5, slate-500/5 */
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .word-animate:hover { color: #cbd5e1; /* slate-300 */ transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; /* slate-400 */ stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; /* slate-300 */ opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }
  `;

  return (
    <>
      <style>{pageStyles}</style>
      <div className="bg-transparent text-slate-100 font-primary overflow-hidden relative">
        
        {/* Responsive Main Content Padding */}
        <div className="relative z-10 p-0 flex flex-col justify-center items-center min-h-[60vh]">
          <div className="text-center max-w-5xl mx-auto relative my-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-slate-50 text-decoration-animate" style={{ fontFamily: 'var(--font-merriweather)' }}>
              <div className="mb-3 md:mb-4">
                <span className="word-animate" data-delay="0">Soul</span>
                <span className="word-animate" data-delay="150">of</span>
                <span className="word-animate italic font-serif font-light text-[#C19A6B]" data-delay="300"> Indian Art</span>
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm font-sans font-normal text-[#A3A3A3] leading-relaxed tracking-normal max-w-xl mx-auto py-2">
                <span className="word-animate" data-delay="450">Timeless</span>
                <span className="word-animate" data-delay="500">masterpieces</span>
                <span className="word-animate" data-delay="550">connecting</span>
                <span className="word-animate" data-delay="600">heritage</span>
                <span className="word-animate" data-delay="650">with</span>
                <span className="word-animate" data-delay="700">modern</span>
                <span className="word-animate" data-delay="750">spaces.</span>
              </div>
            </h1>
            
            <div className="pt-6 md:pt-8 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '1.8s' }}>
                <Link href="/collections" className="group relative inline-flex overflow-hidden rounded-full p-[2px] transition-all duration-300 min-w-[170px] md:min-w-[200px]">
                  <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] px-[40.8px] py-[13.6px] md:px-12 md:py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black text-[13.6px] md:text-base">
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">View Gallery</span>
                  </div>
                </Link>
            </div>
            
            {/* Responsive Detail Line Offsets */}
            <div className="absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '2.0s' }}></div>
            <div className="absolute -right-6 sm:-right-8 top-1/2 transform -translate-y-1/2 w-3 sm:w-4 h-px bg-slate-300 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '2.2s' }}></div>
          </div>
        </div>

        {/* Responsive Mouse Gradient Size & Blur */}
        <div 
          id="mouse-gradient-react"
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        ></div>

        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          ></div>
        ))}
      </div>
    </>
  );
};

export default DigitalSerenity;
