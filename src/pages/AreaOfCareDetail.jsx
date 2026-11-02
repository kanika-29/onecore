import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SectionEyebrow from '../components/SectionEyebrow';
import { assetUrl } from '../utils/assetUrl';
import { formatProductName } from '../utils/formatProductName';
import { useAreaDetail } from '../hooks/useAreaDetail';
import { THERAPEUTIC_DIVISIONS } from '../data/areasOfCare';

const categoryData = {
  // 1. Women's Health / Femme
  femme: {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/femme",
  },
  'womens-health': {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/womens-health",
  },
  'women-health': {
    title: "Femme",
    subtitle: "Women's Health",
    description: "Specialized prescription medicines and supportive therapeutic formulations designed for reproductive health, maternal care, fertility nutrition, and gynaecological wellness.",
    image: "/assets/therapeutic-womens-health.jpg",
    baseRoute: "/areas-of-care/women-health",
  },

  // 2. Pediatrics / Pediaplus
  pediaplus: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediaplus",
  },
  pediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediatrics",
  },
  paediatrics: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/paediatrics",
  },
  pediatric: {
    title: "Pediaplus",
    subtitle: "Pediatrics",
    description: "Formulations and dosage formats engineered specifically for infants, children, and adolescents, spanning nutritional support, respiratory care, antipyretics, and pediatric wellness.",
    image: "/assets/pediaplus.jpg",
    baseRoute: "/areas-of-care/pediaplus",
  },

  // 3. Orthopaedics / Ortheon
  ortheon: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/ortheon",
  },
  orthopaedics: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopaedics",
  },
  orthopedic: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopedic",
  },
  orthopedics: {
    title: "Ortheon",
    subtitle: "Orthopaedics",
    description: "Musculoskeletal therapies, advanced joint-health complexes, bone mineralization agents, and anti-inflammatory formulations supporting mobility and patient recovery.",
    image: "/assets/ortheon.jpg",
    baseRoute: "/areas-of-care/orthopedics",
  },

  // 4. Neurology / Neurix
  neurix: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neurix",
  },
  neurology: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neurology",
  },
  neuro: {
    title: "Neurix",
    subtitle: "Neurology",
    description: "Prescription neuro-therapeutics, neurotropic vitamin formulations, neuropathic pain management medicines, and central nervous system supportive care.",
    image: "/assets/neurix.jpg",
    baseRoute: "/areas-of-care/neuro",
  },

  // 5. Ophthalmology / Eyerix
  eyerix: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/eyerix",
  },
  ophthalmology: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/ophthalmology",
  },
  ocular: {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/ocular",
  },
  'eye-care': {
    title: "Eyerix",
    subtitle: "Ophthalmology",
    description: "Targeted ocular solutions spanning antibiotic and anti-inflammatory eye drops, glaucoma pressure management, dry eye ocular lubricants, and retinal antioxidants.",
    image: "/assets/eyerix.jpg",
    baseRoute: "/areas-of-care/eye-care",
  },

  // 6. Dermatology / Vellis
  vellis: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/vellis",
  },
  dermatology: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/dermatology",
  },
  derma: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/derma",
  },
  skin: {
    title: "Vellis",
    subtitle: "Dermatology",
    description: "Medical dermatology and supportive cutaneous therapies covering antifungal treatments, acne protocols, corticosteroid applications, barrier repair, and photoprotection.",
    image: "/assets/vellis.webp",
    baseRoute: "/areas-of-care/skin",
  },

  // 7. ENT / Otira
  otira: {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/otira",
  },
  ent: {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/ent",
  },
  'ear-nose-throat': {
    title: "OTIRA",
    subtitle: "ENT",
    description: "Formulations engineered for ear, nose, and throat clinical care, including intranasal corticosteroids, nasal decongestants, otic antimicrobial drops, and antihistamines.",
    image: "/assets/otira.jpg",
    baseRoute: "/areas-of-care/ear-nose-throat",
  },

  // 8. General Medicine / Omnara
  omnara: {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/omnara",
  },
  'general-medicine': {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/general-medicine",
  },
  general: {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/general",
  },
  'internal-medicine': {
    title: "OMNARA",
    subtitle: "General Medicine",
    description: "Broad-spectrum daily therapeutic solutions spanning gastrointestinal acid suppression, systemic antibiotics, analgesics, anti-allergic medicines, and vital metabolic support.",
    image: "/assets/therapeutic-general-medicine.jpg",
    baseRoute: "/areas-of-care/internal-medicine",
  },

  // 9. Oncology / Cytos
  cytos: {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/cytos",
  },
  oncology: {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/oncology",
  },
  'cancer-care': {
    title: "Cytos",
    subtitle: "Oncology",
    description: "Specialized prescription pharmaceuticals and medical nutritional supplements providing antiemetic control, hematologic support, and cachexia care for oncology patients.",
    image: "/assets/cytos.jpg",
    baseRoute: "/areas-of-care/cancer-care",
  }
};

export default function AreaOfCareDetail() {
  const { slug } = useParams();
  const currentDivisionSlug = (slug || '').toLowerCase().trim();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { area: dynamicArea, loading: areaLoading } = useAreaDetail(currentDivisionSlug);
  const division = THERAPEUTIC_DIVISIONS[currentDivisionSlug] || {};

  // Dynamic Division Fetch with Cache-Busting
  useEffect(() => {
    if (!currentDivisionSlug) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch(`/api/products?division=${encodeURIComponent(currentDivisionSlug)}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        setProducts(items);
        setIsError(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load products for division:', err);
        setProducts([]);
        setIsError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentDivisionSlug]);

  const currentCategory = useMemo(() => {
    if (!currentDivisionSlug) return null;
    const base = division.name ? {
      title: division.brand,
      subtitle: division.name,
      description: division.description,
      image: division.heroImage,
      baseRoute: `/areas-of-care/${currentDivisionSlug}`,
    } : (categoryData[currentDivisionSlug] || {
      title: currentDivisionSlug.replace(/-/g, ' ').toUpperCase(),
      subtitle: "Therapeutic Division",
      description: "Specialized prescription medicines and clinical healthcare formulations.",
      image: "/assets/therapeutic-general-medicine.jpg",
      baseRoute: `/areas-of-care/${currentDivisionSlug}`,
    });

    if (dynamicArea) {
      return {
        ...base,
        title: dynamicArea.name || base.title,
        subtitle: dynamicArea.heading || base.subtitle,
        description: dynamicArea.description || base.description,
        image: dynamicArea.image_url || base.image || division.heroImage,
      };
    }

    return base;
  }, [currentDivisionSlug, dynamicArea, division]);

  useEffect(() => {
    if (currentCategory) {
      document.title = `${currentCategory.title} — ${currentCategory.subtitle} Portfolio | Onecore Pharma`;
    } else {
      document.title = `Areas of Care | Onecore Pharma`;
    }
  }, [currentCategory]);

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    const cleanQuery = query.replace(/™/g, '').trim();

    return products.filter((product) => {
      const name = (product.brandName || product.name || product.brand_name || '').toLowerCase();
      const comp = (product.shortDescription || product.description || product.composition || product.fullDescription || product.full_description || '').toLowerCase();
      return name.includes(query) || (cleanQuery && name.includes(cleanQuery)) || comp.includes(query);
    });
  }, [products, searchQuery]);

  // Neutral skeleton layout while loading to avoid content flash/jitter
  if (loading || areaLoading) {
    return (
      <div className="w-full bg-transparent text-[#121212] min-h-screen">
        <div className="pt-24 sm:pt-28 pb-4 border-b border-[#E5E3DC] bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
        <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-[28px] overflow-hidden border border-[#E5E3DC] aspect-[16/10] bg-gray-200 animate-pulse" />
            </div>
          </div>
        </section>
      </div>
    );
  }

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
    if (product.slug === 'oneflexo' || (product.brandName || product.name || '').toLowerCase() === 'oneflexo') {
      return '/areas-of-care/orthopaedics/oneflexo';
    }
    return `/areas-of-care/${currentDivisionSlug}/${product.slug}`;
  };

  return (
    <div className="w-full bg-transparent text-[#121212] min-h-screen">
      
      {/* 1. Breadcrumbs Context Bar */}
      <div className="pt-24 sm:pt-28 pb-4 border-b border-[#E5E3DC] bg-white/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#777777] gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/areas-of-care" className="hover:text-[#121212] transition-colors font-medium">
              Areas of Care
            </Link>
            <span>›</span>
            <span className="text-[#121212] font-semibold">{currentCategory.title}</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-transparent border-b border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-4xl sm:text-6xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
                {currentCategory.title} <br />
                <span className="italic font-normal text-[#D52B1E]">{currentCategory.subtitle}</span>
              </h1>
              <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans max-w-2xl">
                {currentCategory.description}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="division-hero-media rounded-[28px] overflow-hidden border border-[#E5E3DC] shadow-sm aspect-[16/10] bg-[#FAF9F6]">
                <img
                  src={assetUrl(currentCategory.image || division.heroImage)}
                  alt={`${division.brand || currentCategory.title} ${division.name || currentCategory.subtitle}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/therapeutic-general-medicine.jpg';
                  }}
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
                placeholder={`Search in ${currentCategory.title} formulations or active salts...`}
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
              Showing <strong className="text-[#121212] font-semibold">{filteredProducts.length}</strong> of {products?.length || 0} formulations
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Cards Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#D52B1E]" />
            <p className="text-xs font-mono tracking-wider text-[#777777] uppercase">Loading division catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white/80 backdrop-blur-xs border border-[#E5E3DC] rounded-3xl p-8 space-y-3 max-w-lg mx-auto">
            <p className="text-base text-[#121212] font-serif font-bold">No formulations found.</p>
            <p className="text-xs text-[#555555]">
              {searchQuery ? 'Try searching with another chemical name or active ingredient.' : 'No products currently active in this division.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#D52B1E] underline hover:text-[#121212] pt-2 cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <DivisionProductCard
                key={product.slug || product.id || index}
                product={product}
                getProductRoute={getProductRoute}
              />
            ))}
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

function DivisionProductCard({ product, getProductRoute }) {
  const [imgError, setImgError] = useState(false);
  const productUrl = getProductRoute(product);
  
  // Packshot extraction
  const rawImage = product.productPrimaryPackshotImage || product.image || product.packshot_url;
  // Guard against any leftover stock photo or synthetic mockup strings
  const isStockPhoto = Boolean(rawImage && (rawImage.includes('therapeutic-') || rawImage.includes('pediaplus') || rawImage.includes('oneflexo')));
  const hasValidImage = Boolean(rawImage && !isStockPhoto && !imgError);

  const title = product.brandName || product.name || product.brand_name || 'Unnamed Product';
  const description = product.shortDescription || product.description || product.composition || product.fullDescription || product.short_description || 'Active pharmaceutical formulation';

  return (
    <Link
      to={productUrl}
      className="bg-white/80 backdrop-blur-xs border border-[#E5E3DC] hover:border-[#D52B1E] rounded-3xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md transition-all duration-300 block cursor-pointer"
    >
      {/* Product Packshot / Formulation Monograph Card */}
      <div className="w-full aspect-[4/3] bg-[#FAF9F6] overflow-hidden flex items-center justify-center p-3 sm:p-4">
        {hasValidImage ? (
          <img
            src={assetUrl(rawImage)}
            alt={`${title} - Onecore Pharma`}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-white border border-[#E5E3DC] rounded-2xl shadow-xs p-4 flex flex-col justify-between items-center text-center group-hover:border-[#D52B1E]/40 transition-colors">
            <div className="w-full pb-2 border-b border-[#F0EFEB] flex items-center justify-between">
              <span className="text-[9px] tracking-[0.2em] font-bold text-[#D52B1E] uppercase">ONECORE</span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-[#777777] bg-[#F5F4F0] px-1.5 py-0.5 rounded">Rx</span>
            </div>
            <div className="my-auto py-2">
              <h4 className="font-serif text-lg sm:text-xl text-[#121212] font-semibold leading-tight mb-1 group-hover:text-[#D52B1E] transition-colors">
                {formatProductName(title)}
              </h4>
              <p className="text-[11px] text-[#555555] line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
            <div className="w-full pt-1.5 border-t border-[#F0EFEB] text-center">
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#999999]">
                Formulation Monograph
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product Details: Product Name and Clear Legible Active Salt / Description */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#121212] tracking-tight group-hover:text-[#D52B1E] transition-colors mb-2 leading-snug">
          {formatProductName(title)}
        </h3>
        <p className="text-sm sm:text-base text-[#222222] font-normal leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}

