import React, { useState } from 'react';
import { Sliders, Save, Sparkles, Globe, Image as ImageIcon, Check } from 'lucide-react';

export const ContentManager: React.FC = () => {
  const [heroHeading, setHeroHeading] = useState('Where Royal Heritage Meets Timeless Indian Artistry');
  const [heroSubtext, setHeroSubtext] = useState('Curating authentic hand-painted Pichwais, relief brassware, traditional masks, and imperial miniature masterworks for discerning art collectors worldwide.');
  const [noticeBanner, setNoticeBanner] = useState('Exclusive Heritage Exhibition & Private Art Concierge Appointments Now Open in Jubilee Hills, Hyderabad');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#0442A5]" />
            <span>Public Website CMS Manager</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update customer-facing announcements, editorial text, and homepage banners in real time.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg flex items-center space-x-2 transition-all"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Changes Published!' : 'Publish Website Updates'}</span>
        </button>
      </div>

      {/* Main CMS Card */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Top Announcement Notice Bar
          </label>
          <input
            type="text"
            value={noticeBanner}
            onChange={(e) => setNoticeBanner(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Homepage Hero Editorial Title
          </label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white font-serif text-base"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Homepage Subtitle / Story Intro
          </label>
          <textarea
            rows={3}
            value={heroSubtext}
            onChange={(e) => setHeroSubtext(e.target.value)}
            className="w-full p-3 bg-[#0D1117] border border-neutral-700 rounded-xl text-xs text-white"
          />
        </div>
      </div>
    </form>
  );
};
