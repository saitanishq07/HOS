import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/art_product_01.jpeg',
    badge: 'ROYAL HERITAGE COLLECTION',
    subtitle: 'HANDCRAFTED ATELIER IN HYDERABAD',
    title: 'Immortalising Sacred Traditions',
    highlight: 'in Pure Gold Leaf',
    description: 'Bespoke Tanjore, Pichwai, and Traditional Indian Wall Sculptures curated for elite residences & collectors worldwide.',
    ctaText: 'View Masterpieces',
    ctaLink: '/products',
  },
  {
    id: 2,
    image: '/images/art_product_04.jpeg',
    badge: 'GALLERY EDITION',
    subtitle: 'TEMPLE ARTISTRY & BRASS RELIEF',
    title: 'Masterpieces Born of',
    highlight: 'Centuries of Mastery',
    description: 'Each creation is individually handcrafted by hereditary Indian artisans with museum-grade preservation framing.',
    ctaText: 'Explore Collection',
    ctaLink: '/collections',
  },
  {
    id: 3,
    image: '/images/art_product_08.jpeg',
    badge: 'EXCLUSIVE COMMISSIONS',
    subtitle: 'ARCHITECTURAL & PRIVATE HOMES',
    title: 'Tailored Heritage Decor',
    highlight: 'For Fine Spaces',
    description: 'Transform grand foyers, luxury estates, and corporate spaces with custom-sized architectural installations.',
    ctaText: 'Commission Artwork',
    ctaLink: '/contact',
  },
  {
    id: 4,
    image: '/images/art_product_12.jpeg',
    badge: 'CERTIFIED AUTHENTIC',
    subtitle: 'CLIENT ORDER CONCIERGE',
    title: 'Track Your Custom Order',
    highlight: 'In Real Time',
    description: 'Lookup your artisan craftsmanship status from studio inspection to insured white-glove doorstep delivery.',
    ctaText: 'Track Order',
    ctaLink: '/track-order',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full h-[85vh] min-h-[580px] bg-[#01173C] text-[#FAF7F2] overflow-hidden group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Background Images */}
      {slides.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transform transition-transform duration-[7000ms]`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
          />
          {/* Subtle Left-Side Vignette for Text Legibility without Washing Image in Blue */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#01173C]/85 via-[#01173C]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#01173C]/70 via-transparent to-black/20" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-10 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.25em] uppercase drop-shadow-md">
              {slide.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#CDEBFF] font-medium drop-shadow-md">
            {slide.subtitle}
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif leading-[1.05] tracking-tight text-white drop-shadow-lg">
            {slide.title} <br />
            <span className="italic font-normal text-[#D4AF37] drop-shadow-md">{slide.highlight}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#FAF7F2]/90 font-light leading-relaxed max-w-xl drop-shadow-md">
            {slide.description}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <Link
              to={slide.ctaLink}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-2xl border border-[#D4AF37]/60"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>

            <Link
              to="/track-order"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#01173C]/60 hover:bg-[#01173C] text-[#CDEBFF] hover:text-white text-xs uppercase tracking-[0.2em] font-medium border border-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg"
            >
              Order Tracking
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-[#0442A5] text-white/90 hover:text-white border border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm shadow-xl"
      >
        <ChevronLeft className="w-6 h-6 text-[#CDEBFF]" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-[#0442A5] text-white/90 hover:text-white border border-white/20 hover:border-[#D4AF37] transition-all duration-300 backdrop-blur-sm shadow-xl"
      >
        <ChevronRight className="w-6 h-6 text-[#CDEBFF]" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-500 ${
              idx === currentSlide
                ? 'w-10 h-1.5 bg-[#D4AF37]'
                : 'w-2.5 h-1.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
