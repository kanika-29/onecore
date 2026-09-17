import React, { useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import FallbackImage from '../components/FallbackImage';
import PageBanner from '../components/PageBanner';
import { useNews } from '../hooks/useNews';
import { useCmsPage } from '../hooks/useCmsPage';
import { ArrowRight, Clock } from 'lucide-react';

export default function News() {
  const { getSection } = useCmsPage('news');
  const { articles: newsArticles } = useNews();

  useEffect(() => {
    document.title = "News & Perspectives | Onecore Pharma";
  }, []);

  const heroSec = getSection('hero', {
    eyebrow: 'NEWS & PERSPECTIVES',
    title: 'News',
    body: 'Stay updated with therapeutic breakthroughs, clinical partnership highlights, and sustainable manufacturing practices from Onecore Pharma.',
    image_url: '/assets/news-1.jpg',
  });

  const featuredArticle = newsArticles.length > 0 ? newsArticles[0] : null;
  const remainingArticles = newsArticles.length > 1 ? newsArticles.slice(1) : [];

  return (
    <div className="w-full bg-brand-ivory text-brand-text">
      {/* =========================================================================
          HERO / BANNER
          ========================================================================= */}
      <PageBanner
        title="News"
        imageUrl={heroSec.image_url || '/assets/news-1.jpg'}
        imageAlt="News - Onecore Pharma"
      />

      {/* =========================================================================
          NEWS & PERSPECTIVES ARTICLES SECTION
          ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-14 lg:space-y-16">
          {/* Featured / Lead Article */}
          {featuredArticle && (
            <ScrollReveal>
              <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-brand-ivory border border-brand-border rounded-sm p-6 sm:p-8 lg:p-10 hover:border-brand-sage/50 transition-all duration-300">
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-sm border border-brand-border">
                    <FallbackImage
                      src={featuredArticle.image || '/assets/hero-healthcare.jpg'}
                      alt={featuredArticle.title}
                      aspectRatio="aspect-[16/10]"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full py-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-brand-muted">
                      <span className="font-semibold tracking-wider text-brand-sage uppercase">
                        {featuredArticle.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-brand-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-medium text-brand-dark group-hover:text-brand-sage transition-colors leading-snug tracking-tight">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                    <time dateTime={featuredArticle.date}>{featuredArticle.date}</time>
                    <span className="font-semibold text-brand-dark group-hover:text-brand-sage flex items-center gap-1 uppercase tracking-wider">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          )}

          {/* Secondary Articles Grid */}
          {remainingArticles.length > 0 && (
            <div className="space-y-8">
              <div className="border-b border-brand-border pb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                  Recent Perspectives & Publications
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {remainingArticles.map((article, idx) => (
                  <ScrollReveal key={article.id || idx} delay={(idx + 1) * 0.08}>
                    <article className="group bg-brand-ivory border border-brand-border rounded-sm p-6 sm:p-8 flex flex-col h-full space-y-5 hover:border-brand-sage/50 transition-all duration-300">
                      <div className="relative overflow-hidden rounded-sm border border-brand-border">
                        <FallbackImage
                          src={article.image || '/assets/hero-healthcare.jpg'}
                          alt={article.title}
                          aspectRatio="aspect-[16/10]"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-brand-muted">
                        <span className="font-semibold tracking-wider text-brand-sage uppercase">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-brand-muted">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-medium text-brand-dark group-hover:text-brand-sage transition-colors leading-snug tracking-tight">
                        {article.title}
                      </h3>

                      <p className="text-sm sm:text-base text-brand-muted leading-relaxed flex-grow">
                        {article.excerpt}
                      </p>

                      <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted">
                        <time dateTime={article.date}>{article.date}</time>
                        <span className="font-semibold text-brand-dark group-hover:text-brand-sage flex items-center gap-1 uppercase tracking-wider">
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
