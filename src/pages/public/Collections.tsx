import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, BusinessSettings } from '../../types';
import { DataService, getImageUrl } from '../../services/db';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CollectionsProps {
  settings?: BusinessSettings;
}

export const Collections: React.FC<CollectionsProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    DataService.getCategories().then((data) => setCategories(data));
  }, []);

  return (
    <div className="bg-[#F4F7FC] min-h-screen text-[#01173C] pt-12 pb-20 font-sans">
      {/* Header */}
      <div className="bg-[#01173C] text-white py-16 mb-16 border-b border-[#0442A5]/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0442A5_0%,_#01173C_85%)] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#D4AF37]">Curated Artforms</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2 mb-4">
            Indian Heritage Collections
          </h1>
          <p className="text-[#CDEBFF]/90 max-w-2xl mx-auto text-sm sm:text-base font-light">
            Explore curated categories of handcrafted Indian artwork, Pichwai medallions, framed brass reliefs, and traditional cultural sculptures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`bg-white rounded-3xl overflow-hidden border border-[#0442A5]/20 shadow-xl flex flex-col ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center`}
          >
            <div className="lg:w-1/2 aspect-[4/3] w-full overflow-hidden relative bg-[#01173C]">
              <img
                src={getImageUrl(cat.imageUrl || '/images/art_product_01.jpeg')}
                alt={cat.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="lg:w-1/2 p-8 sm:p-12 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0442A5] bg-[#0442A5]/10 px-3.5 py-1.5 rounded-full border border-[#0442A5]/20">
                Collection 0{idx + 1}
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#01173C]">
                {cat.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                {cat.description || 'Handcrafted Indian art pieces curated for fine homes and heritage spaces.'}
              </p>

              <div className="pt-4">
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center space-x-2 bg-[#0442A5] hover:bg-[#0553d1] text-white font-semibold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-colors border border-[#D4AF37]/30"
                >
                  <span>Explore {cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
