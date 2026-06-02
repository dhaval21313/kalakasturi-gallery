'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Smile, 
  Heart, 
  Check, 
  Coffee, 
  MessageSquare,
  ArrowRight,
  X
} from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const
    }
  })
};

const COURSES = [
  {
    id: 'creative-foundations',
    title: 'Creative Foundations',
    ageGroup: 'Age 12+ & Adults',
    duration: '8 weeks',
    prerequisite: 'No prior experience required',
    icon: BookOpen,
    accent: '#C19A6B',
    description: 'Perfect for beginners looking to master the essential drawing and painting techniques. A structured journey starting from absolute raw materials to finished visual realism.',
    pointsTitle: 'Syllabus Highlights',
    points: [
      'Graphite shading & sketching techniques',
      'Charcoal blending, form creation & values',
      'Acrylic painting basics & color theory mapping',
      'Understanding wabi-sabi lighting & w/c geometry'
    ]
  },
  {
    id: 'oil-painting-masterclass',
    title: 'Oil Painting Masterclass',
    ageGroup: 'Advanced Students',
    duration: '8–12 weeks',
    prerequisite: 'Creative Foundations (or equivalent experience)',
    icon: GraduationCap,
    accent: '#cbd5e1',
    description: 'Elevate your painting to museum levels. Master the meditative, slow layers of traditional fine art oils, glazing, and textures under Ankita\'s step-by-step guidance.',
    pointsTitle: 'Mastery Focus',
    points: [
      'Classical underpainting & raw umber maps',
      'Glazing, slow-dry mediums & brush rendering',
      'Capturing lifelike skin tones & reflective highlights',
      'Preserving fine art canvas archives for collectors'
    ]
  },
  {
    id: 'kids-art-adventure',
    title: 'Kids Art Adventure',
    ageGroup: 'Ages 7–12',
    duration: 'Ongoing Weekly',
    prerequisite: 'Fun, open curiosity',
    icon: Smile,
    accent: '#38bdf8',
    description: 'A vibrant creative sandbox that nurtures kids\' imagination, observational skills, and self-confidence. Focusing purely on creative play and individual expression—not rigid realism.',
    pointsTitle: 'Creative Core Focus',
    points: [
      'Observational techniques & world framing',
      'Unlocking raw creativity & hand coordination',
      'Color matching, bright palettes & happy textures',
      'Building inner confidence & self-expression'
    ]
  },
  {
    id: 'women-seniors-circle',
    title: 'Women & Seniors Creative Circle',
    ageGroup: 'Open Community',
    duration: 'Ongoing Weekly Sessions',
    prerequisite: 'None (Focus on connection)',
    icon: Heart,
    accent: '#f472b6',
    highlight: 'Highly Recommended Community Choice',
    description: 'A cozy, nurturing space for relaxation, healing self-expression, and warm social connection. Let the brushes melt away modern stress while sharing a warm tea in community.',
    pointsTitle: 'Circle Highlights',
    points: [
      'Relaxation, gentle meditative strokes & healing colors',
      'Pure creative flow with zero performance stress',
      'Active social connection, warm tea & laughter',
      'Celebrating unique personal self-expression'
    ]
  }
];

export default function CoursesPage() {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const whatsappUrl = "https://wa.me/919429188049?text=Hello%20Ankita,%20I'm%20interested%20in%20enrolling%20in%20your%20art%20courses!";

  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-28 pb-24 px-4 sm:px-6 md:px-12 font-sans relative overflow-x-hidden">
      {/* Dynamic atmospheric background blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#1c140c]/40 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#0a110a]/30 blur-[160px] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C19A6B] font-bold block mb-3"
          >
            Studio Academy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-none"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            Creative Art Courses
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light"
          >
            Step-by-step guidance under the personal instruction of Ankita. From mastering classical drawing values to engaging in community healing classes, discover a course aligned with your journey.
          </motion.p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {COURSES.map((course, idx) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={FADE_UP}
                className="group relative rounded-3xl p-6 sm:p-8 bg-[#050505] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Accent Glow on Hover */}
                <div 
                  className="absolute -top-1/4 -right-1/4 w-40 h-40 rounded-full opacity-10 group-hover:opacity-20 blur-3xl transition-opacity pointer-events-none"
                  style={{ backgroundColor: course.accent }}
                />

                <div>
                  {/* Highlight Tag */}
                  {course.highlight && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/25 rounded-full text-[10px] uppercase tracking-wider text-pink-400 font-semibold shadow-inner animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      {course.highlight}
                    </div>
                  )}

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 
                        className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5"
                        style={{ fontFamily: 'var(--font-merriweather), serif' }}
                      >
                        {course.title}
                      </h2>
                      <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" style={{ color: course.accent }} />
                        {course.ageGroup}
                      </span>
                    </div>

                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors bg-white/5"
                      style={{ borderColor: `${course.accent}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: course.accent }} />
                    </div>
                  </div>

                  {/* Meta Specs Bar */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-neutral-950/40 border border-white/5 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C19A6B]" /> Duration
                      </span>
                      <span className="font-semibold text-white font-mono">{course.duration}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#C19A6B]" /> Prerequisite
                      </span>
                      <span className="font-semibold text-white leading-snug">{course.prerequisite}</span>
                    </div>
                  </div>

                  {/* Course narrative */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light mb-6">
                    {course.description}
                  </p>

                  {/* Syllabus / Focus List */}
                  <div className="border-t border-white/5 pt-5 mb-8">
                    <h4 className="text-[10px] uppercase tracking-wider text-[#C19A6B] font-bold mb-3.5">
                      {course.pointsTitle}
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {course.points.map((point, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-400 font-light">
                          <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-white/70" />
                          </div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Enquire Button CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex w-full items-center justify-center rounded-full p-[2px] transition-all duration-300 hover:scale-[1.01] h-12 overflow-hidden"
                >
                  <span className="absolute inset-[-1000%] animate-spin [animation-duration:5s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover/btn:opacity-90 transition-opacity" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] font-bold text-xs uppercase tracking-widest text-[#C19A6B] backdrop-blur-2xl transition-all duration-300 group-hover/btn:bg-black group-hover/btn:text-white">
                    Enquire / Register Interest
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Notes / Studio Amenities */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-24 p-6 sm:p-8 rounded-3xl bg-[#050505] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-[#C19A6B]/10 border border-[#C19A6B]/20 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-[#C19A6B]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-0.5">Complementary Art Supplies for Personal Coaching</h4>
              <p className="text-xs text-neutral-400 font-light">One-on-one classes include starter art supplies tailored to your chosen medium, such as canvas, brushes, paints, charcoal, graphite pencils, and other essential materials.</p>
            </div>
          </div>

          <button 
            onClick={() => setIsQrModalOpen(true)}
            className="px-6 py-3 bg-[#C19A6B] hover:bg-[#b08b5e] text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            Connect via WhatsApp
          </button>
        </motion.div>

      </div>

      {/* WhatsApp QR Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQrModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 text-center"
            >
              {/* Glow Accent */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#C19A6B]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#C19A6B]/5 blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#C19A6B]/10 border border-[#C19A6B]/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-[#C19A6B]" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                Join the Channel
              </h3>
              <p className="text-xs text-[#A3A3A3] font-light mb-6 max-w-xs mx-auto leading-relaxed">
                Scan the QR code to join the <strong>art_kalakasturi</strong> WhatsApp channel. Ankita shares original artworks, behind-the-scenes processes, and stories with zero noise.
              </p>

              {/* QR Code Image Container */}
              <div className="relative w-52 h-52 mx-auto mb-6 rounded-2xl overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-md shadow-inner flex items-center justify-center">
                <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#C19A6B,#000000,#C19A6B)] opacity-10 blur-md pointer-events-none animate-spin [animation-duration:8s]" />
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-white">
                  <Image 
                    src="/whatsapp-qr.jpg" 
                    alt="WhatsApp Channel QR Code" 
                    fill 
                    className="object-cover p-1"
                    quality={100}
                  />
                </div>
              </div>

              {/* Mobile Friendly Link */}
              <div className="flex flex-col gap-3">
                <a 
                  href="https://www.instagram.com/p/DShwPwQEZ3j/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#C19A6B] hover:bg-[#b08b5e] text-black font-semibold text-xs uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  Open QR Post on Instagram
                </a>
                <button 
                  onClick={() => setIsQrModalOpen(false)}
                  className="text-neutral-400 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors py-1"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
