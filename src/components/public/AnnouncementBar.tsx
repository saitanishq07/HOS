import React from 'react';
import { Sparkles, Phone, ShieldCheck, MapPin } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const announcements = [
    { icon: Sparkles, text: 'Complimentary Insured White-Glove Pan-India Delivery' },
    { icon: ShieldCheck, text: 'Artisan Certificate of Authenticity Included with Every Masterpiece' },
    { icon: MapPin, text: 'Private Gallery Visits by Appointment: Jubilee Hills, Hyderabad' },
    { icon: Phone, text: 'Curator & Bespoke Art Concierge: +91 98765 43210' },
  ];

  return (
    <div className="bg-[#FAF8F5] text-slate-800 py-2 px-4 border-b border-[#D4AF37]/30 overflow-hidden text-[11px] font-medium tracking-widest relative z-50 shadow-sm">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
        {[...announcements, ...announcements].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 uppercase font-semibold text-slate-800">
              <IconComponent className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>{item.text}</span>
              <span className="text-[#D4AF37] ml-8">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
