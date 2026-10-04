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
    <div className="bg-[#01173C] text-[#CDEBFF] py-2 px-4 border-b border-[#0442A5]/50 overflow-hidden text-xs font-medium tracking-wider relative z-50">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
        {[...announcements, ...announcements].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 uppercase">
              <IconComponent className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>{item.text}</span>
              <span className="text-[#D4AF37]/50 ml-8">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
