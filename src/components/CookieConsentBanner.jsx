import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cookie,
  ShieldCheck,
  Sliders,
  Check,
  X,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  COOKIE_CATEGORIES,
  getStoredConsent,
  saveConsent,
  acceptAllCookies,
  rejectNonEssentialCookies,
} from '../services/cookieConsent';
import { initAnalyticsManager } from '../services/analyticsManager';
import { useSettings } from '../hooks/useSettings';

export default function CookieConsentBanner() {
  const { siteSettings } = useSettings();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [customPreferences, setCustomPreferences] = useState({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  const isBannerEnabled = siteSettings?.cookie_banner_enabled !== 'false' && siteSettings?.cookie_banner_enabled !== false;
  const bannerTitle = siteSettings?.cookie_banner_title || 'Cookie & Privacy Preferences';
  const bannerDesc = siteSettings?.cookie_banner_desc || 'Onecore Pharma uses cookies to ensure website security, analyze site usage, and support our clinical and corporate communications in accordance with our Privacy Policy.';
  const privacyUrl = siteSettings?.cookie_privacy_url || '/privacy';
  const analyticsId = siteSettings?.google_analytics_id || '';

  // Initialize consent state and analytics tracking on mount
  useEffect(() => {
    const existingConsent = getStoredConsent();

    if (existingConsent) {
      setCustomPreferences({
        essential: true,
        analytics: Boolean(existingConsent.analytics),
        functional: Boolean(existingConsent.functional),
        marketing: Boolean(existingConsent.marketing),
      });
      setShowBanner(false);
    } else if (isBannerEnabled) {
      // First visit: delay slightly so page renders smoothly without layout jump
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isBannerEnabled]);

  // Initialize Analytics Manager whenever analyticsId or consent is ready
  useEffect(() => {
    if (analyticsId) {
      initAnalyticsManager(analyticsId);
    }
  }, [analyticsId]);

  // Listen for programmatic preference modal triggers (e.g. from footer link)
  useEffect(() => {
    const handleOpenModal = () => {
      const current = getStoredConsent();
      if (current) {
        setCustomPreferences({
          essential: true,
          analytics: Boolean(current.analytics),
          functional: Boolean(current.functional),
          marketing: Boolean(current.marketing),
        });
      }
      setShowPreferencesModal(true);
    };

    window.addEventListener('onecore:open-cookie-preferences', handleOpenModal);
    return () => {
      window.removeEventListener('onecore:open-cookie-preferences', handleOpenModal);
    };
  }, []);

  const handleAcceptAll = () => {
    const newConsent = acceptAllCookies();
    setCustomPreferences(newConsent);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const handleRejectNonEssential = () => {
    const newConsent = rejectNonEssentialCookies();
    setCustomPreferences(newConsent);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const handleSaveCustom = () => {
    const newConsent = saveConsent(customPreferences);
    setCustomPreferences(newConsent);
    setShowBanner(false);
    setShowPreferencesModal(false);
  };

  const toggleCategory = (categoryId) => {
    if (categoryId === 'essential') return; // Cannot toggle strictly necessary
    setCustomPreferences((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  if (!isBannerEnabled && !showPreferencesModal) {
    return null;
  }

  return (
    <>
      {/* =========================================================================
          TIER 1: FLOATING BOTTOM BANNER
          Subtle, elegant card in bottom right on desktop, bottom docked on mobile.
          ========================================================================= */}
      {showBanner && !showPreferencesModal && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-xl z-50 bg-[#071324]/95 backdrop-blur-md border border-white/15 text-white rounded-2xl shadow-2xl p-5 sm:p-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0D5C75]/40 border border-[#0D5C75]/60 flex items-center justify-center shrink-0 text-[#00E5FF]">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-serif font-medium text-white tracking-wide">
                  {bannerTitle}
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  Privacy Compliance
                </span>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans">
                {bannerDesc}{' '}
                <Link
                  to={privacyUrl}
                  className="text-[#00E5FF] hover:underline font-medium inline-flex items-center gap-0.5"
                >
                  Privacy Statement
                </Link>
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-[#0D5C75] hover:bg-[#094153] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Accept All
                </button>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Reject Non-Essential
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreferencesModal(true)}
                  className="px-3 py-2 text-white/75 hover:text-white text-xs font-medium underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* =========================================================================
          TIER 2: PREFERENCES MODAL
          Accessible, detailed category controls with toggle switches
          ========================================================================= */}
      {showPreferencesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D5C75]/10 text-[#0D5C75] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="cookie-modal-title" className="text-base font-serif font-medium text-slate-900">
                    Cookie & Privacy Preferences
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Manage granular data consent for your browsing session on Onecore Pharma.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Categories List */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5 text-blue-900">
                <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  In compliance with the Digital Personal Data Protection (DPDP) Act and global privacy standards, non-essential cookies require your explicit consent. Your choices are stored locally and can be updated at any time.
                </p>
              </div>

              <div className="space-y-3">
                {COOKIE_CATEGORIES.map((cat) => {
                  const isChecked = customPreferences[cat.id];
                  const isLocked = cat.required;

                  return (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isChecked
                          ? 'border-slate-200 bg-slate-50/50'
                          : 'border-slate-100 bg-white opacity-85'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-1.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {cat.name}
                            </span>
                            {isLocked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                <Lock className="w-2.5 h-2.5" /> Always Active
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isChecked
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {isChecked ? 'Consent Granted' : 'Declined'}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                            {cat.description}
                          </p>
                        </div>

                        {/* Interactive Toggle Switch */}
                        <div className="shrink-0 pt-0.5">
                          {isLocked ? (
                            <div className="w-11 h-6 bg-[#0D5C75] rounded-full flex items-center justify-end px-1 opacity-60 cursor-not-allowed">
                              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isChecked}
                              onClick={() => toggleCategory(cat.id)}
                              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D5C75] focus:ring-offset-1 ${
                                isChecked ? 'bg-[#0D5C75]' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                                  isChecked ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono pt-1">
                        Typical storage: {cat.examples}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer / Commit Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Save My Preferences
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0D5C75] hover:bg-[#094153] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Accept All
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
