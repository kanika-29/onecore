import { femmeProducts } from './femmeProducts';
import { pediatricsProducts } from './pediatricsProducts';
import { orthopaedicsProducts } from './orthopaedicsProducts';
import { neurologyProducts } from './neurologyProducts';
import { ophthalmologyProducts } from './ophthalmologyProducts';
import { dermatologyProducts } from './dermatologyProducts';
import { entProducts } from './entProducts';
import { generalMedicineProducts } from './generalMedicineProducts';
import { oncologyProducts } from './oncologyProducts';

// Build a unified searchable catalog of all 60+ formulations across all 9 therapeutic divisions
export const allProducts = [
  ...femmeProducts.map((p) => ({
    ...p,
    division: 'FEMME',
    category: "Women's Health",
    productUrl: `/areas-of-care/femme/${p.slug}`,
    categoryUrl: `/areas-of-care/femme`,
  })),
  ...pediatricsProducts.map((p) => ({
    ...p,
    division: 'PEDIAPLUS',
    category: 'Pediatrics',
    productUrl: `/areas-of-care/pediaplus/${p.slug}`,
    categoryUrl: `/areas-of-care/pediaplus`,
  })),
  ...orthopaedicsProducts.map((p) => ({
    ...p,
    division: 'ORTHEON',
    category: 'Orthopaedics',
    productUrl: `/areas-of-care/ortheon/${p.slug}`,
    categoryUrl: `/areas-of-care/ortheon`,
  })),
  ...neurologyProducts.map((p) => ({
    ...p,
    division: 'NEURIX',
    category: 'Neurology',
    productUrl: `/areas-of-care/neurix/${p.slug}`,
    categoryUrl: `/areas-of-care/neurix`,
  })),
  ...ophthalmologyProducts.map((p) => ({
    ...p,
    division: 'EYERIX',
    category: 'Ophthalmology',
    productUrl: `/areas-of-care/eyerix/${p.slug}`,
    categoryUrl: `/areas-of-care/eyerix`,
  })),
  ...dermatologyProducts.map((p) => ({
    ...p,
    division: 'VELLIS',
    category: 'Dermatology',
    productUrl: `/areas-of-care/vellis/${p.slug}`,
    categoryUrl: `/areas-of-care/vellis`,
  })),
  ...entProducts.map((p) => ({
    ...p,
    division: 'OTIRA',
    category: 'Ear, Nose & Throat (ENT)',
    productUrl: `/areas-of-care/otira/${p.slug}`,
    categoryUrl: `/areas-of-care/otira`,
  })),
  ...generalMedicineProducts.map((p) => ({
    ...p,
    division: 'OMNARA',
    category: 'General Medicine',
    productUrl: `/areas-of-care/omnara/${p.slug}`,
    categoryUrl: `/areas-of-care/omnara`,
  })),
  ...oncologyProducts.map((p) => ({
    ...p,
    division: 'CYTOS',
    category: 'Oncology',
    productUrl: `/areas-of-care/cytos/${p.slug}`,
    categoryUrl: `/areas-of-care/cytos`,
  })),
];

// Helper to search across product names, compositions, categories, and indications
export function searchFormulations(query) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return [];
  }
  const q = query.trim().toLowerCase();
  
  return allProducts.filter((item) => {
    const nameMatch = item.name?.toLowerCase().includes(q);
    const compMatch = item.composition?.toLowerCase().includes(q);
    const divMatch = item.division?.toLowerCase().includes(q);
    const catMatch = item.category?.toLowerCase().includes(q);
    const descMatch = item.description?.toLowerCase().includes(q);
    const usedMatch = item.usedFor?.toLowerCase().includes(q);
    return nameMatch || compMatch || divMatch || catMatch || descMatch || usedMatch;
  });
}
