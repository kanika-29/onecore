import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SectionEyebrow from '../components/SectionEyebrow';

const categoryData = {
  femme: {
    title: "Femme",
    subtitle: "Women's Health",
    image: "/assets/therapeutic-womens-health.jpg",
    products: [
      "Calmme",
      "Folentis",
      "Folentis D",
      "Dydronyx",
      "Ferolink",
      "Ferolink-Plus",
      "Chromolyn",
      "Humiphin",
      "Throfree",
      "Easefate",
      "Pro-Ova",
      "Myoriv",
      "Vgisoft-T",
      "Ferticore",
      "Calmme-CZ",
      "Ecofem-BV",
      "Onetron",
      "Cranly",
      "Myoglow",
      "Texacore MF"
    ]
  },
  'womens-health': {
    title: "Femme",
    subtitle: "Women's Health",
    image: "/assets/therapeutic-womens-health.jpg",
    products: [
      "Calmme",
      "Folentis",
      "Folentis D",
      "Dydronyx",
      "Ferolink",
      "Ferolink-Plus",
      "Chromolyn",
      "Humiphin",
      "Throfree",
      "Easefate",
      "Pro-Ova",
      "Myoriv",
      "Vgisoft-T",
      "Ferticore",
      "Calmme-CZ",
      "Ecofem-BV",
      "Onetron",
      "Cranly",
      "Myoglow",
      "Texacore MF"
    ]
  },
  pediaplus: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    image: "/assets/pediaplus.jpg",
    products: [
      "Glypocal-LP",
      "Zincolys Syrup",
      "Flutiriv",
      "Oneriv D3",
      "Glypocal Junior",
      "Dozokid",
      "Appyone",
      "Doxicent DS",
      "Flutiriv-NS",
      "Vitatots",
      "GG Shield Drop",
      "Appycore",
      "Zincolys Plus"
    ]
  },
  pediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    image: "/assets/pediaplus.jpg",
    products: [
      "Glypocal-LP",
      "Zincolys Syrup",
      "Flutiriv",
      "Oneriv D3",
      "Glypocal Junior",
      "Dozokid",
      "Appyone",
      "Doxicent DS",
      "Flutiriv-NS",
      "Vitatots",
      "GG Shield Drop",
      "Appycore",
      "Zincolys Plus"
    ]
  },
  paediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    image: "/assets/pediaplus.jpg",
    products: [
      "Glypocal-LP",
      "Zincolys Syrup",
      "Flutiriv",
      "Oneriv D3",
      "Glypocal Junior",
      "Dozokid",
      "Appyone",
      "Doxicent DS",
      "Flutiriv-NS",
      "Vitatots",
      "GG Shield Drop",
      "Appycore",
      "Zincolys Plus"
    ]
  },
  ortheon: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    image: "/assets/ortheon.jpg",
    products: [
      "Jorelax",
      "DuoDK",
      "Nervia-NX",
      "Frecox-SP",
      "Curajoy",
      "Glyp cal LP",
      "OneFLEXO",
      "Frecox",
      "Frecox-TH",
      "Brotop",
      "Brotop-D"
    ]
  },
  orthopaedics: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    image: "/assets/ortheon.jpg",
    products: [
      "Jorelax",
      "DuoDK",
      "Nervia-NX",
      "Frecox-SP",
      "Curajoy",
      "Glyp cal LP",
      "OneFLEXO",
      "Frecox",
      "Frecox-TH",
      "Brotop",
      "Brotop-D"
    ]
  },
  orthopedic: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    image: "/assets/ortheon.jpg",
    products: [
      "Jorelax",
      "DuoDK",
      "Nervia-NX",
      "Frecox-SP",
      "Curajoy",
      "Glyp cal LP",
      "OneFLEXO",
      "Frecox",
      "Frecox-TH",
      "Brotop",
      "Brotop-D"
    ]
  },
  neurix: {
    title: "Neurix",
    subtitle: "Neurology",
    image: "/assets/neurix.jpg",
    products: [
      "Epinerve-Forte",
      "Nervia",
      "Epi-Plus",
      "Nervia-PG",
      "Nervia-NX",
      "Citimind",
      "Epinerve-2500",
      "Epinerve-C",
      "Citimind P4",
      "Pulsorex",
      "Onepred",
      "Nervia-G",
      "Nervia-Plus",
      "Citalom-C",
      "Zolpicore",
      "Onepam",
      "Neurorelax"
    ]
  },
  neurology: {
    title: "Neurix",
    subtitle: "Neurology",
    image: "/assets/neurix.jpg",
    products: [
      "Epinerve-Forte",
      "Nervia",
      "Epi-Plus",
      "Nervia-PG",
      "Nervia-NX",
      "Citimind",
      "Epinerve-2500",
      "Epinerve-C",
      "Citimind P4",
      "Pulsorex",
      "Onepred",
      "Nervia-G",
      "Nervia-Plus",
      "Citalom-C",
      "Zolpicore",
      "Onepam",
      "Neurorelax"
    ]
  },
  neuro: {
    title: "Neurix",
    subtitle: "Neurology",
    image: "/assets/neurix.jpg",
    products: [
      "Epinerve-Forte",
      "Nervia",
      "Epi-Plus",
      "Nervia-PG",
      "Nervia-NX",
      "Citimind",
      "Epinerve-2500",
      "Epinerve-C",
      "Citimind P4",
      "Pulsorex",
      "Onepred",
      "Nervia-G",
      "Nervia-Plus",
      "Citalom-C",
      "Zolpicore",
      "Onepam",
      "Neurorelax"
    ]
  },
  eyerix: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/eyerix.jpg",
    products: [
      "Moxyone-M",
      "Moxyone",
      "Moxyone-MK",
      "Moxyone-MP",
      "Lotnova",
      "Lotnova-T",
      "Lotnova-M",
      "Tobraeye",
      "Angelcent-TM",
      "Brincore TM",
      "Femacore",
      "Olgerix",
      "Ecoliq",
      "Cortear",
      "Cortear Plus",
      "Eyovex",
      "Tearix",
      "Eyfen",
      "Ocuvion",
      "Brincore",
      "Gaticent",
      "Brimovis",
      "Flurbirix",
      "Brincore-TM",
      "Moxyone-DM",
      "Natmore",
      "Ikarix"
    ]
  },
  ophthalmology: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/eyerix.jpg",
    products: [
      "Moxyone-M",
      "Moxyone",
      "Moxyone-MK",
      "Moxyone-MP",
      "Lotnova",
      "Lotnova-T",
      "Lotnova-M",
      "Tobraeye",
      "Angelcent-TM",
      "Brincore TM",
      "Femacore",
      "Olgerix",
      "Ecoliq",
      "Cortear",
      "Cortear Plus",
      "Eyovex",
      "Tearix",
      "Eyfen",
      "Ocuvion",
      "Brincore",
      "Gaticent",
      "Brimovis",
      "Flurbirix",
      "Brincore-TM",
      "Moxyone-DM",
      "Natmore",
      "Ikarix"
    ]
  },
  ocular: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/eyerix.jpg",
    products: [
      "Moxyone-M",
      "Moxyone",
      "Moxyone-MK",
      "Moxyone-MP",
      "Lotnova",
      "Lotnova-T",
      "Lotnova-M",
      "Tobraeye",
      "Angelcent-TM",
      "Brincore TM",
      "Femacore",
      "Olgerix",
      "Ecoliq",
      "Cortear",
      "Cortear Plus",
      "Eyovex",
      "Tearix",
      "Eyfen",
      "Ocuvion",
      "Brincore",
      "Gaticent",
      "Brimovis",
      "Flurbirix",
      "Brincore-TM",
      "Moxyone-DM",
      "Natmore",
      "Ikarix"
    ]
  },
  'eye-care': {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/eyerix.jpg",
    products: [
      "Moxyone-M",
      "Moxyone",
      "Moxyone-MK",
      "Moxyone-MP",
      "Lotnova",
      "Lotnova-T",
      "Lotnova-M",
      "Tobraeye",
      "Angelcent-TM",
      "Brincore TM",
      "Femacore",
      "Olgerix",
      "Ecoliq",
      "Cortear",
      "Cortear Plus",
      "Eyovex",
      "Tearix",
      "Eyfen",
      "Ocuvion",
      "Brincore",
      "Gaticent",
      "Brimovis",
      "Flurbirix",
      "Brincore-TM",
      "Moxyone-DM",
      "Natmore",
      "Ikarix"
    ]
  },
  vellis: {
    title: "Vellis",
    subtitle: "Dermatology",
    image: "/assets/vellis.webp",
    products: [
      "Itrafite",
      "Lulifite",
      "Tracore (topical)",
      "Yuvizee",
      "Ebacore",
      "Tracore (oral)",
      "Acnozoe",
      "Dazzon",
      "Coresoft",
      "Velibact",
      "Camycore",
      "Defazone",
      "Fexocore",
      "Zion",
      "Glukozoe",
      "Oxyvive",
      "Melacore",
      "Clindaone-AD",
      "Clobtos-AD",
      "Fungione",
      "Fusi-one",
      "Velliglow",
      "Trakomin",
      "Azure-C",
      "Nicotinamide + Clindamycin Gel",
      "Clobetasol + Miconazole Cream",
      "Diclofenac Combination Pain Relief Gel",
      "Ketoconazole + Zinc Pyrithione Shampoo"
    ]
  },
  dermatology: {
    title: "Vellis",
    subtitle: "Dermatology",
    image: "/assets/vellis.webp",
    products: [
      "Itrafite",
      "Lulifite",
      "Tracore (topical)",
      "Yuvizee",
      "Ebacore",
      "Tracore (oral)",
      "Acnozoe",
      "Dazzon",
      "Coresoft",
      "Velibact",
      "Camycore",
      "Defazone",
      "Fexocore",
      "Zion",
      "Glukozoe",
      "Oxyvive",
      "Melacore",
      "Clindaone-AD",
      "Clobtos-AD",
      "Fungione",
      "Fusi-one",
      "Velliglow",
      "Trakomin",
      "Azure-C",
      "Nicotinamide + Clindamycin Gel",
      "Clobetasol + Miconazole Cream",
      "Diclofenac Combination Pain Relief Gel",
      "Ketoconazole + Zinc Pyrithione Shampoo"
    ]
  },
  derma: {
    title: "Vellis",
    subtitle: "Dermatology",
    image: "/assets/vellis.webp",
    products: [
      "Itrafite",
      "Lulifite",
      "Tracore (topical)",
      "Yuvizee",
      "Ebacore",
      "Tracore (oral)",
      "Acnozoe",
      "Dazzon",
      "Coresoft",
      "Velibact",
      "Camycore",
      "Defazone",
      "Fexocore",
      "Zion",
      "Glukozoe",
      "Oxyvive",
      "Melacore",
      "Clindaone-AD",
      "Clobtos-AD",
      "Fungione",
      "Fusi-one",
      "Velliglow",
      "Trakomin",
      "Azure-C",
      "Nicotinamide + Clindamycin Gel",
      "Clobetasol + Miconazole Cream",
      "Diclofenac Combination Pain Relief Gel",
      "Ketoconazole + Zinc Pyrithione Shampoo"
    ]
  },
  skin: {
    title: "Vellis",
    subtitle: "Dermatology",
    image: "/assets/vellis.webp",
    products: [
      "Itrafite",
      "Lulifite",
      "Tracore (topical)",
      "Yuvizee",
      "Ebacore",
      "Tracore (oral)",
      "Acnozoe",
      "Dazzon",
      "Coresoft",
      "Velibact",
      "Camycore",
      "Defazone",
      "Fexocore",
      "Zion",
      "Glukozoe",
      "Oxyvive",
      "Melacore",
      "Clindaone-AD",
      "Clobtos-AD",
      "Fungione",
      "Fusi-one",
      "Velliglow",
      "Trakomin",
      "Azure-C",
      "Nicotinamide + Clindamycin Gel",
      "Clobetasol + Miconazole Cream",
      "Diclofenac Combination Pain Relief Gel",
      "Ketoconazole + Zinc Pyrithione Shampoo"
    ]
  },
  otira: {
    title: "OTIRA",
    subtitle: "ENT",
    image: "/assets/otira.jpg",
    products: [
      "Flutiriv",
      "Deftos",
      "Flutiriv NS",
      "Onerest",
      "Mentira 625/1000",
      "Flutiriv AZ",
      "Bilariv-M",
      "Bilariv",
      "Otivy",
      "Histocore"
    ]
  },
  ent: {
    title: "OTIRA",
    subtitle: "ENT",
    image: "/assets/otira.jpg",
    products: [
      "Flutiriv",
      "Deftos",
      "Flutiriv NS",
      "Onerest",
      "Mentira 625/1000",
      "Flutiriv AZ",
      "Bilariv-M",
      "Bilariv",
      "Otivy",
      "Histocore"
    ]
  },
  'ear-nose-throat': {
    title: "OTIRA",
    subtitle: "ENT",
    image: "/assets/otira.jpg",
    products: [
      "Flutiriv",
      "Deftos",
      "Flutiriv NS",
      "Onerest",
      "Mentira 625/1000",
      "Flutiriv AZ",
      "Bilariv-M",
      "Bilariv",
      "Otivy",
      "Histocore"
    ]
  },
  omnara: {
    title: "OMNARA",
    subtitle: "General",
    image: "/assets/therapeutic-general-medicine.jpg",
    products: [
      "Stomazo-40",
      "Stomazo-D",
      "Doxicent 100/200",
      "Doxicent CV",
      "Frecox",
      "Frecox-SP",
      "Frecox-TH",
      "Nervia-NX",
      "Mesolac",
      "Goodfate-O",
      "Omnagut",
      "Rabefort-20",
      "Rabefort-DSR",
      "Rabefort-L",
      "Rabefort-IT",
      "Pantazon-40",
      "Pantazon-DSR",
      "Omnacare",
      "Cefnara-250",
      "Cefnara-500",
      "Cefnara-CV",
      "Bilariv-M",
      "Throfree"
    ]
  },
  'general-medicine': {
    title: "OMNARA",
    subtitle: "General",
    image: "/assets/therapeutic-general-medicine.jpg",
    products: [
      "Stomazo-40",
      "Stomazo-D",
      "Doxicent 100/200",
      "Doxicent CV",
      "Frecox",
      "Frecox-SP",
      "Frecox-TH",
      "Nervia-NX",
      "Mesolac",
      "Goodfate-O",
      "Omnagut",
      "Rabefort-20",
      "Rabefort-DSR",
      "Rabefort-L",
      "Rabefort-IT",
      "Pantazon-40",
      "Pantazon-DSR",
      "Omnacare",
      "Cefnara-250",
      "Cefnara-500",
      "Cefnara-CV",
      "Bilariv-M",
      "Throfree"
    ]
  },
  general: {
    title: "OMNARA",
    subtitle: "General",
    image: "/assets/therapeutic-general-medicine.jpg",
    products: [
      "Stomazo-40",
      "Stomazo-D",
      "Doxicent 100/200",
      "Doxicent CV",
      "Frecox",
      "Frecox-SP",
      "Frecox-TH",
      "Nervia-NX",
      "Mesolac",
      "Goodfate-O",
      "Omnagut",
      "Rabefort-20",
      "Rabefort-DSR",
      "Rabefort-L",
      "Rabefort-IT",
      "Pantazon-40",
      "Pantazon-DSR",
      "Omnacare",
      "Cefnara-250",
      "Cefnara-500",
      "Cefnara-CV",
      "Bilariv-M",
      "Throfree"
    ]
  },
  'internal-medicine': {
    title: "OMNARA",
    subtitle: "General",
    image: "/assets/therapeutic-general-medicine.jpg",
    products: [
      "Stomazo-40",
      "Stomazo-D",
      "Doxicent 100/200",
      "Doxicent CV",
      "Frecox",
      "Frecox-SP",
      "Frecox-TH",
      "Nervia-NX",
      "Mesolac",
      "Goodfate-O",
      "Omnagut",
      "Rabefort-20",
      "Rabefort-DSR",
      "Rabefort-L",
      "Rabefort-IT",
      "Pantazon-40",
      "Pantazon-DSR",
      "Omnacare",
      "Cefnara-250",
      "Cefnara-500",
      "Cefnara-CV",
      "Bilariv-M",
      "Throfree"
    ]
  },
  cytos: {
    title: "Cytos",
    subtitle: "Oncology",
    image: "/assets/cytos.jpg",
    products: [
      "Cytos SUPPORT",
      "Oncora-4",
      "Oncora-8",
      "Leuco-Boost",
      "Aprecore",
      "Nausex-IV"
    ]
  },
  oncology: {
    title: "Cytos",
    subtitle: "Oncology",
    image: "/assets/cytos.jpg",
    products: [
      "Cytos SUPPORT",
      "Oncora-4",
      "Oncora-8",
      "Leuco-Boost",
      "Aprecore",
      "Nausex-IV"
    ]
  },
  'cancer-care': {
    title: "Cytos",
    subtitle: "Oncology",
    image: "/assets/cytos.jpg",
    products: [
      "Cytos SUPPORT",
      "Oncora-4",
      "Oncora-8",
      "Leuco-Boost",
      "Aprecore",
      "Nausex-IV"
    ]
  }
};


export default function AreaOfCareDetail() {
  const { slug } = useParams();
  const currentCategory = slug ? categoryData[slug.toLowerCase()] : null;

  useEffect(() => {
    if (currentCategory) {
      document.title = `${currentCategory.title} — ${currentCategory.subtitle} Products | Onecore Pharma`;
    }
  }, [currentCategory]);

  if (!currentCategory) {
    return <div className="min-h-screen w-full bg-brand-ivory" />;
  }

  return (
    <div className="w-full bg-brand-ivory text-brand-text min-h-screen">
      {/* Banner */}
      <PageBanner
        title={currentCategory.title}
        imageUrl={currentCategory.image}
        imageAlt={`${currentCategory.title} - ${currentCategory.subtitle} - Onecore Pharma`}
      />

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        {/* Header Block */}
        <div className="space-y-3 border-b border-brand-border/80 pb-8">
          <SectionEyebrow>PRODUCTS</SectionEyebrow>
          <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl font-light text-brand-dark tracking-tight">
            {currentCategory.title}
          </h1>
          <p className="text-xl sm:text-2xl font-light text-brand-muted tracking-tight">
            {currentCategory.subtitle}
          </p>
        </div>

        {/* Section Label & Products Listing */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-light editorial-heading text-brand-dark tracking-tight">
            Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentCategory.products.map((productName, index) => {
              const isFemme = slug?.toLowerCase() === 'femme' || slug?.toLowerCase() === 'womens-health';
              const isPediatrics = slug?.toLowerCase() === 'pediaplus' || slug?.toLowerCase() === 'pediatrics' || slug?.toLowerCase() === 'paediatrics';
              const productSlug = productName.toLowerCase().trim().replace(/\s+/g, '-');

              if (isFemme) {
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/femme/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              if (isPediatrics) {
                const targetAreaSlug = slug?.toLowerCase() === 'pediatrics' ? 'pediatrics' : (slug?.toLowerCase() === 'paediatrics' ? 'paediatrics' : 'pediaplus');
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isOrthopaedics = slug?.toLowerCase() === 'ortheon' || slug?.toLowerCase() === 'orthopaedics' || slug?.toLowerCase() === 'orthopedic' || slug?.toLowerCase() === 'orthopedics';
              if (isOrthopaedics) {
                const targetAreaSlug = slug?.toLowerCase() === 'ortheon' ? 'ortheon' : 'orthopaedics';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isNeurology = slug?.toLowerCase() === 'neurix' || slug?.toLowerCase() === 'neurology' || slug?.toLowerCase() === 'neuro';
              if (isNeurology) {
                const targetAreaSlug = slug?.toLowerCase() === 'neurix' ? 'neurix' : 'neurology';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isOphthalmology = slug?.toLowerCase() === 'eyerix' || slug?.toLowerCase() === 'ophthalmology' || slug?.toLowerCase() === 'ocular' || slug?.toLowerCase() === 'eye-care';
              if (isOphthalmology) {
                const targetAreaSlug = slug?.toLowerCase() === 'eyerix' ? 'eyerix' : 'ophthalmology';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isDermatology = slug?.toLowerCase() === 'vellis' || slug?.toLowerCase() === 'dermatology' || slug?.toLowerCase() === 'derma' || slug?.toLowerCase() === 'skin';
              if (isDermatology) {
                const targetAreaSlug = slug?.toLowerCase() === 'vellis' ? 'vellis' : 'dermatology';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isEnt = slug?.toLowerCase() === 'otira' || slug?.toLowerCase() === 'ent' || slug?.toLowerCase() === 'ear-nose-throat';
              if (isEnt) {
                const targetAreaSlug = slug?.toLowerCase() === 'otira' ? 'otira' : 'ent';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              const isGeneralMedicine = slug?.toLowerCase() === 'omnara' || slug?.toLowerCase() === 'general-medicine' || slug?.toLowerCase() === 'general' || slug?.toLowerCase() === 'internal-medicine';
              if (isGeneralMedicine) {
                const targetAreaSlug = slug?.toLowerCase() === 'omnara' ? 'omnara' : 'general-medicine';
                return (
                  <Link
                    key={index}
                    to={`/areas-of-care/${targetAreaSlug}/${productSlug}`}
                    className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-brand-sage">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-base font-medium text-brand-dark tracking-tight group-hover:text-brand-sage transition-colors">
                        {productName}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-brand-muted group-hover:text-brand-dark transition-colors shrink-0" />
                  </Link>
                );
              }

              return (
                <div
                  key={index}
                  className="bg-brand-surface/60 border border-brand-border p-5 rounded-sm shadow-2xs transition-all duration-200 hover:border-brand-dark hover:bg-brand-surface"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-brand-sage">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-medium text-brand-dark tracking-tight">
                      {productName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
