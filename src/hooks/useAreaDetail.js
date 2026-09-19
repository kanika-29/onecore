import { useState, useEffect } from 'react';
import { getAreaBySlug } from '../data/areasOfCare';

export function useAreaDetail(slug) {
  const [area, setArea] = useState(() => (slug ? getAreaBySlug(slug) : null));
  const [products, setProducts] = useState(() => {
    const found = slug ? getAreaBySlug(slug) : null;
    return found?.sampleProducts || [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setArea(null);
      setProducts([]);
      setLoading(false);
      return;
    }

    const found = getAreaBySlug(slug);
    if (found) {
      setArea(found);
      setProducts(found.sampleProducts || []);
      setError(null);
    } else {
      setArea(null);
      setProducts([]);
      setError('Area of care not found.');
    }
    setLoading(false);
  }, [slug]);

  return { area, products, loading, error };
}

