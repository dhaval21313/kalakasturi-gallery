'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  UserCheck, 
  ExternalLink, 
  Brush, 
  MapPin, 
  Sparkles, 
  Award, 
  BookOpen, 
  Play, 
  Youtube, 
  Instagram,
  Heart,
  ChevronRight,
  FlameKindling
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [activePhoto, setActivePhoto] = useState<number>(0);

  const processPhotos = [
    {
      id: 0,
      src: '/process-composite.jpg',
      title: 'The Inner Landscape (Philosophy)',
      tag: 'MEDITATION & SILENCE',
      desc: 'A double-exposure representation of the artist\'s mind. Before a single stroke is placed on the canvas, hours are spent in silent reading, reflection, and seeking the absolute stillness within.',
      bgGradient: 'from-amber-500/10 via-neutral-900 to-black'
    },
    {
      id: 1,
      src: '/process-rooftop.jpg',
      title: 'Painting in the Himalayan Breeze',
      tag: 'CREATION OVERLOOK',
      desc: 'Ankita painting a white bird in flight on her easel, high on a rooftop in Rishikesh. The physical environment—surrounded by misty green mountains, clean Vedic wind, and natural sunlight—infuses each layer of pigment with pure life energy.',
      bgGradient: 'from-blue-500/10 via-neutral-900 to-black'
    },
    {
      id: 2,
      src: '/process-swami.jpg',
      title: 'Devotion to Swami Vivekananda',
      tag: 'SACRED PORTRAITS',
      desc: 'Ankita holding her hand-painted portrait of Swami Vivekananda. Painting spiritual icons requires a high level of academic realism, absolute focus, and a prayerful mindset to translate their eternal light onto linen.',
      bgGradient: 'from-orange-500/10 via-neutral-900 to-black'
    },
    {
      id: 3,
      src: '/process-funny.jpg',
      title: 'Playful Chaos in the Studio',
      tag: 'BEHIND THE CANVAS',
      desc: 'The raw, unfiltered reality of creation. Squeezing paint, getting hands dirty, laughing, and embracing the messy, joyful chaos of organic oil colors before they are refined into ordered visual poetry.',
      bgGradient: 'from-emerald-500/10 via-neutral-900 to-black'
    }
  ];

  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-32 pb-24 px-4 sm:px-6 md:px-8 font-sans select-none overflow-x-hidden relative">
      {/* Premium Ambient Radial Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-neutral-900/30 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-1/4 w-[700px] h-[700px] rounded-full bg-[#C19A6B]/5 blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-neutral-950 blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* ================= SECTION 1: HERO / THE ARTIST ================= */}
        <section className="mb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 border-b border-white/5 pb-20">
          {/* Advanced Profile Frame */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#C19A6B]/20 shadow-[0_30px_70px_rgba(0,0,0,0.9)] group"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <Image 
              src="/process-composite.jpg" 
              alt="Ankita - KalaKasturi Artist Portrait" 
              fill
              priority
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 420px"
            />
            
            {/* Embedded Floating Tag */}
            <div className="absolute bottom-6 left-6 right-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wider font-mono">ANKITA</h4>
                <p className="text-[#C19A6B] text-[10px] uppercase tracking-widest font-light mt-0.5">Rishikesh, Uttarakhand</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#C19A6B]" />
              </div>
            </div>
          </motion.div>

          {/* Hero Typography */}
          <div className="flex-grow text-center lg:text-left max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-[#C19A6B]/15 border border-[#C19A6B]/30 px-3.5 py-1.5 rounded-full mb-6 text-xs font-mono tracking-wider text-[#C19A6B]"
            >
              <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              THE METAPHYSICS OF REALISM
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-[1.1]"
            >
              Meet <span className="text-[#C19A6B] italic font-serif font-light">Ankita</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-6 font-light"
            >
              Hello! I am <span className="text-white font-medium">Ankita</span>, the philosophical mind and hands behind the **KalaKasturi** art studio. Working out of the sacred valleys of **Rishikesh**, I dedicate my days to bridging classic Indian realism—inspired by the anatomical precision and narrative beauty of legendary masters like Raja Ravi Varma—with deep, modern metaphysical reflection.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-8 font-light"
            >
              I believe painting is not merely the act of rendering textures on linen. It is a slow, sacred dialogue between the quietude of one\'s soul and the pigments in hand. From detailed spiritual portraiture like my Swami Vivekananda oil works, to highly intricate wildlife and organic creations, each canvas requires weeks of devotion.
            </motion.p>

            {/* Direct Social Handles */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a 
                href="https://www.instagram.com/i_ankeeta/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/btn relative flex items-center gap-2 bg-neutral-900 border border-white/10 hover:border-[#C19A6B]/50 transition-all duration-300 py-2.5 px-5 rounded-full text-xs font-mono text-[#A3A3A3] hover:text-white"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-500 transition-transform duration-300 group-hover/btn:rotate-12" />
                @i_ankeeta (Personal)
                <ChevronRight className="w-3 h-3 text-neutral-600 group-hover/btn:translate-x-1 transition-transform" />
              </a>

              <a 
                href="https://www.instagram.com/art_kalakasturi/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/btn relative flex items-center gap-2 bg-neutral-900 border border-white/10 hover:border-[#C19A6B]/50 transition-all duration-300 py-2.5 px-5 rounded-full text-xs font-mono text-[#A3A3A3] hover:text-white"
              >
                <Instagram className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 group-hover/btn:rotate-12" />
                @art_kalakasturi (Studio)
                <ChevronRight className="w-3 h-3 text-neutral-600 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ================= SECTION 2: PHILOSOPHY & INNER CLARITY ================= */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 flex flex-col gap-6">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#C19A6B] animate-pulse" />
              The Art of Inner Silence
            </h2>
            
            <p className="text-neutral-300 leading-relaxed font-light text-base sm:text-lg">
              My creative process begins long before a brush touches the linen. I am deeply guided by philosophical readings—such as the works of Acharya Prashant, particularly on *Maya*—which shape my worldview and clarify my vision. For me, to paint is to observe the mind\'s play, and translate that internal silence onto physical mediums.
            </p>

            <blockquote className="border-l-2 border-[#C19A6B] pl-5 py-2 my-2 text-neutral-400 italic font-serif font-light text-base leading-relaxed">
              "An artist is not someone who merely draws lines on a board; an artist is someone who reflects the quietude of their own soul onto canvas. We turn the internal noise into ordered light."
            </blockquote>

            <p className="text-neutral-400 leading-relaxed font-light text-sm sm:text-base">
              Rishikesh, with its crisp, clean Himalayan air, natural flora, and the sacred sounds of Vedic mantras playing in the background, serves as the ultimate laboratory for my art. Under these pure conditions, my focus deepens, allowing me to slowly layer oils over weeks, creating thick, timeless textures and reflections.
            </p>
          </div>

          <div className="md:col-span-5 relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 bg-neutral-900 group">
            <Image 
              src="https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779777587/kalakasturi_products/jzhbxoe2enzzpn7qg1lw.png" 
              alt="Art tools and canvases in Rishikesh Studio Room" 
              fill 
              className="object-cover opacity-70 transition-transform duration-[1500ms] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[#C19A6B] text-[10px] font-mono uppercase tracking-widest block mb-1">THE RISHIKESH STUDIO</span>
              <p className="text-xs text-neutral-400 italic font-light">"Surrounded by pure clean air, organic flora, and sacred Vedic mantras."</p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: INTERACTIVE PROCESS GALLERY ================= */}
        <section className="mb-24 border-t border-white/5 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block mb-2">STEPS OF CREATION</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">The Process Gallery</h2>
            <p className="text-neutral-400 text-sm mt-3 font-light">
              Explore the four authentic pillars of Ankita\'s everyday studio practice, from reflective study to messy painting and the final creation.
            </p>
          </div>

          {/* Interactive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Selector Left/Right Panel */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {processPhotos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhoto(i)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                    activePhoto === i 
                      ? 'bg-neutral-900/60 border-[#C19A6B]/50 shadow-[0_10px_30px_rgba(193,154,107,0.05)]' 
                      : 'bg-transparent border-white/5 hover:bg-neutral-900/30 hover:border-white/10'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#C19A6B] block mb-1 uppercase">
                      {photo.tag}
                    </span>
                    <h3 className={`text-sm sm:text-base font-semibold transition-colors ${
                      activePhoto === i ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}>
                      {photo.title}
                    </h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    activePhoto === i ? 'bg-[#C19A6B]/20 text-[#C19A6B]' : 'bg-neutral-900 text-neutral-600'
                  }`}>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activePhoto === i ? 'translate-x-0.5' : ''}`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Display Window Right Panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhoto}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-neutral-950/40 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center"
                >
                  {/* Image Display */}
                  <div className="relative w-full md:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex-shrink-0">
                    <Image 
                      src={processPhotos[activePhoto].src} 
                      alt={processPhotos[activePhoto].title} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>

                  {/* Copy Display */}
                  <div className="flex-grow flex flex-col justify-center">
                    <span className="text-[#C19A6B] text-[10px] font-mono tracking-widest block mb-2 uppercase">
                      {processPhotos[activePhoto].tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
                      {processPhotos[activePhoto].title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed font-light text-sm sm:text-base mb-6">
                      {processPhotos[activePhoto].desc}
                    </p>
                    
                    {/* Unique Process Indicator */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-t border-white/5 pt-4">
                      <FlameKindling className="w-3.5 h-3.5 text-[#C19A6B] animate-pulse" />
                      100% Authentic Process
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ================= SECTION 4: DETAILED PROCESS PAIR (FUNNY + ROOFTOP) ================= */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Playful Chaos */}
          <div className="bg-neutral-900/20 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 hover:border-white/10 transition-all duration-300">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-950">
              <Image 
                src="/process-funny.jpg" 
                alt="Playful chaos squeezing paint in studio" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <div>
              <span className="text-[#C19A6B] text-[10px] font-mono uppercase tracking-widest block mb-1">Behind The Scenes</span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">Chaos is the Seed of Order</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                Many art galleries present their artists as clinical and detached. We believe in showing the raw, dirty, paint-splattered truth. Squeezing thick white oils directly onto our fingers and holding tubes with childish glee is where the magic begins. By embracing play, we dissolve the fear of the blank canvas.
              </p>
            </div>
          </div>

          {/* Right: Rooftop Calm */}
          <div className="bg-neutral-900/20 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 hover:border-white/10 transition-all duration-300">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-950">
              <Image 
                src="/process-rooftop.jpg" 
                alt="Painting bird on rooftop in Rishikesh" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <div>
              <span className="text-[#C19A6B] text-[10px] font-mono uppercase tracking-widest block mb-1">Creative Environment</span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">Painted Under Open Himalayan Skies</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-light">
                When weather permits, our studio moves to the rooftop. Painting the dynamic details of a wild bird flying amidst real Himalayan winds and misty hill backdrops binds the work directly to nature. Each stroke reflects the atmosphere, altitude, and clean serenity of Uttarakhand.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: YOUTUBE & SOCIAL HUB ================= */}
        <section className="mb-20 bg-gradient-to-b from-[#111111] to-[#000000] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0"></div>

          <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
              <Youtube className="w-6 h-6 text-red-500 animate-pulse" />
            </div>

            <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block">WATCH THE CREATION UNRAVEL</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Watch Ankita Paint In Real Time
            </h2>
            
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light max-w-2xl">
              We document our raw painting processes, hyperlapse art journeys, and slow-living philosophy on our official YouTube channel **@art_kalakasturi**. Learn how we turn chaotic color blocks into pristine, highly detailed realism.
            </p>

            {/* Simulated Premium Video Card Player */}
            <div className="w-full relative aspect-video sm:max-w-[640px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer my-4">
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/50" />
              <Image 
                src="/process-rooftop.jpg" 
                alt="Youtube process preview" 
                fill 
                className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#C19A6B] text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-6 h-6 fill-current text-black translate-x-0.5" />
                </div>
                <span className="text-xs font-mono text-white tracking-widest uppercase bg-black/80 px-3 py-1 rounded-full border border-white/10">
                  Watch on YouTube
                </span>
              </div>
              <a 
                href="https://www.youtube.com/@art_kalakasturi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute inset-0 z-30"
              />
            </div>

            <div className="flex flex-col gap-4 w-full mt-4">
              <span className="text-[#C19A6B] text-[10px] font-mono uppercase tracking-widest block">Official Storefronts</span>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://www.etsy.com/in-en/shop/KalaKasturiShop" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:border-white/20">
                  Shop ETSY Global Store <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
                <a href="https://www.amazon.in/s?k=Kalakasturi" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10 hover:border-white/20">
                  Shop Amazon India <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Commission Call to Action */}
        <div className="mt-16 flex justify-center">
          <Link href="/contact" className="group relative inline-flex overflow-hidden rounded-full p-[2.5px] transition-all duration-300 min-w-[280px] hover:scale-105 hover:shadow-[0_0_30px_rgba(193,154,107,0.15)]">
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
