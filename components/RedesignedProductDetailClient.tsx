'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Minus, 
  Plus, 
  Share2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Play, 
  Pause,
  Maximize2
} from 'lucide-react';
import { useCartStore } from '../lib/store/cartStore';
import { getCategorySlug } from '../lib/utils';
import CartDrawer from './CartDrawer';
import { artProducts } from '../lib/data';

interface Variation {
  id: string;
  name: string;
  price: string;
  originalMrp: string;
  size: string;
  material: string;
  inStock: boolean;
}

interface Product {
  id: string;
  title: string;
  medium: string;
  price: string;
  originalMrp: string;
  size: string;
  material: string;
  image: string;
  images?: string[];
  description: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  inStock: boolean;
  video?: string | null;
  features?: string[];
  variations?: Variation[];
}

export default function RedesignedProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, updateQuantity, isCartOpen, openCart, closeCart, getTotalItems } = useCartStore();
  const totalCartItems = getTotalItems();

  const [activeMedia, setActiveMedia] = useState<'photo' | 'video'>('photo');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [selectedVarId, setSelectedVarId] = useState<string | null>(
    product.variations && product.variations.length > 0 ? product.variations[0].id : null
  );

  const [activeTab, setActiveTab] = useState<'description' | 'info' | 'reviews'>('description');
  const [lightboxImgIndex, setLightboxImgIndex] = useState<number | null>(null);
  const [lightboxZoomStyle, setLightboxZoomStyle] = useState({ transformOrigin: 'center', transform: 'scale(1)' });
  const lightboxRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reviews local state
  const [reviewsList, setReviewsList] = useState([
    { name: "Rajesh Sharma", date: "June 2, 2026", rating: 5, comment: "Absolutely stunning brushwork! The colors are even more vibrant in person. The museum-grade packaging was extremely secure and arrived in mint condition." },
    { name: "Emily Watson", date: "May 28, 2026", rating: 5, comment: "A breathtaking addition to my studio. The texture of the canvas gives it an incredible lifelike depth. Highly recommended." },
    { name: "Aarav Patel", date: "May 15, 2026", rating: 4, comment: "Very elegant art piece. The shipping was prompt, and it was stretched beautifully on the wood frame. Looking forward to buying again." }
  ]);

  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    const newReview = {
      name: reviewName,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rating: reviewRating,
      comment: reviewComment
    };
    setReviewsList([newReview, ...reviewsList]);
    setReviewName('');
    setReviewEmail('');
    setReviewRating(5);
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const totalItems = images.length + (product.video ? 1 : 0);
  const activeIndex = activeMedia === 'video' ? images.length : activeImgIndex;

  const goToIndex = (index: number) => {
    const targetIndex = (index + totalItems) % totalItems;
    if (product.video && targetIndex === images.length) {
      setActiveMedia('video');
    } else {
      setActiveMedia('photo');
      setActiveImgIndex(targetIndex);
    }
  };

  const handleNext = () => goToIndex(activeIndex + 1);
  const handlePrev = () => goToIndex(activeIndex - 1);

  // Compute selected variation details
  const selectedVariation = product.variations?.find(v => v.id === selectedVarId) || null;
  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentMrp = selectedVariation ? selectedVariation.originalMrp : product.originalMrp;
  const currentSize = selectedVariation ? selectedVariation.size : product.size;
  const currentMaterial = selectedVariation ? selectedVariation.material : product.material;
  const currentStock = selectedVariation ? selectedVariation.inStock : product.inStock;

  const salesVal = parseInt(currentPrice.replace(/[^\d]/g, ''), 10);
  const mrpVal = parseInt(currentMrp.replace(/[^\d]/g, ''), 10);
  const discountPct = mrpVal > 0 ? Math.round(((mrpVal - salesVal) / mrpVal) * 100) : 0;

  // Lightbox Zoom handlers
  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    if (lightboxRef.current) cancelAnimationFrame(lightboxRef.current);
    lightboxRef.current = requestAnimationFrame(() => {
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setLightboxZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(1.8)'
      });
    });
  };

  const handleLightboxMouseLeave = () => {
    if (lightboxRef.current) cancelAnimationFrame(lightboxRef.current);
    setLightboxZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    return () => {
      if (lightboxRef.current) cancelAnimationFrame(lightboxRef.current);
    };
  }, []);

  const handleOpenCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  // Add to cart flow
  const handleAddToCart = () => {
    if (!currentStock) return;
    const finalId = selectedVariation ? selectedVariation.id : product.id;
    const cartTitle = selectedVariation 
      ? (`${product.title} - ${selectedVariation.name}`)
      : product.title;

    addItem({
      id: finalId,
      title: cartTitle,
      price: salesVal,
      priceRaw: currentPrice,
      image: images[0] || '',
    });
    
    updateQuantity(finalId, quantity);
  };

  // Generate 4 related products
  const categorySlug = getCategorySlug(product.category);
  const relatedProducts = artProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  // If we don't have 4 products in the same category, grab from others
  if (relatedProducts.length < 4) {
    const fallbackProducts = artProducts.filter(p => p.id !== product.id && p.category !== product.category);
    for (const fb of fallbackProducts) {
      if (relatedProducts.length >= 4) break;
      if (!relatedProducts.some(rp => rp.id === fb.id)) {
        relatedProducts.push(fb);
      }
    }
  }

  // Generate dynamic SKU
  const skuString = `KK-${product.id.substring(0, 8).toUpperCase()}-${selectedVariation ? selectedVariation.id.replace(product.id + '-', '').substring(0, 4).toUpperCase() : 'ORIG'}`;

  return (
    <div className="redesigned-product-page-wrapper min-h-screen flex flex-col font-sans select-text">
      
      {/* ======================= TOP BAR (Green Banner) ======================= */}
      <div className="bg-[#1E3F20] text-white py-2 px-4 text-xs font-semibold tracking-wider flex flex-col md:flex-row items-center justify-between gap-2 border-b border-[#ffffff]/10 select-none">
        <div className="flex items-center gap-2">
          <span>Call Us : +91 90334 59353</span>
        </div>
        <div className="text-center font-medium">
          Sign up and GET 20% OFF for your first order. <Link href="/login" className="underline hover:text-amber-400 transition-colors ml-1 font-bold">Sign up now</Link>
        </div>
        <div className="flex items-center gap-4 text-white">
          <a href="mailto:care.kalakasturi@gmail.com" className="hover:text-amber-400 transition-colors">care.kalakasturi@gmail.com</a>
        </div>
      </div>

      {/* ======================= NAVBAR (White) ======================= */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 select-none">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" />
            </div>
            <span 
              className="text-2xl md:text-3xl tracking-wider text-[#1E3F20] select-none" 
              style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
            >
              Kala Kasturi
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] uppercase font-bold tracking-widest text-neutral-700">
            <Link href="/collections" className="hover:text-[#1E3F20] transition-colors">Gallery</Link>
            <Link href="/courses" className="hover:text-[#1E3F20] transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-[#1E3F20] transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-[#1E3F20] transition-colors">Contact</Link>
          </nav>

          {/* Icons Bar */}
          <div className="flex items-center gap-5 text-neutral-700">
            <Link href="/collections" className="hover:text-[#1E3F20] transition-all p-1" title="Search Gallery">
              <Search className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)} 
              className="hover:text-[#1E3F20] transition-all p-1 cursor-pointer bg-transparent border-0"
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button 
              onClick={openCart} 
              className="hover:text-[#1E3F20] transition-all p-1 relative cursor-pointer bg-transparent border-0"
              title="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1E3F20] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {totalCartItems}
                </span>
              )}
            </button>
            <Link href="/login" className="hover:text-[#1E3F20] transition-all p-1" title="Account / Login">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ======================= SHOP HEADER (Breadcrumbs) ======================= */}
      <section className="bg-[#F3F4F6] py-12 px-6 border-b border-[#E5E7EB] text-center select-none">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1E3F20] mb-3 font-serif">
          {product.category} Details
        </h1>
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-neutral-500">
          <Link href="/" className="hover:text-[#1E3F20] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#1E3F20] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#1E3F20]">{product.title}</span>
        </div>
      </section>

      {/* ======================= MAIN CONTENT SECTION ======================= */}
      <main className="max-w-[1400px] mx-auto w-full px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Gallery Panel */}
          <div className="lg:col-span-7 flex flex-col gap-5 w-full select-none">
            {/* Visual View Stage */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-neutral-900/10 border border-[#E5E7EB] shadow-sm">
              {activeMedia === 'photo' ? (
                <div 
                  className="w-full h-full relative cursor-zoom-in group/stage"
                  onClick={() => setLightboxImgIndex(activeImgIndex)}
                >
                  <Image
                    src={images[activeImgIndex]}
                    alt={`${product.title} detailed view`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                    referrerPolicy="no-referrer"
                    draggable="false"
                  />
                  
                  {/* Prev / Next Arrows */}
                  {totalItems > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-white/80 hover:bg-[#1E3F20] hover:text-white border border-[#E5E7EB] text-[#1E3F20] flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-10 cursor-pointer shadow"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-[#1E3F20] hover:text-white border border-[#E5E7EB] text-[#1E3F20] flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-10 cursor-pointer shadow"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 right-4 bg-black/60 p-2.5 rounded-full border border-white/10 backdrop-blur-md z-10 text-white pointer-events-none">
                    <Maximize2 className="w-4 h-4 text-neutral-300" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative bg-black">
                  {product.video && (
                    <video
                      ref={videoRef}
                      src={product.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  )}
                  {/* Custom video control bar overlaid dynamically */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/75 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md z-10 text-white">
                    <button onClick={togglePlay} className="flex items-center gap-2 hover:text-amber-400 transition-colors bg-transparent border-0 cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4 text-amber-400 fill-current" /> : <Play className="w-4 h-4 text-amber-400 fill-current" />}
                      <span className="text-[10px] uppercase tracking-wider font-semibold">{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stage bottom selection thumbnail row */}
            {totalItems > 1 && (
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                {Array.from({ length: totalItems }).map((_, i) => {
                  const isVideoItem = product.video && i === images.length;
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => goToIndex(i)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border bg-[#F9FAFB] transition-all duration-300 ${
                        isActive 
                          ? 'border-[#1E3F20] scale-105 shadow-md ring-2 ring-[#1E3F20]/10' 
                          : 'border-[#E5E7EB] hover:border-neutral-400'
                      }`}
                    >
                      {isVideoItem ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 hover:bg-black/10 transition-colors text-[#1E3F20]">
                          <Play className="w-5 h-5 fill-current mb-0.5" />
                          <span className="text-[8px] uppercase tracking-wider font-bold">Video</span>
                        </div>
                      ) : (
                        <Image
                          src={images[i]}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="85px"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Options & Purchase Form */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-neutral-800">
            {/* Header info */}
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#1E3F20] font-bold block mb-1">
                {product.category}
              </span>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3F20] leading-snug font-serif">
                  {product.title}
                </h1>
                
                {/* Stock status badge */}
                <div className="shrink-0 pt-1">
                  {currentStock ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-extrabold uppercase tracking-wide in-stock-badge-text">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] font-extrabold uppercase tracking-wide out-of-stock-badge-text">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Review summary info */}
              <div className="flex items-center gap-2 mt-3 text-xs select-none">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-semibold text-neutral-700 font-mono">5.0</span>
                <span className="text-neutral-400">•</span>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="text-[#1E3F20] font-bold hover:underline bg-transparent border-0 cursor-pointer p-0"
                >
                  ({reviewsList.length} reviews)
                </button>
              </div>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-4 py-4 border-y border-[#E5E7EB] select-none">
              <span className="text-3xl font-extrabold font-mono text-[#1E3F20]">{currentPrice}</span>
              {currentMrp !== currentPrice && (
                <span className="text-lg text-neutral-400 font-mono line-through">{currentMrp}</span>
              )}
              {discountPct > 0 && (
                <span className="px-2.5 py-0.5 bg-[#1E3F20]/10 border border-[#1E3F20]/25 rounded-md text-[10px] uppercase tracking-wider text-[#1E3F20] font-extrabold">
                  {discountPct}% Off
                </span>
              )}
            </div>

            {/* Description intro */}
            <div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed italic">
                {product.description.split('.')[0]}. {product.description.split('.')[1]}.
              </p>
            </div>

            {/* Dynamic Product Variations select grid */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Select Edition / Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variations.map((v) => {
                    const isSelected = selectedVarId === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVarId(v.id)}
                        className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E3F20] border-[#1E3F20] text-white shadow-sm'
                            : 'bg-white border-[#E5E7EB] text-neutral-600 hover:border-neutral-400 hover:text-[#1e3f20]'
                        }`}
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span>{v.name}</span>
                          <span className={`text-[9px] font-normal font-mono ${isSelected ? 'text-neutral-200' : 'text-neutral-500'}`}>
                            {v.price} • {v.size}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Purchase CTA controls */}
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] pt-6 select-none">
              <div className="flex items-center gap-3">
                
                {/* Quantity selector */}
                <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={!currentStock}
                    className="px-3 hover:bg-neutral-50 text-neutral-600 h-full flex items-center justify-center cursor-pointer bg-transparent border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-neutral-800 font-mono w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={!currentStock}
                    className="px-3 hover:bg-neutral-50 text-neutral-600 h-full flex items-center justify-center cursor-pointer bg-transparent border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!currentStock}
                  className="flex-1 bg-[#1E3F20] hover:bg-[#152e18] text-white font-bold text-xs uppercase tracking-widest rounded-lg h-12 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add To Cart
                </button>

                {/* Buy Now button */}
                <button
                  onClick={() => {
                    handleAddToCart();
                    router.push('/checkout');
                  }}
                  disabled={!currentStock}
                  className="flex-1 bg-[#C19A6B] hover:bg-[#b08757] text-white font-bold text-xs uppercase tracking-widest rounded-lg h-12 flex items-center justify-center cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-12 h-12 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors text-neutral-500 cursor-pointer bg-transparent"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500 border-none' : ''}`} />
                </button>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="border-t border-[#E5E7EB] pt-6 flex flex-col gap-2.5 text-xs text-neutral-500 select-none">
              <div>
                <span className="font-bold text-neutral-700 uppercase">SKU:</span> {skuString}
              </div>
              {product.tags && product.tags.length > 0 && (
                <div>
                  <span className="font-bold text-neutral-700 uppercase">Tags:</span> {product.tags.join(', ')}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-700 uppercase">Share:</span>
                <div className="flex items-center gap-3 text-neutral-600 ml-1">
                  <a href="#" className="hover:text-[#1E3F20] transition-colors"><Share2 className="w-4 h-4" /></a>
                  <a href="#" className="hover:text-[#1E3F20] transition-colors font-bold">f</a>
                  <a href="#" className="hover:text-[#1E3F20] transition-colors font-bold">t</a>
                  <a href="#" className="hover:text-[#1E3F20] transition-colors font-bold">p</a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ======================= TABS SECTION ======================= */}
        <div className="mt-16 md:mt-24 border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden shadow-sm">
          {/* Tabs row */}
          <div className="flex border-b border-[#E5E7EB] bg-neutral-50 select-none">
            {(['description', 'info', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs sm:text-sm uppercase tracking-widest font-extrabold cursor-pointer border-r border-[#E5E7EB] transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-[#1E3F20] border-t-2 border-t-[#1E3F20] -mt-[2px]' 
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {tab === 'description' ? 'Description' : tab === 'info' ? 'Additional Information' : 'Reviews'}
              </button>
            ))}
          </div>

          {/* Tab Content body */}
          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1E3F20] font-serif mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C19A6B]" />
                  Artistic Narrative
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed text-justify whitespace-pre-line select-text">
                  {product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <div className="mt-6 p-5 bg-[#FAF9F6] border border-[#E5E7EB] rounded-xl">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1E3F20] mb-3">Collector Details</h4>
                    <ul className="flex flex-col gap-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs font-semibold text-neutral-600">
                          <span className="text-[#C19A6B] font-bold">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="overflow-x-auto select-none">
                <table className="w-full border-collapse border border-[#E5E7EB] rounded-lg overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-[#1E3F20] text-white">
                      <th className="border border-[#E5E7EB] px-6 py-3.5 text-left font-bold uppercase tracking-wider text-xs">Attribute</th>
                      <th className="border border-[#E5E7EB] px-6 py-3.5 text-left font-bold uppercase tracking-wider text-xs">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] font-medium text-neutral-600">
                    <tr className="bg-white">
                      <td className="border border-[#E5E7EB] px-6 py-4 font-bold text-neutral-700">Dimensions</td>
                      <td className="border border-[#E5E7EB] px-6 py-4">{currentSize}</td>
                    </tr>
                    <tr className="bg-neutral-50/50">
                      <td className="border border-[#E5E7EB] px-6 py-4 font-bold text-neutral-700">Medium</td>
                      <td className="border border-[#E5E7EB] px-6 py-4">{product.medium}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-[#E5E7EB] px-6 py-4 font-bold text-neutral-700">Material</td>
                      <td className="border border-[#E5E7EB] px-6 py-4">{currentMaterial}</td>
                    </tr>
                    <tr className="bg-neutral-50/50">
                      <td className="border border-[#E5E7EB] px-6 py-4 font-bold text-neutral-700">Framing</td>
                      <td className="border border-[#E5E7EB] px-6 py-4">
                        {product.category === 'Original Art' ? 'Stretched wrapped canvas (Ready to hang)' : 'Rolled fine art canvas (Ships in a protective tube)'}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-[#E5E7EB] px-6 py-4 font-bold text-neutral-700">Delivery & Shipping</td>
                      <td className="border border-[#E5E7EB] px-6 py-4">Museum-grade bubble wrapped packaging • Insured global delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-lg font-bold text-[#1E3F20] font-serif mb-4">
                    Customer Reviews ({reviewsList.length})
                  </h3>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                    {reviewsList.map((rev, index) => (
                      <div key={index} className="p-5 border border-[#E5E7EB] bg-[#FAF9F6] rounded-xl flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-neutral-800 text-sm">{rev.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500 select-none">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 fill-current ${i < rev.rating ? 'text-amber-500' : 'text-neutral-200'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed select-text">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave a review form */}
                <div className="lg:col-span-5 p-6 border border-[#E5E7EB] bg-neutral-50 rounded-xl">
                  <h3 className="text-base font-bold text-[#1E3F20] uppercase tracking-wider mb-4">
                    Leave a Review
                  </h3>
                  
                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg animate-fade-in select-none">
                      ✓ Thank you! Your review has been added successfully.
                    </div>
                  )}

                  <form onSubmit={handleAddReview} className="space-y-4 text-xs font-semibold">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500">Your Rating</label>
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="hover:scale-115 transition-transform cursor-pointer bg-transparent border-0 p-0"
                          >
                            <Star className={`w-6 h-6 fill-current ${star <= reviewRating ? 'text-amber-500' : 'text-neutral-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="revName" className="text-neutral-500">Name *</label>
                      <input
                        id="revName"
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-neutral-800 focus:outline-[#1E3F20]"
                        placeholder="e.g. Rajesh Sharma"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="revEmail" className="text-neutral-500">Email Address *</label>
                      <input
                        id="revEmail"
                        type="email"
                        required
                        value={reviewEmail}
                        onChange={(e) => setReviewEmail(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-neutral-800 focus:outline-[#1E3F20]"
                        placeholder="e.g. rajesh@gmail.com"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="revComment" className="text-neutral-500">Review Comment *</label>
                      <textarea
                        id="revComment"
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-neutral-800 focus:outline-[#1E3F20] resize-none"
                        placeholder="Write your review here..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1E3F20] hover:bg-[#152e18] text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================= RELATED PRODUCTS SECTION ======================= */}
        <section className="mt-20 md:mt-28 border-t border-[#E5E7EB] pt-16">
          <div className="text-center mb-10 select-none">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-extrabold block mb-1">Related Products</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3F20] tracking-tight font-serif">
              Explore Related Products
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none">
            {relatedProducts.map((p) => {
              const pSalesVal = parseInt(p.price.replace(/[^\d]/g, ''), 10);
              const pMrpVal = parseInt(p.originalMrp?.replace(/[^\d]/g, '') || p.price.replace(/[^\d]/g, ''), 10);
              const pDiscountPct = pMrpVal > pSalesVal ? Math.round(((pMrpVal - pSalesVal) / pMrpVal) * 100) : 0;
              const pSlug = getCategorySlug(p.category);

              return (
                <div key={p.id} className="group flex flex-col gap-3.5 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  {/* Image panel */}
                  <Link href={`/products/${pSlug}/${p.id}`} className="block relative aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-[#E5E7EB]">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 50vw, 300px"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Discount badge */}
                    {pDiscountPct > 0 && (
                      <span className="absolute top-3 left-3 bg-[#1E3F20] text-white text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-md">
                        {pDiscountPct}% Off
                      </span>
                    )}

                    {/* Toolbar overlays */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] text-[#1E3F20] flex items-center justify-center hover:bg-[#1E3F20] hover:text-white transition-all shadow-sm cursor-pointer border-none">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>

                  {/* Metadata and Title info */}
                  <div className="px-4 pb-5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-extrabold uppercase">
                      <span>{p.category}</span>
                      <div className="flex items-center text-amber-500 font-semibold gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-neutral-700 font-mono">5.0</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${pSlug}/${p.id}`} className="hover:text-[#1E3F20] transition-colors">
                      <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[#1E3F20] line-clamp-1 font-serif">
                        {p.title}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-extrabold text-[#1E3F20] font-mono">{p.price}</span>
                      {p.originalMrp && p.originalMrp !== p.price && (
                        <span className="text-xs text-neutral-400 line-through font-mono">{p.originalMrp}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================= BADGES ROW ======================= */}
        <section className="mt-20 md:mt-24 border-t border-[#E5E7EB] pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          <div className="flex items-center gap-4 p-5 border border-[#E5E7EB] rounded-2xl bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#1E3F20]/10 flex items-center justify-center text-[#1E3F20] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wide">Free Shipping</h4>
              <p className="text-xs text-neutral-500 mt-1">Museum-grade secure wrapping and insured global delivery.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 border border-[#E5E7EB] rounded-2xl bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#1E3F20]/10 flex items-center justify-center text-[#1E3F20] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wide">Flexible Payment</h4>
              <p className="text-xs text-neutral-500 mt-1">Highly secure dynamic checkout with multiple credit, debit, or UPI options.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 border border-[#E5E7EB] rounded-2xl bg-white shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#1E3F20]/10 flex items-center justify-center text-[#1E3F20] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wide">24x7 Support</h4>
              <p className="text-xs text-neutral-500 mt-1">Direct support helpline and WhatsApp channels for all collector queries.</p>
            </div>
          </div>
        </section>

      </main>

      {/* ======================= REDESIGNED LIGHT FOOTER ======================= */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12 px-6 select-none mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <Image src="/kalakasturilogo.png" alt="KalaKasturi Logo" fill className="object-contain" />
            </div>
            <span 
              className="text-2xl tracking-wider text-[#1E3F20] select-none" 
              style={{ fontFamily: 'var(--font-allura), cursive', fontWeight: 'bold' }}
            >
              Kala Kasturi
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Link href="/collections" className="hover:text-[#1E3F20] transition-colors">All Artworks</Link>
            <Link href="/contact" className="hover:text-[#1E3F20] transition-colors">Contact Us</Link>
            <Link href="/shipping-returns" className="hover:text-[#1E3F20] transition-colors">Shipping & Returns</Link>
            <Link href="/about" className="hover:text-[#1E3F20] transition-colors">About the Artist</Link>
            <Link href="/terms" className="hover:text-[#1E3F20] transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-[#1E3F20] transition-colors">Privacy Policy</Link>
          </div>

          <div className="w-full border-t border-[#E5E7EB] pt-6 mt-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
            <p>© {new Date().getFullYear()} KalaKasturi. All rights reserved.</p>
            <p className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Museum Grade Curated Art</p>
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal Overlay with Zoom */}
      <AnimatePresence>
        {lightboxImgIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-between"
            onClick={() => setLightboxImgIndex(null)}
          >
            {/* Top Navigation / Status bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 z-50 select-none">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C19A6B] no-override">
                  {product.title}
                </h3>
                <p className="text-[10px] text-neutral-400 mt-1 font-semibold no-override">
                  Image {lightboxImgIndex + 1} of {images.length} • Move cursor to zoom
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImgIndex(null);
                }}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer text-white"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Center Area: Zoomable Image Frame with Side Arrows */}
            <div className="flex-1 flex items-center justify-between px-4 md:px-8 relative select-none">
              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImgIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
                  }}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-[#C19A6B] hover:text-black border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 z-50 cursor-pointer shadow-lg animate-fade-in"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Main Image Frame (Zoom container) */}
              <div 
                className="flex-1 h-[65vh] md:h-[75vh] max-w-4xl mx-auto relative overflow-hidden rounded-2xl border border-white/5 bg-[#050505] cursor-zoom-in"
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleLightboxMouseMove}
                onMouseLeave={handleLightboxMouseLeave}
              >
                <Image
                  src={images[lightboxImgIndex]}
                  alt={`${product.title} zoom view`}
                  fill
                  className="object-contain transition-transform duration-200 ease-out pointer-events-none"
                  style={lightboxZoomStyle}
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImgIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
                  }}
                  className="w-12 h-12 rounded-full bg-white/5 hover:bg-[#C19A6B] hover:text-black border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 z-50 cursor-pointer shadow-lg animate-fade-in"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Navigation Row */}
            {images.length > 1 && (
              <div 
                className="flex items-center justify-center gap-3 py-6 bg-black/40 border-t border-white/5 z-50 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, i) => {
                  const isActive = i === lightboxImgIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => setLightboxImgIndex(i)}
                      className={`relative w-12 h-16 rounded-lg overflow-hidden border transition-all duration-300 bg-neutral-900 ${
                        isActive 
                          ? 'border-[#C19A6B] scale-105 shadow-md' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="50px"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Shopping Cart Sliding Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={closeCart} 
        onOpenCheckout={handleOpenCheckout} 
      />

    </div>
  );
}
