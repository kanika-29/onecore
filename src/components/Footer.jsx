import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Heart, Mail, PhoneCall } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { assetUrl } from '../utils/assetUrl';

export default function Footer() {
  const location = useLocation();
  const { siteSettings } = useSettings();

  const currentYear = new Date().getFullYear();
  const copyright = siteSettings.copyright_text || `© ${currentYear} Onecore Pharma Pvt. Ltd. All rights reserved.`;

  const areasOfCare = [
    { name: 'Oncology (CYTOS)', path: '/areas-of-care' },
    { name: 'Women’s Health (FEMME)', path: '/areas-of-care/femme' },
    { name: 'Neurology (NEURIX)', path: '/areas-of-care' },
    { name: 'Orthopaedics (ORTHEON)', path: '/areas-of-care' },
    { name: 'Dermatology (VELLIS)', path: '/areas-of-care' },
    { name: 'Ophthalmology (EYERIX)', path: '/areas-of-care' },
    { name: 'ENT (OTIRA)', path: '/areas-of-care' },
    { name: 'Paediatrics (PEDIAPLUS)', path: '/areas-of-care' },
    { name: 'General Medicine (OMNARA)', path: '/areas-of-care' },
  ];

  const careAndSupport = [
    { name: 'Patients & Caregivers', path: '/patients-caregivers' },
    { name: 'Healthcare Professionals', path: '/contact' },
    { name: 'Adverse Event Reporting', path: '/contact' },
    { name: 'Medical Inquiries', path: '/contact' },
    { name: 'Formulation Directory', path: '/areas-of-care' },
  ];

  const qualityAndScience = [
    { name: 'Quality & Manufacturing', path: '/quality-manufacturing' },
    { name: 'Testing & Release Protocols', path: '/quality-manufacturing' },
    { name: 'Qualified Environments', path: '/quality-manufacturing' },
    { name: 'Responsible Packaging', path: '/#sustainability' },
  ];

  const company = [
    { name: 'About Onecore', path: '/about' },
    { name: 'Our Purpose & Vision', path: '/#purpose' },
    { name: 'Distribution & Franchise Partnerships', path: '/partnerships' },
    { name: 'News & Perspectives', path: '/news' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <footer className="bg-[#D52B1E] text-white pt-16 sm:pt-20 pb-12 overflow-hidden selection:bg-white/20 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Lilly Brand Mark + 4 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/20">
          
          {/* Brand Stature Block */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block group focus:outline-none" aria-label="Onecore Pharma">
              <img
                src={assetUrl(siteSettings.logo_url || '/assets/onecore-logo.png')}
                alt="Onecore Pharma"
                className="h-9 sm:h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 block pt-2">
                PRESCRIBING A BETTER TOMORROW
              </span>
            </Link>

            <p className="text-white/80 text-sm max-w-sm leading-relaxed pt-2">
              Developing purposeful formulations, dependable quality, and healthcare solutions centered on patients and healthcare professionals.
            </p>

            {/* Quick Medical Emergency Support Note */}
            <div className="pt-4 space-y-2 text-xs text-white/75">
              <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
                Medical Safety & Pharmacovigilance
              </p>
              <p className="leading-relaxed">
                If you suspect an adverse reaction or have a clinical query regarding a Onecore formulation, please consult your physician or notify our medical safety team.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
              >
                <span>Report an Adverse Event</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 1: Areas of Care */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Areas of Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {areasOfCare.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Care & Support */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Care & Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {careAndSupport.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Science & Quality */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Science & Quality
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {qualityAndScience.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/90">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors block py-0.5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Regulatory Code, Legal & Disclaimers (Lilly Style) */}
        <div className="pt-8 space-y-4 text-xs text-white/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-mono text-[11px] tracking-wider text-white/80">
              CMAT-IN-0104/2026 {copyright}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-white/80">
              <Link to="/privacy" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                Privacy Statement
              </Link>
              <Link to="/disclaimer" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                Terms of Use
              </Link>
              <Link to="/contact" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                Accessibility
              </Link>
              <Link to="/contact" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                Contact & Regulatory
              </Link>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-white/60 max-w-4xl pt-2">
            The healthcare information on this website is provided for educational and clinical awareness purposes only and is not intended to substitute for professional medical advice, diagnosis, or treatment. Consult a licensed healthcare provider for questions regarding any medical condition or prescription regimen.
          </p>
        </div>

      </div>
    </footer>
  );
}
