'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah L.",
    location: "New York, USA",
    text: "The Ektara Girl painting brings an incredible sense of peace to our living room. The detail is unmatched. Truly a masterclass in capturing emotion.",
    rating: 5,
  },
  {
    name: "Rohan K.",
    location: "London, UK",
    text: "I've collected Indian art for years, but the depth in these Raja Ravi Varma style pieces is purely authentic. Stunning work that honors the heritage.",
    rating: 5,
  },
  {
    name: "Elena M.",
    location: "Berlin, Germany",
    text: "The wabi-sabi abstract holds so much quiet energy. It changes with the light throughout the day. It's not just a painting, it's an experience.",
    rating: 5,
  },
  {
    name: "James T.",
    location: "Sydney, Australia",
    text: "Fast international shipping and the oil painting was wrapped perfectly. The colors are even more vibrant in person than on the screen.",
    rating: 5,
  },
  {
    name: "Ananya S.",
    location: "Toronto, Canada",
    text: "A mesmerizing piece! Bought the Vishvamitra painting for my meditation space. The spiritual aura it brings is very real and profound.",
    rating: 5,
  },
  {
    name: "David W.",
    location: "Los Angeles, USA",
    text: "Exceptional quality. You can see the soul poured into these canvases. Customer service was remarkably accommodating as well.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-22 overflow-hidden relative border-t border-white/5 bg-black/40">
      <div className="max-w-[1400px] mx-auto px-6 mb-11 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-merriweather)' }}>
            Voices from Around the Globe
          </h2>
          <p className="text-[#A3A3A3] text-[14.4px] md:text-lg max-w-2xl mx-auto">
            Authentic experiences from our collectors who have welcomed Kalakasturi art into their homes.
          </p>
        </motion.div>
      </div>

      {/* Marquee Animations defined in global.css or inline. We'll use Tailwind utilities */}
      <div className="relative w-full flex items-center mb-8 overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] gap-6 pl-6">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-6 shrink-0">
              {testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-[260px] md:w-[450px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2 group-hover:border-white/20"
                >
                  <div className="flex gap-1 mb-4 md:mb-6 text-[#C19A6B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#E5E5E5] text-[12.8px] md:text-lg italic leading-relaxed mb-6 md:mb-8 font-light min-h-[80px] md:min-h-[100px]">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex flex-col border-t border-white/5 pt-4">
                    <span className="font-semibold text-white text-[12.8px] md:text-base tracking-wide">{t.name}</span>
                    <span className="text-[11.2px] md:text-sm text-[#A3A3A3] mt-1">{t.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Reverse Marquee */}
      <div className="relative w-full flex items-center overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee-reverse group-hover:[animation-play-state:paused] gap-6 pl-6 pt-2">
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-6 shrink-0">
              {[...testimonials].reverse().map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-[260px] md:w-[450px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 transition-transform duration-300 hover:-translate-y-2 group-hover:border-white/20"
                >
                  <div className="flex gap-1 mb-4 md:mb-6 text-[#C19A6B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#E5E5E5] text-[12.8px] md:text-lg italic leading-relaxed mb-6 md:mb-8 font-light min-h-[80px] md:min-h-[100px]">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex flex-col border-t border-white/5 pt-4">
                    <span className="font-semibold text-white text-[12.8px] md:text-base tracking-wide">{t.name}</span>
                    <span className="text-[11.2px] md:text-sm text-[#A3A3A3] mt-1">{t.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
