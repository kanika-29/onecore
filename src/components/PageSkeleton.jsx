import React from 'react';

/**
 * Premium, subtle loading skeleton for Onecore Pharma pages.
 * Prevents static content flash while database sections/products are loading.
 */
export default function PageSkeleton({ title = 'Loading page...' }) {
  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212] min-h-screen">
      {/* Top Breadcrumb / Header Spacer */}
      <div className="pt-24 sm:pt-28 pb-4 border-b border-[#E5E3DC] bg-white/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-4 w-40 bg-slate-200/80 animate-pulse rounded" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto border-b border-[#E5E3DC]/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="h-4 w-28 bg-[#D52B1E]/20 animate-pulse rounded" />
            <div className="h-12 sm:h-16 w-4/5 bg-slate-200/80 animate-pulse rounded-lg" />
            <div className="h-5 w-full max-w-xl bg-slate-200/60 animate-pulse rounded" />
            <div className="h-5 w-3/4 max-w-lg bg-slate-200/60 animate-pulse rounded" />
            <div className="pt-4 flex gap-4">
              <div className="h-11 w-40 bg-slate-200/80 animate-pulse rounded-full" />
              <div className="h-11 w-32 bg-slate-200/50 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[28px] overflow-hidden border border-[#E5E3DC] aspect-[16/10] bg-slate-200/70 animate-pulse shadow-xs" />
          </div>
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="space-y-4 mb-10">
          <div className="h-4 w-32 bg-[#D52B1E]/20 animate-pulse rounded" />
          <div className="h-8 w-64 bg-slate-200/80 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/80 border border-[#E5E3DC] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs"
            >
              <div className="h-6 w-1/2 bg-slate-200/80 animate-pulse rounded" />
              <div className="h-4 w-full bg-slate-200/60 animate-pulse rounded" />
              <div className="h-4 w-4/5 bg-slate-200/60 animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-slate-200/60 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
