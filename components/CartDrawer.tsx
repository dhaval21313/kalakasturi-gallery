"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Plus, Minus, Trash2, Shield, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '../lib/store/cartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    // Build WhatsApp Message Body
    const contactNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919033459353";
    let message = "Hello Kala Kasturi! I am interested in placing an order for the following artworks:\n\n";
    message += "----------------------------------------\n";
    items.forEach(item => {
      message += `- ${item.title} (${item.priceRaw}) x ${item.quantity}\n`;
    });
    message += "----------------------------------------\n";
    
    // Compute total manually for WhatsApp message
    const numericTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `Total Art Value: ₹${numericTotal.toLocaleString('en-IN')}\n\n`;
    message += "Please let me know if these originals are currently available and what are the next steps for delivery!\n";

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contactNumber.replace(/[^\d+]/g, '')}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const totalPrice = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black backdrop-blur-sm cursor-pointer"
          />

          {/* Cart Panel Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] bg-[#0d0f17] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#C19A6B]" />
                <h2 className="text-xl font-bold tracking-tight text-white">Your Art Cart</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#C19A6B]/15 text-[#C19A6B] text-xs font-bold rounded-full font-mono">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-[#A3A3A3] hover:text-white transition-colors"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6 text-[#A3A3A3]">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h3 className="text-white text-base font-semibold tracking-wider mb-2 uppercase">Your Cart is Empty</h3>
                  <p className="text-sm text-neutral-500 font-light max-w-[260px] leading-relaxed mb-6">
                    Browse the gallery collections to discover original Indian fine art oil paintings and portrait mounts.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-[#C19A6B] hover:bg-[#b08c60] text-black text-xs font-bold uppercase tracking-wider rounded-full transition-colors active:scale-95"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 relative group hover:border-white/10 transition-colors">
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-[10px] text-neutral-500 uppercase tracking-widest">
                          Mount
                        </div>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-wide leading-snug pr-6 line-clamp-2">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-[#C19A6B] font-mono mt-1 block">Original Piece</span>
                      </div>

                      {/* Quantity & Price Rows */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 border border-white/10 rounded-full bg-black/40 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-medium text-white px-2 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold font-mono text-white">
                          {item.priceRaw}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 p-1.5 bg-black/40 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-500 hover:text-red-400 rounded-lg transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-neutral-400 text-sm">Order Value:</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-light flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Museum-grade secure protective custom boxing included.</span>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {/* WhatsApp Checkout */}
                  <button
                    onClick={handleCheckoutWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors active:scale-98 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    Inquire / Order on WhatsApp
                  </button>

                  {/* Standard Checkout Panel Redirect */}
                  <button
                    onClick={onOpenCheckout}
                    className="w-full py-3.5 bg-[#C19A6B] hover:bg-[#b08c60] text-black font-bold text-xs uppercase tracking-widest rounded-full transition-colors active:scale-98 shadow-md"
                  >
                    Go to Secure Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
