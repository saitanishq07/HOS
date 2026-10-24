import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { getImageUrl } from '../../services/db';

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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F8F9FA] to-[#EFF6FF] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 opacity-5 font-serif text-[180px] font-bold text-slate-900 leading-none select-none pointer-events-none">
        SEETAH
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white p-2 border border-slate-200 shadow-xl group-hover:scale-105 transition-transform flex items-center justify-center">
              <img src={getImageUrl('/logo.png')} alt="House of Seetah Logo" className="max-h-full max-w-full object-contain" />
            </div>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-slate-900 mb-2">
            HOUSE OF SEETAH
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-xs tracking-wider uppercase font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-700" /> Private Commercial Billing & Admin Console
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-8 shadow-xl backdrop-blur-xl text-slate-800">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <span>Admin Authentication</span>
              <Sparkles className="w-4 h-4 text-amber-600" />
            </h2>
            <p className="text-xs text-slate-500">
              Enter your credentials to access business metrics, invoice engine, and customer CRM.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="admin@houseofseetah.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0442A5] hover:bg-[#033585] text-white text-sm font-medium tracking-wide shadow-xs flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 mb-2">Demo Credentials Pre-filled</p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200/70 text-[11px] text-indigo-950 font-mono">
              Email: admin@houseofseetah.com | Password: seetah2026
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
            ← Return to Public Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};
