import React, { useState, useEffect } from 'react';
import { BusinessSettings } from '../../types';
import { DataService, initialSettings, getImageUrl } from '../../services/db';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

interface AboutProps {
  settings?: BusinessSettings;
}

export const About: React.FC<AboutProps> = () => {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);

  useEffect(() => {
    DataService.getSettings().then(setSettings);
  }, []);

  const aboutText = settings.aboutText || "Hyderabad's premier atelier dedicated to preserving Indian heritage artwork, hand-painted Pichwai medallions, and framed brass reliefs.";

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1A1816] pt-28 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-[#01173C] text-white py-16 mb-16 border-b border-[#0442A5]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0442A5_0%,_#01173C_85%)] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Atelier Heritage</span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2 mb-4">
            About House of Seetah
          </h1>
          <p className="text-[#CDEBFF]/90 max-w-2xl mx-auto text-sm sm:text-base font-light">
            {aboutText}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* EDITORIAL STORY SPREAD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 shadow-2xl">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#C85A32]">Proven Atelier Craftsmanship</span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
              Curating Fine Indian Artistry for Luxury Interiors
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base font-light leading-relaxed">
              Founded in Hyderabad, House of Seetah serves art collectors, interior architects, and heritage enthusiasts. We specialize in circular hand-painted Pichwai medallions depicting Srinathji and Vrindavan devotion, framed solid brass Nandi reliefs on golden brocade silk, and authentic folk ritual masks.
            </p>
            <p className="text-neutral-600 text-sm font-light leading-relaxed">
              Every creation in our Jubilee Hills gallery is executed by master artisan families who have preserved ancient painting and metal casting techniques for generations.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
              <img src={getImageUrl('/images/art_product_01.jpeg')} alt="Pichwai Art" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-md mt-6">
              <img src={getImageUrl('/images/art_product_06.jpeg')} alt="Brass Nandi Relief" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 4 PILLARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Master Provenance',
              desc: 'Direct sourcing from hereditary artisan families across Rajasthan and Telangana.',
              icon: Award
            },
            {
              title: 'Natural Mineral Colors',
              desc: 'Organic lapis lazuli, malachite, and 24K gold foil leaf application.',
              icon: Sparkles
            },
            {
              title: 'Verified GST Atelier',
              desc: 'Full tax compliance with verified GSTIN: 36AABCH9988K1Z5.',
              icon: ShieldCheck
            },
            {
              title: 'Jubilee Hills Gallery',
              desc: 'Private art concierge appointments & custom architectural commissions.',
              icon: Building2
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-gallery space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0442A5]/10 text-[#0442A5] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury font-bold text-xl text-neutral-900">{pillar.title}</h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
