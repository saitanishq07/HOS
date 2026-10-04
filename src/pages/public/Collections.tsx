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
    <div className="bg-[#FAF8F5] min-h-screen text-[#01173C] pt-6 pb-20 font-sans">
      {/* Header */}
      <div className="bg-white text-slate-900 py-16 mb-16 border-b border-[#D4AF37]/30 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Curated Artforms</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#01173C] mt-2 mb-4">
            Indian Heritage Collections
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-light">
            Explore curated categories of handcrafted Indian artwork, Pichwai medallions, framed brass reliefs, and traditional cultural sculptures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`bg-white rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-xl flex flex-col ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-center`}
          >
            <div className="lg:w-1/2 aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
              <img
                src={getImageUrl(cat.imageUrl || '/images/art_product_01.jpeg')}
                alt={cat.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="lg:w-1/2 p-8 sm:p-12 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#01173C] bg-slate-100 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40">
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
                  className="inline-flex items-center space-x-2 bg-[#01173C] hover:bg-[#082659] text-white font-semibold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-colors border border-[#D4AF37]/40"
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
