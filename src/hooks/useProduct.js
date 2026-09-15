import { useState, useEffect } from 'react';

export function useProduct(slugOrId = 'oneflexo') {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slugOrId}`);
        if (!res.ok) return;

        const json = await res.json();
        if (!isMounted || !json.success || !json.data) return;

        setProduct(json.data);
      } catch (err) {
        console.warn(`Product fetch failed for [${slugOrId}], using fallback:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [slugOrId]);

  return { product, loading };
}
