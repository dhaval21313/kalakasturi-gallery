'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Truck, PackageCheck, AlertCircle, ArrowRight, ShieldCheck, CornerUpLeft } from 'lucide-react';
import Link from 'next/link';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ShippingReturnsPage() {
  return (
    <div className="bg-dark-charcoal text-light-sand min-h-screen pt-24 md:pt-40 pb-24 px-6 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neutral-900/30 blur-[130px] pointer-events-none z-0"></div>

      <div className="max-w-[800px] mx-auto relative z-10">
        <motion.div 
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-12"
        >
          {/* Header */}
          <div className="border-b border-white/5 pb-8">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 text-xs font-mono tracking-wider text-[#C19A6B]">
              <Truck className="w-3.5 h-3.5 text-[#C19A6B]" />
              GLOBAL LOGISTICS
            </motion.div>
            <motion.h1 
              variants={FADE_UP}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-[#FAF6EE] mb-4"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              Shipping &amp; Returns
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-sm font-mono text-neutral-500">
              Delivering spiritual masterpieces securely worldwide.
            </motion.p>
          </div>

          {/* Quick info Bento */}
          <motion.div variants={STAGGER} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Heavy-Duty Packaging</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Acid-free glassine wrapping, shockproof foam, and impact-sealed mailing cylinders or wooden crates.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <Truck className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Express Delivery</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Shipped air-priority via DHL, FedEx, or India Post, complete with live tracking.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <CornerUpLeft className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Return Guarantee</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Hassle-free 14-day policy on reproduction prints and standard collector series.
              </p>
            </motion.div>
          </motion.div>

          {/* Detailed content */}
          <motion.div variants={FADE_UP} className="prose prose-invert max-w-none flex flex-col gap-8 text-[#D4D4D4] font-light leading-relaxed text-sm sm:text-base">
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                1. Shipped Directly from Rishikesh
              </h2>
              <p>
                All our originals are fully finished, cured, and packed inside our main studio in Rishikesh, Uttarakhand. Depending on the dimensions:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm text-neutral-400">
                <li><strong>Unframed canvases:</strong> Sh Shipped rolled in solid thick-walled PVC mailing tubes to completely avoid creasing or surface cracking.</li>
                <li><strong>Framed pieces:</strong> Rigid cardboard reinforcement layered inside double-wall boxes and safely locked in wooden support panels if massive.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                2. Shipping Timelines
              </h2>
              <p>
                As hand-painted artworks require adequate dry-curing times of up to 10 days before rolling, the overall dispatch schedules are as follows:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm text-neutral-400">
                <li><strong>Fine Art Prints:</strong> Dispatched in 2-3 business days. Domestic: 4-7 days. Global: 8-12 days.</li>
                <li><strong>Ready Original Art:</strong> Shipped within 3-4 enterprise days. Worldwide delivery: 7-10 air days.</li>
                <li><strong>Custom Commission Pieces:</strong> Specific curing &amp; production times will be explicitly communicated based on scale and color layer depth.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                3. Customs, Duties &amp; Insurances
              </h2>
              <p>
                Every original art shipment is fully covered via full-value damage insurance with a certified photo-certificate of authenticity. Please note that customs clearance fees, import duties, or local entry tax rates of your country are paid as the buyer&apos;s responsibility at delivery step.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                4. Return &amp; Cancellation Terms
              </h2>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm text-neutral-400">
                <li><strong>Stock Prints &amp; Unpinned Catalog Items:</strong> Eligible for returns or exchanges within 14 calendar days from delivery step. The item must arrive pristine back in its original packaging.</li>
                <li><strong>Original Paintings:</strong> Because each piece constitutes non-reproducible manual labor and heavy-duty shipping costs, all sales of original works are final once loaded onto carriers.</li>
                <li><strong>Damaged Transits:</strong> If you receive structural box damage, photograph the parcel before opening and contact us with a brief clip immediately at <a href="mailto:care.kalakasturi@gmail.com" className="text-white hover:underline">care.kalakasturi@gmail.com</a> so we can process your insurance claim.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3 bg-neutral-950 p-6 rounded-2xl border border-white/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C19A6B] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-medium text-white mb-1">
                    Need special timing or private delivery coordination?
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    If you require signature-upon-delivery, weekend dropoffs, or specific wooden-crated frame packaging, our custom support can guide your preferences easily.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#C19A6B] transition-colors font-mono">
                    Ask dynamic custom support <ArrowRight className="w-3.5 h-3.5 text-[#C19A6B]" />
                  </Link>
                </div>
              </div>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
