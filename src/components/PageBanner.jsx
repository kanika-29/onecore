import React from 'react';
import { motion } from 'framer-motion';
import HeroResponsiveImage from './HeroResponsiveImage';

export default function PageBanner({
  title,
  imageUrl,
  imageMobileUrl,
  imageAlt = 'Onecore Pharma',
  className = '',
}) {
  return (
    <section className={`relative w-full overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.75rem] lg:rounded-b-[3.5rem] shadow-md ${className}`}>
      {/* Background Image Container */}
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] bg-brand-dark flex items-center justify-center">
        <HeroResponsiveImage
          desktopImage={imageUrl}
          mobileImage={imageMobileUrl}
          alt={imageAlt}
          fallback="/assets/hero-healthcare.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Softened Gradient Overlay for vibrant contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent pointer-events-none" />

        {/* Centered Bold White Title */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="editorial-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-wide leading-tight drop-shadow-md"
          >
            {title}
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
