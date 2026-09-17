import { useState, useEffect } from 'react';

/**
 * Hook to load dynamic CMS page content and sections from MySQL via Express API.
 * Gracefully falls back to hardcoded defaults on load / network error.
 */
export function useCmsPage(pageKey, fallbackData = {}) {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/${pageKey}`);
        if (!res.ok) return;

        const json = await res.json();
        if (!isMounted || !json.success || !json.data) return;

        const pageData = json.data;
        setPage(pageData);

        // Update SEO Meta
        if (pageData.seo_title) {
          document.title = pageData.seo_title;
        }
        if (pageData.seo_description) {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', pageData.seo_description);
          }
        }

        // Map sections by section_key
        if (Array.isArray(pageData.sections)) {
          const secMap = {};
          pageData.sections.forEach((sec) => {
            let parsedItems = [];
            if (sec.items_json) {
              try {
                parsedItems = typeof sec.items_json === 'string'
                  ? JSON.parse(sec.items_json)
                  : sec.items_json;
              } catch (e) {
                parsedItems = [];
              }
            }

            const headingVal = sec.heading || sec.title || '';
            const subheadingVal = sec.subheading || sec.subtitle || '';

            secMap[sec.section_key] = {
              id: sec.id,
              section_key: sec.section_key,
              heading: headingVal,
              title: headingVal,
              subheading: subheadingVal,
              subtitle: subheadingVal,
              eyebrow: sec.eyebrow || '',
              body: sec.body || '',
              image_url: sec.image_url || '',
              poster_url: sec.poster_url || sec.image_url || '',
              video_url: sec.video_url || '',
              cta_text: sec.cta_text || '',
              cta_url: sec.cta_url || '',
              secondary_cta_text: sec.secondary_cta_text || '',
              secondary_cta_url: sec.secondary_cta_url || '',
              is_active: sec.is_active !== 0,
              items: Array.isArray(parsedItems) ? parsedItems : [],
            };
          });
          setSections(secMap);
        }
      } catch (err) {
        console.warn(`CMS Fetch failed for page [${pageKey}], using fallback:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPage();

    return () => {
      isMounted = false;
    };
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
    return {
      id: sec.id,
      section_key: sec.section_key,
      title: sec.title || fallbackTitle,
      heading: sec.heading || fallbackTitle,
      subtitle: sec.subtitle || fallbackSubtitle,
      subheading: sec.subheading || fallbackSubtitle,
      eyebrow: sec.eyebrow || fallback.eyebrow || '',
      body: sec.body || fallback.body || '',
      image_url: sec.image_url || fallback.image_url || '',
      poster_url: sec.poster_url || fallback.poster_url || fallback.image_url || '',
      video_url: sec.video_url || fallback.video_url || '',
      cta_text: sec.cta_text || fallback.cta_text || '',
      cta_url: sec.cta_url || fallback.cta_url || '',
      secondary_cta_text: sec.secondary_cta_text || fallback.secondary_cta_text || '',
      secondary_cta_url: sec.secondary_cta_url || fallback.secondary_cta_url || '',
      is_active: sec.is_active,
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
