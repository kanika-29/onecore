import React, { useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

export default function FallbackImage({
  src,
  alt = 'Onecore Pharma visual',
  className = '',
  aspectRatio = 'aspect-[4/3]',
  caption = ''
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const resolvedSrc = assetUrl(src);

  return (
    <div className={`relative overflow-hidden bg-brand-surface border border-brand-border/60 ${aspectRatio} ${className}`}>
      {!hasError ? (
        <>
          <img
            src={resolvedSrc}
            alt={alt}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-brand-surface flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full border-2 border-brand-sage/30 border-t-brand-sage animate-spin" />
            </div>
          )}
        </>
      ) : (
        /* Graceful editorial architectural placeholder */
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-brand-surface via-brand-ivory to-brand-sage-light/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">ONECORE PHARMA</span>
            </div>
            <span className="text-[11px] font-mono text-brand-muted/70">ARCHIVE REF // OC-26</span>
          </div>

          <div className="space-y-2 my-auto py-6">
            <div className="h-[1px] w-12 bg-brand-sage mb-4" />
            <p className="text-sm sm:text-base font-medium text-brand-text max-w-sm">{alt}</p>
            <p className="text-xs text-brand-muted">Purposeful formulation & clinical research environment</p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-brand-muted border-t border-brand-border/60 pt-3">
            <span>CLINICAL EXCELLENCE</span>
            <span>QUALITY CONTROLLED</span>
          </div>
        </div>
      )}
      {caption && (
        <div className="absolute bottom-3 left-3 right-3 bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded">
          {caption}
        </div>
      )}
    </div>
  );
}
