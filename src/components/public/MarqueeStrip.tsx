import React from 'react';

interface MarqueeStripProps {
  dark?: boolean;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({ dark = true }) => {
  const items = [
    '24K Pure Gold Leaf Work',
    'Hereditary Artisan Guild',
    'Museum-Grade Conservation Framing',
    'Certified Authenticity Guaranteed',
    'Bespoke Private Commissions',
    'Pan-India & Global White-Glove Shipping',
    'Handcrafted Indian Temple Art',
  ];

  return (
    <div
      className="py-4 overflow-hidden border-y border-[#D4AF37]/30 text-xs sm:text-sm font-serif tracking-[0.25em] uppercase select-none bg-[#FAF8F5] text-slate-800 font-semibold shadow-sm"
    >
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="inline-flex items-center gap-12">
            <span>{text}</span>
            <span className="text-xs text-[#D4AF37]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
