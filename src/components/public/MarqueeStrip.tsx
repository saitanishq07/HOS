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
      className={`py-4 overflow-hidden border-y border-[#0442A5]/40 text-xs sm:text-sm font-serif tracking-[0.25em] uppercase select-none ${
        dark ? 'bg-[#01173C] text-[#CDEBFF]' : 'bg-[#F4F7FC] text-[#01173C]'
      }`}
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
