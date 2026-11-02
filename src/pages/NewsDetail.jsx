import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import { assetUrl } from '../utils/assetUrl';

export default function NewsDetail() {
  const { slug } = useParams();
  const { articles, loading } = useNews();

  const article = articles?.find(a => a.slug === slug);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Onecore Pharma`;
      window.scrollTo(0, 0);
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-[#121212]">
        <div className="animate-pulse">Loading perspective...</div>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div className="w-full bg-transparent text-[#121212] min-h-[70vh]">
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Back Button */}
          <div>
            <Link 
              to="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-[#777777] hover:text-[#D52B1E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </div>

          {/* Article Header */}
          <header className="space-y-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-xs text-[#777777]">
              <span className="font-bold tracking-wider text-[#D52B1E] uppercase">
                {article.category}
              </span>
              <span className="hidden sm:inline">—</span>
              <time dateTime={article.date}>{article.date}</time>
              <span className="hidden sm:inline">—</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#121212] leading-tight tracking-tight">
              {article.title}
            </h1>
          </header>

          {/* Hero Image */}
          <div className="relative overflow-hidden rounded-3xl border border-[#E5E3DC] aspect-[2/1] sm:aspect-[21/9] bg-[#FAF9F6] shadow-sm">
            <img
              src={assetUrl(article.image || '/assets/hero-healthcare.jpg')}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/hero-healthcare.jpg';
              }}
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg sm:prose-xl prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#121212] prose-p:text-[#555555] prose-p:font-light prose-p:leading-relaxed prose-a:text-[#D52B1E] prose-a:no-underline hover:prose-a:underline">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>{article.excerpt}</p>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}
