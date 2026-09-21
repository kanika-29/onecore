import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Globe, User, ArrowRight, ArrowUpRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { assetUrl } from '../utils/assetUrl';

export default function Navbar() {
  const { siteSettings } = useSettings();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logoUrl = assetUrl(siteSettings.logo_url || '/assets/onecore-logo.png');

  // Track scroll position for subtle styling changes
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/areas-of-care?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setDrawerOpen(false);
    }
  };

  const therapeuticDivisions = [
    { name: 'CYTOS', specialty: 'Oncology', path: '/areas-of-care' },
    { name: 'FEMME', specialty: 'Women’s Health', path: '/areas-of-care/femme' },
    { name: 'NEURIX', specialty: 'Neurology', path: '/areas-of-care' },
    { name: 'ORTHEON', specialty: 'Orthopaedics', path: '/areas-of-care' },
    { name: 'VELLIS', specialty: 'Dermatology', path: '/areas-of-care' },
    { name: 'EYERIX', specialty: 'Ophthalmology', path: '/areas-of-care' },
    { name: 'OTIRA', specialty: 'ENT', path: '/areas-of-care' },
    { name: 'PEDIAPLUS', specialty: 'Paediatrics', path: '/areas-of-care' },
    { name: 'OMNARA', specialty: 'General Medicine', path: '/areas-of-care' },
  ];

  const primaryNavLinks = [
    { label: 'About Onecore', path: '/about', desc: 'Our heritage, mission, and leadership' },
    { label: 'Areas of Care', path: '/areas-of-care', desc: 'Specialized therapeutic disciplines' },
    { label: 'Patients & Caregivers', path: '/patients-caregivers', desc: 'Condition guides and safety support' },
    { label: 'Quality & Manufacturing', path: '/quality-manufacturing', desc: 'Precision standards & laboratory QA' },
    { label: 'News & Perspectives', path: '/news', desc: 'Latest updates and clinical insights' },
    { label: 'Contact Us', path: '/contact', desc: 'Medical affairs and partner inquiries' },
  ];

  return (
    <>
      {/* =========================================================================
          FLOATING DUAL PILL HEADER (THE LILLY MODEL)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-8 py-4 sm:py-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT FLOATING PILL: Brand Logo + Menu Hamburger */}
          <div className="pointer-events-auto">
            <div
              className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
                scrolled
                  ? 'bg-[#111111]/95 text-white border-white/15 shadow-2xl'
                  : 'bg-[#141414]/90 text-white border-white/20 shadow-xl'
              }`}
            >
              {/* Home Logo Link */}
              <Link
                to="/"
                className="flex items-center gap-2 group focus:outline-none"
                aria-label="Onecore Pharma Home"
              >
                <div className="h-6 sm:h-7 w-auto flex items-center">
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                    Onecore
                  </span>
                </div>
              </Link>

              {/* Vertical Subtle Separator */}
              <div className="h-4 w-[1px] bg-white/20" aria-hidden="true" />

              {/* Hamburger Button */}
              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors focus:outline-none text-xs font-semibold uppercase tracking-wider"
                aria-label={drawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {drawerOpen ? (
                  <>
                    <X className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT FLOATING PILL: Search, Region, HCP Portal */}
          <div className="pointer-events-auto flex items-center gap-2">
            <div
              className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg ${
                scrolled
                  ? 'bg-[#111111]/95 text-white border-white/15 shadow-2xl'
                  : 'bg-[#141414]/90 text-white border-white/20 shadow-xl'
              }`}
            >
              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-white/85 hover:text-white transition-colors rounded-full hover:bg-white/10"
                aria-label="Search Formulations"
                title="Search formulations and conditions"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Region Pill */}
              <div className="hidden sm:flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors pl-1 border-l border-white/15">
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <span className="font-medium text-[11px] uppercase tracking-wider">India</span>
              </div>

              {/* HCP Portal / Sign In Action Pill */}
              <Link
                to="/contact"
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-[#D52B1E] text-white rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 border border-white/15 hover:border-transparent"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">HCP Portal</span>
                <span className="sm:hidden">Portal</span>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          EXPANDABLE SEARCH MODAL / OVERLAY
          ========================================================================= */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 sm:top-24 left-0 right-0 z-40 px-4 max-w-2xl mx-auto"
          >
            <div className="bg-[#181818]/95 backdrop-blur-2xl text-white rounded-3xl p-5 border border-white/15 shadow-2xl space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-white/50 absolute left-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search formulations, areas of care, clinical conditions..."
                  autoFocus
                  className="w-full bg-white/5 border border-white/15 focus:border-[#D52B1E] text-white placeholder-white/40 rounded-full pl-12 pr-28 py-3 text-sm focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>

              {/* Suggested Quick Searches */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs text-white/70">
                <span className="text-[11px] uppercase tracking-wider text-white/40">Quick Searches:</span>
                {['Femme', 'Cytos', 'Ortheon', 'Neurix', 'Dermatology', 'Paediatrics'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      navigate(`/areas-of-care?q=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-full text-[11px] text-white/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          FULL-SCREEN EDITORIAL NAVIGATION DRAWER (THE LILLY FLYOUT)
          ========================================================================= */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="min-h-screen px-4 sm:px-8 lg:px-16 pt-28 pb-16 max-w-7xl mx-auto flex flex-col justify-between">
              
              {/* Drawer Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-4">
                
                {/* Left Column: Primary Corporate & Patient Navigation */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
                    Onecore Healthcare Directory
                  </span>
                  
                  <nav className="space-y-4">
                    {primaryNavLinks.map((link, idx) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setDrawerOpen(false)}
                          className="group block py-2 border-b border-white/10 hover:border-[#D52B1E]/60 transition-colors"
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl sm:text-3xl font-serif text-white group-hover:text-[#D52B1E] transition-colors">
                              {link.label}
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-[#D52B1E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                          </div>
                          <p className="text-xs sm:text-sm text-white/50 pt-1 group-hover:text-white/70 transition-colors">
                            {link.desc}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Right Column: 9 Specialized Areas of Care (The Lilly Condition Index) */}
                <div className="lg:col-span-6 space-y-6 lg:pl-8 lg:border-l border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E]">
                      Areas of Care (9 Divisions)
                    </span>
                    <Link
                      to="/areas-of-care"
                      onClick={() => setDrawerOpen(false)}
                      className="text-xs text-white/60 hover:text-white underline underline-offset-4"
                    >
                      View All Formulations
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {therapeuticDivisions.map((div, idx) => (
                      <motion.div
                        key={div.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * idx, duration: 0.3 }}
                      >
                        <Link
                          to={div.path}
                          onClick={() => setDrawerOpen(false)}
                          className="p-3.5 rounded-2xl bg-white/5 hover:bg-[#D52B1E]/15 border border-white/10 hover:border-[#D52B1E]/40 block transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold tracking-wider text-white uppercase group-hover:text-[#D52B1E] transition-colors">
                              {div.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#D52B1E] group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <span className="text-xs text-white/50 block pt-0.5">
                            {div.specialty}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Fast Action Card inside Drawer */}
                  <div className="pt-4">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D52B1E]">
                        <ShieldCheck className="w-4 h-4 text-[#D52B1E]" />
                        <span>Medical Information & Compliance</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        Need prescribing details or clinical assistance? Our medical team is dedicated to supporting doctors, pharmacists, and healthcare organizations.
                      </p>
                      <Link
                        to="/contact"
                        onClick={() => setDrawerOpen(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#D52B1E] hover:bg-[#B52015] text-white text-xs font-semibold rounded-full transition-colors"
                      >
                        <span>Connect with Medical Affairs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Bottom Bar */}
              <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
                <p>© {new Date().getFullYear()} Onecore Pharma. Committed to a better tomorrow.</p>
                <div className="flex items-center gap-6">
                  <Link to="/privacy" onClick={() => setDrawerOpen(false)} className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/disclaimer" onClick={() => setDrawerOpen(false)} className="hover:text-white transition-colors">
                    Healthcare Disclaimer
                  </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
