import { useState, useEffect } from 'react';
import { newsArticles as fallbackNews } from '../data/news';

export function useNews() {
  const [articles, setArticles] = useState(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) return;

        const json = await res.json();
        if (!isMounted || !json.success || !Array.isArray(json.data) || json.data.length === 0) return;

        const formatted = json.data.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          category: item.category,
          date: item.published_at 
            ? new Date(item.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          readTime: item.read_time || '3 min read',
          image: item.featured_image_url || '/assets/hero-healthcare.jpg',
        }));

        setArticles(formatted);
      } catch (err) {
        console.warn('News fetch failed, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return { articles, loading };
}
