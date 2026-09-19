import { useState } from 'react';
import { newsArticles as fallbackNews } from '../data/news';

export function useNews() {
  const [articles] = useState(fallbackNews);
  const [loading] = useState(false);

  return { articles, loading };
}

