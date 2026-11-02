import { useState, useEffect } from 'react';
import { getAreaBySlug, THERAPEUTIC_DIVISIONS } from '../data/areasOfCare';

export function useAreaDetail(slug) {
  const [area, setArea] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setArea(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/therapeutic-areas/${slug}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (isMounted && result.success && result.data) {
          const apiArea = result.data;
          const fallback = getAreaBySlug(slug) || {};
          const cleanSlug = (slug || apiArea.slug || '').toLowerCase().trim();
          const divConfig = THERAPEUTIC_DIVISIONS[cleanSlug] || THERAPEUTIC_DIVISIONS[apiArea.slug] || {};
          const authoritativeHero = apiArea.image_url || fallback.image_url || fallback.heroImage || fallback.image || divConfig.heroImage;

          const merged = {
            ...fallback,
            ...apiArea,
            id: apiArea.id,
            name: apiArea.name || divConfig.brand || fallback?.title,
            title: apiArea.name || divConfig.brand || fallback?.title,
            slug: apiArea.slug || slug,
            heading: apiArea.heading || divConfig.name || fallback?.focusTitle,
            focusTitle: apiArea.heading || divConfig.name || fallback?.focusTitle,
            description: apiArea.description || divConfig.description || fallback?.description,
            image: authoritativeHero,
            heroImage: authoritativeHero,
            image_url: apiArea.image_url || authoritativeHero,
            tags: apiArea.tags && apiArea.tags.length > 0 ? apiArea.tags : fallback?.tags || [],
            sampleProducts: (apiArea.products && apiArea.products.length > 0) ? apiArea.products : [],
          };

          setArea(merged);
          setProducts(merged.sampleProducts);
          setError(null);
          setIsError(false);
        } else {
          throw new Error('No data');
        }
      } catch {
        if (isMounted) {
          const fallback = getAreaBySlug(slug);
          if (fallback) {
            const cleanSlug = (slug || fallback.slug || '').toLowerCase().trim();
            const divConfig = THERAPEUTIC_DIVISIONS[cleanSlug] || {};
            const authoritativeHero = divConfig.heroImage || fallback.heroImage || fallback.image;
            setArea({
              ...fallback,
              image: authoritativeHero,
              heroImage: authoritativeHero,
            });
            setProducts([]);
            setError(null);
          } else {
            setArea(null);
            setProducts([]);
            setError('Area of care not found.');
          }
          setIsError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };


    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { area, products, loading, error, isError };
}

