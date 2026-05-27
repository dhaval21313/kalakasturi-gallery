'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Scale, ShieldAlert, Award, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-40 pb-24 px-6 font-sans relative overflow-hidden">
      {" "}
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
              <Scale className="w-3.5 h-3.5 text-[#C19A6B]" />
              USER AGREEMENT
            </motion.div>
            <motion.h1 
              variants={FADE_UP}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              Terms &amp; Conditions
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-sm font-mono text-neutral-500">
              Terms of Service regulating the purchase and collection of KalaKasturi Fine Arts.
            </motion.p>
          </div>

          {/* Quick info Bento */}
          <motion.div variants={STAGGER} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <Award className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Artist Copyrights</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                All intellectual properties and image reproduction rights remain exclusively preserved by KalaKasturi.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <BookOpen className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Honest Listings</h3>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                We present realistic color captures, actual measurements, and media breakdown catalogs.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Governance</h3>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                Regulated respectfully in accordance with classical intellectual guidelines and Indian Court Jurisdictions.
              </p>
            </motion.div>
          </motion.div>

          {/* Detailed content */}
          <motion.div variants={FADE_UP} className="prose prose-invert max-w-none flex flex-col gap-8 text-[#D4D4D4] font-light leading-relaxed text-sm sm:text-base">
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or purchasing items on this KalaKasturi platform, you agree to comply with and represent acceptance of these Terms of Service. If you disagree with any segment, please discontinue using our online services.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                2. Intellectual Copyright &amp; Reproduction Rights
              </h2>
              <p>
                All materials, visual assets, layouts, designs, painting previews, product images, dynamic content, and logos featured on this site are owned or licensed by KalaKasturi.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs sm:text-sm text-neutral-400">
                <li><strong>No Commercial Reproduction:</strong> Purchasing an original physical painting or printed copy does NOT vest copyright transfer or reproductive privileges to the buyer. You are strictly forbidden from copying, uploading to print-on-demand portals, or commercially duplicating KalaKasturi designs.</li>
                <li><strong>Dynamic Sharing:</strong> Social sharing or digital editorial displays of our work represent creative community honors, provided clear artistic text credits to <code>@art_kalakasturi</code> are attached.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                3. Order Acceptance, Prices &amp; Rejection Rights
              </h2>
              <p>
                A checkout submission represents a buyer proposal. KalaKasturi maintains discretionary right to cancel or void any order (and refund the payment fully) in instances including, but not limited to:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm text-neutral-400">
                <li>Sudden inventory discrepancies or damage to physical frames.</li>
                <li>Delivery constraints or unserviceable global delivery zones.</li>
                <li>Incorrect price tags displayed on system pages due to system errors.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                4. Custom Commission Clauses
              </h2>
              <p>
                Individual commissioned pieces involve private milestone targets. Initial deposits agreed inside correspondence are fully non-refundable once materials mapping, base watercolors, or sketching structures have been initiated by the artist in the Rishikesh Studio.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                5. Limitation of Liability
              </h2>
              <p>
                We build extreme caution into our packaging, but once carriers receive the parcels, KalaKasturi is not responsible or directly liable for transit delay waves, force majeure events, or postal tracking misalignments.
              </p>
            </section>

            <section className="flex flex-col gap-3 bg-neutral-950 p-6 rounded-2xl border border-white/5">
              <h3 className="text-base font-medium text-white mb-1">
                Do you have specific licensing or commercial requests?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                If you are a gallery, museum curator, publisher, or corporate interior director who wishes to contract commercial reproduction or display licenses, let&apos;s establish formal licensing terms.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#C19A6B] transition-colors font-mono">
                Initiate Licensing Dialogue <ArrowRight className="w-3.5 h-3.5 text-[#C19A6B]" />
              </Link>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
