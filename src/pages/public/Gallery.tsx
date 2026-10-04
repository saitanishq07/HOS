import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Eye, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { getImageUrl } from '../../services/db';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  price: number;
}

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Pichwai Art',
    'Brass Relief',
    'Folk Masks',
    'Miniatures',
    'Cultural Decor'
  ];

  // Map all 45 client images into high-resolution gallery collection items
  const galleryItems: GalleryItem[] = Array.from({ length: 45 }, (_, idx) => {
    const num = idx + 1;
    const numStr = num < 10 ? `0${num}` : `${num}`;
    const catMap = [
      'Pichwai Art',
      'Brass Relief',
      'Folk Masks',
      'Miniatures',
      'Cultural Decor'
    ];
    const catIndex = idx % 5;
    return {
      id: `art-${numStr}`,
      title: idx === 0 ? 'Srinathji Pichwai Art Circular Medallion' :
             idx === 5 ? 'Framed Brass Nandi Relief on Golden Silk' :
             idx === 4 ? 'Radha Krishna Eternal Devotion Medallion' :
             idx === 7 ? 'Traditional Folk Art Ritual Mask Wall Hanging' :
             `Heritage Masterpiece Exhibit #${numStr}`,
      category: catMap[catIndex],
      imageUrl: `/images/art_product_${numStr}.jpeg`,
      description: `Authentic traditional Indian artwork piece #${numStr} from the House of Seetah archive in Jubilee Hills, Hyderabad.`,
      price: 12000 + (num * 350)
    };
  });

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 pt-6 pb-24 font-sans">
      {/* Editorial Header */}
      <div className="bg-white text-slate-900 py-16 mb-12 border-b border-[#D4AF37]/30 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Visual Archival Exhibition</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#01173C] mt-2 mb-4">
            House of Seetah Art Gallery
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-light">
            Exhibition showcasing all 45 handcrafted Indian art pieces, circular Pichwai medallions, carved brass reliefs, and folk masks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-6 mb-10 custom-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#01173C] text-white shadow-md font-bold border border-[#D4AF37] scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MASONRY GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[4/5] bg-[#F5F0E6] overflow-hidden relative">
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1">
                    <Eye className="w-4 h-4 text-[#D4AF37]" /> Inspect Artwork
                  </span>
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif-luxury font-bold text-base text-neutral-900 line-clamp-1 group-hover:text-[#0442A5] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-neutral-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white relative shadow-2xl space-y-6">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/50 border border-neutral-800">
              <img src={getImageUrl(activeItem.imageUrl)} alt={activeItem.title} className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800 pt-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">{activeItem.category}</span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white mt-1">{activeItem.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">{activeItem.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-neutral-400 block">Acquisition Value</span>
                <span className="font-serif-luxury text-2xl font-bold text-[#CDEBFF]">
                  ₹{activeItem.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Link
                to={`/products/${activeItem.id}`}
                className="px-6 py-3 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
