import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Search, Check } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SectionEyebrow from '../components/SectionEyebrow';
import { assetUrl } from '../utils/assetUrl';

// Import product datasets for all 9 therapeutic areas
import { femmeProducts } from '../data/femmeProducts';
import { pediatricsProducts } from '../data/pediatricsProducts';
import { orthopaedicsProducts } from '../data/orthopaedicsProducts';
import { neurologyProducts } from '../data/neurologyProducts';
import { ophthalmologyProducts } from '../data/ophthalmologyProducts';
import { dermatologyProducts } from '../data/dermatologyProducts';
import { entProducts } from '../data/entProducts';
import { generalMedicineProducts } from '../data/generalMedicineProducts';
import { oncologyProducts } from '../data/oncologyProducts';

const categoryData = {
  // 1. Women's Health / Femme
  femme: {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/femme",
    products: femmeProducts
  },
  'womens-health': {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/femme",
    products: femmeProducts
  },
  'women-health': {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/femme",
    products: femmeProducts
  },

  // 2. Pediatrics / Pediaplus
  pediaplus: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediaplus",
    products: pediatricsProducts
  },
  pediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediatrics",
    products: pediatricsProducts
  },
  paediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/paediatrics",
    products: pediatricsProducts
  },
  pediatric: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediaplus",
    products: pediatricsProducts
  },

  // 3. Orthopaedics / Ortheon
  ortheon: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/ortheon",
    products: orthopaedicsProducts
  },
  orthopaedics: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopaedics",
    products: orthopaedicsProducts
  },
  orthopedic: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopedic",
    products: orthopaedicsProducts
  },
  orthopedics: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopedics",
    products: orthopaedicsProducts
  },

  // 4. Neurology / Neurix
  neurix: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neurix",
    products: neurologyProducts
  },
  neurology: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neurology",
    products: neurologyProducts
  },
  neuro: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neuro",
    products: neurologyProducts
  },

  // 5. Ophthalmology / Eyerix
  eyerix: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/eyerix",
    products: ophthalmologyProducts
  },
  ophthalmology: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/ophthalmology",
    products: ophthalmologyProducts
  },
  ocular: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/ocular",
    products: ophthalmologyProducts
  },
  'eye-care': {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/eye-care",
    products: ophthalmologyProducts
  },

  // 6. Dermatology / Vellis
  vellis: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/vellis",
    products: dermatologyProducts
  },
  dermatology: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/dermatology",
    products: dermatologyProducts
  },
  derma: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/derma",
    products: dermatologyProducts
  },
  skin: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/skin",
    products: dermatologyProducts
  },

  // 7. ENT / Otira
  otira: {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/otira",
    products: entProducts
  },
  ent: {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/ent",
    products: entProducts
  },
  'ear-nose-throat': {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/ear-nose-throat",
    products: entProducts
  },

  // 8. General Medicine / Omnara
  omnara: {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/omnara",
    products: generalMedicineProducts
  },
  'general-medicine': {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/general-medicine",
    products: generalMedicineProducts
  },
  general: {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/general",
    products: generalMedicineProducts
  },
  'internal-medicine': {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/internal-medicine",
    products: generalMedicineProducts
  },

  // 9. Oncology / Cytos
  cytos: {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/cytos",
    products: oncologyProducts
  },
  oncology: {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/oncology",
    products: oncologyProducts
  },
  'cancer-care': {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/cancer-care",
    products: oncologyProducts
  }
};

export default function AreaOfCareDetail() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = useMemo(() => {
    if (!slug) return null;
    return categoryData[slug.toLowerCase().trim()] || null;
  }, [slug]);

  useEffect(() => {
    if (currentCategory) {
      document.title = `${currentCategory.title} — ${currentCategory.subtitle} Portfolio | Onecore Pharma`;
    } else {
      document.title = `Areas of Care | Onecore Pharma`;
    }
  }, [currentCategory]);

  const filteredProducts = useMemo(() => {
    if (!currentCategory || !currentCategory.products) return [];
    if (!searchQuery.trim()) return currentCategory.products;

    const query = searchQuery.toLowerCase().trim();
    return currentCategory.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.composition && product.composition.toLowerCase().includes(query))
    );
  }, [currentCategory, searchQuery]);

  if (!currentCategory) {
    return (
      <div className="min-h-screen w-full bg-brand-ivory flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <SectionEyebrow>THERAPEUTIC AREAS</SectionEyebrow>
          <h1 className="font-serif text-3xl font-light text-brand-dark">Specialty Area Not Found</h1>
          <p className="text-sm text-brand-muted">
            The requested therapeutic division "<span className="font-mono">{slug}</span>" is not recognized.
          </p>
          <div className="pt-4">
            <Link
              to="/areas-of-care"
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              <ArrowLeft size={14} />
              <span>Back to Areas of Care</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolve specific product detail route
  const getProductRoute = (product) => {
    // Special custom route for OneFLEXO
    if (product.slug === 'oneflexo' || product.name.toLowerCase() === 'oneflexo') {
      return '/areas-of-care/orthopaedics/oneflexo';
    }
    return `${currentCategory.baseRoute}/${product.slug}`;
  };

  return (
    <div className="w-full bg-brand-ivory text-brand-text min-h-screen">
      {/* 1. Page Banner */}
      <PageBanner
        title={currentCategory.title}
        imageUrl={currentCategory.image}
        imageAlt={`${currentCategory.title} — ${currentCategory.subtitle} — Onecore Pharma`}
      />

      {/* 2. Breadcrumbs & Context Header */}
      <div className="w-full border-b border-brand-border/80 bg-brand-surface/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-brand-muted gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/areas-of-care" className="hover:text-brand-dark transition-colors">
              Areas of Care
            </Link>
            <span>›</span>
            <span className="text-brand-dark font-medium">{currentCategory.title} ({currentCategory.subtitle})</span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-brand-muted">
            {currentCategory.products.length} Registered Formulations
          </div>
        </div>
      </div>

      {/* 3. Main Product Catalogue Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header Block with Editorial Hierarchy */}
        <div className="border-b border-brand-border/80 pb-8 space-y-4">
          <SectionEyebrow>PRODUCT CATALOGUE</SectionEyebrow>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-light text-brand-dark tracking-tight">
                {currentCategory.title}
              </h1>
              <p className="text-xl sm:text-2xl font-light text-brand-muted tracking-tight mt-1">
                {currentCategory.subtitle}
              </p>
            </div>
            <p className="max-w-xl text-sm sm:text-base text-brand-muted leading-relaxed font-sans">
              {currentCategory.description}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${currentCategory.title} products or active ingredients...`}
              className="w-full bg-white border border-brand-border/90 rounded-xs pl-10 pr-4 py-2.5 text-xs sm:text-sm text-brand-dark placeholder:text-brand-muted/70 focus:outline-hidden focus:border-brand-dark transition-colors shadow-2xs"
            />
          </div>
          <div className="text-xs font-mono text-brand-muted self-end sm:self-center">
            Showing <strong className="text-brand-dark font-semibold">{filteredProducts.length}</strong> of {currentCategory.products.length} products
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-brand-surface/40 border border-brand-border/60 rounded-xs p-8 space-y-3">
            <p className="text-base text-brand-dark font-medium">No products match your search query.</p>
            <p className="text-xs text-brand-muted">Try searching with a different product name or active salt.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-brand-sage underline hover:text-brand-dark pt-2 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product, index) => {
              const productUrl = getProductRoute(product);
              const productImage = product.image || currentCategory.image;

              return (
                <Link
                  key={product.slug || index}
                  to={productUrl}
                  className="bg-white border border-brand-border/80 hover:border-brand-dark/50 transition-all duration-300 rounded-xs p-6 flex flex-col justify-between group shadow-2xs hover:shadow-sm"
                >
                  <div>
                    {/* Product Image / Packshot Container */}
                    <div className="w-full aspect-[4/3] bg-brand-surface/40 border border-brand-border/40 rounded-xs overflow-hidden mb-5 flex items-center justify-center p-4 group-hover:bg-brand-surface/70 transition-colors">
                      <img
                        src={assetUrl(productImage)}
                        alt={`${product.name} - Onecore Pharma`}
                        className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl sm:text-2xl font-light text-brand-dark tracking-tight leading-snug group-hover:text-brand-sage transition-colors font-serif mb-2.5">
                      {product.name}
                    </h3>

                    {/* Composition / Strength */}
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-sans line-clamp-3">
                      {product.composition}
                    </p>
                  </div>

                  {/* View Product CTA Link */}
                  <div className="pt-5 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs sm:text-sm font-medium text-brand-dark group-hover:text-brand-sage transition-colors">
                    <span>View Product</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform text-brand-muted group-hover:text-brand-sage" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom Navigation / Return Link */}
        <div className="border-t border-brand-border/80 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/areas-of-care"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-brand-dark hover:text-brand-sage transition-colors"
          >
            <ArrowLeft size={14} />
            <span>View All Areas of Care</span>
          </Link>
          <span className="text-xs text-brand-muted">
            All formulations subject to clinician prescription and regional regulatory approval.
          </span>
        </div>
      </section>
    </div>
  );
}
