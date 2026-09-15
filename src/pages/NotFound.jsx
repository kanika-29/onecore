import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-32 text-center">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-mono font-bold tracking-widest text-brand-sage uppercase">
          ERROR 404
        </span>
        <h1 className="editorial-heading text-4xl sm:text-5xl font-light text-brand-dark">
          Page Not Found
        </h1>
        <p className="text-base text-brand-muted">
          The requested URL could not be located. Explore our therapeutic specialties or return home.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-sage transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
