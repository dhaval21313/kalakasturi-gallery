import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, ShoppingBag, Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000000] py-12 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center gap-8">
        
        {/* Line 1: Symbol and logo only */}
        <div className="flex items-center gap-3">
          <div className="relative w-[48px] h-[48px] flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" />
          </div>
          <span 
            className="text-3xl tracking-wider text-white" 
            style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
          >
            Kala Kasturi
          </span>
        </div>

        {/* Line 2: Support links only, no heading */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-sm text-[#A3A3A3]">
          <Link href="/collections" className="hover:text-white transition-colors duration-200">All Artworks</Link>
          <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link>
          <Link href="/shipping-returns" className="hover:text-white transition-colors duration-200">Shipping & Returns</Link>
          <Link href="/about" className="hover:text-white transition-colors duration-200">About the Artist</Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
        </div>

        {/* Line 3: Copyright & Social media / Shop links (No 3D boxes, just direct icons) */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-[#A3A3A3]">
          <p className="order-2 md:order-1 font-mono tracking-wide">
            © {new Date().getFullYear()} KalaKasturi. All rights reserved.
          </p>
          
          <div className="order-1 md:order-2 flex items-center gap-4">
            {/* Amazon Shop */}
            <a 
              href="https://www.amazon.in/s?k=Kalakasturi" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Shop on Amazon"
              className="text-[#A3A3A3] hover:text-amber-400 hover:scale-110 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
            </a>

            {/* Etsy Shop */}
            <a 
              href="https://www.etsy.com/in-en/shop/KalaKasturiShop" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Shop on Etsy"
              className="text-[#A3A3A3] hover:text-orange-400 hover:scale-110 transition-all duration-300"
            >
              <Store className="w-5 h-5" />
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/art_kalakasturi/" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Follow on Instagram"
              className="text-[#A3A3A3] hover:text-pink-400 hover:scale-110 transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
