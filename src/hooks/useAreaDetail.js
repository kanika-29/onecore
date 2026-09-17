import { useState, useEffect } from 'react';
import { getAreaBySlug } from '../data/areasOfCare';

export function useAreaDetail(slug) {
  const [area, setArea] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAreaDetail() {
      if (!slug) {
        if (isMounted) {
          setArea(null);
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      // Local fallback area base configuration
      const fallbackAreaConfig = getAreaBySlug(slug);

      try {
        // Attempt to fetch specific area from API
        const areaRes = await fetch(`/api/therapeutic-areas/${encodeURIComponent(slug)}`);
        
        let apiArea = null;
        if (areaRes.ok) {
          const json = await areaRes.json();
          if (json.success && json.data) {
            apiArea = json.data;
          }
        }

        // Fetch products from API to filter by area if possible
        let apiProducts = [];
        try {
          const productsRes = await fetch('/api/products');
          if (productsRes.ok) {
            const pJson = await productsRes.json();
            if (pJson.success && Array.isArray(pJson.data)) {
              apiProducts = pJson.data;
            }
          }
        } catch (pErr) {
          console.warn('Failed fetching product list from API:', pErr);
        }

        if (!isMounted) return;

        if (fallbackAreaConfig || apiArea) {
          // Merge API data with fallback configuration
          const mergedArea = {
            ...(fallbackAreaConfig || {}),
            ...(apiArea ? {
              apiId: apiArea.id,
              name: apiArea.name || fallbackAreaConfig?.divisionName,
              divisionName: apiArea.division_name || fallbackAreaConfig?.divisionName,
              therapeuticArea: apiArea.name || fallbackAreaConfig?.therapeuticArea,
              heading: apiArea.heading || fallbackAreaConfig?.heading,
              description: apiArea.description || fallbackAreaConfig?.description,
              image: apiArea.image_url || fallbackAreaConfig?.image,
              heroImage: apiArea.image_url || fallbackAreaConfig?.heroImage,
              tags: apiArea.tags || fallbackAreaConfig?.keyTherapeuticInfo,
            } : {})
          };

          // Filter matching products from API
          let matchingProducts = [];
          if (apiProducts.length > 0) {
            const areaDbId = apiArea?.id;
            const areaSlugNormalized = (mergedArea.slug || slug).toLowerCase();
            const areaNameNormalized = (mergedArea.therapeuticArea || '').toLowerCase();

            matchingProducts = apiProducts.filter((p) => {
              if (areaDbId && p.therapeutic_area_id === areaDbId) return true;
              if (p.therapeutic_area_slug && p.therapeutic_area_slug.toLowerCase() === areaSlugNormalized) return true;
              if (p.therapeutic_area_name && p.therapeutic_area_name.toLowerCase().includes(areaNameNormalized)) return true;
              return false;
            });
          }

          // If no API products matched, use sample fallback products from local config
          if (matchingProducts.length === 0 && fallbackAreaConfig?.sampleProducts) {
            matchingProducts = fallbackAreaConfig.sampleProducts;
          }

          setArea(mergedArea);
          setProducts(matchingProducts);
        } else {
          setArea(null);
          setProducts([]);
        }
      } catch (err) {
        console.warn(`Area detail fetch failed for [${slug}], using static fallback:`, err);
        if (!isMounted) return;
        if (fallbackAreaConfig) {
          setArea(fallbackAreaConfig);
          setProducts(fallbackAreaConfig.sampleProducts || []);
        } else {
          setError('Failed to load area of care details.');
          setArea(null);
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAreaDetail();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { area, products, loading, error };
}
