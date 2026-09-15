import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mainNavLinks } from '../data/navigation';
import { useSettings } from '../hooks/useSettings';

export default function Navbar() {
  const { siteSettings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const logoUrl = siteSettings.logo_url || '/assets/onecore-logo.png';
  const navLinks = (() => {
    let links = mainNavLinks;
    if (siteSettings.navigation_links) {
      try {
        const parsed = typeof siteSettings.navigation_links === 'string' 
          ? JSON.parse(siteSettings.navigation_links) 
          : siteSettings.navigation_links;
        if (Array.isArray(parsed) && parsed.length > 0) links = parsed;
      } catch {
        links = mainNavLinks;
      }
    }
    const filtered = links.filter((l) => l.is_active !== false);

    // Ensure "About" is moved to the front (immediately after logo)
    const aboutIndex = filtered.findIndex(
      (l) => l.name?.toLowerCase() === 'about' || l.path === '/about'
    );
    if (aboutIndex > 0) {
      const [aboutItem] = filtered.splice(aboutIndex, 1);
      filtered.unshift(aboutItem);
    }
    return filtered;
  })();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-ivory/90 backdrop-blur-md border-b border-brand-border/80 py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage"
              aria-label="Onecore Pharma Home"
            >
              <img
                src={logoUrl}
                alt="Onecore Pharma"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.filter(l => l.is_active !== false).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-brand-dark font-semibold'
                        : 'text-brand-muted hover:text-brand-dark'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-sage"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all duration-200"
              >
                <span>Contact Us</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-brand-dark hover:text-brand-sage focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-brand-ivory border-b border-brand-border shadow-xl px-6 py-8 lg:hidden max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="flex flex-col space-y-4">
              <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-muted">
                Navigation
              </span>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg py-2 border-b border-brand-border/40 flex items-center justify-between ${
                      isActive ? 'text-brand-sage font-semibold' : 'text-brand-dark'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-dark text-white text-sm font-semibold tracking-wider uppercase rounded-full"
                >
                  <span>Contact Us</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
