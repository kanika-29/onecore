import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assetUrl } from '../utils/assetUrl';
import ProductImageGallery from '../components/ProductImageGallery';
import PageSkeleton from '../components/PageSkeleton';

// Helper to parse Mechanism into 3 steps for the dark flow section
function parseMechanismSteps(mechanismText) {
  if (!mechanismText) return [];

  const parts = mechanismText
    .split(/(?:;|\.\s+)/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (parts.length >= 3) {
    return [
      {
        num: "01",
        title: "Primary Action",
        desc: parts[0].endsWith('.') ? parts[0] : parts[0] + '.'
      },
      {
        num: "02",
        title: "Target Pathway",
        desc: parts[1].endsWith('.') ? parts[1] : parts[1] + '.'
      },
      {
        num: "03",
        title: "Clinical Response",
        desc: parts.slice(2).join(' ').trim()
      }
    ];
  } else if (parts.length === 2) {
    return [
      {
        num: "01",
        title: "Active Delivery",
        desc: parts[0].endsWith('.') ? parts[0] : parts[0] + '.'
      },
      {
        num: "02",
        title: "Pathway Action",
        desc: parts[1].endsWith('.') ? parts[1] : parts[1] + '.'
      },
      {
        num: "03",
        title: "Therapeutic Outcome",
        desc: "Supports intended physiological balance and target symptom management."
      }
    ];
  } else {
    return [
      {
        num: "01",
        title: "Mechanism of Action",
        desc: mechanismText
      },
      {
        num: "02",
        title: "Target Pathway",
        desc: "Operates through specific cellular receptors and metabolic coenzymes."
      },
      {
        num: "03",
        title: "Therapeutic Effect",
        desc: "Helps produce the intended clinical outcome as evaluated by healthcare professionals."
      }
    ];
  }
}


// Helper to parse Direction into numbered steps (01 and 02)
function parseDirectionSteps(directionText) {
  if (!directionText) return [];

  const text = directionText.trim();
  const parts = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    return parts.slice(0, 2).map((part, idx) => {
      let lines = part.split('\n').map(l => l.trim()).filter(Boolean);
      let heading = idx === 0 ? "Dosing & Schedule" : "Administration Advice";
      let body = part;

      if (lines.length > 1 && /^(dosing\s*(and|&)\s*schedule|administration\s*advice)/i.test(lines[0])) {
        body = lines.slice(1).join(' ');
      } else {
        body = body.replace(/^(dosing\s*(and|&)\s*schedule|administration\s*advice)[:\s-]*/i, '').trim();
      }

      const cleanSentence = body.endsWith('.') ? body : body + '.';
      return {
        num: String(idx + 1).padStart(2, '0'),
        title: heading,
        desc: cleanSentence
      };
    });
  }

  const sentences = text
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use as prescribed'));

  return sentences.slice(0, 2).map((sentence, idx) => {
    let title = idx === 0 ? "Dosing & Schedule" : "Administration Advice";
    let body = sentence.replace(/^(dosing\s*(and|&)\s*schedule|administration\s*advice)[:\s-]*/i, '').trim();
    const cleanSentence = body.endsWith('.') ? body : body + '.';

    return {
      num: String(idx + 1).padStart(2, '0'),
      title,
      desc: cleanSentence
    };
  });
}

// Helper to parse Precautions into Accordion items
function parsePrecautionsAccordions(precautionsArray) {
  if (!precautionsArray || precautionsArray.length === 0) return [];

  const defaultTitles = [
    "General Tolerability & Precautions",
    "Clinical Warnings & Considerations",
    "Interactions & Administration Warnings",
    "Special Patient Population Guidance",
    "Monitoring & Safety Protocols"
  ];

  return precautionsArray.map((text, idx) => {
    let title = defaultTitles[idx] || `Safety Consideration ${idx + 1}`;
    const lower = text.toLowerCase();
    if (lower.includes("kidney") || lower.includes("renal") || lower.includes("stone")) {
      title = "Renal & Kidney Safety";
    } else if (lower.includes("antibiotic") || lower.includes("levothyroxine") || lower.includes("warfarin")) {
      title = "Drug Interactions & Separations";
    } else if (lower.includes("b12") || lower.includes("folate") || lower.includes("anaemia")) {
      title = "Deficiency & Haematologic Warnings";
    } else if (lower.includes("bleeding") || lower.includes("liver") || lower.includes("thrombosis")) {
      title = "Bleeding, Liver & Disease Risk";
    } else if (lower.includes("pregnancy") || lower.includes("hyperstimulation") || lower.includes("gynaecologist")) {
      title = "Pregnancy & Specialist Protocols";
    }

    return {
      title,
      content: text
    };
  });
}

import { useProduct } from '../hooks/useProduct';
import { getAreaListingRoute } from '../utils/areaNavigation';
import { formatProductName } from '../utils/formatProductName';
import ProductEndLink from '../components/ProductEndLink';

export default function FemmeProductDetail() {
  const { productSlug } = useParams();
  const { product, loading } = useProduct(productSlug);
  const listingRoute = getAreaListingRoute(product, 'femme');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Femme | Onecore Pharma`;
    } else {
      document.title = "Product Not Found | Onecore Pharma";
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const navOffset = window.innerWidth < 640 ? 120 : 140;
      const sections = ['precautions', 'directions', 'used', 'indications', 'mechanism'];
      
      if (window.scrollY < 300) {
        setActiveTab('overview');
        return;
      }

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            setActiveTab(id === 'indications' ? 'used' : id);
            return;
          }
        }
      }
      setActiveTab('overview');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!product) {
    return (
      <div className="w-full bg-[#f7f5f1] text-[#232126] min-h-screen">
        <div className="border-b border-[#d9d4cf] py-3 px-6 text-xs text-[#777078]">
          <Link to="/areas-of-care/femme" className="hover:text-[#232126]">Therapeutic Areas › Femme</Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="font-serif text-4xl text-[#232126]">Product Not Found</h1>
          <p className="text-base text-[#625d64]">
            The requested Femme product "<span className="font-mono">{productSlug}</span>" could not be found.
          </p>
          <div className="pt-4">
            <Link
              to="/areas-of-care/femme"
              className="inline-block border border-[#232126] px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#232126] hover:text-white transition-colors"
            >
              ← Back to Femme Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mechanismSteps = (product.mechanisms && product.mechanisms.length > 0)
    ? product.mechanisms.map((m, idx) => ({
        num: String(idx + 1).padStart(2, '0'),
        title: (m.title || `Action Step ${idx + 1}`).replace(/^(?:0?[1-9]\s*[-—:.]\s*)+/, '').trim(),
        desc: (m.description || '').replace(/^(?:0?[1-9]\s*[-—:.]\s*)+/, '').trim(),
      }))
    : parseMechanismSteps(product.mechanism);
  const directionSteps = parseDirectionSteps(product.direction);
  const precautionsAccordions = parsePrecautionsAccordions(product.precautions);
  const hasPrecautions = precautionsAccordions && precautionsAccordions.length > 0;

  const scrollToSection = (id) => {
    setActiveTab(id);
    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id) || document.getElementById(id === 'used' ? 'indications' : (id === 'indications' ? 'used' : id));
    if (el) {
      const navOffset = window.innerWidth < 640 ? 114 : 126;
      const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-transparent text-[#232126] font-sans antialiased">

      {/* 3. PRODUCT HERO (SPLIT SCREEN 43% / 57%) */}
      <div id="overview" className="w-full bg-transparent grid grid-cols-1 lg:grid-cols-12 min-h-[640px] scroll-mt-24">
        {/* LEFT 43% */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#e9e5df] to-[#f1eee9] p-8 sm:p-14 lg:p-16 flex flex-col items-center justify-center relative min-h-[420px]">
          {(product.images && product.images.length > 0) ? (
            <ProductImageGallery
              images={product.images}
              fallbackImage={product.image || product.packshot_url}
              brandName={product.name}
              className="max-w-[340px]"
            />
          ) : ((product.image || product.packshot_url) && !(product.image || product.packshot_url).includes('therapeutic-') && !(product.image || product.packshot_url).includes('pediaplus')) ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
              <img
                src={assetUrl(product.image || product.packshot_url)}
                alt={product.name}
                className="w-full h-full object-contain p-6 lg:p-12 mix-blend-multiply drop-shadow-2xl"
              />
            </div>
          ) : (
            <div className="w-[220px] sm:w-[260px] bg-white border border-[#d4cfc9] rounded-[16px] shadow-lg p-6 flex flex-col items-center relative min-h-[340px]">
              <div className="w-full text-center pb-4 border-b border-[#eeeae6]">
                <span className="text-[10px] tracking-[0.2em] font-bold text-[#5b2a70] uppercase">ONECORE</span>
              </div>
              <div className="my-auto py-8 text-center space-y-2">
                <h3 className="font-serif text-3xl text-[#232126] font-normal tracking-tight">{formatProductName(product.name)}</h3>
                <p className="text-[11px] text-[#5f5862] leading-relaxed max-w-[200px] mx-auto">
                  {product.composition}
                </p>
              </div>
              <div className="w-full pt-3 border-t border-[#eeeae6] text-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#887e8c]">
                  <Link to={listingRoute} className="hover:underline transition-colors">
                    GYNAECOLOGY
                  </Link>
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xs text-[11px] text-[#736d74] border border-[#e5e1dc]">
            Prescription Medicine
          </div>
        </div>

        {/* RIGHT 57% */}
        <div className="lg:col-span-7 p-8 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#5b2a70]">
            <Link to={listingRoute} className="hover:underline transition-colors">
              FEMME
            </Link>
            <span> · </span>
            <Link to={listingRoute} className="hover:underline transition-colors">
              WOMEN'S HEALTH
            </Link>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#232126] font-normal my-4 leading-[0.98]">
            {formatProductName(product.name)}
          </h1>
          <div className="text-base text-[#736c74] mb-6 font-sans">
            {product.composition}
          </div>
          <p className="text-lg sm:text-xl text-[#575159] leading-relaxed max-w-2xl font-sans">
            {product.full_description || product.description}
          </p>
        </div>
      </div>

      {/* 5. STICKY ANCHOR NAVIGATION */}
      <div className="sticky top-[64px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md border-t border-[#eeeae6] border-b border-[#d9d4cf] px-6 sm:px-12 shadow-2xs">
        <div className="max-w-6xl mx-auto flex gap-6 sm:gap-8 overflow-x-auto py-3 scrollbar-none no-scrollbar">
          <button
            type="button"
            onClick={() => scrollToSection('overview')}
            className={`text-xs uppercase tracking-wider font-semibold py-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#D52B1E] text-[#121212] font-bold'
                : 'border-transparent text-[#514b53] hover:text-[#121212]'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('mechanism')}
            className={`text-xs uppercase tracking-wider font-semibold py-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'mechanism'
                ? 'border-[#D52B1E] text-[#121212] font-bold'
                : 'border-transparent text-[#514b53] hover:text-[#121212]'
            }`}
          >
            Mechanism of Action
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('used')}
            className={`text-xs uppercase tracking-wider font-semibold py-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'used'
                ? 'border-[#D52B1E] text-[#121212] font-bold'
                : 'border-transparent text-[#514b53] hover:text-[#121212]'
            }`}
          >
            Therapeutic Role
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('directions')}
            className={`text-xs uppercase tracking-wider font-semibold py-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
              activeTab === 'directions'
                ? 'border-[#D52B1E] text-[#121212] font-bold'
                : 'border-transparent text-[#514b53] hover:text-[#121212]'
            }`}
          >
            Administration & Dosage
          </button>
          {hasPrecautions && (
            <button
              type="button"
              onClick={() => scrollToSection('precautions')}
              className={`text-xs uppercase tracking-wider font-semibold py-2 px-1 transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === 'precautions'
                  ? 'border-[#D52B1E] text-[#121212] font-bold'
                  : 'border-transparent text-[#514b53] hover:text-[#121212]'
              }`}
            >
              Safety Profile
            </button>
          )}
        </div>
      </div>

      {/* 6. MECHANISM OF WORK (DARK SECTION) */}
      <section id="mechanism" className="bg-[#232126] text-white py-20 px-6 sm:px-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#D52B1E] font-bold block">
              Mechanism of Action
            </span>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              How the formula operates in the body.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-6 max-w-4xl pt-2">
              {mechanismSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="border-t border-[#5c5760] pt-6 min-h-[180px]">
                    <div className="font-serif text-3xl text-[#D52B1E]">{step.num}</div>
                    <h3 className="font-serif text-2xl font-normal text-white my-3">{step.title}</h3>
                    <p className="text-sm text-[#cbc6ce] leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < mechanismSteps.length - 1 && (
                    <div className="hidden md:flex items-center justify-center pt-10 text-2xl text-[#7f7683]">
                      →
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHEN IS IT USED? (NEUTRAL/STONE SECTION) */}
      <section id="used" className="bg-[#ebe7e1] text-[#232126] py-20 px-6 sm:px-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#5b2a70] font-bold block">
              Therapeutic Indications
            </span>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              When is it used?
            </h2>
            {product.benefits && product.benefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {product.benefits.map((b, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-xs border border-[#d8d3cb] p-6 rounded-2xl shadow-2xs space-y-2">
                    <h3 className="font-serif text-xl font-medium text-[#232126]">{b.title}</h3>
                    <p className="text-sm text-[#4a454d] leading-relaxed">{b.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base sm:text-lg text-[#333333] leading-relaxed max-w-3xl font-normal">
                {product.usedFor}
              </p>
            )}

            {/* In-section exploration links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#d8d3cb]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <span className="text-xs text-[#736c74] font-medium shrink-0">Explore Details:</span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => scrollToSection('mechanism')}
                    className="text-xs font-semibold px-4 py-2 sm:py-1.5 rounded-full bg-white text-[#232126] border border-[#d4cfc9] hover:border-[#D52B1E] transition-all cursor-pointer shadow-2xs text-center"
                  >
                    Mechanism of Action →
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('directions')}
                    className="text-xs font-semibold px-4 py-2 sm:py-1.5 rounded-full bg-white text-[#232126] border border-[#d4cfc9] hover:border-[#D52B1E] transition-all cursor-pointer shadow-2xs text-center"
                  >
                    Administration & Dosage →
                  </button>
                </div>
              </div>
              <Link
                to={listingRoute}
                className="text-xs font-semibold text-[#736c74] hover:text-[#232126] underline transition-all self-start sm:self-auto sm:ml-auto"
              >
                All Women's Health Formulations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ADMINISTRATION & DOSAGE */}
      <section id="directions" className="bg-white text-[#232126] py-20 px-6 sm:px-16 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3" />
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              Administration and dosage guidance.
            </h2>

            <div className="max-w-3xl space-y-0">
              {directionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-6 py-6 border-t border-[#d9d4cf] last:border-b"
                >
                  <div className="font-serif text-3xl text-[#a58fad]">{step.num}</div>
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#232126] mb-2">{step.title}</h3>
                    <p className="text-base text-[#625d64] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#efe9f2] border-l-4 border-[#5b2a70] p-5 text-sm leading-relaxed text-[#514b53] max-w-3xl">
              <strong className="text-[#5b2a70] font-semibold">Important:</strong> Use only as directed by a healthcare professional and according to the locally approved product label. Follow physician instructions.
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRECAUTIONS */}
      <section id="precautions" className="bg-white text-[#232126] py-20 px-6 sm:px-16 border-t border-[#eeeae6] scroll-mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3" />
          <div className="lg:col-span-9 space-y-6">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              Important safety information.
            </h2>
            <p className="text-base text-[#625d64] max-w-3xl mb-8">
              Review critical safety instructions, clinical considerations, and contraindications.
            </p>

            <div className="max-w-3xl">
              {precautionsAccordions.map((item, idx) => (
                <details
                  key={idx}
                  className="border-t border-[#d9d4cf] last:border-b group"
                  open={idx === 0}
                >
                  <summary className="cursor-pointer py-6 flex justify-between items-center font-serif text-xl sm:text-2xl text-[#232126] list-none select-none">
                    <span>{item.title}</span>
                    <span className="font-sans text-2xl text-[#756d77] group-open:hidden">+</span>
                    <span className="font-sans text-2xl text-[#756d77] hidden group-open:block">×</span>
                  </summary>
                  <p className="pb-6 text-base text-[#625d64] leading-relaxed max-w-2xl">
                    {item.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Direct Product Action Link */}
      <ProductEndLink product={product} />
    </div>
  );
}
