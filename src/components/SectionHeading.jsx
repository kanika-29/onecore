import React from 'react';

export default function SectionHeading({
  children,
  subtitle,
  className = '',
  isDark = false,
  as = 'h2',
  align = 'left'
}) {
  const Tag = as;
  const alignmentClasses = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`space-y-4 ${alignmentClasses} ${className}`}>
      <Tag
        className={`editorial-heading font-light tracking-tight ${
          as === 'h1'
            ? 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-brand-text'
            : as === 'h2'
            ? 'text-3xl sm:text-4xl lg:text-5xl font-normal'
            : 'text-2xl sm:text-3xl lg:text-4xl font-normal'
        } ${isDark ? 'text-white' : 'text-brand-text'}`}
      >
        {children}
      </Tag>
      {subtitle && (
        <p
          className={`text-base sm:text-lg lg:text-xl font-normal max-w-3xl leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-brand-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
