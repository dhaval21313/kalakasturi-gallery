'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, Palette, Sparkles, Compass, LogIn } from 'lucide-react';
import { useCartStore } from '../../lib/store/cartStore';
import CartDrawer from '../CartDrawer';

const NAV_ITEMS = [
  { name: 'Gallery', href: '/collections', icon: Palette, color: 'from-pink-500 via-rose-500 to-purple-600' },
  { name: 'Courses', href: '/courses', icon: Sparkles, color: 'from-amber-400 via-orange-400 to-yellow-500' },
  { name: 'About', href: '/about', icon: Compass, color: 'from-cyan-400 via-sky-400 to-blue-500' },
  { name: 'Login', href: '/login', icon: LogIn, color: 'from-emerald-400 via-teal-400 to-cyan-500' },
  { name: 'Cart', href: '#', icon: ShoppingCart, color: 'from-purple-500 via-fuchsia-400 to-pink-500' }
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide global navbar on redesigned product pages
  if (pathname?.includes('/products/')) return null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isCartOpen, openCart, closeCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const isActive = (href: string) => {
    if (href === '#') return isCartOpen;
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const handleOpenCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <motion.nav 
        animate={{
          backgroundColor: isScrolled ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.45)",
          backdropFilter: isScrolled ? "blur(24px)" : "blur(12px)",
          borderBottomColor: isScrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
          paddingTop: isMobile ? "14px" : (isScrolled ? "12px" : "18px"),
          paddingBottom: isMobile ? "14px" : (isScrolled ? "12px" : "18px"),
          height: isMobile ? "72px" : (isScrolled ? "72px" : "138px")
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 border-b flex items-center"
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 relative flex items-center justify-between h-full">
          
          {/* ======================= DESKTOP VIEW ======================= */}
          <div className="hidden md:block w-full h-full relative">
            
            {/* 1. Normal Double-Line Header (Centered) */}
            <motion.div
              animate={{
                opacity: isScrolled ? 0 : 1,
                y: isScrolled ? -15 : 0,
                scale: isScrolled ? 0.95 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ pointerEvents: isScrolled ? 'none' : 'auto' }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 py-2"
            >
              {/* Logo & Brand Name Centered */}
              <Link 
                href="/" 
                className="flex items-center gap-3 px-4 py-1.5"
              >
                <div className="relative w-[48px] h-[48px] flex items-center justify-center bg-black rounded-xl overflow-hidden">
                   <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" priority />
                </div>
                <span 
                  className="text-3xl md:text-4xl tracking-wider text-white select-none" 
                  style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
                >
                  Kala Kasturi
                </span>
              </Link>

              {/* Line 2: Centered Links */}
              <div className="flex items-center gap-10 text-sm font-medium tracking-wide text-[#A3A3A3]">
                <Link href="/collections" className={`${isActive('/collections') ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-colors duration-200`}>Gallery</Link>
                <Link href="/courses" className={`${isActive('/courses') ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-colors duration-200`}>Courses</Link>
                <Link href="/about" className={`${isActive('/about') ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-colors duration-200`}>About</Link>
                <Link href="/login" className={`${isActive('/login') ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-colors duration-200`}>Login</Link>
                <button 
                  onClick={openCart}
                  className={`${isActive('#') ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-colors duration-200 relative flex items-center gap-1.5 cursor-pointer bg-transparent border-0`}
                >
                  Cart
                  {totalItems > 0 ? (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full font-mono">
                      {totalItems}
                    </span>
                  ) : (
                    <span className={`w-1.5 h-1.5 ${isActive('#') ? 'bg-warm-ivory' : 'bg-[#C19A6B]'} rounded-full`} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* 2. Sticky Single-Line Header (Logo Left, Menu Right) */}
            <motion.div
              animate={{
                opacity: isScrolled ? 1 : 0,
                y: isScrolled ? 0 : 15,
                scale: isScrolled ? 1 : 0.95,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ pointerEvents: isScrolled ? 'auto' : 'none' }}
              className="absolute inset-0 flex items-center justify-between"
            >
              {/* Compact Brand Left */}
              <Link 
                href="/" 
                className="flex items-center gap-2.5"
              >
                <div className="relative w-[40px] h-[40px] flex items-center justify-center bg-black rounded-lg overflow-hidden shadow-inner">
                   <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" />
                </div>
                <span 
                  className="text-2xl md:text-3xl tracking-wider text-white" 
                  style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
                >
                  Kala Kasturi
                </span>
              </Link>

              {/* Nav Menu with text only on Right */}
              <div className="flex items-center gap-8 lg:gap-10 text-sm font-medium tracking-wide text-[#A3A3A3]">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      if (item.name === 'Cart') {
                        e.preventDefault();
                        openCart();
                      } else {
                        router.push(item.href);
                      }
                    }}
                    className={`group ${isActive(item.href) ? 'text-warm-ivory font-semibold' : 'hover:text-white'} transition-all duration-300 relative py-1.5 cursor-pointer bg-transparent border-0`}
                  >
                    <span className="relative font-medium tracking-wider text-[12px] uppercase flex items-center gap-1">
                      {item.name}
                      {item.name === 'Cart' && totalItems > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full font-mono">
                          {totalItems}
                        </span>
                      )}
                      <span className={`absolute bottom-[-2px] left-0 ${isActive(item.href) ? 'w-full' : 'w-0'} h-[1.5px] bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-300 group-hover:w-full`} />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ======================= MOBILE VIEW ======================= */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            {/* Logo left */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5"
            >
              <div className="relative w-[38px] h-[38px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
                 <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" />
              </div>
              <span 
                className="text-2xl tracking-wider text-white" 
                style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
              >
                Kala Kasturi
              </span>
            </Link>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={openCart}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center relative bg-transparent border-0 cursor-pointer text-white"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full font-mono scale-90 origin-top-right">
                    {totalItems}
                  </span>
                )}
              </button>
              <button 
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors bg-transparent border-0 cursor-pointer" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu Slidedown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark-charcoal pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.name}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (item.name === 'Cart') {
                    openCart();
                  } else {
                    router.push(item.href);
                  }
                }} 
                className="flex items-center justify-between border-b border-white/10 pb-4 group w-full text-left bg-transparent border-t-0 border-x-0 cursor-pointer"
              >
                <span className={`text-lg font-medium tracking-wide ${isActive(item.href) ? 'text-warm-ivory font-semibold' : 'text-[#A3A3A3] group-hover:text-white'} transition-colors flex items-center gap-2`}>
                  {item.name}
                  {item.name === 'Cart' && totalItems > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full font-mono">
                      {totalItems}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Shopping Cart Sliding Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
        onOpenCheckout={handleOpenCheckout} 
      />
    </>
  );
}

