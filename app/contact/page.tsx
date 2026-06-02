'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-44 pb-24 px-6 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <motion.div 
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
        >
          <div className="flex flex-col gap-10">
            <div>
              <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Let&apos;s Connect.
              </motion.h1>
              <motion.p variants={FADE_UP} className="text-xl text-[#A3A3A3] leading-relaxed max-w-md">
                Have a question about a piece, shipping, or want to discuss a custom commission? We&apos;d love to hear from you.
              </motion.p>
            </div>

            <motion.div variants={STAGGER} className="flex flex-col gap-8">
              <motion.div variants={FADE_UP} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Email</h3>
                  <p className="text-[#A3A3A3] mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:care.kalakasturi@gmail.com" className="text-white hover:text-[#A3A3A3] font-medium transition-colors">care.kalakasturi@gmail.com</a>
                </div>
              </motion.div>

              <motion.div variants={FADE_UP} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Social Media</h3>
                  <p className="text-[#A3A3A3] mb-2">DM us for quick inquiries or to see the latest.</p>
                  <a href="https://www.instagram.com/art_kalakasturi/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#A3A3A3] font-medium transition-colors">@art_kalakasturi</a>
                </div>
              </motion.div>

              <motion.div variants={FADE_UP} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">Studio Region</h3>
                  <p className="text-[#A3A3A3]">Based in India. Shipping original art globally with premium protective packaging.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={FADE_UP} className="bg-[#1A1A1A] p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 right-[-10%] top-[-10%] w-[300px] h-[300px] bg-white/5 blur-3xl rounded-full pointer-events-none" />
            
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold tracking-tight">Message Sent</h3>
                <p className="text-[#A3A3A3]">Thank you for reaching out. We will get back to you within 24-48 hours.</p>
                <button 
                  onClick={() => setFormState('idle')}
                  className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 text-white">
                <h3 className="text-2xl font-semibold mb-2">Send a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-[#A3A3A3]">Full Name</label>
                    <input id="name" required type="text" className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-white" placeholder="Jane Doe" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#A3A3A3]">Email Address</label>
                    <input id="email" required type="email" className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-white" placeholder="jane@example.com" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-sm font-medium text-[#A3A3A3]">Subject</label>
                  <select id="subject" className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-white appearance-none">
                    <option value="general">General Inquiry</option>
                    <option value="commission">Custom Commission</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-[#A3A3A3]">Message</label>
                  <textarea id="message" required rows={5} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors text-white resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formState === 'submitting'}
                  className="mt-4 w-full group relative inline-flex overflow-hidden rounded-full p-[2px] transition-all duration-300 disabled:opacity-70"
                >
                  <span className="absolute inset-[-1000%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black w-full text-center">
                    <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 flex items-center gap-2">
                      {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                    </span>
                  </div>
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
