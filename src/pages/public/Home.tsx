import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Award, MessageSquare, Eye, Phone, MapPin, X, Truck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Product, BusinessSettings } from '../../types';
import { DataService, initialSettings, getImageUrl } from '../../services/db';
import { HeroSlider } from '../../components/public/HeroSlider';
import { MarqueeStrip } from '../../components/public/MarqueeStrip';
import { useCart } from '../../context/CartContext';

interface HomeProps {
  settings?: BusinessSettings;
}

export const Home: React.FC<HomeProps> = () => {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    DataService.getSettings().then(setSettings);
    DataService.getProducts().then((products) => {
      setFeaturedProducts(products.slice(0, 8));
    });
  }, []);

  return (
    <div className="bg-[#F4F7FC] text-[#01173C] font-sans overflow-x-hidden">
      
      {/* 1. HERO SLIDER */}
      <HeroSlider />

      {/* 2. EDITORIAL MARQUEE STRIP */}
      <MarqueeStrip dark={true} />

      {/* 3. ASYMMETRICAL EDITORIAL FEATURE — MASTERPIECE SPOTLIGHT */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#01173C] text-[#FAF7F2] border border-[#0442A5]/50 p-8 sm:p-12 lg:p-16 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0442A5]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Large Artwork Showcase */}
          <div className="lg:col-span-7 relative group">
            <div className="aspect-[4/5] overflow-hidden bg-[#0A162B] border border-[#D4AF37]/50 shadow-2xl relative">
              <img
                src={getImageUrl('/images/art_product_01.jpeg')}
                alt="Srinathji Pichwai Art Medallion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0442A5] text-white border border-[#D4AF37]/50 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg">
                Atelier Masterpiece Highlight
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-[0.25em]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Rajasthan Pichwai Guild</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              Srinathji Sacred Devotional Art Medallion
            </h2>

            <p className="text-[#CDEBFF]/85 text-sm sm:text-base leading-relaxed font-light">
              Hand-gilded in pure 24K gold leaf by hereditary Nathdwara master painters. Rendered with organic stone pigments extracted from lapis lazuli and malachite, framed in museum-grade protective glass and antique brocade silk.
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
              <div>
                <p className="text-[#D4AF37] font-semibold uppercase tracking-wider">Medium</p>
                <p className="font-medium text-white mt-0.5">24K Gold Foil & Natural Dyes</p>
              </div>
              <div>
                <p className="text-[#D4AF37] font-semibold uppercase tracking-wider">Provenance</p>
                <p className="font-medium text-white mt-0.5">Nathdwara Guild Heritage</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-xs text-[#CDEBFF]/70 uppercase font-semibold">Framed Acquisition Value</p>
                <p className="text-2xl font-serif font-bold text-[#D4AF37]">
                  ₹185,000 <span className="text-xs text-[#CDEBFF]/70 font-sans font-normal">(Incl. Tax & Insured Shipping)</span>
                </p>
              </div>

              <button
                onClick={() => {
                  if (featuredProducts.length > 0) {
                    addToCart(featuredProducts[0]);
                  } else {
                    openCart();
                  }
                }}
                className="px-6 py-4 bg-gradient-to-r from-[#0442A5] via-[#0553d1] to-[#022A6B] hover:from-[#0553d1] hover:to-[#0442A5] text-white text-xs font-semibold uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition-all border border-[#D4AF37]/40"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Inquiry Bag</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED ARTFORMS CATEGORIES */}
      <section className="py-20 bg-[#0B192C] text-[#FAF7F2] border-y border-[#0442A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">CURATED ARTFORMS</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Explore Our Heritage Collections
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Pichwai & Devotional Art",
                desc: "Hand-painted sacred Pichwai medallions with 24K gold leaf detailing.",
                image: "/images/art_product_01.jpeg",
                link: "/products?category=Pichwai+%26+Traditional+Art"
              },
              {
                title: "Brassware & Relief Frames",
                desc: "Hand-carved brass Nandi reliefs & idols on silk brocade.",
                image: "/images/art_product_06.jpeg",
                link: "/products?category=Brassware+%26+Relief+Frames"
              },
              {
                title: "Traditional Masks & Sculptures",
                desc: "Folk-inspired cultural masks & ritual decorative hangings.",
                image: "/images/art_product_08.jpeg",
                link: "/products?category=Traditional+Masks+%26+Sculptures"
              },
              {
                title: "Miniature Paintings & Wall Art",
                desc: "Court miniatures & hand-painted Radha Krishna masterworks.",
                image: "/images/art_product_05.jpeg",
                link: "/products?category=Miniature+Paintings+%26+Wall+Art"
              },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="bg-[#01173C] overflow-hidden border border-[#0442A5]/40 hover:border-[#D4AF37]/60 shadow-2xl transition-all duration-500 group flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-black/40 overflow-hidden relative">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#01173C] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold text-xl text-white mb-2 group-hover:text-[#CDEBFF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#CDEBFF]/75 font-light leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Discover Collection <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENT ORDER TRACKING PROMOTIONAL BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0442A5] text-white p-8 sm:p-12 border border-[#D4AF37]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/30 text-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase border border-[#D4AF37]/30">
              <Truck className="w-3.5 h-3.5" />
              <span>Real-Time Craftsmanship Tracking</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold">
              Track Your Commissioned Masterpiece
            </h3>
            <p className="text-xs sm:text-sm text-[#CDEBFF] font-light leading-relaxed">
              Already have an order or invoice with House of Seetah? Inspect studio craftsmanship verification, insured transit status, and doorstep delivery timing.
            </p>
          </div>

          <Link
            to="/track-order"
            className="px-8 py-4 bg-[#01173C] hover:bg-[#081730] text-[#D4AF37] font-semibold text-xs uppercase tracking-[0.2em] border border-[#D4AF37] shadow-xl shrink-0 transition duration-300"
          >
            Launch Order Tracker
          </Link>
        </div>
      </section>

      {/* 6. ARTISAN HERITAGE STORY & JUBILEE HILLS ATELIER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#0442A5]">ATELIER PROVENANCE</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#01173C] leading-tight">
              Preserving Centuries of Indian Artistry in Jubilee Hills, Hyderabad
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-light">
              Located in Jubilee Hills, House of Seetah operates as both an art atelier and private gallery. Every piece in our collection is hand-selected directly from master artisan families across Nathdwara, Jaipur, Tanjore, and Telangana.
            </p>
            
            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-start space-x-3 p-4 bg-white border border-[#0442A5]/20 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0442A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#01173C]">Authentic Organic Materials</p>
                  <p className="text-slate-600 mt-0.5">Natural stone dyes, squirrel-hair fine brushes, 24K gold foil leaf, and solid brass casting.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-white border border-[#0442A5]/20 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0442A5] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#01173C]">Custom Architectural Commissions</p>
                  <p className="text-slate-600 mt-0.5">Bespoke dimensions, custom silk backdrops, and dedicated interior architect concierge consultation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden shadow-2xl border border-[#0442A5]/30 bg-[#01173C]">
              <img src={getImageUrl('/images/art_product_07.jpeg')} alt="Kamadhenu Frame" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] overflow-hidden shadow-2xl border border-[#0442A5]/30 bg-[#01173C] mt-8">
              <img src={getImageUrl('/images/art_product_12.jpeg')} alt="Brass Seetah Figurine" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED CATALOG GRID WITH INQUIRY BAG & LIGHTBOX MODAL */}
      <section className="py-20 bg-white border-t border-[#0442A5]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#0442A5]">CURATED MASTERPIECES</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#01173C] mt-1">
                Featured Artwork Showcase
              </h2>
            </div>

            <Link
              to="/products"
              className="text-xs uppercase tracking-widest font-semibold text-[#0442A5] hover:underline flex items-center gap-1"
            >
              View Full Catalog ({featuredProducts.length}+) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => {
              const title = prod.title || prod.productName || 'Artpiece';
              return (
                <div
                  key={prod.id}
                  className="bg-[#F4F7FC] overflow-hidden border border-[#0442A5]/20 shadow-md hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-[#01173C] overflow-hidden relative">
                      <img
                        src={getImageUrl(prod.imageUrl)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="absolute bottom-3 right-3 p-2 bg-[#01173C]/90 text-[#CDEBFF] hover:text-[#D4AF37] border border-[#0442A5]/40"
                        title="Inspect Artwork"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#0442A5]">
                        {prod.categoryName || prod.category}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#01173C] mt-1 line-clamp-1">{title}</h3>
                      <p className="text-xs text-slate-600 font-light mt-1.5 line-clamp-2">{prod.description}</p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#0442A5]/10">
                    <span className="font-serif font-bold text-base text-[#0442A5]">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => addToCart(prod)}
                      className="px-3.5 py-2 bg-[#0442A5] hover:bg-[#0553d1] text-white text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1.5 border border-[#D4AF37]/40 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#01173C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] text-white border border-[#0442A5]/50 max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-[4/3] overflow-hidden bg-[#01173C] border border-white/10">
              <img src={getImageUrl(selectedProduct.imageUrl)} alt={selectedProduct.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">{selectedProduct.category}</span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">{selectedProduct.title || selectedProduct.productName}</h3>
              <p className="text-xs text-[#CDEBFF]/80 mt-2">{selectedProduct.description}</p>
              <p className="text-xl font-bold text-[#D4AF37] mt-3">₹{selectedProduct.price?.toLocaleString('en-IN')}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-6 py-3 bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-[#D4AF37]/40 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Inquiry Bag</span>
              </button>

              <Link
                to={`/products/${selectedProduct.id}`}
                className="text-xs text-[#CDEBFF] hover:text-white uppercase tracking-wider"
              >
                View Full Specifications
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
