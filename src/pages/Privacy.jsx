import React, { useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import ScrollReveal from '../components/ScrollReveal';

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Onecore Pharma";
  }, []);

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      <PageBanner
        title="Privacy Policy"
        imageUrl="/assets/about-facility.jpg"
        imageAlt="Privacy Policy - Onecore Pharma"
      />

      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <ScrollReveal>
          <div className="space-y-6 text-brand-muted text-base sm:text-lg leading-relaxed">
            <h2 className="editorial-heading text-2xl font-medium text-brand-dark">1. Information Collection</h2>
            <p>
              Onecore Pharma collects information voluntarily submitted through our contact and inquiry forms, including names, professional affiliations, and contact details necessary to respond to product or partnership communications.
            </p>

            <h2 className="editorial-heading text-2xl font-medium text-brand-dark pt-6">2. Use of Information</h2>
            <p>
              Submitted details are used solely to route inquiries to the appropriate departmental function, such as medical information, business partnerships, or customer support.
            </p>

            <h2 className="editorial-heading text-2xl font-medium text-brand-dark pt-6">3. Data Protection & Confidentiality</h2>
            <p>
              We maintain reasonable technical and organizational standards to protect communications from unauthorized disclosure, access, or alteration.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
