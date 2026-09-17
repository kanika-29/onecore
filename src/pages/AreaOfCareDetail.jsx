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
    image: "/assets/therapeutic-paediatrics.jpg",
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
    image: "/assets/therapeutic-paediatrics.jpg",
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
    image: "/assets/therapeutic-paediatrics.jpg",
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
    image: "/assets/therapeutic-orthopaedics.jpg",
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
    image: "/assets/therapeutic-orthopaedics.jpg",
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
    image: "/assets/therapeutic-orthopaedics.jpg",
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
    image: "/assets/therapeutic-neurology.jpg",
    products: [
      "Neurox",
      "Neurox-Plus",
      "Neurox-G",
      "Neurox-NT",
      "Neurox-M",
      "Neurox-OD",
      "Neurox-PG",
      "Neurox-TH",
      "Neurica",
      "Neurica-Plus",
      "Neurica-M",
      "Neurica-G",
      "Neurovit",
      "Neurovit-Plus",
      "Neurocalm",
      "Neurocalm-Plus",
      "Cerebro",
      "Cerebro-Plus",
      "Nurocore",
      "Nurocore-Plus"
    ]
  },
  neurology: {
    title: "Neurix",
    subtitle: "Neurology",
    image: "/assets/therapeutic-neurology.jpg",
    products: [
      "Neurox",
      "Neurox-Plus",
      "Neurox-G",
      "Neurox-NT",
      "Neurox-M",
      "Neurox-OD",
      "Neurox-PG",
      "Neurox-TH",
      "Neurica",
      "Neurica-Plus",
      "Neurica-M",
      "Neurica-G",
      "Neurovit",
      "Neurovit-Plus",
      "Neurocalm",
      "Neurocalm-Plus",
      "Cerebro",
      "Cerebro-Plus",
      "Nurocore",
      "Nurocore-Plus"
    ]
  },
  eyerix: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/therapeutic-ophthalmology.jpg",
    products: [
      "Eyerix Tears",
      "Eyerix-LS",
      "Eyerix-PF",
      "Eyerix-DX",
      "Optiriv",
      "Optiriv-D",
      "Optiriv-Plus",
      "Optiriv-G",
      "Tearsone",
      "Tearsone-Plus",
      "Visicare",
      "Visicare-D",
      "Ocuriv",
      "Ocuriv-Plus",
      "Catariv",
      "Glaura",
      "Glaura-P",
      "Lubrimax",
      "Macushield",
      "Eyecore-D"
    ]
  },
  ophthalmology: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    image: "/assets/therapeutic-ophthalmology.jpg",
    products: [
      "Eyerix Tears",
      "Eyerix-LS",
      "Eyerix-PF",
      "Eyerix-DX",
      "Optiriv",
      "Optiriv-D",
      "Optiriv-Plus",
      "Optiriv-G",
      "Tearsone",
      "Tearsone-Plus",
      "Visicare",
      "Visicare-D",
      "Ocuriv",
      "Ocuriv-Plus",
      "Catariv",
      "Glaura",
      "Glaura-P",
      "Lubrimax",
      "Macushield",
      "Eyecore-D"
    ]
  },
  vellis: {
    title: "Vellis",
    subtitle: "Dermatology",
    image: "/assets/therapeutic-dermatology.jpg",
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
    image: "/assets/therapeutic-dermatology.jpg",
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
    image: "/assets/therapeutic-ent.jpg",
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
    image: "/assets/therapeutic-ent.jpg",
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
