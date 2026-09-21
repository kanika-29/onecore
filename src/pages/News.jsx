import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useNews } from '../hooks/useNews';
import { useCmsPage } from '../hooks/useCmsPage';
import { ArrowRight, Clock } from 'lucide-react';
import { assetUrl } from '../utils/assetUrl';

export default function News() {
  const { getSection } = useCmsPage('news');
  const { articles: newsArticles } = useNews();

  useEffect(() => {
    document.title = "News & Perspectives | Onecore Pharma";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'NEWS & PERSPECTIVES',
    title: 'News & Perspectives',
    body: 'Stay updated with formulation research insights, therapeutic milestones, and manufacturing disciplines from Onecore Pharma.',
    image_url: '/assets/news-1.jpg',
  });

  const featuredArticle = newsArticles.length > 0 ? newsArticles[0] : null;
  const remainingArticles = newsArticles.length > 1 ? newsArticles.slice(1) : [];

  return (
    <div className="w-full bg-[#FAF9F6] text-[#121212] min-h-screen">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HERO
          Spacious, dignified typography with signature crimson accent
          ========================================================================= */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-8 border-b border-[#E5E3DC] bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D52B1E] block">
            {heroSec.eyebrow || 'NEWS & PERSPECTIVES'}
          </span>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#121212] tracking-tight leading-[1.05]">
              News & <br />
              <span className="italic font-normal text-[#D52B1E]">Clinical Perspectives.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#555555] font-light leading-relaxed font-sans pt-1">
              {heroSec.body || 'Stay updated with formulation research insights, therapeutic milestones, and manufacturing disciplines from Onecore Pharma.'}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — ARTICLES DIRECTORY
          ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Featured / Lead Article */}
        {featuredArticle && (
          <ScrollReveal>
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
