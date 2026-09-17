import React from 'react';
import { motion } from 'framer-motion';

export default function PageBanner({
  title,
  imageUrl,
  imageAlt = 'Onecore Pharma',
  className = '',
}) {
  const fallbackImage = '/assets/hero-healthcare.jpg';
  const bgImage = imageUrl || fallbackImage;

  return (
    <section className={`relative w-full overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.75rem] lg:rounded-b-[3.5rem] shadow-md ${className}`}>
      {/* Background Image Container */}
      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px] bg-brand-dark flex items-center justify-center">
        <img
          src={bgImage}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
        />

        {/* Subtle Dark Gradient Overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/35" />

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
