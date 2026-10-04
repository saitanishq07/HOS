import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, BusinessSettings } from '../../types';
import { DataService, initialSettings } from '../../services/db';
import { MessageSquare, ArrowLeft, ShieldCheck, CheckCircle2, Send, Eye, Award, Truck, Sparkles, Phone, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductDetailProps {
  settings?: BusinessSettings;
}

export const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  // Enquiry Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    DataService.getSettings().then(setSettings);
    if (id) {
      DataService.getProductById(id).then((foundProduct) => {
        if (foundProduct) {
          setProduct(foundProduct);
          DataService.getProducts().then((allProducts) => {
            const related = allProducts.filter(
              (p) => p.category === foundProduct.category && p.id !== foundProduct.id
            );
            setRelatedProducts(related.slice(0, 3));
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    await DataService.saveEnquiry({
      customerName: enquiryForm.name,
      phone: enquiryForm.phone,
      customerPhone: enquiryForm.phone,
      email: enquiryForm.email,
      customerEmail: enquiryForm.email,
      productName: product.title || product.productName,
      productTitle: product.title || product.productName,
      productCode: product.productCode || product.id,
      message: enquiryForm.message || `Inquiry regarding ${product.title || product.productName}.`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New',
    });

    setEnquirySubmitted(true);
    setTimeout(() => {
      setIsEnquiryModalOpen(false);
      setEnquirySubmitted(false);
      setEnquiryForm({ name: '', phone: '', email: '', message: '' });
    }, 2500);
  };

  const images = product
    ? [product.imageUrl, ...(product.galleryImages || [])].filter(Boolean)
    : [];

  const whatsappMessage = product
    ? `Hello House of Seetah,\n\nI am interested in acquiring the following artwork:\n*Artwork:* ${product.title || product.productName}\n*Code:* ${product.productCode || product.id}\n*Price:* ₹${product.price.toLocaleString('en-IN')}\n\nPlease share delivery lead times & custom mounting options.`
    : '';

  if (loading) {
    return (
      <div className="bg-[#F4F7FC] min-h-screen pt-32 pb-24 font-sans max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] rounded-3xl animate-shimmer" />
          <div className="space-y-6">
            <div className="h-6 w-1/4 rounded animate-shimmer" />
            <div className="h-10 w-3/4 rounded animate-shimmer" />
            <div className="h-24 w-full rounded animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F4F7FC] min-h-screen text-[#01173C] pt-32 pb-24 font-sans text-center">
        <div className="max-w-md mx-auto p-12 bg-white rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="font-serif text-3xl font-bold mb-2">Artwork Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">The requested heritage artwork could not be located in our atelier catalog.</p>
          <Link to="/products" className="px-6 py-3 rounded-xl bg-[#0442A5] text-white text-xs font-bold uppercase tracking-wider">
            Return to Product Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FC] min-h-screen text-[#01173C] pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-[#0442A5] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection Catalog</span>
        </Link>

        {/* MAIN PRODUCT DISPLAY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-[#0442A5]/20 p-6 sm:p-10 shadow-2xl">
          
          {/* LEFT: Product Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-[#01173C] border border-[#0442A5]/30 relative group shadow-md">
              <img
                src={images[activeImageIndex] || product.imageUrl}
                alt={product.title || product.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#01173C] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-widest shadow-md">
                {product.category}
              </span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#0442A5] shadow-md scale-105' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs & Concierge Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#0442A5]">
                Archival Code: {product.productCode || product.id}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#01173C] mt-1 leading-tight">
                {product.title || product.productName}
              </h1>
            </div>

            {/* Price Banner */}
            <div className="p-4 bg-[#F4F7FC] border border-[#0442A5]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 block">Acquisition Value</span>
                <span className="font-serif font-bold text-3xl text-[#0442A5]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <span className={`px-3 py-1 text-xs font-bold ${
                product.inStock !== false ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}>
                {product.inStock !== false ? 'Available in Atelier' : 'Made to Order'}
              </span>
            </div>

            <p className="text-slate-700 text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Matrix */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200 text-xs">
              <div className="p-3 bg-[#F4F7FC]">
                <span className="text-slate-500 font-semibold block">Dimensions</span>
                <span className="font-bold text-[#01173C] mt-0.5 block">{product.dimensions || '24 x 36 Inches'}</span>
              </div>
              <div className="p-3 bg-[#F4F7FC]">
                <span className="text-slate-500 font-semibold block">Medium / Material</span>
                <span className="font-bold text-[#01173C] mt-0.5 block">{product.medium || 'Natural Mineral Dyes'}</span>
              </div>
              <div className="p-3 bg-[#F4F7FC]">
                <span className="text-slate-500 font-semibold block">HSN/SAC Code</span>
                <span className="font-bold text-[#01173C] mt-0.5 block font-mono">{product.hsnCode || '9701'}</span>
              </div>
              <div className="p-3 bg-[#F4F7FC]">
                <span className="text-slate-500 font-semibold block">Provenance</span>
                <span className="font-bold text-[#01173C] mt-0.5 block">Indian Heritage Guild</span>
              </div>
            </div>

            {/* Concierge Action CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                className="w-full py-4 bg-[#0442A5] hover:bg-[#0553d1] text-white font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition-all border border-[#D4AF37]/40"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Inquiry Bag</span>
              </button>

              <a
                href={`https://wa.me/${(settings.phone || '+91 98765 43210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Inquire via WhatsApp</span>
              </a>

              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full py-3.5 bg-white border border-slate-300 text-slate-800 font-semibold text-xs uppercase tracking-widest hover:border-[#0442A5] flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4 text-[#0442A5]" />
                <span>Send Direct Inquiry Form</span>
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Certificate of Provenance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#0442A5]" />
                <span>Insured Wooden Crate Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED HERITAGE MASTERWORKS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl font-bold text-[#01173C] mb-8">
              More Works from this Collection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.id}`}
                  className="bg-white border border-[#0442A5]/20 shadow-md hover:shadow-xl transition-all group overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-[#01173C] overflow-hidden">
                    <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-[#01173C] line-clamp-1 group-hover:text-[#0442A5] transition-colors">
                      {rel.title || rel.productName}
                    </h3>
                    <p className="font-serif font-bold text-[#0442A5] text-base mt-1">₹{rel.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DIRECT INQUIRY FORM MODAL */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#01173C]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#0442A5]/40 max-w-lg w-full p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0442A5]">Concierge Enquiry</span>
                <h3 className="font-serif text-2xl font-bold text-[#01173C] mt-0.5">
                  Inquire About This Artwork
                </h3>
              </div>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {enquirySubmitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#01173C]">Enquiry Received</h4>
                <p className="text-xs text-slate-500">Our art curator will reach out to you shortly via phone or WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FC] border border-slate-300 text-[#01173C] focus:border-[#0442A5]"
                    placeholder="e.g. Smt. Gayatri Devi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F4F7FC] border border-slate-300 text-[#01173C] focus:border-[#0442A5]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F4F7FC] border border-slate-300 text-[#01173C] focus:border-[#0442A5]"
                      placeholder="client@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message / Specific Requirements</label>
                  <textarea
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full p-3 bg-[#F4F7FC] border border-slate-300 text-[#01173C] focus:border-[#0442A5]"
                    placeholder="Please let us know if you require custom sizing or framing..."
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsEnquiryModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0442A5] text-white font-bold uppercase tracking-wider shadow-md border border-[#D4AF37]/40"
                  >
                    Submit Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
