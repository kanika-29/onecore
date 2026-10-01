import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
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
    <footer className="bg-[#C42115] text-white pt-10 sm:pt-14 pb-8 sm:pb-10 relative overflow-hidden selection:bg-white/20 selection:text-white">
      
      {/* Massive Centered "onecore" Text Watermark */}
      <div 
        className="absolute inset-x-0 top-0 bottom-20 sm:bottom-28 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <span className="text-[16vw] sm:text-[18vw] lg:text-[220px] font-black tracking-tighter leading-none text-[#650800]/35 whitespace-nowrap select-none -translate-y-3 sm:-translate-y-6">
          onecore
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid: Lilly Brand Mark + 4 Columns with Vertical Dividers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 pb-8 sm:pb-10 border-b border-white/25">
          
          {/* Brand Stature Block */}
          <div className="lg:col-span-4 space-y-3 lg:pr-8 lg:border-r lg:border-white/25">
            <Link to="/" className="inline-block group focus:outline-none" aria-label="Onecore Pharma">
              <img
                src={assetUrl(siteSettings.logo_url || '/assets/onecore-logo.png')}
                alt="Onecore Pharma"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white block pt-1.5">
                PRESCRIBING A BETTER TOMORROW
              </span>
            </Link>

            <p className="text-white font-semibold text-xs sm:text-sm max-w-sm leading-relaxed pt-1">
              Developing purposeful formulations, dependable quality, and healthcare solutions centered on patients and healthcare professionals.
            </p>

            {/* Quick Medical Emergency Support Note */}
            <div className="pt-2 space-y-1.5 text-xs text-white/95 font-semibold">
              <p className="font-bold text-white uppercase tracking-wider text-[10px]">
                Medical Safety & Pharmacovigilance
              </p>
              <p className="leading-relaxed text-[11px] sm:text-xs">
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
          <div className="lg:col-span-2 space-y-3 lg:px-6 lg:border-r lg:border-white/25">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Areas of Care
            </h4>
            <ul className="space-y-1.5 text-xs text-white/95 font-semibold">
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
          <div className="lg:col-span-2 space-y-3 lg:px-6 lg:border-r lg:border-white/25">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Care & Support
            </h4>
            <ul className="space-y-1.5 text-xs text-white/95 font-semibold">
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
          <div className="lg:col-span-2 space-y-3 lg:px-6 lg:border-r lg:border-white/25">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Science & Quality
            </h4>
            <ul className="space-y-1.5 text-xs text-white/95 font-semibold">
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
          <div className="lg:col-span-2 space-y-3 lg:pl-6">
            <h4 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-white/95 font-semibold">
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

        {/* Regulatory Code, Legal & Disclaimers */}
        <div className="pt-5 space-y-3 text-xs text-white font-semibold">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-wider text-white font-bold">
              CMAT-IN-0104/2026 {copyright}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-xs text-white font-semibold">
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

          <p className="text-[11px] leading-relaxed text-white/85 font-semibold max-w-4xl pt-1">
            The healthcare information on this website is provided for educational and clinical awareness purposes only and is not intended to substitute for professional medical advice, diagnosis, or treatment. Consult a licensed healthcare provider for questions regarding any medical condition or prescription regimen.
          </p>
        </div>

      </div>
    </footer>
  );
}
