import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

/**
 * ProductImageGallery
 * Renders an interactive multiple-photo gallery with thumbnail strip,
 * active image zoom, and fullscreen lightbox modal.
 */
export default function ProductImageGallery({
  images = [],
  fallbackImage = '',
  brandName = 'Product',
  className = '',
}) {
  // Normalize images list
  const imageList = React.useMemo(() => {
    if (Array.isArray(images) && images.length > 0) {
      return images
        .map((img) => (typeof img === 'string' ? { image_url: img, alt_text: brandName } : img))
        .filter((img) => Boolean(img?.image_url));
    }
    if (fallbackImage) {
      return [{ image_url: fallbackImage, alt_text: brandName, is_primary: true }];
    }
    return [];
  }, [images, fallbackImage, brandName]);

  const [activeIndex, setActiveIndex] = useState(() => {
    const primaryIdx = imageList.findIndex((img) => img.is_primary);
    return primaryIdx >= 0 ? primaryIdx : 0;
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = imageList[activeIndex] || imageList[0] || { image_url: fallbackImage, alt_text: brandName };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full absolute inset-0`}>
      {/* Main Active Image Display */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden group p-6 lg:p-12">
        <img
          src={assetUrl(activeImage.image_url)}
          alt={activeImage.alt_text || `${brandName} - Onecore Pharma`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply drop-shadow-2xl"
          onError={(e) => {
            if (fallbackImage && e.target.src !== assetUrl(fallbackImage)) {
              e.target.src = assetUrl(fallbackImage);
            } else {
              e.target.style.display = 'none';
            }
          }}
        />

        {/* Expand / Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          title="View Full Size"
        >
          <Maximize2 size={16} />
        </button>

        {/* Counter Badge if Multiple Photos */}
        {imageList.length > 1 && (
          <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono font-medium text-white shadow-xs">
            {activeIndex + 1} / {imageList.length}
          </div>
        )}

        {/* In-frame Previous / Next Arrows for quick browsing */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Multiple Photos Thumbnails Strip */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto max-w-full pb-6 lg:pb-12 scrollbar-none justify-center z-10">
          {imageList.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border p-1 bg-white shrink-0 transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-[#D52B1E] ring-2 ring-[#D52B1E]/30 shadow-xs scale-105'
                    : 'border-[#E5E3DC] hover:border-slate-400 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={assetUrl(img.image_url)}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = assetUrl(fallbackImage);
                  }}
                />
                {img.is_primary && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#D52B1E] text-[8px] font-bold text-white text-center py-0.5 leading-none">
                    MAIN
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={assetUrl(activeImage.image_url)}
              alt={activeImage.alt_text || brandName}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Caption / Counter */}
          <div className="absolute bottom-6 inset-x-0 text-center text-white/80 text-sm font-sans">
            <span className="font-semibold text-white">{brandName}</span>
            {imageList.length > 1 && (
              <span className="ml-3 font-mono text-xs text-white/60">
                ({activeIndex + 1} of {imageList.length})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
