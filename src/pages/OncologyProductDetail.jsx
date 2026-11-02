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
        title: "Target Pathway",
        desc: parts[0].endsWith('.') ? parts[0] : parts[0] + '.'
      },
      {
        num: "02",
        title: "Cellular Response",
        desc: parts[1].endsWith('.') ? parts[1] : parts[1] + '.'
      },
      {
        num: "03",
        title: "Therapeutic Outcome",
        desc: "Supports oncology care protocols, symptom control and patient quality of life."
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
        desc: "Acts on specific receptors, cell cycle pathways, and biological targets."
      },
      {
        num: "03",
        title: "Therapeutic Effect",
        desc: "Helps achieve the intended clinical oncology outcome under oncologist supervision."
      }
    ];
  }
}

// Helper to parse UsedFor into 2-4 items for the horizontal grid
function parseUsedForItems(usedForText) {
  if (!usedForText) return [];

  const items = usedForText
    .replace(/^Used (?:for|when|in|as) /i, '')
    .split(/(?:;|,|\band\b|\bor\b|—)/)
    .map(i => i.trim())
    .filter(i => i.length > 3 && !i.match(/^(?:for|or|and|not for parenteral|not as a stand-alone)$/i));

  const finalItems = items.slice(0, 4);

  if (finalItems.length === 0) {
    return [{ num: "01", title: usedForText }];
  }

  return finalItems.map((item, idx) => ({
    num: String(idx + 1).padStart(2, '0'),
    title: item.charAt(0).toUpperCase() + item.slice(1)
  }));
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

      if (lines.length > 1 && /^(dosing\s*(and|&)\s*schedule|administration\s*advice|dosage\s*&)/i.test(lines[0])) {
        body = lines.slice(1).join(' ');
      } else {
        body = body.replace(/^(dosing\s*(and|&)\s*schedule|administration\s*advice|dosage\s*&[:\s\w]*)[:\s-]*/i, '').trim();
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
    .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use as prescribed') && !s.toLowerCase().startsWith('administer under'));

  return sentences.slice(0, 2).map((sentence, idx) => {
    let title = idx === 0 ? "Dosing & Schedule" : "Administration Advice";
    let body = sentence.replace(/^(dosing\s*(and|&)\s*schedule|administration\s*advice|dosage\s*&[:\s\w]*)[:\s-]*/i, '').trim();
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
    "General Clinical Considerations",
    "Adverse Event Monitoring & Safety",
    "Drug Interactions & Concomitant Therapy",
    "Special Patient Populations",
    "Institutional & Oncology Protocols"
  ];

  return precautionsArray.map((text, idx) => {
    let title = defaultTitles[idx] || `Safety Consideration ${idx + 1}`;
    const lower = text.toLowerCase();
    if (lower.includes("neutropen") || lower.includes("blood") || lower.includes("chemo")) {
      title = "Chemotherapy & Hematologic Monitoring";
    } else if (lower.includes("interaction") || lower.includes("cyp3a4") || lower.includes("apomorphine")) {
      title = "Interactions & Regimen Adjustments";
    } else if (lower.includes("renal") || lower.includes("hepatic") || lower.includes("liver")) {
      title = "Renal & Hepatic Considerations";
    } else if (lower.includes("qt") || lower.includes("cardiac") || lower.includes("ecg")) {
      title = "Cardiovascular & ECG Precautions";
    } else if (lower.includes("pregnant") || lower.includes("contracept")) {
      title = "Pregnancy & Contraception Guidance";
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

export default function OncologyProductDetail() {
  const { productSlug } = useParams();
  const { product, loading } = useProduct(productSlug);
  const listingRoute = getAreaListingRoute(product, 'cytos');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Cytos Oncology | Onecore Pharma`;
    } else {
      document.title = "Product Not Found | Onecore Pharma";
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const navOffset = window.innerWidth < 640 ? 120 : 140;
      const sections = ['precautions', 'directions', 'indications', 'used', 'mechanism'];
      
      if (window.scrollY < 300) {
        setActiveTab('overview');
        return;
      }

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navOffset) {
            setActiveTab(id === 'used' ? 'indications' : id);
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
          <Link to="/areas-of-care/cytos" className="hover:text-[#232126]">Therapeutic Areas › Cytos</Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="font-serif text-4xl text-[#232126]">Product Not Found</h1>
          <p className="text-base text-[#625d64]">
            The requested Oncology product "<span className="font-mono">{productSlug}</span>" could not be found.
          </p>
          <div className="pt-4">
            <Link
              to="/areas-of-care/cytos"
              className="inline-block border border-[#232126] px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#232126] hover:text-white transition-colors"
            >
              ← Back to Cytos Products
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

      {/* PRODUCT HERO (SPLIT SCREEN 43% / 57%) */}
      <div id="overview" className="w-full bg-transparent grid grid-cols-1 lg:grid-cols-12 min-h-[640px] scroll-mt-24">
        {/* LEFT 43% */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#e5e9ec] to-[#f0f3f5] p-8 sm:p-14 lg:p-16 flex flex-col items-center justify-center relative min-h-[420px]">
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
            <div className="w-[220px] sm:w-[260px] bg-white border border-[#cfd6dc] rounded-[16px] shadow-lg p-6 flex flex-col items-center relative min-h-[340px]">
              <div className="w-full text-center pb-4 border-b border-[#e6ebef]">
                <span className="text-[10px] tracking-[0.2em] font-bold text-[#1f4e5b] uppercase">ONECORE</span>
              </div>
              <div className="my-auto py-8 text-center space-y-2">
                <h3 className="font-serif text-3xl text-[#232126] font-normal tracking-tight">{formatProductName(product.name)}</h3>
                <p className="text-[11px] text-[#556066] leading-relaxed max-w-[200px] mx-auto">
                  {product.composition}
                </p>
              </div>
              <div className="w-full pt-3 border-t border-[#e6ebef] text-center">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#788891]">
                  <Link to={listingRoute} className="hover:underline transition-colors">
                    ONCOLOGY
                  </Link>
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xs text-[11px] text-[#736d74] border border-[#e5e1dc]">
            Specialty Medicine
          </div>
        </div>

        {/* RIGHT 57% */}
        <div className="lg:col-span-7 p-8 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#1f4e5b]">
            <Link to={listingRoute} className="hover:underline transition-colors">
              CYTOS
            </Link>
            <span> · </span>
            <Link to={listingRoute} className="hover:underline transition-colors">
              ONCOLOGY
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

      {/* STICKY ANCHOR NAVIGATION */}
      <div className="sticky top-[64px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-[#d9d4cf] px-6 sm:px-12 py-3 flex gap-6 sm:gap-10 overflow-x-auto text-xs uppercase tracking-widest font-semibold text-[#777078] scrollbar-none shadow-2xs">
        <button
          type="button"
          onClick={() => scrollToSection('overview')}
          className={`py-2 px-1 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-xs font-semibold border-b-2 ${
            activeTab === 'overview'
              ? 'border-[#D52B1E] text-[#121212] font-bold'
              : 'border-transparent text-[#777078] hover:text-[#121212]'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('mechanism')}
          className={`py-2 px-1 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-xs font-semibold border-b-2 ${
            activeTab === 'mechanism'
              ? 'border-[#D52B1E] text-[#121212] font-bold'
              : 'border-transparent text-[#777078] hover:text-[#121212]'
          }`}
        >
          Mechanism of Action
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('indications')}
          className={`py-2 px-1 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-xs font-semibold border-b-2 ${
            activeTab === 'indications' || activeTab === 'used'
              ? 'border-[#D52B1E] text-[#121212] font-bold'
              : 'border-transparent text-[#777078] hover:text-[#121212]'
          }`}
        >
          Therapeutic Role
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('directions')}
          className={`py-2 px-1 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-xs font-semibold border-b-2 ${
            activeTab === 'directions'
              ? 'border-[#D52B1E] text-[#121212] font-bold'
              : 'border-transparent text-[#777078] hover:text-[#121212]'
          }`}
        >
          Administration & Dosage
        </button>
        {hasPrecautions && (
          <button
            type="button"
            onClick={() => scrollToSection('precautions')}
            className={`py-2 px-1 transition-all whitespace-nowrap cursor-pointer uppercase tracking-widest text-xs font-semibold border-b-2 ${
              activeTab === 'precautions'
                ? 'border-[#D52B1E] text-[#121212] font-bold'
                : 'border-transparent text-[#777078] hover:text-[#121212]'
            }`}
          >
            Safety Profile
          </button>
        )}
      </div>

      {/* SECTION: MECHANISM OF ACTION */}
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

      {/* SECTION: THERAPEUTIC INDICATIONS */}
      <section id="indications" className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#1f4e5b] mb-3">
            Therapeutic Indications
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#232126] font-normal mb-6">
            When is it used?
          </h2>
          {product.benefits && product.benefits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {product.benefits.map((b, idx) => (
                <div key={idx} className="bg-[#FAF9F6] border border-[#e5e3dc] p-6 rounded-2xl shadow-2xs space-y-2">
                  <h3 className="font-serif text-xl font-medium text-[#232126]">{b.title}</h3>
                  <p className="text-sm text-[#4a454d] leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#333333] text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
              {product.usedFor}
            </p>
          )}

          {/* In-section exploration links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#e5e3dc] mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs text-[#736c74] font-medium shrink-0">Explore Details:</span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => scrollToSection('mechanism')}
                  className="text-xs font-semibold px-4 py-2 sm:py-1.5 rounded-full bg-[#FAF9F6] text-[#232126] border border-[#d4cfc9] hover:border-[#D52B1E] transition-all cursor-pointer shadow-2xs text-center"
                >
                  Mechanism of Action →
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('directions')}
                  className="text-xs font-semibold px-4 py-2 sm:py-1.5 rounded-full bg-[#FAF9F6] text-[#232126] border border-[#d4cfc9] hover:border-[#D52B1E] transition-all cursor-pointer shadow-2xs text-center"
                >
                  Administration & Dosage →
                </button>
              </div>
            </div>
            <Link
              to={listingRoute}
              className="text-xs font-semibold text-[#736c74] hover:text-[#232126] underline transition-all self-start sm:self-auto sm:ml-auto"
            >
              All Oncology Formulations
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: ADMINISTRATION & DOSAGE */}
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
                  <div className="font-serif text-3xl text-[#788891]">{step.num}</div>
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#232126] mb-2">{step.title}</h3>
                    <p className="text-base text-[#575159] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#f0f4f7] border-l-4 border-[#1f4e5b] p-5 text-sm leading-relaxed text-[#575159] max-w-3xl">
              <strong className="text-[#1f4e5b] font-semibold">Important:</strong> Use only as directed by an oncologist or healthcare professional and according to the locally approved product label.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PRECAUTIONS & SAFETY */}
      {hasPrecautions && (
        <section id="precautions" className="py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-white scroll-mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#1f4e5b] mb-3">
              SAFETY & TOLERABILITY
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#232126] font-normal mb-6">
              Precautions & Clinical Considerations
            </h2>

            <div className="space-y-4 max-w-3xl">
              {precautionsAccordions.map((item, index) => (
                <div key={index} className="border border-[#d9d4cf] rounded-xs p-6 bg-[#fbfaf8]">
                  <h3 className="font-serif text-lg text-[#232126] font-normal mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#575159] leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Direct Product Action Link */}
      <ProductEndLink product={product} />

      {/* FOOTER CTA */}
      <div className="border-t border-[#d9d4cf] py-12 px-6 sm:px-12 bg-[#f7f5f1] text-center">
        <Link
          to={listingRoute}
          className="inline-block border border-[#232126] px-8 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#232126] hover:text-white transition-colors"
        >
          ← Back to Cytos Portfolio
        </Link>
      </div>
    </div>
  );
}
