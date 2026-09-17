import React from 'react';
import PageBanner from './PageBanner';

export default function PageHero({
  title,
  imageUrl,
  imageAlt,
  className = '',
}) {
  return (
    <PageBanner
      title={title}
      imageUrl={imageUrl}
      imageAlt={imageAlt}
      className={className}
    />
  );
}
