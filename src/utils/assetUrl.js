/**
 * Utility to resolve asset URLs correctly across local dev, preview, and GitHub Pages.
 * Strips leading slashes and prefixes with import.meta.env.BASE_URL (or './')
 */
export function assetUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Remove leading slash so it resolves with Vite BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}

export default assetUrl;
