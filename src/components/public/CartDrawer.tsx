import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/db';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();

  if (!isCartOpen) return null;

  const handleWhatsAppInquiry = () => {
    if (cart.length === 0) return;

    let message = `Namaste House of Seetah Gallery Concierge,\n\nI would like to inquire about availability, bespoke customization, and insured shipping for the following item(s):\n\n`;
    
    cart.forEach((item, index) => {
      const title = item.product.title || item.product.productName || 'Artpiece';
      const code = item.product.productCode ? ` [${item.product.productCode}]` : '';
      const price = item.product.price ? ` - ₹${item.product.price.toLocaleString('en-IN')}` : '';
      message += `${index + 1}. ${title}${code} (Qty: ${item.quantity})${price}\n`;
    });

    if (totalPrice > 0) {
      message += `\nEstimated Value: ₹${totalPrice.toLocaleString('en-IN')}`;
    }

    message += `\n\nPlease confirm availability and concierge consultation timing. Thank you.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#01173C]/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B192C] text-[#CDEBFF] border-l border-[#0442A5]/50 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#01173C] border-b border-[#0442A5]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-xl font-serif tracking-wider text-white">
                Inquiry Bag <span className="text-sm font-sans text-[#D4AF37]">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/10">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#0442A5] mx-auto" />
                <p className="font-serif text-lg text-gray-300">Your inquiry bag is empty</p>
                <p className="text-xs text-[#CDEBFF]/70 max-w-xs mx-auto">
                  Explore our curated gallery of handcrafted Indian art and select pieces for concierge consultation.
                </p>
                <div className="pt-4">
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs uppercase tracking-widest font-semibold transition border border-[#D4AF37]/40 shadow-lg"
                  >
                    Browse Collections
                  </button>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const title = item.product.title || item.product.productName || 'Artpiece';
                return (
                  <div key={item.product.id} className="pt-6 first:pt-0 flex gap-4">
                    <img
                      src={getImageUrl(item.product.imageUrl || '/images/art_product_01.jpeg')}
                      alt={title}
                      className="w-20 h-24 object-cover border border-[#0442A5]/50 bg-[#01173C]"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-base text-white line-clamp-1">{title}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-400 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.product.productCode && (
                          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mt-0.5">
                            Code: {item.product.productCode}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[#D4AF37] mt-1">
                          ₹{item.product.price?.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-white/20 text-xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-white/10 text-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-white/10 text-gray-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-[#CDEBFF]/80">
                          Total: ₹{((item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Action Buttons */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#0442A5]/40 bg-[#01173C] space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-widest text-[#CDEBFF]/80">Estimated Value</span>
                <span className="text-xl font-serif font-bold text-[#D4AF37]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <p className="text-[11px] text-[#CDEBFF]/70 leading-relaxed">
                ✦ Complimentary white-glove Pan-India delivery & artisan authentication certificate included.
              </p>

              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-xl transition duration-300"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Inquire via WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  Clear Bag
                </button>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>Continue Browsing</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
