'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Star, UserCheck, ExternalLink, Brush, MapPin, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-36 pb-24 px-4 sm:px-6 font-sans select-none">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-neutral-900/40 blur-[140px] pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        
        {/* Artistic Hero Profile Introduction */}
        <section className="mb-20 flex flex-col md:flex-row items-center gap-10 md:gap-16 border-b border-white/5 pb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#C19A6B]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex-shrink-0"
          >
            <Image 
              src="/ankita-profile.jpg" 
              alt="Ankita - KalaKasturi Art Studio" 
              fill 
              className="object-cover"
            />
          </motion.div>

          <div className="flex-grow text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 text-xs font-mono tracking-wider text-[#C19A6B]"
            >
              <Award className="w-3.5 h-3.5" />
              ARTIST & STUDIO DIRECTOR
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white"
            >
              Meet Ankita
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mb-6 font-light"
            >
              Hello! I am Ankita, the artist and founder behind KalaKasturi. Based in the spiritual heart of <span className="text-white font-medium flex-inline gap-1"><MapPin className="inline w-3.5 h-3.5 text-[#C19A6B]" /> Rishikesh, Uttarakhand</span>, I focus on bridging classical Indian heritage with contemporary aesthetic spacing. I specialize in handcrafted Spiritual paintings, vibrant folk narratives, and hyper-detailed wildlife art on live canvas.
            </motion.p>

            {/* Studio Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 font-mono text-[10.5px] text-[#A3A3A3]"
            >
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <Brush className="w-3.5 h-3.5 text-[#C19A6B]" />
                100% Handcrafted
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 text-[#C19A6B]" />
                Premium Mediums
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <UserCheck className="w-3.5 h-3.5 text-[#C19A6B]" />
                Global Collectors
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Devotional Spirit section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 border-t border-white/5 pt-16">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 bg-neutral-900">
            <Image 
              src="https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779777587/kalakasturi_products/jzhbxoe2enzzpn7qg1lw.png" 
              alt="Art tools and canvases in Rishikesh Studio" 
              fill 
              className="object-cover opacity-80"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block mb-1">Rishikesh Studio Room</span>
              <p className="text-xs text-neutral-400 italic font-light">"Surrounded by pure clean air, organic flora, and sacred Vedic mantras playing in the background."</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#C19A6B]" />
              The Creative Devotion
            </h2>
            <p className="text-neutral-400 leading-relaxed font-light text-base">
              Every creation leaving my studio is treated as a form of sacred worship. Guided by old classical textbooks and natural landscapes of Uttarakhand, I layer authentic oils and gold gilding slowly over several weeks to build timeless texture and reflection.
            </p>
            <p className="text-neutral-400 leading-relaxed font-light text-base">
              Beyond standard fine canvases, we curate digital reproduction prints on archival fine arts paper and custom items for global delivery via our verified storefront channels.
            </p>
            
            <div className="flex flex-col gap-3 mt-4">
              <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block">Authorized Worldwide Deliveries</span>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.etsy.com/in-en/shop/KalaKasturiShop" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                  Shop ETSY Global Store <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
                <a href="https://www.amazon.in/s?k=Kalakasturi" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                  Shop Amazon India <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic CTA */}
        <div className="mt-16 flex justify-center">
          <Link href="/contact" className="group relative inline-flex overflow-hidden rounded-full p-[2.5px] transition-all duration-300 min-w-[270px]">
            <span className="absolute inset-[-1000%] animate-spin [animation-duration:5s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] px-10 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black">
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 select-none flex items-center gap-2">
                Get in Touch for Commissions
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
