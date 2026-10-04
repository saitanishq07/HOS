import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, BusinessSettings } from '../../types';
import { DataService, initialSettings, getImageUrl } from '../../services/db';
import { Search, Filter, Sparkles, ArrowRight, Eye, PackageX, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductsProps {
  settings?: BusinessSettings;
}

export const Products: React.FC<ProductsProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    DataService.getProducts().then((data) => {
      setProducts(data);
      const uniqueCats = Array.from(new Set(data.map((p) => p.category)));
      setCategories(['All', ...uniqueCats]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  let filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const nameStr = (product.title || product.productName || '').toLowerCase();
    const codeStr = (product.productCode || '').toLowerCase();
    const descStr = (product.description || '').toLowerCase();
    const matchesSearch =
      nameStr.includes(searchQuery.toLowerCase()) ||
      codeStr.includes(searchQuery.toLowerCase()) ||
      descStr.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => (a.title || a.productName || '').localeCompare(b.title || b.productName || ''));
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#01173C] pt-6 pb-24 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white text-slate-900 py-16 mb-12 border-b border-[#D4AF37]/30 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">ARTISAN ARCHIVAL CATALOG</span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#01173C]">
            Indian Art & Handicraft Masterpieces
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-light">
            Explore authentic Tanjore & Pichwai medallions, framed brass reliefs, tribal masks, and court miniature paintings handcrafted by master Indian artisans.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter & Search Bar */}
        <div className="bg-white border border-[#D4AF37]/30 p-4 sm:p-6 shadow-md mb-10 flex flex-col md:flex-row gap-4 items-center justify-between rounded-lg">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, category, code, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-slate-300 text-xs text-[#01173C] font-medium focus:outline-none focus:border-[#D4AF37] rounded"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#FAF8F5] border border-slate-300 text-xs font-semibold text-[#01173C] focus:outline-none focus:border-[#D4AF37] rounded"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Artwork Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-6 mb-8 custom-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchParams(category === 'All' ? {} : { category });
              }}
              className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 rounded ${
                selectedCategory === category
                  ? 'bg-[#01173C] text-white border border-[#D4AF37] font-bold shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 border border-slate-200 space-y-4">
                <div className="aspect-[4/3] animate-shimmer" />
                <div className="h-4 w-1/3 animate-shimmer" />
                <div className="h-6 w-3/4 animate-shimmer" />
                <div className="h-10 w-full animate-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const title = product.title || product.productName || 'Artpiece';
              return (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden border border-[#D4AF37]/30 shadow-md hover:shadow-xl transition-all duration-500 group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#01173C] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif font-bold text-xl text-[#01173C] line-clamp-1 group-hover:text-[#0442A5] transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-600 font-light mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">Acquisition Value</span>
                      <span className="font-serif font-bold text-xl text-[#01173C]">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2.5 bg-[#01173C] hover:bg-[#082659] text-white transition border border-[#D4AF37]/40 shadow-sm"
                        title="Add to Inquiry Bag"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                      </button>

                      <Link
                        to={`/products/${product.id}`}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#01173C] font-bold text-xs uppercase tracking-wider flex items-center gap-1 border border-slate-200"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-16 text-center shadow-xl max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-slate-100 text-[#01173C] mx-auto flex items-center justify-center mb-4 rounded-full">
              <PackageX className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#01173C] mb-2">No Matching Masterpieces Found</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We are continuously curating new authentic artworks from master Indian artisans. Try clearing your search filter or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSearchParams({});
              }}
              className="px-6 py-3 bg-[#01173C] text-white text-xs font-semibold uppercase tracking-widest border border-[#D4AF37]/40 shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
