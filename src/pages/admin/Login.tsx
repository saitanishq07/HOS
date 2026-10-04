import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@houseofseetah.com');
  const [password, setPassword] = useState('seetah2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid administrator credentials. Please check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0442A5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C85A32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 opacity-10 font-serif text-[180px] font-bold text-white leading-none select-none">
        SEETAH
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#022A6B] via-[#0442A5] to-[#0553d1] p-1 border-2 border-[#D4AF37] shadow-2xl group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0A0C10] rounded-full flex items-center justify-center p-2">
                <img src="/logo.png" alt="House of Seetah Logo" className="max-h-full max-w-full object-contain filter brightness-110" />
              </div>
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-white mb-2">
            HOUSE OF SEETAH
          </h1>
          <p className="text-xs text-[#CDEBFF] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Private Commercial Billing & Admin Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141822] border border-neutral-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span>Admin Authentication</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </h2>
            <p className="text-xs text-neutral-400">
              Enter your credentials to access business metrics, invoice engine, and customer CRM.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#0A0C10] border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5] focus:ring-1 focus:ring-[#0442A5] transition-all"
                  placeholder="admin@houseofseetah.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#0A0C10] border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0442A5] focus:ring-1 focus:ring-[#0442A5] transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0442A5] to-[#022A6B] hover:from-[#0553d1] hover:to-[#0442A5] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#0442A5]/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Info */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-400 mb-2">Demo Credentials Pre-filled</p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-mono">
              Email: admin@houseofseetah.com | Password: seetah2026
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-neutral-400 hover:text-[#CDEBFF] transition-colors">
            ← Return to Public Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};
