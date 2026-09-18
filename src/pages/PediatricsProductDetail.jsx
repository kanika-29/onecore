import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPediatricsProductBySlug } from '../data/pediatricsProducts';

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
        desc: "Operates through specific cellular receptors and metabolic cofactors."
      },
      {
        num: "03",
        title: "Therapeutic Effect",
        desc: "Helps produce the intended clinical outcome as evaluated by healthcare professionals."
      }
    ];
  }
}

// Helper to parse UsedFor into 2-4 items for the horizontal grid
function parseUsedForItems(usedForText) {
  if (!usedForText) return [];

  const items = usedForText
    .replace(/^Used (?:for|when|in) /i, '')
    .split(/(?:,|\band\b|\bor\b|—)/)
    .map(i => i.trim())
    .filter(i => i.length > 3 && !i.match(/^(?:for|or|and|not as a treatment for|not as a substitute for)$/i));

  const finalItems = items.slice(0, 4);

  if (finalItems.length === 0) {
    return [{ num: "01", title: usedForText }];
  }

  return finalItems.map((item, idx) => ({
    num: String(idx + 1).padStart(2, '0'),
    title: item.charAt(0).toUpperCase() + item.slice(1)
  }));
}

// Helper to parse Direction into numbered steps
function parseDirectionSteps(directionText) {
  if (!directionText) return [];

  const sentences = directionText
    .split(/\.\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return sentences.map((sentence, idx) => {
    let title = "Administration Instruction";
    if (idx === 0) title = "Dosing & Schedule";
    else if (idx === 1) title = "Administration Advice";
    else if (idx === 2) title = "Duration & Safety";
    else title = "Medical Supervision";

    const cleanSentence = sentence.endsWith('.') ? sentence : sentence + '.';

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
    } else if (lower.includes("antibiotic") || lower.includes("levothyroxine") || lower.includes("tetracycline") || lower.includes("quinolone")) {
      title = "Drug Interactions & Separations";
    } else if (lower.includes("drowsiness") || lower.includes("sedative") || lower.includes("sleep")) {
      title = "Sedation & Neurologic Precautions";
    } else if (lower.includes("zinc") || lower.includes("calcium") || lower.includes("vitamin")) {
      title = "Micronutrient & Cumulative Intake Limits";
    } else if (lower.includes("immunocompromised") || lower.includes("critically ill")) {
      title = "Immunocompromised & Critical Care Guidance";
    } else if (lower.includes("allergy") || lower.includes("colostrum") || lower.includes("penicillin") || lower.includes("cephalosporin")) {
      title = "Hypersensitivity & Allergy Warnings";
    } else if (lower.includes("nosebleed") || lower.includes("growth") || lower.includes("steroid")) {
      title = "Local Irritation & Paediatric Growth Monitoring";
    }

    return {
      title,
      content: text
    };
  });
}

export default function PediatricsProductDetail() {
  const { productSlug } = useParams();
  const product = getPediatricsProductBySlug(productSlug);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Pediaplus | Onecore Pharma`;
    } else {
      document.title = "Product Not Found | Onecore Pharma";
    }
  }, [product]);

  if (!product) {
    return (
      <div className="w-full bg-[#f7f5f1] text-[#232126] min-h-screen">
        <div className="border-b border-[#d9d4cf] py-3 px-6 text-xs text-[#777078]">
          <Link to="/areas-of-care/pediaplus" className="hover:text-[#232126]">Therapeutic Areas › Pediatrics</Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="font-serif text-4xl text-[#232126]">Product Not Found</h1>
          <p className="text-base text-[#625d64]">
            The requested Pediatrics product "<span className="font-mono">{productSlug}</span>" could not be found.
          </p>
          <div className="pt-4">
            <Link
              to="/areas-of-care/pediaplus"
              className="inline-block border border-[#232126] px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#232126] hover:text-white transition-colors"
            >
              ← Back to Pediatrics Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mechanismSteps = parseMechanismSteps(product.mechanism);
  const usedForItems = parseUsedForItems(product.usedFor);
  const directionSteps = parseDirectionSteps(product.direction);
  const precautionsAccordions = parsePrecautionsAccordions(product.precautions);
  const hasPrecautions = precautionsAccordions && precautionsAccordions.length > 0;

  return (
    <div className="w-full bg-white text-[#232126] font-sans antialiased">
      {/* 2. CONTEXT / BREADCRUMB BAR */}
      <div className="w-full border-b border-[#d9d4cf] bg-white py-3 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#777078] gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to="/areas-of-care" className="hover:text-[#232126] transition-colors">Areas of Care</Link>
          <span>›</span>
          <Link to="/areas-of-care/pediaplus" className="hover:text-[#232126] transition-colors">Pediatrics</Link>
          <span>›</span>
          <span className="text-[#232126] font-medium">{product.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Market information:</span>
          <strong className="text-[#232126] font-semibold">India</strong>
        </div>
      </div>

      {/* 3. PRODUCT HERO (SPLIT SCREEN 43% / 57%) */}
      <div className="w-full bg-[#f7f5f1] grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT 43% - Packshot Presentation */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#e9e5df] to-[#f1eee9] p-8 sm:p-14 lg:p-16 flex flex-col items-center justify-center relative min-h-[420px]">
          <div className="w-[220px] sm:w-[260px] bg-white border border-[#d4cfc9] rounded-[16px] shadow-lg p-6 flex flex-col items-center relative min-h-[340px]">
            <div className="w-full text-center pb-4 border-b border-[#eeeae6]">
              <span className="text-[10px] tracking-[0.2em] font-bold text-[#5b2a70] uppercase">ONECORE</span>
            </div>
            <div className="my-auto py-8 text-center space-y-2">
              <h3 className="font-serif text-3xl text-[#232126] font-normal tracking-tight">{product.name}</h3>
              <p className="text-[11px] text-[#5f5862] leading-relaxed max-w-[200px] mx-auto">
                {product.composition}
              </p>
            </div>
            <div className="w-full pt-3 border-t border-[#eeeae6] text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#887e8c]">PEDIAPLUS · PAEDIATRICS</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xs text-[11px] text-[#736d74] border border-[#e5e1dc]">
            Paediatric Healthcare Formulation
          </div>
        </div>

        {/* RIGHT 57% - Product Information */}
        <div className="lg:col-span-7 p-8 sm:p-14 lg:p-20 flex flex-col justify-center">
          <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#5b2a70]">
            PEDIAPLUS · PEDIATRICS
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[#232126] font-normal my-4 leading-[0.98]">
            {product.name}
          </h1>
          <div className="text-base text-[#736c74] mb-6 font-sans">
            {product.composition}
          </div>
          <p className="text-lg sm:text-xl text-[#575159] leading-relaxed max-w-2xl font-sans">
            {product.description}
          </p>
          <div className="border-t border-[#beb8b3] mt-8 pt-6 max-w-2xl">
            <small className="block text-[10px] tracking-[0.15em] uppercase text-[#887e8c] font-semibold mb-2">
              PRODUCT AT A GLANCE
            </small>
            <span className="font-serif text-xl sm:text-2xl leading-snug text-[#232126]">
              {product.usedFor}
            </span>
          </div>
        </div>
      </div>

      {/* 5. STICKY ANCHOR NAVIGATION */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#eeeae6] border-b border-[#d9d4cf] px-6 sm:px-12">
        <div className="max-w-6xl mx-auto flex gap-8 overflow-x-auto py-4 scrollbar-none no-scrollbar">
          <a href="#mechanism" className="text-xs uppercase tracking-wider font-semibold text-[#514b53] hover:text-[#5b2a70] transition-colors whitespace-nowrap">
            How it works
          </a>
          <a href="#used" className="text-xs uppercase tracking-wider font-semibold text-[#514b53] hover:text-[#5b2a70] transition-colors whitespace-nowrap">
            When it is used
          </a>
          <a href="#directions" className="text-xs uppercase tracking-wider font-semibold text-[#514b53] hover:text-[#5b2a70] transition-colors whitespace-nowrap">
            Direction of use
          </a>
          {hasPrecautions && (
            <a href="#precautions" className="text-xs uppercase tracking-wider font-semibold text-[#514b53] hover:text-[#5b2a70] transition-colors whitespace-nowrap">
              Precautions
            </a>
          )}
        </div>
      </div>

      {/* 6. MECHANISM OF WORK (DARK SECTION) */}
      <section id="mechanism" className="bg-[#232126] text-white py-20 px-6 sm:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3 text-xs font-bold tracking-[0.19em] uppercase text-[#cfbfd6] pt-2">
            MECHANISM OF WORK
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              How the formula operates in the body.
            </h2>
            <p className="text-base sm:text-lg text-[#cbc6ce] leading-relaxed max-w-3xl">
              {product.mechanism}
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-6 max-w-4xl">
              {mechanismSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="border-t border-[#5c5760] pt-6 min-h-[180px]">
                    <div className="font-serif text-3xl text-[#cbb9d3]">{step.num}</div>
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

      {/* 7. WHEN IS IT USED? (STONE/NEUTRAL SECTION) */}
      <section id="used" className="bg-[#ebe7e1] text-[#232126] py-20 px-6 sm:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3 text-xs font-bold tracking-[0.19em] uppercase text-[#5b2a70] pt-2">
            WHEN IS IT USED?
          </div>
          <div className="lg:col-span-9 space-y-8">
            <h2 className="font-serif text-4xl sm:text-5xl font-normal leading-tight max-w-3xl">
              Targeted clinical indications & support.
            </h2>
            <p className="text-base sm:text-lg text-[#625d64] leading-relaxed max-w-3xl">
              {product.usedFor}
            </p>

            {usedForItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#bdb7b2] my-8">
                {usedForItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 border-b sm:border-b-0 border-[#c9c3be] last:border-0 lg:border-r"
                  >
                    <div className="text-[10px] tracking-widest text-[#8d818f] font-mono uppercase">
                      {item.num}
                    </div>
                    <strong className="block font-serif text-xl font-normal mt-3 text-[#232126] leading-snug">
                      {item.title}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. DIRECTION OF USE */}
      <section id="directions" className="bg-white text-[#232126] py-20 px-6 sm:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-3 text-xs font-bold tracking-[0.19em] uppercase text-[#5b2a70] pt-2">
            DIRECTION OF USE
          </div>
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

      {/* 9. PRECAUTIONS (ONLY RENDER IF PRECAUTIONS EXIST) */}
      {hasPrecautions && (
        <section id="precautions" className="bg-white text-[#232126] py-20 px-6 sm:px-16 border-t border-[#eeeae6]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-3 text-xs font-bold tracking-[0.19em] uppercase text-[#5b2a70] pt-2">
              PRECAUTIONS
            </div>
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
      )}

      {/* 10. SAFETY / INFORMATION STRIP */}
      <div className="bg-[#5b2a70] text-white py-8 px-6 sm:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="font-serif text-2xl sm:text-3xl text-white">
            Information should follow the approved local label.
          </div>
          <div className="text-xs sm:text-sm text-[#eadfeb] max-w-xl leading-relaxed">
            For OneCore products, indication, dosage and precaution content should be market specific. Consult a registered medical practitioner for prescribing guidance.
          </div>
        </div>
      </div>
    </div>
  );
}
