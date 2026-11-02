/**
 * Central image path resolution helper
 * Safely resolves relative, uploaded, absolute, and asset URLs.
 * Prevents double `/uploads/uploads/` errors and falls back to `/placeholder.png`.
 */
export function resolveImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.png';
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:')
  ) {
    return imagePath;
  }

  // Strip leading slashes
  let cleaned = imagePath.replace(/^\/+/, '');

  // Fix duplicate or nested prefixes: uploads/uploads/... or assets/uploads/... -> uploads/...
  cleaned = cleaned.replace(/^uploads\/uploads\//, 'uploads/');
  cleaned = cleaned.replace(/^assets\/uploads\//, 'uploads/');

  // If it points to /images/divisions/
  if (cleaned.startsWith('images/divisions/')) {
    const filename = cleaned.replace(/^images\/divisions\//, '');
    const divisionMap = {
      'general-medicine.jpg': '/assets/therapeutic-general-medicine.jpg',
      'ortheon.jpg': '/assets/ortheon.jpg',
      'orthopaedics.jpg': '/assets/ortheon.jpg',
      'womens-health.jpg': '/assets/therapeutic-womens-health.jpg',
      'pediaplus.jpg': '/assets/pediaplus.jpg',
      'pediatrics.jpg': '/assets/pediaplus.jpg',
      'paediatrics.jpg': '/assets/pediaplus.jpg',
      'neurix.jpg': '/assets/neurix.jpg',
      'neurology.jpg': '/assets/neurix.jpg',
      'eyerix.jpg': '/assets/eyerix.jpg',
      'ophthalmology.jpg': '/assets/eyerix.jpg',
      'vellis.webp': '/assets/vellis.webp',
      'dermatology.jpg': '/assets/vellis.webp',
      'otira.jpg': '/assets/otira.jpg',
      'ent.jpg': '/assets/otira.jpg',
      'cytos.jpg': '/assets/cytos.jpg',
      'oncology.jpg': '/assets/cytos.jpg',
    };
    if (divisionMap[filename]) {
      return divisionMap[filename];
    }
  }

  // If it points to public assets
  if (cleaned.startsWith('assets/')) {
    return withCacheBuster(`/${cleaned}`);
  }

  // If it already starts with uploads/
  if (cleaned.startsWith('uploads/')) {
    return withCacheBuster(`/${cleaned}`);
  }

  // Otherwise treat as an uploaded file name
  return withCacheBuster(`/uploads/${cleaned}`);
}

/**
 * Appends a cache-busting version token to local assets so mobile browsers
 * never serve stale disk-cached images after an update.
 */
function withCacheBuster(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('?v=') || url.includes('&v=')) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=20261023v1`;
}

/**
 * Utility to resolve asset URLs correctly across local dev, preview, and production.
 * Strips leading slashes and prefixes with import.meta.env.BASE_URL (or './')
 */
export function assetUrl(path) {
  if (!path) return '/placeholder.png';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // If path is an uploaded asset or division hero banner, route through resolveImageUrl
  const clean = path.replace(/^\/+/, '');
  if (clean.startsWith('uploads/') || clean.startsWith('assets/uploads/') || clean.startsWith('images/divisions/')) {
    return resolveImageUrl(path);
  }

  // Remove leading slash so it resolves with Vite BASE_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return withCacheBuster(`${cleanBase}${cleanPath}`);
}

export default assetUrl;

