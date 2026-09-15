import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    document.title = 'Admin Portal Login | Onecore Pharma';
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070D12] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-navy-light/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src="/assets/onecore-logo.png"
            alt="Onecore Pharma"
            className="h-10 w-auto object-contain brightness-0 invert mb-3"
          />
          <p className="text-xs font-mono tracking-widest uppercase text-brand-teal mt-1">
            Custom CMS & Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-brand-navy/90 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-brand-slate font-light mt-1">
              Enter your authorized administrative credentials to access the portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-xs text-red-300">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@onecorepharma.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-xs text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all shadow-xs"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-slate mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pl-11 text-xs text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all shadow-xs"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-teal/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Super Admin Bootstrap Note */}
          <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-brand-slate/60 text-center font-light">
            <p>
              New administrator accounts and credentials must be provisioned via the secure CLI tool or by a Super Administrator.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-brand-slate hover:text-white transition-colors"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}
