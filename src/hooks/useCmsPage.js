import { useState, useEffect } from 'react';
import { pagesContent } from '../data/pagesContent';

/**
 * Hook to load page content and sections from MySQL database via Express API,
 * with immediate zero-flicker static fallback.
 */
export function useCmsPage(pageKey, fallbackData = {}) {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState(null);
  const [sectionsList, setSectionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchPageFromApi = async () => {
      try {
        const res = await fetch(`/api/pages/${pageKey}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();

        if (isMounted && result.success && result.data) {
          const apiPage = result.data;
          setPage(apiPage);

          if (Array.isArray(apiPage.sections)) {
            setSectionsList(apiPage.sections);
            const mapped = {};
            apiPage.sections.forEach((sec) => {
              let parsedItems = [];
              if (sec.items_json) {
                try {
                  parsedItems = typeof sec.items_json === 'string' ? JSON.parse(sec.items_json) : sec.items_json;
                } catch {
                  parsedItems = [];
                }
              }

              let parsedContent = null;
              if (sec.content_json) {
                try {
                  parsedContent = typeof sec.content_json === 'string' ? JSON.parse(sec.content_json) : sec.content_json;
                } catch {
                  parsedContent = null;
                }
              }

              const normalizedSec = {
                ...sec,
                id: sec.id,
                section_key: sec.section_key,
                section_type: sec.section_type,
                title: sec.heading || parsedContent?.headline || parsedContent?.heading || parsedContent?.title || '',
                heading: sec.heading || parsedContent?.headline || parsedContent?.heading || parsedContent?.title || '',
                subtitle: sec.subheading || parsedContent?.subheadline || parsedContent?.subtext || parsedContent?.lead || parsedContent?.subheading || '',
                subheading: sec.subheading || parsedContent?.subheadline || parsedContent?.subtext || parsedContent?.lead || parsedContent?.subheading || '',
                eyebrow: sec.eyebrow || parsedContent?.eyebrow || '',
                body: sec.body || parsedContent?.body || parsedContent?.description || parsedContent?.mission || '',
                image_url: sec.image_url || parsedContent?.image_url || '',
                image_mobile_url: sec.image_mobile_url || parsedContent?.image_mobile_url || parsedContent?.mobile_image_url || '',
                mobile_image_url: sec.image_mobile_url || parsedContent?.image_mobile_url || parsedContent?.mobile_image_url || '',
                poster_url: sec.poster_url || parsedContent?.poster_url || sec.image_url || parsedContent?.image_url || '',
                video_url: sec.video_url || parsedContent?.video_url || '',
                cta_text: sec.cta_text || parsedContent?.cta_text || '',
                cta_url: sec.cta_url || parsedContent?.cta_link || parsedContent?.cta_url || '',
                secondary_cta_text: sec.secondary_cta_text || parsedContent?.secondary_cta_text || '',
                secondary_cta_url: sec.secondary_cta_url || parsedContent?.secondary_cta_url || '',
                is_active: sec.is_active === 1 || sec.is_active === true,
                items: (parsedItems && parsedItems.length > 0) ? parsedItems : (parsedContent?.items || undefined),
                content: parsedContent || undefined,
                content_json: sec.content_json || undefined,
              };

              mapped[sec.section_key] = normalizedSec;
              // Also map hyphenated / underscored variants
              mapped[sec.section_key.replace(/_/g, '-')] = normalizedSec;
              mapped[sec.section_key.replace(/-/g, '_')] = normalizedSec;

              // Cross-aliases for all modular blueprints across pages
              if (
                sec.section_key === 'contact_hero' ||
                sec.section_key === 'hero_banner' ||
                sec.section_key === 'about_hero' ||
                sec.section_key === 'portfolio_header' ||
                sec.section_key === 'careers_hero' ||
                sec.section_key === 'quality_hero' ||
                sec.section_key === 'patients_hero' ||
                sec.section_key === 'hcp_hero' ||
                sec.section_key === 'news_hero'
              ) {
                if (!mapped['hero']) mapped['hero'] = normalizedSec;
              }
              if (sec.section_key === 'divisions_showcase' || sec.section_key === 'division_tabs_section') {
                if (!mapped['areas_of_care']) mapped['areas_of_care'] = normalizedSec;
                if (!mapped['divisions']) mapped['divisions'] = normalizedSec;
              }
              if (sec.section_key === 'corporate_mission') {
                if (!mapped['mission_vision']) mapped['mission_vision'] = normalizedSec;
                if (!mapped['our_purpose']) mapped['our_purpose'] = normalizedSec;
              }
              if (sec.section_key === 'quality_promise') {
                if (!mapped['quality_assurance']) mapped['quality_assurance'] = normalizedSec;
                if (!mapped['quality_highlight']) mapped['quality_highlight'] = normalizedSec;
              }
              if (sec.section_key === 'manufacturing_excellence' || sec.section_key === 'manufacturing_standards') {
                if (!mapped['manufacturing_standards'] || (sec.image_url && sec.image_url !== '/assets/hero-healthcare.jpg')) {
                  mapped['manufacturing_standards'] = normalizedSec;
                }
                if (!mapped['manufacturing_excellence'] || (sec.image_url && sec.image_url !== '/assets/hero-healthcare.jpg')) {
                  mapped['manufacturing_excellence'] = normalizedSec;
                }
              }
              if (sec.section_key === 'contact_info_cards') mapped['direct_channels'] = normalizedSec;
              if (sec.section_key === 'direct_channels') mapped['contact_info_cards'] = normalizedSec;
              if (sec.section_key === 'contact_form_settings') mapped['form_intro'] = normalizedSec;
              if (sec.section_key === 'form_intro') mapped['contact_form_settings'] = normalizedSec;
            });
            setSections(mapped);
          }

          // Update SEO Meta
          if (apiPage.seo_title) {
            document.title = apiPage.seo_title;
          }
          if (apiPage.seo_description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', apiPage.seo_description);
            }
          }
          setIsError(false);
        } else {
          throw new Error('Invalid page payload');
        }
      } catch {
        // Genuine error fallback to static data
        if (isMounted) {
          const staticFallback = pagesContent[pageKey] || fallbackData;
          setPage(staticFallback);
          setSections(staticFallback?.sections || {});
          if (staticFallback?.seo_title) document.title = staticFallback.seo_title;
          setIsError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPageFromApi();

    return () => {
      isMounted = false;
    };
  }, [pageKey]);

  /**
   * Helper to retrieve a section's fields with fallback
   */
  const getSection = (key, fallback = {}) => {
    if (!key) return fallback;
    const normKey1 = key;
    const normKey2 = typeof key === 'string' ? key.replace(/_/g, '-') : key;
    const normKey3 = typeof key === 'string' ? key.replace(/-/g, '_') : key;
    const sec = sections ? (sections[normKey1] || sections[normKey2] || sections[normKey3]) : null;

    const fallbackTitle = fallback.title || fallback.heading || '';
    const fallbackSubtitle = fallback.subtitle || fallback.subheading || '';

    if (!sec) {
      return {
        ...fallback,
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

    const isNonEmptyStr = (val) => typeof val === 'string' && val.trim().length > 0;

    const titleVal = isNonEmptyStr(sec.heading)
      ? sec.heading
      : (isNonEmptyStr(sec.title) ? sec.title : fallbackTitle);

    const subVal = isNonEmptyStr(sec.subheading)
      ? sec.subheading
      : (isNonEmptyStr(sec.subtitle) ? sec.subtitle : fallbackSubtitle);

    const eyebrowVal = isNonEmptyStr(sec.eyebrow)
      ? sec.eyebrow
      : (fallback.eyebrow || '');

    const bodyVal = isNonEmptyStr(sec.body)
      ? sec.body
      : (fallback.body || '');

    const imageVal = isNonEmptyStr(sec.image_url)
      ? sec.image_url
      : (fallback.image_url || fallback.poster_url || fallback.image || '');

    const posterVal = isNonEmptyStr(sec.poster_url)
      ? sec.poster_url
      : (imageVal || fallback.poster_url || fallback.image_url || '');

    const videoVal = isNonEmptyStr(sec.video_url)
      ? sec.video_url
      : (fallback.video_url || '');

    const ctaTextVal = isNonEmptyStr(sec.cta_text)
      ? sec.cta_text
      : (fallback.cta_text || '');

    const ctaUrlVal = isNonEmptyStr(sec.cta_url)
      ? sec.cta_url
      : (fallback.cta_url || '');

    const secondaryCtaTextVal = isNonEmptyStr(sec.secondary_cta_text)
      ? sec.secondary_cta_text
      : (fallback.secondary_cta_text || '');

    const secondaryCtaUrlVal = isNonEmptyStr(sec.secondary_cta_url)
      ? sec.secondary_cta_url
      : (fallback.secondary_cta_url || '');

    const itemsVal = (Array.isArray(sec.items) && sec.items.length > 0)
      ? sec.items
      : (Array.isArray(fallback.items) ? fallback.items : []);

    return {
      ...fallback,
      ...sec,
      id: sec.id || key,
      section_key: key,
      title: titleVal,
      heading: titleVal,
      subtitle: subVal,
      subheading: subVal,
      eyebrow: eyebrowVal,
      body: bodyVal,
      image_url: imageVal,
      poster_url: posterVal,
      video_url: videoVal,
      cta_text: ctaTextVal,
      cta_url: ctaUrlVal,
      secondary_cta_text: secondaryCtaTextVal,
      secondary_cta_url: secondaryCtaUrlVal,
      is_active: sec.is_active !== false,
      items: itemsVal,
    };
  };

  return {
    page,
    sections,
    sectionsList,
    getSection,
    loading,
  };
}
