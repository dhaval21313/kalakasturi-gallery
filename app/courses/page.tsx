'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

const TRANSLATIONS = {
  en: {
    formTitle: "🎨 Art Course Inquiry",
    formSubtitle: "Interested in joining an art class? Fill out the form below and we'll get back to you soon.",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone / WhatsApp",
    age: "Age",
    selectCourse: "Select Course",
    chooseCoursePlaceholder: "Choose a Course",
    expLevel: "Experience Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    learningMode: "Preferred Learning Mode",
    online: "Online",
    inPerson: "In-Person",
    either: "Either",
    preferredDays: "Preferred Days & Time",
    achieveGoal: "What would you like to learn or achieve?",
    howHeard: "How did you hear about us?",
    selectHeardPlaceholder: "Select",
    consent: "I agree to be contacted regarding course information.",
    submit: "Submit Inquiry",
    submitting: "Submitting...",
    success: "✅ Thank you for your inquiry! We will contact you within 24–48 hours with course details and availability.",
    requiredError: "Please fill in all required fields marked with *",
    consentError: "Instruction: Please check the box at the bottom of the form ('I agree to be contacted...') to proceed with your enrollment.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid phone number (minimum 8 digits).",
    courses: [
      { value: "Drawing & Sketching", label: "Drawing & Sketching" },
      { value: "Watercolor Painting", label: "Watercolor Painting" },
      { value: "Acrylic Painting", label: "Acrylic Painting" },
      { value: "Oil Painting", label: "Oil Painting" },
      { value: "Mixed Media", label: "Mixed Media" },
      { value: "One-on-One Art Classes", label: "One-on-One Art Classes" },
      { value: "Not Sure Yet", label: "Not Sure Yet" }
    ],
    heardOptions: [
      { value: "Instagram", label: "Instagram" },
      { value: "Facebook", label: "Facebook" },
      { value: "Google", label: "Google" },
      { value: "Friend/Family", label: "Friend/Family" },
      { value: "Other", label: "Other" }
    ]
  },
  hi: {
    formTitle: "🎨 कला पाठ्यक्रम पूछताछ फ़ॉर्म",
    formSubtitle: "कला कक्षा में रुचि है? नीचे दिया गया फ़ॉर्म भरें और हम जल्द ही आपसे संपर्क करेंगे।",
    fullName: "पूरा नाम",
    email: "ईमेल पता",
    phone: "फ़ोन / व्हाट्सऐप नंबर",
    age: "आयु",
    selectCourse: "पाठ्यक्रम चुनें",
    chooseCoursePlaceholder: "पाठ्यक्रम चुनें",
    expLevel: "अनुभव स्तर",
    beginner: "शुरुआती (Beginner)",
    intermediate: "मध्यम (Intermediate)",
    advanced: "उन्नत (Advanced)",
    learningMode: "सीखने का माध्यम",
    online: "ऑनलाइन",
    inPerson: "ऑफ़लाइन (प्रत्यक्ष)",
    either: "दोनों में से कोई भी",
    preferredDays: "पसंदीदा दिन एवं समय",
    achieveGoal: "आप क्या सीखना या हासिल करना चाहते हैं?",
    howHeard: "आपको हमारे बारे में कैसे पता चला?",
    selectHeardPlaceholder: "विकल्प चुनें",
    consent: "मैं पाठ्यक्रम संबंधी जानकारी प्राप्त करने हेतु संपर्क किए जाने की सहमति देता/देती हूँ।",
    submit: "पूछताछ भेजें",
    submitting: "भेजा जा रहा है...",
    success: "✅ धन्यवाद! आपकी पूछताछ प्राप्त हो गई है। हम 24–48 घंटों के भीतर आपसे संपर्क करेंगे और पाठ्यक्रम की जानकारी तथा उपलब्धता साझा करेंगे।",
    requiredError: "कृपया * वाले सभी अनिवार्य फ़ील्ड भरें",
    consentError: "निर्देश: आगे बढ़ने के लिए कृपया फ़ॉर्म के नीचे दिए गए चेकबॉक्स ('मैं पाठ्यक्रम संबंधी जानकारी प्राप्त करने हेतु...') पर टिक (✓) करें।",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें।",
    invalidPhone: "कृपया एक वैध फ़ोन नंबर दर्ज करें (न्यूनतम 8 अंक)।",
    courses: [
      { value: "Drawing & Sketching", label: "ड्रॉइंग एवं स्केचिंग" },
      { value: "Watercolor Painting", label: "वॉटरकलर पेंटिंग" },
      { value: "Acrylic Painting", label: "एक्रीलिक पेंटिंग" },
      { value: "Oil Painting", label: "ऑयल पेंटिंग" },
      { value: "Mixed Media", label: "मिक्स्ड मीडिया" },
      { value: "One-on-One Art Classes", label: "व्यक्तिगत (वन-ऑन-वन) कला कक्षाएँ" },
      { value: "Not Sure Yet", label: "अभी निश्चित नहीं हूँ" }
    ],
    heardOptions: [
      { value: "Instagram", label: "इंस्टाग्राम" },
      { value: "Facebook", label: "फेसबुक" },
      { value: "Google", label: "गूगल" },
      { value: "Friend/Family", label: "मित्र / परिवार" },
      { value: "Other", label: "अन्य" }
    ]
  }
};

export default function CoursesPage() {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formLanguage, setFormLanguage] = useState<'en' | 'hi'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [learningMode, setLearningMode] = useState('');
  const [preferredDays, setPreferredDays] = useState('');
  const [goal, setGoal] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [website, setWebsite] = useState(''); // Spam honeypot field

  const whatsappUrl = "https://wa.me/919429188049?text=Hello%20Ankita,%20I'm%20interested%20in%20enrolling%20in%20your%20art%20courses!";

  const openInquiryForm = (courseId: string) => {
    setSubmitSuccess(false);
    setErrorMessage('');
    setWebsite(''); // reset honeypot
    
    // Map course ID to the specific select choice
    if (courseId === 'creative-foundations') {
      setSelectedCourse('Drawing & Sketching');
    } else if (courseId === 'oil-painting-masterclass') {
      setSelectedCourse('Oil Painting');
    } else if (courseId === 'kids-art-adventure') {
      setSelectedCourse('Mixed Media');
    } else if (courseId === 'women-seniors-circle') {
      setSelectedCourse('Watercolor Painting');
    } else {
      setSelectedCourse('');
    }
    
    setIsFormModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const t = TRANSLATIONS[formLanguage];

    // Basic required check
    if (!fullName.trim() || !email.trim() || !phone.trim() || !selectedCourse || !experienceLevel || !learningMode) {
      setErrorMessage(t.requiredError);
      return;
    }

    // Consent check
    if (!agreeConsent) {
      setErrorMessage(t.consentError);
      return;
    }

    // Validation patterns
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[\d\s()+-]{8,20}$/;

    if (!EMAIL_REGEX.test(email.trim())) {
      setErrorMessage(t.invalidEmail);
      return;
    }

    if (!PHONE_REGEX.test(phone.trim())) {
      setErrorMessage(t.invalidPhone);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      age: age.trim() || null,
      course: selectedCourse,
      experienceLevel,
      learningMode,
      preferredDays: preferredDays.trim() || null,
      goal: goal.trim() || null,
      howHeard: howHeard || null,
      language: formLanguage,
      website // Spam Honeypot Field!
    };

    try {
      // 1. Submit to Next.js secure API route (handles honeypot, DB write, lead email, auto-responder)
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData?.message || "Secure API submission failed. Triggering robust local fallback.");
      }

      if (resData.etherealUrl) {
        console.log("Mock SMTP auto-responder successfully sent! Preview URL:", resData.etherealUrl);
      }

      setSubmitSuccess(true);
      
      // Reset Form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setAge('');
      setExperienceLevel('');
      setLearningMode('');
      setPreferredDays('');
      setGoal('');
      setHowHeard('');
      setAgreeConsent(false);
      setWebsite('');
    } catch (apiError) {
      console.warn("Secure API processing failed. Activating local resilience fallback:", apiError);
      
      // 2. Offline Resilience Fallback (Direct client-side Firestore connection or localStorage)
      try {
        const clientData = {
          ...payload,
          submittedAt: serverTimestamp ? serverTimestamp() : new Date().toISOString(),
          fallbackProcessed: true
        };

        if (db) {
          await addDoc(collection(db, "course_inquiries"), clientData);
          console.log("Offline Fallback: Successfully wrote to Firestore directly via Client SDK.");
        } else {
          console.warn("Offline Fallback: Firestore is not configured. Saving to localStorage queue.");
          const inquiries = JSON.parse(localStorage.getItem('course_inquiries') || '[]');
          inquiries.push({ ...clientData, submittedAt: new Date().toISOString() });
          localStorage.setItem('course_inquiries', JSON.stringify(inquiries));
        }

        setSubmitSuccess(true);
        
        // Reset Form fields on successful local fallback
        setFullName('');
        setEmail('');
        setPhone('');
        setAge('');
        setExperienceLevel('');
        setLearningMode('');
        setPreferredDays('');
        setGoal('');
        setHowHeard('');
        setAgreeConsent(false);
        setWebsite('');
      } catch (fallbackErr) {
        console.error("Critical: Form resilience fallback also failed:", fallbackErr);
        setErrorMessage(
          formLanguage === 'en' 
            ? "Submission failed. Please check your network connection or message Ankita directly via WhatsApp." 
            : "पूछताछ भेजने में असमर्थ। कृपया अपना नेटवर्क कनेक्शन जांचें या व्हाट्सऐप पर संपर्क करें।"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-none text-[#FAF6EE]"
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
                <button
                  onClick={() => openInquiryForm(course.id)}
                  className="group/btn relative inline-flex w-full items-center justify-center rounded-full p-[2px] transition-all duration-300 hover:scale-[1.01] h-12 overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-[-1000%] animate-spin [animation-duration:5s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover/btn:opacity-90 transition-opacity" />
                  <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] font-bold text-xs uppercase tracking-widest text-[#C19A6B] backdrop-blur-2xl transition-all duration-300 group-hover/btn:bg-black group-hover/btn:text-white">
                    Enquire / Register Interest
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </div>
                </button>
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

      {/* Art Course Inquiry Form Modal */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col justify-between"
            >
              {/* Glow Accent */}
              <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[#C19A6B]/5 blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-[#C19A6B]/5 blur-[120px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/5 z-20 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 pr-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                    {TRANSLATIONS[formLanguage].formTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {TRANSLATIONS[formLanguage].formSubtitle}
                  </p>
                </div>

                {/* Language Selector Toggle */}
                <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-full border border-white/5 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setFormLanguage('en')}
                    className={`px-3.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer ${
                      formLanguage === 'en' 
                        ? 'bg-[#C19A6B] text-black' 
                        : 'text-neutral-400 hover:text-white bg-transparent'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormLanguage('hi')}
                    className={`px-3.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer ${
                      formLanguage === 'hi' 
                        ? 'bg-[#C19A6B] text-black' 
                        : 'text-neutral-400 hover:text-white bg-transparent'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Form Content - Scrollable */}
              <div className="overflow-y-auto pr-1 flex-1 hide-scrollbar max-h-[60vh]">
                {submitSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 px-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                      <Check className="w-8 h-8" />
                    </div>
                    <p className="text-base sm:text-lg font-medium text-emerald-400 max-w-md mx-auto leading-relaxed">
                      {TRANSLATIONS[formLanguage].success}
                    </p>
                    <button 
                      onClick={() => setIsFormModalOpen(false)}
                      className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold uppercase tracking-widest rounded-full transition-all cursor-pointer"
                    >
                      {formLanguage === 'en' ? 'Close Window' : 'खिड़की बंद करें'}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-5 py-2">
                    
                    {/* Honeypot field for spam prevention */}
                    <div style={{ position: 'absolute', left: '-5000px', top: '-5000px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                      <input 
                        type="text" 
                        name="website" 
                        value={website} 
                        onChange={(e) => setWebsite(e.target.value)} 
                        tabIndex={-1} 
                        placeholder="Do not fill this if you are human" 
                      />
                    </div>

                    {/* Error Alerts */}
                    {errorMessage && (
                      <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                        {errorMessage}
                      </div>
                    )}

                    {/* Inputs Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].fullName} *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 focus:ring-0 focus:ring-offset-0"
                          placeholder={formLanguage === 'en' ? "Ankita" : "अंकिता"}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].email} *
                        </label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 focus:ring-0 focus:ring-offset-0"
                          placeholder="ankita@example.com"
                        />
                      </div>
                    </div>

                    {/* Inputs Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].phone} *
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 focus:ring-0 focus:ring-offset-0"
                          placeholder="+91 99999-99999"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].age}
                        </label>
                        <input 
                          type="number" 
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 focus:ring-0 focus:ring-offset-0"
                          placeholder={formLanguage === 'en' ? "24" : "२४"}
                        />
                      </div>
                    </div>

                    {/* Dropdowns Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].selectCourse} *
                        </label>
                        <div className="relative">
                          <select 
                            required
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white appearance-none cursor-pointer focus:ring-0 focus:ring-offset-0"
                          >
                            <option value="" disabled className="bg-[#050505] text-neutral-600">
                              {TRANSLATIONS[formLanguage].chooseCoursePlaceholder}
                            </option>
                            {TRANSLATIONS[formLanguage].courses.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#050505] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#C19A6B]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                          {TRANSLATIONS[formLanguage].howHeard}
                        </label>
                        <div className="relative">
                          <select 
                            value={howHeard}
                            onChange={(e) => setHowHeard(e.target.value)}
                            className="w-full bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white appearance-none cursor-pointer focus:ring-0 focus:ring-offset-0"
                          >
                            <option value="" disabled className="bg-[#050505] text-neutral-600">
                              {TRANSLATIONS[formLanguage].selectHeardPlaceholder}
                            </option>
                            {TRANSLATIONS[formLanguage].heardOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#050505] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#C19A6B]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Radio Options Group 1: Experience Level */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                        {TRANSLATIONS[formLanguage].expLevel} *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                          const isSelected = experienceLevel === level;
                          const labels = {
                            en: { Beginner: 'Beginner', Intermediate: 'Intermediate', Advanced: 'Advanced' },
                            hi: { Beginner: 'शुरुआती (Beginner)', Intermediate: 'मध्यम (Intermediate)', Advanced: 'उन्नत (Advanced)' }
                          };
                          return (
                            <button
                              type="button"
                              key={level}
                              onClick={() => setExperienceLevel(level)}
                              className={`py-3 rounded-2xl border text-[11px] font-medium transition-all text-center cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#C19A6B]/15 border-[#C19A6B] text-white font-bold' 
                                  : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {labels[formLanguage][level as keyof typeof labels['en']]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Radio Options Group 2: Learning Mode */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                        {TRANSLATIONS[formLanguage].learningMode} *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Online', 'In-Person', 'Either'].map((mode) => {
                          const isSelected = learningMode === mode;
                          const labels = {
                            en: { Online: 'Online', 'In-Person': 'In-Person', Either: 'Either' },
                            hi: { Online: 'ऑनलाइन', 'In-Person': 'ऑफ़लाइन (प्रत्यक्ष)', Either: 'दोनों में से कोई भी' }
                          };
                          return (
                            <button
                              type="button"
                              key={mode}
                              onClick={() => setLearningMode(mode)}
                              className={`py-3 rounded-2xl border text-[11px] font-medium transition-all text-center cursor-pointer ${
                                isSelected 
                                  ? 'bg-[#C19A6B]/15 border-[#C19A6B] text-white font-bold' 
                                  : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {labels[formLanguage][mode as keyof typeof labels['en']]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Days & Time */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                        {TRANSLATIONS[formLanguage].preferredDays}
                      </label>
                      <input 
                        type="text" 
                        value={preferredDays}
                        onChange={(e) => setPreferredDays(e.target.value)}
                        className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 focus:ring-0 focus:ring-offset-0"
                        placeholder={formLanguage === 'en' ? "Weekends, mornings preferred" : "सप्ताहांत, सुबह का समय"}
                      />
                    </div>

                    {/* What would you like to achieve */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-[#C19A6B] font-bold">
                        {TRANSLATIONS[formLanguage].achieveGoal}
                      </label>
                      <textarea 
                        rows={3}
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="bg-neutral-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#C19A6B]/50 transition-colors text-white placeholder-neutral-600 resize-none focus:ring-0 focus:ring-offset-0"
                        placeholder={formLanguage === 'en' ? "Learn classical shading and start acrylic painting..." : "शास्त्रीय शेडिंग सीखना और एक्रेलिक पेंटिंग शुरू करना..."}
                      />
                    </div>

                    {/* Consent checkbox */}
                    <label className={`flex gap-3 items-start text-xs font-light cursor-pointer select-none py-2 px-3.5 rounded-2xl border transition-all duration-300 ${
                      errorMessage === TRANSLATIONS[formLanguage].consentError
                        ? 'bg-red-500/5 border-red-500/30 text-red-300 animate-pulse'
                        : 'bg-transparent border-transparent text-neutral-400'
                    }`}>
                      <input 
                        type="checkbox"
                        checked={agreeConsent}
                        onChange={(e) => {
                          setAgreeConsent(e.target.checked);
                          if (e.target.checked && errorMessage === TRANSLATIONS[formLanguage].consentError) {
                            setErrorMessage('');
                          }
                        }}
                        className={`w-4.5 h-4.5 rounded border bg-neutral-950 text-[#C19A6B] focus:ring-0 mt-0.5 focus:ring-offset-0 cursor-pointer transition-colors ${
                          errorMessage === TRANSLATIONS[formLanguage].consentError
                            ? 'border-red-500/50'
                            : 'border-white/10'
                        }`}
                      />
                      <span className="leading-snug">{TRANSLATIONS[formLanguage].consent}</span>
                    </label>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group/sub relative inline-flex w-full items-center justify-center rounded-full p-[2px] transition-all duration-300 hover:scale-[1.01] h-12 overflow-hidden cursor-pointer mt-4"
                    >
                      <span className="absolute inset-[-1000%] animate-spin [animation-duration:6s] bg-[conic-gradient(from_90deg_at_50%_50%,#C19A6B,#000000,#C19A6B)] opacity-40 group-hover/sub:opacity-90 transition-opacity" />
                      <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] font-bold text-xs uppercase tracking-widest text-[#C19A6B] backdrop-blur-2xl transition-all duration-300 group-hover/sub:bg-black group-hover/sub:text-white">
                        {isSubmitting ? TRANSLATIONS[formLanguage].submitting : TRANSLATIONS[formLanguage].submit}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/sub:translate-x-1" />
                      </div>
                    </button>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
