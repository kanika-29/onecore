import { useState, useEffect } from 'react';
import { newsArticles as fallbackNews } from '../data/news';

export function useNews() {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (isMounted && result.success && Array.isArray(result.data) && result.data.length > 0) {
          const normalized = result.data.map((item, idx) => ({
            id: item.id || idx + 1,
            title: item.title,
            slug: item.slug,
            category: item.category || 'CORPORATE UPDATE',
            excerpt: item.excerpt || item.content || '',
            content: item.content || item.excerpt || '',
            date: item.published_date || (item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
            readTime: item.read_time || '4 min read',
            image: item.featured_image_url || '/assets/news-1.jpg',
            featured_image_url: item.featured_image_url || '/assets/news-1.jpg',
          }));

          setArticles(normalized);
          setIsError(false);
        } else {
          throw new Error('No news items found');
        }
      } catch {
        if (isMounted) {
          setArticles(fallbackNews);
          setIsError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return { articles, loading, isError };
}
