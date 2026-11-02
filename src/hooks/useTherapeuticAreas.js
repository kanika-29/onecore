import { useState, useEffect } from 'react';
import { areasOfCare as fallbackAreas, THERAPEUTIC_DIVISIONS } from '../data/areasOfCare';

export function useTherapeuticAreas() {
  const [areas, setAreas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchAreas = async () => {
      try {
        const res = await fetch('/api/therapeutic-areas', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (isMounted && result.success && Array.isArray(result.data) && result.data.length > 0) {
          // Normalize items with fallback fields
          const merged = result.data.map((area, idx) => {
            const fallback = fallbackAreas.find(
              (f) => f.slug === area.slug || f.id === area.id || f.title?.toLowerCase() === area.name?.toLowerCase() || f.divisionName?.toLowerCase() === area.name?.toLowerCase()
            ) || fallbackAreas[idx] || {};

            const cleanSlug = (fallback.slug || area.slug || fallback.id || area.id || '').toLowerCase();
            const divConfig = THERAPEUTIC_DIVISIONS[cleanSlug] || THERAPEUTIC_DIVISIONS[area.slug] || THERAPEUTIC_DIVISIONS[area.name?.toLowerCase()] || {};
            const authoritativeHero = area.image_url || fallback.image_url || fallback.heroImage || fallback.image || divConfig.heroImage;

            return {
              ...fallback,
              ...area,
              id: fallback.id || area.slug || area.id,
              divisionName: fallback.divisionName || divConfig.brand || area.name,
              therapeuticArea: fallback.therapeuticArea || divConfig.name || area.heading,
              num: area.number_label || fallback.num || String(idx + 1).padStart(2, '0'),
              title: fallback.title || divConfig.brand || area.name,
              name: fallback.title || divConfig.brand || area.name,
              slug: fallback.slug || area.slug,
              focusTitle: area.heading || area.focus_title || fallback.focusTitle || fallback.heading,
              heading: area.heading || fallback.focusTitle || fallback.heading,
              description: area.description || divConfig.description || fallback.description,
              image: authoritativeHero,
              heroImage: authoritativeHero,
              image_url: area.image_url || authoritativeHero,
              tags: area.tags && area.tags.length > 0 ? area.tags : fallback.tags || [],
              sampleProducts: (area.products && area.products.length > 0) ? area.products : [],
              route: fallback.route || `/areas-of-care/${fallback.slug || area.slug}`,
            };
          });

          setAreas(merged);
          setIsError(false);
        } else {
          throw new Error('Invalid areas response');
        }
      } catch {
        if (isMounted) {
          setAreas(fallbackAreas);
          setIsError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAreas();

    return () => {
      isMounted = false;
    };
  }, []);

  return { areas, loading, isError };
}

