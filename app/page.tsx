'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Globe, Paintbrush, BadgeCheck, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { artProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import DigitalSerenity from '@/components/DigitalSerenity';

const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const NewsletterSection = dynamic(() => import('@/components/NewsletterSection'), { ssr: true });

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Page() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div ref={containerRef} className="bg-[#000000] text-[#F5F5F5] font-sans overflow-x-hidden pt-[72px] md:pt-[138px]">
      <main>
        {/* Pure Image Hero Section */}
        <section className="w-full overflow-hidden relative">
          <motion.div style={{ y: heroY, scale: 1.05 }} className="w-full relative origin-top">
              <Image
                src="/upload-hero-bg.png"
                alt="Kalakasturi Art Studio"
                width={3840}
                height={2160}
                className="w-full h-[70vh] object-cover md:h-auto"
                sizes="100vw"
                quality={95}
                priority
              />
          </motion.div>
        </section>

        {/* Heading & Subheading Section below the image */}
        <section className="w-full relative z-10 -mt-[7px]">
          <DigitalSerenity />
        </section>

        <section className="w-full pb-11 md:pb-16 pt-[18px]">
          <motion.div 
            variants={FADE_UP} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            className="w-full px-4 md:px-6 mt-[21px]"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-6">
              {[
                { title: "Featured Art", image: "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779777651/kalakasturi_products/hl2panmzd96vyczuh54u.jpg" },
                { title: "Prints", image: "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779777440/kalakasturi_products/iaslgwspg9u2tyo0f8d8.png" },
                { title: "Customize Your Item", image: "https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779808219/kalakasturi_products/bcbysgq7ogmejyraniwx.jpg" },
                { title: "Courses", image: "/courses-featured.png" }
              ].map((card, i) => (
                <div key={i} className="group relative rounded-3xl aspect-square md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-shadow duration-500">
                  <Image src={card.image} alt={card.title} fill quality={95} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8 translate-y-2 lg:translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-medium text-lg sm:text-xl lg:text-3xl text-center drop-shadow-md">{card.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="py-16 md:py-22 overflow-hidden bg-black/30 border-y border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Latest Arrivals</h2>
              <p className="text-[#A3A3A3] text-lg">Recently completed works from the studio.</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/collections" className="text-sm font-semibold tracking-wide uppercase hover:text-white transition-colors border-b border-white pb-1">View All</Link>
            </div>
          </div>
          
          <div className="w-full px-4 md:px-12 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {artProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 md:py-22">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6 md:gap-8 divide-x divide-white/10">
              
              <div className="flex flex-col gap-2 md:gap-4 items-center md:items-start text-center md:text-left px-1 md:pr-12 py-2 md:py-0">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 md:mb-4">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-[14px] sm:text-[19.2px] md:text-2xl font-semibold tracking-tight leading-snug md:leading-tight">24/7 Support</h3>
                <p className="text-[12.8px] md:text-base text-[#A3A3A3] leading-relaxed hidden sm:block">Our support team and representatives are available round-the-clock to assist.</p>
                <p className="text-[10px] text-[#A3A3A3] leading-relaxed sm:hidden">Always active</p>
              </div>

              <div className="flex flex-col gap-2 md:gap-4 items-center md:items-start text-center md:text-left px-2 sm:px-6 md:px-12 py-2 md:py-0">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 md:mb-4">
                  <BadgeCheck className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-[14px] sm:text-[19.2px] md:text-2xl font-semibold tracking-tight leading-snug md:leading-tight">Original Art</h3>
                <p className="text-[12.8px] md:text-base text-[#A3A3A3] leading-relaxed hidden sm:block">A certificate of originality is provided with every single art purchase.</p>
                <p className="text-[10px] text-[#A3A3A3] leading-relaxed sm:hidden">Certified pieces</p>
              </div>

              <div className="flex flex-col gap-2 md:gap-4 items-center md:items-start text-center md:text-left px-1 md:pl-12 py-2 md:py-0">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-1 md:mb-4">
                  <Globe className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-[14px] sm:text-[19.2px] md:text-2xl font-semibold tracking-tight leading-snug md:leading-tight">Worldwide</h3>
                <p className="text-[12.8px] md:text-base text-[#A3A3A3] leading-relaxed hidden sm:block">Art pieces are securely packaged and shipped globally via fully tracked courier.</p>
                <p className="text-[10px] text-[#A3A3A3] leading-relaxed sm:hidden">Safe global shipping</p>
              </div>

            </div>
          </div>
        </section>

        <Testimonials />

        <section className="pt-16 pb-12 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto bg-gradient-to-b from-[#1A1A1A] to-[#000000] border border-white/10 rounded-3xl p-6 sm:p-12 md:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dwmilzocy/image/upload/q_auto,f_auto/v1779777651/kalakasturi_products/hl2panmzd96vyczuh54u.jpg')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-3xl"
            >
              <motion.h2 variants={FADE_UP} className="text-2xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
                Bring your empty walls to life.
              </motion.h2>
              <motion.p variants={FADE_UP} className="text-[12.8px] sm:text-lg md:text-xl text-[#A3A3A3]">
                Shop our curated collection of original paintings and find the perfect statement piece for your home.
              </motion.p>
              <motion.div variants={FADE_UP} className="mt-2 sm:mt-4">
                <Link href="/collections" className="group relative inline-flex overflow-hidden rounded-full p-[2px] transition-all duration-300 min-w-[192px] md:min-w-[240px] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505]/95 px-[38.4px] py-[16px] md:px-12 md:py-5 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black text-[12.8px] md:text-base">
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">Browse the Collection</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
