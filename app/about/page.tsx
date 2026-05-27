'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Star, UserCheck, Image as ImageIcon, Heart, MessageCircle, ExternalLink, Brush, MapPin, Quote, Sparkles, X, Award, Eye } from 'lucide-react';
import Link from 'next/link';

// Detailed mock Instagram posts based on real-world Kala Kasturi paintings and descriptions
const instagramPosts = [
  {
    id: "post1",
    image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=800&auto=format&fit=crop",
    likes: "1,248",
    comments: "84",
    title: "The Ektara Girl Painting",
    caption: "Slowly bringing the Ektara Girl to life with multi-layered oil glazes. Capturing the simplicity, depth, and musical heart of Indian village life. Original oil on stretched canvas. ✨🪕 #IndianArt #FolkPainting #EktaraGirl #OriginalOil #RishikeshArt",
    date: "2 days ago"
  },
  {
    id: "post2",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    likes: "932",
    comments: "46",
    title: "Mythology & Mysticism",
    caption: "Vishvamitra in deep meditation. Inspired byclassical Indian aesthetics and the legendary Raja Ravi Varma. Created using fine linen and natural pigments. 🙏🎨 #RajaRaviVarma #MythologyArt #SpiritualPainting #IndianHeritage",
    date: "1 week ago"
  },
  {
    id: "post3",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
    likes: "1,829",
    comments: "152",
    title: "Leopard Oil Study",
    caption: "Detail study of the leopard's eyes. Wildlife art is all about capturing the hidden soul of nature. Hand-painted textures take weeks to cure perfectly. 🐆👁️ #WildlifeArt #LeopardPainting #OilOnCanvas #RealisticPainting #FineArt",
    date: "2 weeks ago"
  },
  {
    id: "post4",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    likes: "1,044",
    comments: "72",
    title: "Saraswati Contemporary Woman",
    caption: "Veena Woman in abstract golden hues. Blending modern interior trends with ancient spiritual symbolism to create positive vibrations in your space. 🎶💛 #SaraswatiArt #VeenaArt #GoldenPaintings #DevotionalArt #ContemporaryIndian",
    date: "3 weeks ago"
  },
  {
    id: "post5",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=800&auto=format&fit=crop",
    likes: "782",
    comments: "39",
    title: "Studio Palette Details",
    caption: "Raw pigments, heavy body oils, and traditional mediums. Every artwork begins as a dance of vibrant colors on the wooden palette in my Rishikesh studio. 🌸🎨 #BehindTheScenes #ArtistStudio #OilColors #CreativeProcess #DailyArt",
    date: "1 month ago"
  },
  {
    id: "post6",
    image: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=800&auto=format&fit=crop",
    likes: "1,490",
    comments: "109",
    title: "Cosmic Spiral Mountain",
    caption: "The majestic Himalayas meet abstract expressionism. Finding peace in the brush strokes and cosmic gradients representing Mount Kailash in blue spirals. 🏔️🌀 #CosmicArt #AbstractLandscape #Himalayas #RishikeshVibe #MeditativeSpirit",
    date: "1 month ago"
  },
  {
    id: "post7",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    likes: "860",
    comments: "54",
    title: "Ganesha Earth Tones",
    caption: "Vighnaharta Ganesha hand-drawn watercolor watercolor sketch. This serves as the study pattern for our upcoming gold leaf oil piece. 🌟🐘 #GaneshaSketch #WatercolorArt #IndianGods #SpiritualVibe #ArtCreation",
    date: "2 months ago"
  },
  {
    id: "post8",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop",
    likes: "1,112",
    comments: "91",
    title: "Folk Wall Decor Concepts",
    caption: "Arranging classical prints in modern interior environments. Art is meant to elevate normal walls into spiritual retreats. High quality textured prints now open on ETSY. 🌿🏠 #EtsyArt #GalleryWall #IndianHomeDecor #PrintsForSale",
    date: "2 months ago"
  },
  {
    id: "post9",
    image: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop",
    likes: "1,675",
    comments: "115",
    title: "Divine flute of Krishna",
    caption: "Detailed close-up on the intricate gold jewelry of the divine flutist. It takes extreme patience and fine brushes to achieve this nível of traditional precision. ✨💙 #RadheKrishna #OrnatePaintings #FineArtPrints #ClassicalVibe",
    date: "3 months ago"
  }
];

export default function AboutPage() {
  const [selectedPost, setSelectedPost] = useState<typeof instagramPosts[0] | null>(null);

  return (
    <div className="bg-[#000000] text-[#F5F5F5] min-h-screen pt-36 pb-24 px-4 sm:px-6 font-sans select-none">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-neutral-900/40 blur-[140px] pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto relative z-10">
        
        {/* Artistic Hero Profile Introduction */}
        <section className="mb-20 flex flex-col md:flex-row items-center gap-10 md:gap-16 border-b border-white/5 pb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#C19A6B]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex-shrink-0"
          >
            <Image 
              src="/ankita-profile.jpg" 
              alt="Ankita - KalaKasturi Art Studio" 
              fill 
              className="object-cover"
            />
          </motion.div>

          <div className="flex-grow text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-4 text-xs font-mono tracking-wider text-[#C19A6B]"
            >
              <Award className="w-3.5 h-3.5" />
              ARTIST &amp; STUDIO DIRECTOR
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white"
            >
              Meet Ankita
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mb-6 font-light"
            >
              Hello! I am Ankita, the artist and founder behind KalaKasturi. Based in the spiritual heart of <span className="text-white font-medium flex-inline gap-1"><MapPin className="inline w-3.5 h-3.5 text-[#C19A6B]" /> Rishikesh, Uttarakhand</span>, I focus on bridging classical Indian heritage with contemporary aesthetic spacing. I specialize in handcrafted Spiritual paintings, vibrant folk narratives, and hyper-detailed wildlife art on live canvas.
            </motion.p>

            {/* Studio Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 font-mono text-[10.5px] text-[#A3A3A3]"
            >
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <Brush className="w-3.5 h-3.5 text-[#C19A6B]" />
                100% Handcrafted
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 text-[#C19A6B]" />
                Premium Mediums
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-md">
                <UserCheck className="w-3.5 h-3.5 text-[#C19A6B]" />
                Global Collectors
              </div>
            </motion.div>
          </div>
        </section>

        {/* Real-time Instagram Link Profile Status Frame */}
        <section className="bg-neutral-950/90 border border-white/5 rounded-3xl p-6 md:p-10 mb-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 pb-6 border-b border-white/5 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px] flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/ankita-profile.jpg" 
                    alt="Ankita's Instagram Profile avatar" 
                    width={48} 
                    height={48} 
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold tracking-tight text-white hover:text-[#C19A6B] transition-colors">
                    <a href="https://www.instagram.com/art_kalakasturi/" target="_blank" rel="noopener noreferrer">art_kalakasturi</a>
                  </h3>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white text-[8px] font-bold">✓</span>
                </div>
                <p className="text-xs text-neutral-400">Official Art Studio feed</p>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-8 font-mono">
              <div className="text-center">
                <span className="block text-base font-bold text-white">124</span>
                <span className="text-[10px] uppercase text-neutral-500">Posts</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-center">
                <span className="block text-base font-bold text-white">4.8k</span>
                <span className="text-[10px] uppercase text-neutral-500">Followers</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-center">
                <span className="block text-base font-bold text-white">321</span>
                <span className="text-[10px] uppercase text-neutral-500">Following</span>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/art_kalakasturi/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative inline-flex overflow-hidden rounded-full p-[1px] transition-all duration-300 hover:scale-[1.03]"
            >
              <span className="absolute inset-[-1000%] animate-spin [animation-duration:5s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100" />
              <div className="inline-flex h-9 items-center justify-center rounded-full bg-[#050505] px-5 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black border-0">
                <span className="relative z-10 flex items-center gap-1.5 text-xs text-[#C19A6B]">
                  <Instagram className="w-4 h-4 text-[#C19A6B]" />
                  Follow on Instagram
                  <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </span>
              </div>
            </a>
          </div>

          {/* Premium Fine Art Instagram Grid Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer"
              >
                {/* Image Component */}
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover metadata & statistics icons */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 z-20 transition-all duration-300">
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-mono uppercase bg-black/60 border border-white/5 px-2 py-0.5 rounded-md backdrop-blur-md text-[#C19A6B] flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-[#C19A6B]" />
                      @art_kalakasturi
                    </span>
                    <span className="text-[9.5px] font-mono text-neutral-400">{post.date}</span>
                  </div>

                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-sm font-bold text-white mb-2 tracking-tight group-hover:text-[#C19A6B] transition-colors truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#ee2a7b]" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-sky-400" /> {post.comments}
                      </span>
                      <span className="flex items-center gap-1 ml-auto text-neutral-400">
                        <Eye className="w-3.5 h-3.5 text-neutral-400" /> View Post
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Devotional Spirit section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 border-t border-white/5 pt-16">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/5 bg-neutral-900">
            <Image 
              src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200" 
              alt="Art tools and canvases in Rishikesh Studio" 
              fill 
              className="object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block mb-1">Rishikesh Studio Room</span>
              <p className="text-xs text-neutral-400 italic font-light">&quot;Surrounded by pure clean air, organic flora, and sacred Vedic mantras playing in the background.&quot;</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#C19A6B]" />
              The Creative Devotion
            </h2>
            <p className="text-neutral-400 leading-relaxed font-light text-base">
              Every creation leaving my studio is treated as a form of sacred worship. Guided by old classical textbooks and natural landscapes of Uttarakhand, we layer authentic oils and gold gilding slowly over several weeks to build timeless texture and reflection.
            </p>
            <p className="text-neutral-400 leading-relaxed font-light text-base">
              Beyond standard fine canvases, we curate digital reproduction prints on archival fine arts paper and custom items for global delivery via our verified storefront channels.
            </p>
            
            <div className="flex flex-col gap-3 mt-4">
              <span className="text-[#C19A6B] text-xs font-mono uppercase tracking-widest block">Authorized Worldwide Deliveries</span>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.etsy.com/in-en/shop/KalaKasturiShop" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                  Shop ETSY Global Store <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
                <a href="https://www.amazon.in/s?k=Kalakasturi" target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10">
                  Shop Amazon India <ExternalLink className="w-3 h-3 text-[#C19A6B]" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic CTA */}
        <div className="mt-16 flex justify-center">
          <Link href="/contact" className="group relative inline-flex overflow-hidden rounded-full p-[2.5px] transition-all duration-300 min-w-[270px]">
            <span className="absolute inset-[-1000%] animate-spin [animation-duration:5s] bg-[conic-gradient(from_90deg_at_50%_50%,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8b00ff,#ff0000)] opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#050505] px-10 py-4 font-semibold text-white backdrop-blur-xl transition-all duration-300 group-hover:bg-black">
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-105 select-none flex items-center gap-2">
                Get in Touch for Commissions
              </span>
            </div>
          </Link>
        </div>

      </div>

      {/* Modern High-Fidelity Instagram Post Detail Modal Backdrop */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#050505] border border-white/10 rounded-3xl overflow-hidden max-w-[900px] w-full flex flex-col md:flex-row shadow-[0_30px_70px_rgba(0,0,0,0.9)] max-h-[90vh] md:max-h-[80vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Column */}
              <div className="relative w-full md:w-[55%] aspect-square md:aspect-auto bg-black flex-shrink-0 md:min-h-[450px]">
                <Image 
                  src={selectedPost.image} 
                  alt={selectedPost.title} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {/* Feed Meta Sidebar Column */}
              <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col justify-between text-white overflow-y-auto">
                <div className="flex flex-col flex-grow">
                  {/* Instagarm Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden relative border border-white/10">
                        <Image 
                          src="/ankita-profile.jpg" 
                          alt="Ankita micro" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-xs">art_kalakasturi</span>
                          <span className="w-3 h-3 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white text-[7px] font-bold">✓</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Rishikesh, Uttarakhand</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Caption Copy & Detailed hashtags */}
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-white mb-2 tracking-tight">{selectedPost.title}</h3>
                    <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-light italic select-text mb-4 mt-1">
                      {selectedPost.caption}
                    </p>
                  </div>
                </div>

                {/* Footer and Interactive Redirect Link Button */}
                <div className="pt-4 border-t border-white/5 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-[#ee2a7b]">
                        <Heart className="w-4 h-4 fill-current text-[#ee2a7b]" /> {selectedPost.likes} Likes
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <MessageCircle className="w-4 h-4 text-neutral-400" /> {selectedPost.comments}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">{selectedPost.date}</span>
                  </div>

                  <a 
                    href="https://www.instagram.com/art_kalakasturi/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 transition-opacity font-semibold text-xs text-white"
                  >
                    <Instagram className="w-4 h-4" />
                    Open &amp; Interact on Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
