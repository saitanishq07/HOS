import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ShieldCheck, Search, Truck } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { initialSettings, getImageUrl } from '../../services/db';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  settings?: BusinessSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings = initialSettings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftNavLinks = [
    { name: 'Collections', path: '/collections' },
    { name: 'Product Catalog', path: '/products' },
    { name: 'Art Gallery', path: '/gallery' },
  ];

  const rightNavLinks = [
    { name: 'About Atelier', path: '/about' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Contact', path: '/contact' },
  ];

  const allNavLinks = [...leftNavLinks, ...rightNavLinks];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#01173C]/95 backdrop-blur-md border-b border-[#0442A5]/40 py-3 shadow-2xl'
          : 'bg-[#01173C] border-b border-[#0442A5]/30 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Left Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {leftNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-all relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-[#CDEBFF]/80 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Center Brand Crest & Title */}
          <Link to="/" className="flex flex-col items-center group py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 p-1 border border-[#D4AF37]/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                <img
                  src={getImageUrl(settings.logoUrl)}
                  alt={settings.companyName}
                  className="max-h-full max-w-full object-contain filter brightness-110"
                />
              </div>
              <div className="flex flex-col items-start sm:items-center">
                <span className="font-serif font-bold text-lg sm:text-2xl tracking-[0.2em] text-white group-hover:text-[#CDEBFF] transition-colors">
                  HOUSE OF SEETAH
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">
                  {settings.tagline || 'Indian Art & Heritage Atelier'}
                </span>
              </div>
            </div>
          </Link>

          {/* Right Desktop Nav & Action Icons */}
          <div className="hidden lg:flex items-center space-x-7">
            {rightNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-[0.2em] font-medium transition-all relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-[#CDEBFF]/80 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37]" />
                )}
              </Link>
            ))}

            {/* Inquiry Bag Drawer Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#CDEBFF] hover:text-[#D4AF37] transition-colors"
              aria-label="Open Inquiry Bag"
              title="Inquiry Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0442A5] text-white border border-[#D4AF37] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Link */}
            <Link
              to="/admin/login"
              className="p-2 text-[#CDEBFF]/60 hover:text-[#D4AF37] transition-colors"
              title="Private Admin System"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Right Bar */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-[#D4AF37]"
              aria-label="Open Inquiry Bag"
            >
              <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0442A5] text-white border border-[#D4AF37] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7 text-[#D4AF37]" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#01173C] border-b border-[#0442A5]/40 px-6 py-6 transition-all">
          <div className="flex flex-col space-y-4">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-widest font-medium py-2 border-b border-white/10 ${
                  isActive(link.path) ? 'text-[#D4AF37] font-semibold' : 'text-[#CDEBFF]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 flex flex-col space-y-3">
              <Link
                to="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#0442A5] text-white py-3 font-semibold text-xs uppercase tracking-wider border border-[#D4AF37]/40 shadow-lg"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Order Status</span>
              </Link>

              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-white/20 text-[#CDEBFF] py-2.5 font-semibold text-xs uppercase tracking-wider"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Admin & Billing System</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
