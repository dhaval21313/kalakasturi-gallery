'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, MessageCircle } from 'lucide-react';

export default function InternationalShippingModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the modal
    const hasSeenNotice = localStorage.getItem('hasSeenInternationalShippingNotice');
    if (!hasSeenNotice) {
      // Delay the popup slightly for a smoother, less intrusive entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenInternationalShippingNotice', 'true');
    setIsOpen(false);
  };

  const contactNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919033459353";
  const whatsappUrl = `https://wa.me/${contactNumber.replace(/[^\d+]/g, '')}?text=Hello%20Ankita,%20I%27m%20an%20international%20buyer%20interested%20in%20your%20art.%20Could%20you%20please%20help%20me%20calculate%20the%20shipping%20price%20to%20my%20address?`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Glassy dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Premium Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-stone-950/90 border border-[#C19A6B]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_50px_-12px_rgba(193,154,107,0.25)] backdrop-blur-md z-10 text-center flex flex-col items-center"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/5 transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Globe Icon */}
            <div className="w-16 h-16 rounded-full bg-[#C19A6B]/10 border border-[#C19A6B]/30 flex items-center justify-center mb-6 relative group">
              <Globe className="w-8 h-8 text-[#C19A6B] animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-[#C19A6B]/20 blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight font-serif">
              International Collectors
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              For deliveries outside of India, please contact us directly with your shipping address. We will verify custom carrier rates to provide you the best shipping price.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C19A6B] hover:bg-[#b08b5f] text-black font-semibold px-5 py-3 rounded-full text-sm shadow-lg transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" /> Message on WhatsApp
              </a>
              <button
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-3 rounded-full text-sm transition-all"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
