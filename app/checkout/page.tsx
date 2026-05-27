"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, ShieldCheck, CreditCard, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';
import { useCartStore } from '../../lib/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeResponse, setStripeResponse] = useState<any>(null);

  // Avoid hydration layout mismatch by waiting for client load
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const totalPrice = getTotalPrice();

  // Redirect if cart is empty and checkout isn't completed
  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 pt-32">
        <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6 text-[#A3A3A3]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Checkout is Empty</h2>
        <p className="text-sm text-neutral-400 max-w-[280px] leading-relaxed mb-8">
          Add original canvas oil paintings or portraits to your cart before checking out.
        </p>
        <Link
          href="/collections"
          className="px-8 py-3 bg-[#C19A6B] hover:bg-[#b08c60] text-black text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
        >
          View Collections
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full Name is required";
    if (!formData.phone.trim()) return "WhatsApp/Phone Number is required";
    if (!formData.email.trim()) return "Email address is required";
    if (!formData.street.trim()) return "Shipping Street Address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.state.trim()) return "State is required";
    if (!formData.zip.trim()) return "Postal / Zip code is required";
    return null;
  };

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }

    const contactNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210";
    
    // Compile formatted order narrative
    let text = `Hello Kala Kasturi! I would like to place an order:\n\n`;
    text += `📦 ORDER SUMMARY\n`;
    text += `----------------------------------------\n`;
    items.forEach(item => {
      text += `- ${item.title} (${item.priceRaw}) x ${item.quantity}\n`;
    });
    text += `----------------------------------------\n`;
    text += `Subtotal: ₹${totalPrice.toLocaleString('en-IN')}\n`;
    text += `Shipping: Free (Special Collector Safe Transit)\n`;
    text += `Grand Total: ₹${totalPrice.toLocaleString('en-IN')}\n\n`;
    
    text += `👤 CUSTOMER DETAILS\n`;
    text += `- Name: ${formData.name}\n`;
    text += `- Phone: ${formData.phone}\n`;
    text += `- Email: ${formData.email}\n\n`;
    
    text += `📍 SHIPPING ADDRESS\n`;
    text += `- Street: ${formData.street}\n`;
    text += `- City: ${formData.city}\n`;
    text += `- State: ${formData.state}\n`;
    text += `- Zip Code: ${formData.zip}\n`;
    text += `- Country: ${formData.country}\n\n`;
    
    text += `Please verify inventory availability and guide me through the bank/Stripe details to proceed with the secure payment!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${contactNumber.replace(/[^\d+]/g, '')}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    
    // Set checkout completed state
    setPaymentSuccess(true);
    clearCart();
  };

  const handleStripePrototypeCheckout = async () => {
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.title,
            image: item.image,
            price: item.price * 100, // conversion to smallest currency units
            quantity: item.quantity
          })),
          customerEmail: formData.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        setStripeResponse(data);
        if (data.prototype) {
          // Simulation popup
          setTimeout(() => {
            setIsSubmitting(false);
            setPaymentSuccess(true);
            clearCart();
          }, 1500);
        } else if (data.url) {
          // Standard production redirection
          window.location.href = data.url;
        }
      } else {
        setErrorMsg(data.error || 'Checkout API compilation failed');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg('Network error compiling checkout parameters');
      setIsSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pt-32">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-extrabold uppercase tracking-widest mb-3">Order Requested!</h1>
        
        {stripeResponse?.prototype ? (
          <div className="max-w-[480px] bg-neutral-900 border border-white/10 p-6 rounded-2xl mb-8 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C19A6B] mb-2">Stripe Prototype Sandbox Integration Active</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Your serverless endpoint at <code className="text-red-400">/api/checkout/session</code> successfully intercepted the order data. Payment validation routes operate in sandbox simulation since production keys are currently pending.
            </p>
          </div>
        ) : (
          <p className="text-sm text-neutral-400 max-w-[360px] text-center leading-relaxed mb-8">
            Your details have been compiled and sent to the Kala Kasturi founder. We have opened a WhatsApp chat window to complete security authorization and shipping coordinates.
          </p>
        )}

        <button
          onClick={() => router.push('/')}
          className="px-8 py-3.5 bg-[#C19A6B] hover:bg-[#b08c60] text-black text-xs font-bold uppercase tracking-widest rounded-full transition-colors active:scale-95"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-16">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 cursor-pointer bg-transparent border-0 text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight mb-10 uppercase tracking-widest text-[#C19A6B]">
          Art Collector Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Customer Data Input Forms (Lg: 7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            <form onSubmit={handleWhatsAppCheckout} className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Identity Details Card */}
              <div className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C19A6B]">1. Identity & Contact Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address Details Card */}
              <div className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C19A6B]">2. Collector Shipping Coordinates</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. 123 Temple Road, Laxman Jhula"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Rishikesh"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Uttarakhand"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Postal / Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="e.g. 249201"
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#C19A6B] focus:ring-1 focus:ring-[#C19A6B] outline-none transition-colors text-white"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

          </div>

          {/* RIGHT: Order Summary & Execution controls (Lg: 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 bg-[#080808] border border-white/10 rounded-2xl space-y-6 shadow-md">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
                Art Order Summary
              </h3>

              {/* Items details */}
              <div className="space-y-4 max-h-[240px] overflow-y-auto pr-2 divide-y divide-white/5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pt-3 first:pt-0">
                    <div className="relative w-12 h-14 rounded overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center text-[8px] text-neutral-500 uppercase tracking-widest">
                          Mount
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold font-mono text-white shrink-0">{item.priceRaw}</span>
                  </div>
                ))}
              </div>

              {/* Price Calculation Ticker */}
              <div className="border-t border-white/5 pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal Value</span>
                  <span className="font-mono text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400 items-center">
                  <span className="flex items-center gap-1.5">
                    Shipping & Transit
                    <span className="px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                      Uttarakhand Hub
                    </span>
                  </span>
                  <span className="font-mono text-emerald-400 uppercase font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Estimated Insurance / Box</span>
                  <span className="font-mono text-emerald-400 uppercase font-semibold">Included</span>
                </div>
                
                <div className="flex justify-between items-baseline border-t border-white/5 pt-4">
                  <span className="text-sm font-semibold text-white">Grand Total</span>
                  <span className="text-xl font-bold font-mono text-[#C19A6B]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Buttons Panel */}
              <div className="space-y-3 pt-2">
                {/* 1. Primary Action: WhatsApp Redirection Checkout */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all active:scale-98 cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  Order on WhatsApp (Immediate Setup)
                </button>

                {/* 2. Secondary Action: Stripe Prototype checkout */}
                <button
                  onClick={handleStripePrototypeCheckout}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-transparent border border-white/10 hover:border-white/20 text-[#A3A3A3] hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-4 h-4" />
                  {isSubmitting ? 'Verifying Sandbox Session...' : 'Checkout via Credit Card (Sandbox)'}
                </button>
              </div>

              {/* Secure Trust indicators */}
              <div className="flex gap-2 p-3 bg-neutral-950 border border-white/5 rounded-xl text-[9px] text-neutral-400 leading-relaxed font-light">
                <ShieldCheck className="w-5 h-5 text-[#C19A6B] shrink-0" />
                <span>Encrypted transit wrapper. The original canvases are safely boxed in reinforced museum grade panels before immediate secure handoff.</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
