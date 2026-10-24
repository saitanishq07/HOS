import React, { useState, useEffect } from 'react';
import { dbService, getImageUrl } from '../../services/db';
import { Product, Category } from '../../types';
import { Package, Plus, Search, Edit3, Trash2, Image as ImageIcon, Sparkles, X, Check } from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadCatalogData();
  }, []);

  const loadCatalogData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        dbService.getProducts(),
        dbService.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading product catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      title: '',
      categoryId: categories[0]?.id || 'pichwai',
      categoryName: categories[0]?.name || 'Pichwai & Traditional Art',
      price: 15000,
      hsnCode: '9701',
      description: '',
      dimensions: '24 x 36 Inches',
      medium: 'Natural Pigments on Cotton Fabric',
      artworkEra: 'Contemporary Revival',
      inStock: true,
      featured: true,
      imageUrl: '/images/art_product_01.jpeg',
      galleryImages: ['/images/art_product_01.jpeg']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;

    try {
      if (editingProduct.id) {
        await dbService.saveProduct(editingProduct as Product);
      } else {
        await dbService.saveProduct({
          ...editingProduct,
          id: `art-${Date.now()}`
        } as Product);
      }
      setIsModalOpen(false);
      loadCatalogData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const filteredProducts = products.filter(p => {
    const titleStr = (p.title || p.productName || '').toLowerCase();
    const descStr = (p.description || '').toLowerCase();
    const matchesSearch = titleStr.includes(searchTerm.toLowerCase()) || descStr.includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#0442A5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 tracking-wide flex items-center gap-2">
            <Package className="w-6 h-6 text-[#0442A5]" />
            <span>Product & Artwork Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all 45 actual client photographs, details, prices, and stock statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white text-xs font-semibold shadow-xs flex items-center space-x-2 transition-all transform hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Artwork</span>
        </button>
      </div>

      {/* Search & Categories Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog items by name, style, or medium..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCat('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCat === 'ALL'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCat === c.id
                  ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden group shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                <img
                  src={getImageUrl(prod.imageUrl)}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-semibold rounded-md shadow-xs border ${
                  prod.inStock ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' : 'bg-amber-50 text-amber-800 border-amber-200/80'
                }`}>
                  {prod.inStock ? 'In Stock' : 'Made to Order'}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                  {prod.categoryName}
                </span>
                <h3 className="font-serif text-sm font-bold text-slate-900 line-clamp-1">{prod.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">HSN: {prod.hsnCode}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(prod)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 text-xs font-medium transition-colors border border-slate-200/60 flex items-center justify-center space-x-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Artwork Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSaveProduct} className="bg-white border border-slate-200/90 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl my-8 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {editingProduct.id ? 'Edit Artwork' : 'Add New Heritage Piece'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category *</label>
                <select
                  value={editingProduct.categoryId || ''}
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === e.target.value);
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: e.target.value,
                      categoryName: cat?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={editingProduct.price || 0}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Primary Image Path *</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="/images/art_product_01.jpeg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Dimensions</label>
                <input
                  type="text"
                  value={editingProduct.dimensions || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Medium / Material</label>
                <input
                  type="text"
                  value={editingProduct.medium || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, medium: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 font-medium mb-1">Art Description</label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.inStock || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0442A5]"
                />
                <span>In Stock & Ready for Dispatch</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.featured || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0442A5]"
                />
                <span>Feature on Home Showcase</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0442A5] hover:bg-[#033585] text-white rounded-xl text-xs font-medium shadow-xs transition-all"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
