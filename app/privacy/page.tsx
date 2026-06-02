'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-40 pb-24 px-6 font-sans relative overflow-hidden">
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
              <Shield className="w-3.5 h-3.5 text-[#C19A6B]" />
              LEGAL DOCUMENT
            </motion.div>
            <motion.h1 
              variants={FADE_UP}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-[#FAF6EE] mb-4"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              Privacy Policy
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-sm font-mono text-neutral-500">
              Last updated: May 24, 2026
            </motion.p>
          </div>

          {/* Quick Summary Cards (Bento style) */}
          <motion.div variants={STAGGER} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <Lock className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Safe Transfers</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                All order details and custom commission notes are fully secured.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <Eye className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">Zero Renting</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                We never rent, sell, or advertise with your artwork interests or personal contacts.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP} className="bg-neutral-950/80 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
              <FileText className="w-5 h-5 text-[#C19A6B] mb-1" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white">GDPR Compliant</h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Full support to download, alter, or purge your account records instantly.
              </p>
            </motion.div>
          </motion.div>

          {/* Detailed Content */}
          <motion.div variants={FADE_UP} className="prose prose-invert max-w-none flex flex-col gap-8 text-[#D4D4D4] font-light leading-relaxed text-sm sm:text-base">
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                1. Information We Collect
              </h2>
              <p>
                At KalaKasturi, we value your privacy above all. When you place a custom order, register for gallery updates, or request commissioned artwork, we may collect minimal transactional details including:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-xs sm:text-sm text-neutral-400">
                <li>Your name and shipping/billing credentials.</li>
                <li>Contact numbers and email to coordinates live delivery status.</li>
                <li>Art preferences, commissioned request specs, and photo uploads of rooms.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                2. How We Secure Your Data
              </h2>
              <p>
                Any interaction on our system runs encrypted end-to-end via secure socket layers. Transaction payment tokens are processed directly by industry standard channels (such as Stripe, Amazon Pay, or PayPal) without reaching our local storage files.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                3. Cookies and Visual Preferences
              </h2>
              <p>
                Our site processes small cookies to retain your gallery sorting views, cart reservations, and device sizes mapping. Doing so ensures lightweight image caching and fluid transition cycles without lagging.
              </p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-white tracking-tight" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                4. Third-Party Marketplace Partners
              </h2>
              <p>
                Because we host authorized checkout lines on ESTY and Amazon, those external hubs maintain distinct tracking profiles. We suggest checking their native policies when leaving our domain.
              </p>
            </section>

            <section className="flex flex-col gap-3 bg-neutral-950 p-6 rounded-2xl border border-white/5">
              <h3 className="text-base font-medium text-[#C19A6B] mb-1">
                Have inquiries about your privacy rights?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                We respond within 24 working hours to address any concerns.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs text-white hover:text-[#C19A6B] transition-colors font-mono">
                Connect with our legal representative <ArrowRight className="w-3.5 h-3.5 text-[#C19A6B]" />
              </Link>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
