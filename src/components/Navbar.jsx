import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { assetUrl } from '../utils/assetUrl';

export default function Navbar() {
  const { siteSettings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const logoUrl = assetUrl(siteSettings.logo_url || '/assets/onecore-logo.png');

  // Specific left and right navigation groups as required
  const leftNavLinks = [
    { name: 'About', path: '/about' },
    { name: 'Areas of Care', path: '/areas-of-care' },
    { name: 'Patients & Caregivers', path: '/patients-caregivers' },
    { name: 'Quality & Manufacturing', path: '/quality-manufacturing' },
  ];

  const rightNavLinks = [
    { name: 'News', path: '/news' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/areas-of-care?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full relative z-50 bg-[#FAF8F5]">
      {/* =========================================================================
          ROW 1: BRANDING & SEARCH BAR ROW
          ========================================================================= */}
      <div className="w-full border-b border-[#E8E1D5] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Official Onecore Logo + Vertical Divider + Tagline */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage"
                aria-label="Onecore Pharma Home"
              >
                <img
                  src={logoUrl}
                  alt="Onecore Pharma"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                />
              </Link>

              {/* Vertical Hairline Divider */}
              <div
                className="hidden sm:block h-8 w-[1px] bg-[#D1C7B7] mx-4 sm:mx-6"
                aria-hidden="true"
              />

              {/* Editorial Tagline */}
              <div className="hidden sm:flex flex-col justify-center font-serif text-[#1C2621] text-xs sm:text-[13px] tracking-wide leading-tight select-none">
                <span className="font-normal text-[#1C2621]">Committed To</span>
                <span className="italic font-light text-[#3E4D44]">Better Tomorrow</span>
              </div>
            </div>

            {/* Right: Underline Search Bar & Mobile Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Underline Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="relative flex items-center border-b border-[#A69B8A] focus-within:border-[#1C2621] pb-1 transition-colors group w-32 sm:w-52 md:w-60">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    aria-label="Search"
                    className="w-full bg-transparent text-xs sm:text-sm text-[#1C2621] placeholder-[#8A8175] focus:outline-none pr-6 font-sans"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-0 text-[#6B6255] group-hover:text-[#1C2621] transition-colors p-0.5"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </form>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-brand-dark hover:text-brand-sage focus:outline-none ml-1"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: DESKTOP NAVIGATION ROW (Warm Beige/Ivory)
          ========================================================================= */}
      <nav
        aria-label="Main Navigation"
        className="hidden lg:block w-full bg-[#F5EFE6] border-b border-[#E3D9CA]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5">
            {/* Left 4 Navigation Links */}
            <div className="flex items-center gap-6 xl:gap-8">
              {leftNavLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium tracking-normal transition-colors py-1 relative ${
                      active
                        ? 'text-[#0E1712] font-semibold'
                        : 'text-[#3B463E] hover:text-[#0E1712]'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#1C2621]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Navigation Links: News + Contact Us Pill Button */}
            <div className="flex items-center gap-6">
              {rightNavLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium tracking-normal transition-colors py-1 relative ${
                      active
                        ? 'text-[#0E1712] font-semibold'
                        : 'text-[#3B463E] hover:text-[#0E1712]'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#1C2621]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              <Link
                to="/contact"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isLinkActive('/contact')
                    ? 'bg-[#1C2621] text-white border-[#1C2621]'
                    : 'border-[#1C2621] text-[#1C2621] hover:bg-[#1C2621] hover:text-white'
                }`}
              >
                <span>Contact Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          MOBILE DRAWER NAVIGATION
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden w-full bg-[#F5EFE6] border-b border-[#E3D9CA] shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-muted block">
                Menu
              </span>

              {/* Tagline on Mobile */}
              <div className="pb-2 border-b border-[#E3D9CA]/70 font-serif text-[#1C2621] text-sm">
                <span>Committed To </span>
                <span className="italic text-[#3E4D44]">Better Tomorrow</span>
              </div>

              {/* Left links */}
              {leftNavLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 text-base border-b border-[#E3D9CA]/60 flex items-center justify-between ${
                      active ? 'text-[#1C2621] font-semibold' : 'text-[#3B463E]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}

              {/* Right links */}
              {rightNavLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 text-base border-b border-[#E3D9CA]/60 flex items-center justify-between ${
                      active ? 'text-[#1C2621] font-semibold' : 'text-[#3B463E]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}

              {/* Contact Us button */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#1C2621] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm"
                >
                  <span>Contact Us</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
