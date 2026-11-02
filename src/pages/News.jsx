import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import HeroResponsiveImage from '../components/HeroResponsiveImage';
import { useNews } from '../hooks/useNews';
import { useCmsPage } from '../hooks/useCmsPage';
import { ArrowRight, Clock } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';
import PageSkeleton from '../components/PageSkeleton';

export default function News() {
  const { getSection, loading: cmsLoading, isError: cmsError } = useCmsPage('news');
  const { articles: newsArticles, loading: newsLoading } = useNews();

  useEffect(() => {
    document.title = "News & Perspectives | Onecore Pharma";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'NEWS & PERSPECTIVES',
    title: 'News & Perspectives',
    body: 'Stay updated with formulation research insights, therapeutic milestones, and manufacturing disciplines from Onecore Pharma.',
    image_url: '/assets/news-1.jpg',
  });

  const articlesList = newsArticles || [];
  const featuredArticle = articlesList.length > 0 ? articlesList[0] : null;
  const remainingArticles = articlesList.length > 1 ? articlesList.slice(1) : [];

  if ((cmsLoading && !cmsError) || (newsLoading && !newsArticles)) {
    return <PageSkeleton />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212] min-h-screen">
      
      {/* =========================================================================
          SECTION 1 — HERO BANNER
          Clean, stately, high-contrast human photography with bold typography
          ========================================================================= */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-end pb-16 sm:pb-24 pt-32 px-4 sm:px-8 lg:px-12 bg-black">
        {/* Hero Background Responsive Photograph */}
        <div className="absolute inset-0 z-0">
          <HeroResponsiveImage
            desktopImage={heroSec.image_url}
            mobileImage={heroSec.image_mobile_url || heroSec.mobile_image_url}
            alt="Onecore Pharma News & Perspectives"
            fallback="/assets/news-1.jpg"
            className="w-full h-full object-cover object-center"
          />
          {/* Directional contrast gradient — lessened intensity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Block */}
        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          <ScrollReveal>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif font-light text-white tracking-tight leading-[1.04] max-w-4xl">
              News & <br />
              <span className="italic font-normal text-[#D52B1E]">Clinical Perspectives.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed font-sans max-w-3xl">
              {heroSec.body || 'Stay updated with formulation research insights, therapeutic milestones, and manufacturing disciplines from Onecore Pharma.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — ARTICLES DIRECTORY
          ========================================================================= */}
      <section className="py-10 sm:py-14 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Featured / Lead Article */}
        {featuredArticle && (
          <ScrollReveal>
            <Link to={`/news/${featuredArticle.slug}`} className="block">
              <article className="group grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center bg-white border border-[#E5E3DC] hover:border-[#121212] rounded-[28px] p-6 sm:p-10 transition-all duration-300 shadow-xs hover:shadow-md">
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-2xl border border-[#E5E3DC] aspect-[16/10] bg-[#FAF9F6]">
                    <img
                      src={assetUrl(featuredArticle.image || '/assets/hero-healthcare.jpg')}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full py-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#777777]">
                      <span className="font-bold tracking-wider text-[#D52B1E] uppercase">
                        {featuredArticle.category}
                      </span>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#888888]" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#121212] group-hover:text-[#D52B1E] transition-colors leading-snug tracking-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-base sm:text-lg text-[#555555] font-light leading-relaxed font-sans">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#E5E3DC] flex items-center justify-between text-xs text-[#777777]">
                    <time dateTime={featuredArticle.date}>{featuredArticle.date}</time>
                    <span className="font-semibold text-[#121212] group-hover:text-[#D52B1E] flex items-center gap-1.5 transition-colors">
                      <span>Read Perspective</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </ScrollReveal>
        )}

        {/* Remaining Perspectives Grid */}
        {remainingArticles.length > 0 && (
          <div className="space-y-8">
            <div className="border-b border-[#E5E3DC] pb-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">
                Recent Publications & Updates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {remainingArticles.map((article, idx) => (
                <ScrollReveal key={article.id || idx} delay={(idx + 1) * 0.08}>
                  <Link to={`/news/${article.slug}`} className="block h-full">
                    <article className="group bg-white border border-[#E5E3DC] hover:border-[#121212] rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6 transition-all duration-300 shadow-xs hover:shadow-md">
                      <div className="space-y-5">
                        <div className="relative overflow-hidden rounded-2xl border border-[#E5E3DC] aspect-[16/10] bg-[#FAF9F6]">
                          <img
                            src={assetUrl(article.image || '/assets/hero-healthcare.jpg')}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#777777]">
                          <span className="font-bold tracking-wider text-[#D52B1E] uppercase">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#888888]" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#121212] group-hover:text-[#D52B1E] transition-colors leading-snug tracking-tight">
                          {article.title}
                        </h3>

                        <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed font-sans">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-5 border-t border-[#E5E3DC] flex items-center justify-between text-xs text-[#777777]">
                        <time dateTime={article.date}>{article.date}</time>
                        <span className="font-semibold text-[#121212] group-hover:text-[#D52B1E] flex items-center gap-1.5 transition-colors">
                          <span>Read Perspective</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </article>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
