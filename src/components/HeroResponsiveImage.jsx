import React, { useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

/**
 * HeroResponsiveImage
 * Responsive Hero Image component for Onecore Pharma.
 *
 * Fallback Behavior:
 * 1. If both desktopImage and mobileImage are provided:
 *    - Mobile view (<768px) displays mobileImage
 *    - Desktop view (>=768px) displays desktopImage
 * 2. If only desktopImage is provided:
 *    - Both desktop and mobile view display desktopImage
 * 3. If only mobileImage is provided:
 *    - Both desktop and mobile view display mobileImage
 * 4. If neither is provided:
 *    - Falls back to the provided fallback image (default: /assets/hero-healthcare.jpg)
 */
export default function HeroResponsiveImage({
  desktopImage,
  mobileImage,
  alt = 'Onecore Pharma',
  fallback = '/assets/hero-healthcare.jpg',
  className = 'w-full h-full object-cover object-center',
  loading = 'eager',
  ...rest
}) {
  const [hasError, setHasError] = useState(false);

  // Resolution hierarchy
  const fallbackSrc = assetUrl(fallback);
  const primaryDesktop = desktopImage?.trim() || mobileImage?.trim() || fallback;
  const primaryMobile = mobileImage?.trim() || desktopImage?.trim() || fallback;

  const desktopSrc = hasError ? fallbackSrc : assetUrl(primaryDesktop);
  const mobileSrc = hasError ? fallbackSrc : assetUrl(primaryMobile);

  const hasDistinctMobile = Boolean(mobileImage?.trim() && mobileImage.trim() !== desktopImage?.trim());

  return (
    <picture className="contents">
      {hasDistinctMobile && !hasError && (
        <source
          media="(max-width: 767px)"
          srcSet={mobileSrc}
        />
      )}
      <img
        src={desktopSrc}
        alt={alt}
        className={className}
        loading={loading}
        onError={(e) => {
          if (!hasError) {
            setHasError(true);
          } else {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackSrc;
          }
        }}
        {...rest}
      />
    </picture>
  );
}
