import React, { useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import ScrollReveal from '../components/ScrollReveal';

export default function Disclaimer() {
  useEffect(() => {
    document.title = "Disclaimer | Onecore Pharma";
  }, []);

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      <PageBanner
        title="Disclaimer"
        imageUrl="/assets/hero-healthcare.jpg"
        imageAlt="Disclaimer - Onecore Pharma"
      />

      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <ScrollReveal>
          <div className="space-y-6 text-brand-muted text-base sm:text-lg leading-relaxed">
            <h2 className="editorial-heading text-2xl font-medium text-brand-dark">Medical Information Notice</h2>
            <p>
              The content provided on this website is for informational and educational purposes only and is not intended to replace consultation with a qualified medical professional.
            </p>

            <h2 className="editorial-heading text-2xl font-medium text-brand-dark pt-6">Product Availability</h2>
            <p>
              Product specifications and availability are subject to local regulatory authorizations and marketed formulation guidelines.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
