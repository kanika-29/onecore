import React from 'react';
import SectionEyebrow from './SectionEyebrow';
import ScrollReveal from './ScrollReveal';

export default function PageHero({
  eyebrow,
  title,
  description,
  children
}) {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 border-b border-brand-border/60 bg-gradient-to-b from-brand-surface/60 to-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
          <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-light text-brand-dark max-w-4xl tracking-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-lg sm:text-xl text-brand-muted max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </ScrollReveal>
      </div>
    </section>
  );
}
