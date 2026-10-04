import React, { useState } from 'react';
import { Settings, Save, Check, Building2, CreditCard, ShieldCheck } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const [businessName, setBusinessName] = useState('House of Seetah');
  const [gstin, setGstin] = useState('36AABCH9988K1Z5');
  const [address, setAddress] = useState('Suite 402, Heritage Crafts Plaza, Jubilee Hills, Hyderabad, Telangana - 500033');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('admin@houseofseetah.com');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [accountNo, setAccountNo] = useState('50200088991122');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [upi, setUpi] = useState('houseofseetah@hdfcbank');
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
            <Settings className="w-6 h-6 text-[#0442A5]" />
            <span>Commercial & Invoice Settings</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure official GST legal credentials, print defaults, and bank settlement details.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#0442A5] hover:bg-[#0553d1] text-white text-xs font-semibold shadow-lg flex items-center space-x-2 transition-all"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save Business Settings'}</span>
        </button>
      </div>

      {/* Business Details */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-serif font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#0442A5]" />
          <span>Legal Enterprise Information</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Registered Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">GSTIN Number *</label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-mono font-bold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-neutral-400 mb-1">Official Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Official Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Support Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
            />
          </div>
        </div>
      </div>

      {/* Bank Account Details */}
      <div className="bg-[#161922] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-serif font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <span>Bank Payment Settlement Details</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Corporate UPI ID</label>
            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1117] border border-neutral-700 rounded-xl text-white font-mono text-emerald-400"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
