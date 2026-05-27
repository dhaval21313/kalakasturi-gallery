'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Check, ArrowRight } from 'lucide-react';

const INTERESTS = [
  "Original Oil Paintings",
  "Wabi-Sabi Abstracts",
  "Prints & Reproductions",
  "Studio Behind-The-Scenes",
  "Collector Pre-Releases"
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <section id="newsletter-section" className="pt-13 pb-16 px-6 md:pt-17 md:pb-22 relative overflow-hidden bg-transparent">
      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        <div className="bg-transparent p-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="subscribe-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="w-full text-center space-y-8"
              >
                <h2 
                  className="text-[14px] xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2" 
                  style={{ fontFamily: 'var(--font-merriweather)' }}
                >
                  Subscribe to our newsletter for updates
                </h2>

                {/* Submission Form - sleek, ultra-modern minimalist UI */}
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch gap-4 w-full">
                  <div className="relative flex-1 w-full group/input">
                    {/* Glassy backdrop with sophisticated fade gradient and gold highlight on focus */}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-[#141414] to-stone-950 rounded-2xl opacity-80 group-focus-within/input:opacity-100 transition-opacity duration-500 border border-white/5 group-focus-within/input:border-[#C19A6B]/30" />
                    
                    {/* Gold bottom accent line that glows on focus */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 group-focus-within/input:bg-[#C19A6B] transition-all duration-500 rounded-b-2xl" />
                    
                    {/* Subtle gold outer radial glow on focus */}
                    <div className="absolute -inset-0.5 bg-[#C19A6B]/10 rounded-2xl opacity-0 group-focus-within/input:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
                      <Mail className="w-5 h-5 text-stone-500 group-focus-within/input:text-[#C19A6B] transition-colors duration-300" />
                    </div>
                    
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="relative z-10 w-full bg-transparent py-4 pl-12 pr-4 text-sm text-white focus:outline-none transition-all duration-300 placeholder:text-stone-600 font-sans tracking-wider"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto md:min-w-[240px] group relative inline-flex overflow-hidden rounded-full p-[2px] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] shrink-0"
                  >
                    {/* Spin Color Conic Gradient (user's preferred custom effect) */}
                    <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] px-[38.4px] py-[16px] md:px-12 md:py-5 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black border-0">
                      <span className="relative z-10 flex items-center justify-center gap-2 text-[12.8px] md:text-sm tracking-wide w-full whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                        Subscribe
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#C19A6B]" />
                      </span>
                    </div>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="welcome-circle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full text-center space-y-8 py-10"
              >
                <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-stone-800 flex items-center justify-center mx-auto shadow-inner text-[#C19A6B]" style={{ boxShadow: 'inset 0 0 15px rgba(193, 154, 107, 0.1)' }}>
                  <Check className="w-8 h-8" />
                </div>
                
                <div className="space-y-4">
                  <h3 
                    className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-merriweather)' }}
                  >
                    Thank you for subscribing
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
                    You have successfully subscribed with <span className="text-white font-mono text-sm underline underline-offset-4 decoration-stone-600">{email}</span>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="text-xs font-mono text-stone-500 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Change subscription email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
