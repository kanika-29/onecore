/**
 * Mapping and helper to resolve Area of Care listing page routes dynamically.
 * Maps therapeutic area slugs, division names, category names, and database IDs
 * to their corresponding Area of Care product listing page.
 */

const AREA_ROUTE_MAP = {
  // Cytos / Oncology
  cytos: '/areas-of-care/cytos',
  oncology: '/areas-of-care/cytos',
  'cancer-care': '/areas-of-care/cytos',

  // Pediaplus / Pediatrics
  pediaplus: '/areas-of-care/pediaplus',
  pediatrics: '/areas-of-care/pediaplus',
  paediatrics: '/areas-of-care/pediaplus',
  pediatric: '/areas-of-care/pediaplus',

  // OTIRA / ENT
  otira: '/areas-of-care/otira',
  ent: '/areas-of-care/otira',
  'ear-nose-throat': '/areas-of-care/otira',

  // Femme / Women's Health
  femme: '/areas-of-care/femme',
  'womens-health': '/areas-of-care/femme',
  'women-health': '/areas-of-care/femme',
  gynaecology: '/areas-of-care/femme',
  gynecology: '/areas-of-care/femme',

  // Omnara / General Medicine
  omnara: '/areas-of-care/omnara',
  'general-medicine': '/areas-of-care/omnara',
  general: '/areas-of-care/omnara',
  'internal-medicine': '/areas-of-care/omnara',

  // Vellis / Dermatology
  vellis: '/areas-of-care/vellis',
  dermatology: '/areas-of-care/vellis',
  derma: '/areas-of-care/vellis',
  skin: '/areas-of-care/vellis',

  // Eyerix / Ophthalmology
  eyerix: '/areas-of-care/eyerix',
  ophthalmology: '/areas-of-care/eyerix',
  ocular: '/areas-of-care/eyerix',
  'eye-care': '/areas-of-care/eyerix',

  // Neurix / Neurology
  neurix: '/areas-of-care/neurix',
  neurology: '/areas-of-care/neurix',
  neuro: '/areas-of-care/neurix',

  // Ortheon / Orthopaedics
  ortheon: '/areas-of-care/ortheon',
  orthopaedics: '/areas-of-care/ortheon',
  orthopedic: '/areas-of-care/ortheon',
  orthopedics: '/areas-of-care/ortheon',
};

const AREA_ID_MAP = {
  1: '/areas-of-care/femme',
  2: '/areas-of-care/pediaplus',
  3: '/areas-of-care/ortheon',
  4: '/areas-of-care/neurix',
  5: '/areas-of-care/eyerix',
  6: '/areas-of-care/vellis',
  7: '/areas-of-care/otira',
  8: '/areas-of-care/omnara',
  9: '/areas-of-care/cytos',
};

/**
 * Returns the URL path to the Area of Care product listing page
 * based on product category metadata or fallback slug.
 *
 * @param {object} [product] - Product data object
 * @param {string} [defaultSlug] - Fallback therapeutic area slug (e.g. 'cytos')
 * @returns {string} Target route (e.g. '/areas-of-care/cytos')
 */
export function getAreaListingRoute(product, defaultSlug) {
  if (defaultSlug) {
    const s = String(defaultSlug).toLowerCase().trim();
    return AREA_ROUTE_MAP[s] || `/areas-of-care/${s}`;
  }

  if (product) {
    if (product.categoryUrl) {
      return product.categoryUrl;
    }
    if (product.therapeutic_area_slug) {
      const s = String(product.therapeutic_area_slug).toLowerCase().trim();
      if (AREA_ROUTE_MAP[s]) return AREA_ROUTE_MAP[s];
      return `/areas-of-care/${s}`;
    }
    if (product.therapeutic_area_id && AREA_ID_MAP[product.therapeutic_area_id]) {
      return AREA_ID_MAP[product.therapeutic_area_id];
    }
    if (product.division) {
      const d = String(product.division).toLowerCase().trim();
      if (AREA_ROUTE_MAP[d]) return AREA_ROUTE_MAP[d];
    }
    if (product.category) {
      const c = String(product.category).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      if (AREA_ROUTE_MAP[c]) return AREA_ROUTE_MAP[c];
    }
  }

  return '/areas-of-care';
}

export default getAreaListingRoute;
