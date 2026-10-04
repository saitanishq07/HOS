import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { initialSettings, getImageUrl } from '../../services/db';

interface FooterProps {
  settings?: BusinessSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings = initialSettings }) => {
  return (
    <footer className="bg-[#0F0E0E] text-[#E8E2D5] pt-16 pb-8 border-t border-[#C5A059]/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-white/5 p-1 border border-[#D4AF37]/60 flex items-center justify-center">
                <img
                  src={getImageUrl(settings.logoUrl)}
                  alt={settings.companyName}
                  className="max-h-full max-w-full object-contain filter brightness-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getImageUrl('logo.png');
                  }}
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#FAF7F2] tracking-widest">
                  HOUSE OF SEETAH
                </h3>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium">
                  {settings.tagline || 'Indian Art & Heritage Atelier'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Hyderabad's premier boutique atelier for sacred Tanjore & Pichwai medallions, Radha Krishna miniature paintings, framed brass reliefs, and traditional cultural wall art.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#D4AF37] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>GSTIN Registered: {settings.gstin || '36AABCH9988K1Z5'}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-[#FAF7F2] mb-4 tracking-wide border-b border-white/10 pb-2">
              Explore Atelier
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
                  <span className="text-[#D4AF37]">›</span>
                  <span>Home Showcase</span>
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
                  <span className="text-[#D4AF37]">›</span>
                  <span>Heritage Art Categories</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
                  <span className="text-[#D4AF37]">›</span>
                  <span>Full Product Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
                  <span className="text-[#D4AF37]">›</span>
                  <span>Artisanal Visual Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2 font-medium text-[#D4AF37]">
                  <span>›</span>
                  <span>Client Order Tracking Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
                  <span className="text-[#D4AF37]">›</span>
                  <span>About Atelier</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-[#FAF7F2] mb-4 tracking-wide border-b border-white/10 pb-2">
              Curated Artforms
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Pichwai & Devotional Art</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Framed Brass Nandi Reliefs</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Miniature Radha Krishna Art</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Traditional Cultural Masks</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Handcrafted Decorative Sculpture</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg text-[#FAF7F2] mb-4 tracking-wide border-b border-white/10 pb-2">
              Atelier Showroom
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed font-light">
                  {settings.address || 'Suite 402, Heritage Crafts Plaza, Jubilee Hills, Hyderabad, Telangana - 500033'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={`tel:${settings.phone || '+919876543210'}`} className="hover:text-white transition-colors">
                  {settings.phone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href={`mailto:${settings.email || 'billing@houseofseetah.com'}`} className="hover:text-white transition-colors">
                  {settings.email || 'billing@houseofseetah.com'}
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Mon - Sat: 10:00 AM - 7:30 PM (By Appointment)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} House of Seetah Private Limited. All Rights Reserved.</p>

          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-200 transition-colors cursor-pointer">Authenticity Guaranteed</span>
            <span className="hover:text-gray-200 transition-colors cursor-pointer">GST Tax Invoice Provided</span>
            <Link to="/admin/login" className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
