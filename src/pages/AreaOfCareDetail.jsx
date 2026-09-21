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
      <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D52B1E]">
            Therapeutic Areas
          </span>
          <h1 className="font-serif text-3xl font-light text-[#121212]">Specialty Area Not Found</h1>
          <p className="text-sm text-[#555555]">
            The requested therapeutic division "<span className="font-mono">{slug}</span>" is not recognized.
          </p>
          <div className="pt-4">
            <Link
              to="/areas-of-care"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#121212] hover:bg-[#D52B1E] text-white text-xs font-semibold rounded-full transition-colors"
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
    <div className="w-full bg-[#FAF9F6] text-[#121212] min-h-screen">
      
      {/* 1. Breadcrumbs Context Bar */}
      <div className="pt-24 sm:pt-28 pb-4 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#777777] gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/areas-of-care" className="hover:text-[#121212] transition-colors font-medium">
              Areas of Care
            </Link>
            <span>›</span>
            <span className="text-[#121212] font-semibold">{currentCategory.title} ({currentCategory.subtitle})</span>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#D52B1E] bg-[#FFF1F0] px-3 py-1 rounded-full border border-[#F5C2C0]">
            {currentCategory.products.length} Registered Formulations
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-white border-b border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D52B1E] block">
                Division Portfolio
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
                {currentCategory.title} <br />
                <span className="italic font-normal text-[#D52B1E]">{currentCategory.subtitle}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans max-w-2xl">
                {currentCategory.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/10] bg-[#FAF9F6]">
                <img
                  src={assetUrl(currentCategory.image)}
                  alt={`${currentCategory.title} — ${currentCategory.subtitle} — Onecore Pharma`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* Search & Filter Bar */}
          <div className="pt-6 border-t border-[#E5E3DC] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${currentCategory.title} products or active salts...`}
                className="w-full bg-[#FAF9F6] border border-[#E5E3DC] focus:border-[#D52B1E] rounded-full pl-11 pr-10 py-2.5 text-xs sm:text-sm text-[#121212] placeholder-[#888888] focus:outline-none transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#777777] hover:text-[#121212] p-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5 hidden" />
                  ✕
                </button>
              )}
            </div>
            <div className="text-xs text-[#777777] self-end sm:self-center">
              Showing <strong className="text-[#121212] font-semibold">{filteredProducts.length}</strong> of {currentCategory.products.length} formulations
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Cards Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white border border-[#E5E3DC] rounded-3xl p-8 space-y-3 max-w-lg mx-auto">
            <p className="text-base text-[#121212] font-serif font-bold">No formulations match your search.</p>
            <p className="text-xs text-[#555555]">Try searching with a generic chemical name or active ingredient.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#D52B1E] underline hover:text-[#121212] pt-2 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const productUrl = getProductRoute(product);
              const productImage = product.image || currentCategory.image;

              return (
                <div
                  key={product.slug || index}
                  className="bg-white border border-[#E5E3DC] hover:border-[#121212] transition-all duration-300 rounded-[24px] p-6 flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Product Packshot Container */}
                    <div className="w-full aspect-[4/3] bg-[#FAF9F6] border border-[#E5E3DC]/70 rounded-2xl overflow-hidden mb-5 flex items-center justify-center p-4 group-hover:bg-[#FFF1F0]/40 transition-colors">
                      <img
                        src={assetUrl(productImage)}
                        alt={`${product.name} - Onecore Pharma`}
                        className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] tracking-tight group-hover:text-[#D52B1E] transition-colors mb-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Composition / Strength */}
                    <p className="text-xs text-[#555555] leading-relaxed font-mono bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E5E3DC]/60 line-clamp-3 mb-3">
                      {product.composition}
                    </p>

                    {/* Indication Preview */}
                    {product.usedFor && (
                      <p className="text-xs text-[#777777] line-clamp-2 italic leading-relaxed">
                        {product.usedFor}
                      </p>
                    )}
                  </div>

                  {/* View Product CTA Link */}
                  <div className="pt-5 mt-5 border-t border-[#E5E3DC]">
                    <Link
                      to={productUrl}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-[#121212] group-hover:bg-[#D52B1E] text-white text-xs font-semibold rounded-full transition-colors"
                    >
                      <span>View Monograph</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Navigation / Return Link */}
        <div className="border-t border-[#E5E3DC] pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/areas-of-care"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#121212] hover:text-[#D52B1E] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>View All 9 Therapeutic Divisions</span>
          </Link>
          <span className="text-xs text-[#777777]">
            All formulations manufactured to cGMP & pharmacopoeial standards.
          </span>
        </div>
      </section>
    </div>
  );
}
