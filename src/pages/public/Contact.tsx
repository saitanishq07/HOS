import React, { useState, useEffect } from 'react';
import { BusinessSettings, Enquiry } from '../../types';
import { DataService, initialSettings } from '../../services/db';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ContactProps {
  settings?: BusinessSettings;
}

export const Contact: React.FC<ContactProps> = () => {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    artCategory: 'Pichwai & Traditional Art',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    DataService.getSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.saveEnquiry({
      customerName: formData.name,
      phone: formData.phone,
      customerPhone: formData.phone,
      email: formData.email,
      customerEmail: formData.email,
      productName: formData.artCategory,
      productTitle: formData.artCategory,
      message: formData.message,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'New',
    });

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', artCategory: 'Pichwai & Traditional Art', message: '' });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1A1816] pt-28 pb-24 font-sans">
      {/* Header Banner */}
      <div className="bg-[#01173C] text-white py-16 mb-16 border-b border-[#0442A5]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0442A5_0%,_#01173C_85%)] opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Concierge Appointments</span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight text-white mt-2 mb-4">
            Contact House of Seetah
          </h1>
          <p className="text-[#CDEBFF]/90 max-w-2xl mx-auto text-sm sm:text-base font-light">
            Visit our Jubilee Hills gallery atelier in Hyderabad or schedule a private art consultation for custom interior commissions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Contact & Atelier Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-2xl space-y-6">
              <h2 className="font-serif-luxury text-2xl font-bold text-neutral-900 border-b border-neutral-200 pb-4">
                Hyderabad Gallery Atelier
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0442A5] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-neutral-900 uppercase tracking-wider">Atelier Location</p>
                    <p className="text-neutral-600 mt-0.5">{settings.address || 'Suite 402, Heritage Crafts Plaza, Jubilee Hills, Hyderabad, Telangana - 500033'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#0442A5] shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-900 uppercase tracking-wider">Phone & WhatsApp</p>
                    <p className="text-neutral-600 mt-0.5">{settings.phone || '+91 98765 43210'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#0442A5] shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-900 uppercase tracking-wider">Support Email</p>
                    <p className="text-neutral-600 mt-0.5">{settings.email || 'billing@houseofseetah.com'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#0442A5] shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-900 uppercase tracking-wider">Operating Hours</p>
                    <p className="text-neutral-600 mt-0.5">Mon – Sat: 10:00 AM – 7:30 PM (By Appointment)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <a
                  href={`https://wa.me/${(settings.phone || '+91 98765 43210').replace(/[^0-9]/g, '')}?text=Hello%20House%20of%20Seetah,%20I%20would%20like%20to%20schedule%20an%20art%20concierge%20appointment.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Launch Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* GST Credential Badge */}
            <div className="p-6 bg-[#01173C] text-white rounded-3xl border border-[#D4AF37]/30 shadow-xl space-y-2">
              <div className="flex items-center space-x-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Legal Enterprise</span>
              </div>
              <p className="font-mono text-sm font-bold text-white">GSTIN: {settings.gstin || '36AABCH9988K1Z5'}</p>
              <p className="text-[11px] text-[#CDEBFF]/80">Registered under Telangana State Goods & Services Tax Department.</p>
            </div>
          </div>

          {/* RIGHT: Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 shadow-2xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#C85A32]">Interactive Desk</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-neutral-900 mt-1">
                Send an Art Enquiry
              </h2>
            </div>

            {submitted ? (
              <div className="p-12 text-center bg-[#FAF7F2] rounded-2xl border border-emerald-300 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif-luxury text-2xl font-bold text-neutral-900">Thank You!</h3>
                <p className="text-xs text-neutral-600">Your enquiry has been submitted to our Jubilee Hills sales CRM desk. Our lead curator will contact you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#0442A5] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-neutral-300 rounded-xl text-neutral-900"
                    placeholder="e.g. Smt. Gayatri Devi"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-neutral-300 rounded-xl text-neutral-900"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF7F2] border border-neutral-300 rounded-xl text-neutral-900"
                      placeholder="client@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Artform Category of Interest</label>
                  <select
                    value={formData.artCategory}
                    onChange={(e) => setFormData({ ...formData, artCategory: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-neutral-300 rounded-xl text-neutral-900"
                  >
                    <option value="Pichwai & Traditional Art">Pichwai & Traditional Art</option>
                    <option value="Brassware & Relief Frames">Brassware & Relief Frames</option>
                    <option value="Traditional Masks & Sculptures">Traditional Masks & Sculptures</option>
                    <option value="Miniature Paintings & Wall Art">Miniature Paintings & Wall Art</option>
                    <option value="Cultural Home Decor">Cultural Home Decor</option>
                    <option value="Bespoke Commission">Bespoke Architectural Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Your Message or Custom Dimensions</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 bg-[#FAF7F2] border border-neutral-300 rounded-xl text-neutral-900"
                    placeholder="Describe your inquiry or custom art requirements..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>Submit Art Concierge Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* MAP EMBED */}
        <div className="mt-16 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl h-80">
          <iframe
            title="House of Seetah Jubilee Hills Atelier Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.827282823616!2d78.4045!3d17.4312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c0a87654321%3A0x123456789abcdef!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
