import { useState, useEffect } from 'react';

export function useProduct(slugOrId = 'oneflexo') {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slugOrId}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (isMounted && result.success && result.data) {
          const apiProd = result.data;
          
          // Normalize compositions
          const comps = (apiProd.compositions || []).map((c) => ({
            ...c,
            ingredient_name: c.ingredient_name,
            ingredient_subtitle: c.ingredient_description || c.ingredient_subtitle || '',
            amount: c.strength || c.amount || '',
            strength: c.strength || c.amount || '',
            role_description: c.role_description || '',
          }));

          // Normalize safety sections
          const safety = (apiProd.safetySections || apiProd.safety_sections || []).map((s) => ({
            ...s,
            section_title: s.title || s.section_title || '',
            title: s.title || s.section_title || '',
            content: s.description || s.content || '',
            description: s.description || s.content || '',
          }));

          const compSummary = apiProd.composition_summary || 
            (comps.length > 0 ? comps.map((c) => `${c.ingredient_name || ''} ${c.strength || ''}`.trim()).filter(Boolean).join(' + ') : null);
          
          const mechanismSummary = (apiProd.mechanisms && apiProd.mechanisms.length > 0)
            ? apiProd.mechanisms.map((m) => `${m.title ? m.title + ': ' : ''}${m.description || ''}`).join('. ')
            : null;

          const precautionsList = safety.map((s) => s.description || s.content).filter(Boolean);

          const rawImages = apiProd.images || [];
          let galleryImages = rawImages
            .filter((img) => img.image_url && !img.image_url.startsWith('/assets/therapeutic-'))
            .map((img) => ({
              id: img.id,
              image_url: img.image_url,
              alt_text: img.alt_text || apiProd.brand_name || '',
              is_primary: img.is_primary === 1 || img.is_primary === true,
            }));

          if (apiProd.packshot_url && !galleryImages.some((img) => img.image_url === apiProd.packshot_url)) {
            galleryImages.unshift({
              image_url: apiProd.packshot_url,
              alt_text: apiProd.brand_name || '',
              is_primary: true,
            });
          }

          const normalized = {
            ...apiProd,
            name: apiProd.brand_name || apiProd.name || '',
            brand_name: apiProd.brand_name || apiProd.name || '',
            composition: compSummary || '',
            composition_summary: compSummary || '',
            description: apiProd.full_description || apiProd.description || '',
            full_description: apiProd.full_description || apiProd.description || '',
            short_description: apiProd.short_description || '',
            usedFor: apiProd.short_description || '',
            mechanism: mechanismSummary || '',
            direction: apiProd.dosage?.description || '',
            precautions: precautionsList,
            packshot_url: apiProd.packshot_url || '',
            image: apiProd.packshot_url || '',
            images: galleryImages,
            gallery: galleryImages,
            compositions: comps,
            benefits: apiProd.benefits || [],
            dosage: apiProd.dosage || null,
            mechanisms: apiProd.mechanisms || [],
            safetySections: safety,
            safety_sections: safety,
          };

          setProduct(normalized);
          setIsError(false);
        } else {
          throw new Error('Product not found in API');
        }
      } catch (err) {
        if (isMounted) {
          setProduct(null);
          setIsError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slugOrId]);

  return { product, loading, isError };
}
