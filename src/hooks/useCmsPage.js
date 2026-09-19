import { useState, useEffect } from 'react';
import { pagesContent } from '../data/pagesContent';

/**
 * Hook to load page content and sections statically from pagesContent data.
 * Gracefully provides instant rendering with zero network dependencies in static frontend mode.
 */
export function useCmsPage(pageKey, fallbackData = {}) {
  const staticPage = pagesContent[pageKey] || fallbackData;
  const [page, setPage] = useState(staticPage);
  const [sections, setSections] = useState(staticPage?.sections || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pageData = pagesContent[pageKey] || fallbackData;
    setPage(pageData);
    setSections(pageData?.sections || {});

    // Update SEO Meta
    if (pageData?.seo_title) {
      document.title = pageData.seo_title;
    }
    if (pageData?.seo_description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageData.seo_description);
      }
    }
    setLoading(false);
  }, [pageKey]);

  /**
   * Helper to retrieve a section's fields with fallback
   */
  const getSection = (key, fallback = {}) => {
    const sec = sections[key];
    const fallbackTitle = fallback.title || fallback.heading || '';
    const fallbackSubtitle = fallback.subtitle || fallback.subheading || '';

    if (!sec) {
      return {
        title: fallbackTitle,
        heading: fallbackTitle,
        subtitle: fallbackSubtitle,
        subheading: fallbackSubtitle,
        eyebrow: fallback.eyebrow || '',
        body: fallback.body || '',
        image_url: fallback.image_url || '',
        poster_url: fallback.poster_url || fallback.image_url || '',
        video_url: fallback.video_url || '',
        cta_text: fallback.cta_text || '',
        cta_url: fallback.cta_url || '',
        secondary_cta_text: fallback.secondary_cta_text || '',
        secondary_cta_url: fallback.secondary_cta_url || '',
        is_active: fallback.is_active !== false,
        items: fallback.items || [],
      };
    }

    const titleVal = sec.title || sec.heading || fallbackTitle;
    const subVal = sec.subtitle || sec.subheading || fallbackSubtitle;

    return {
      id: sec.id || key,
      section_key: key,
      title: titleVal,
      heading: titleVal,
      subtitle: subVal,
      subheading: subVal,
      eyebrow: sec.eyebrow || fallback.eyebrow || '',
      body: sec.body || fallback.body || '',
      image_url: sec.image_url || fallback.image_url || '',
      poster_url: sec.poster_url || fallback.poster_url || fallback.image_url || '',
      video_url: sec.video_url || fallback.video_url || '',
      cta_text: sec.cta_text || fallback.cta_text || '',
      cta_url: sec.cta_url || fallback.cta_url || '',
      secondary_cta_text: sec.secondary_cta_text || fallback.secondary_cta_text || '',
      secondary_cta_url: sec.secondary_cta_url || fallback.secondary_cta_url || '',
      is_active: sec.is_active !== false,
      items: sec.items && sec.items.length > 0 ? sec.items : fallback.items || [],
    };
  };

  return {
    page,
    sections,
    getSection,
    loading,
  };
}

