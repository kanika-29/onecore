import React from 'react';
import { useParams } from 'react-router-dom';
import FemmeProductDetail from '../pages/FemmeProductDetail';
import PediatricsProductDetail from '../pages/PediatricsProductDetail';
import OrthopaedicsProductDetail from '../pages/OrthopaedicsProductDetail';
import NeurologyProductDetail from '../pages/NeurologyProductDetail';
import OphthalmologyProductDetail from '../pages/OphthalmologyProductDetail';
import DermatologyProductDetail from '../pages/DermatologyProductDetail';
import EntProductDetail from '../pages/EntProductDetail';
import GeneralMedicineProductDetail from '../pages/GeneralMedicineProductDetail';
import OncologyProductDetail from '../pages/OncologyProductDetail';
import ProductOneFlexo from '../pages/ProductOneFlexo';

/**
 * Universal Product Detail Dispatcher
 * Resolves any division URL variant (brand name e.g. "femme", medical slug e.g. "womens-health")
 * to the corresponding specialized division product detail component.
 */
export default function ProductDetailDispatcher() {
  const { divisionSlug, productSlug } = useParams();
  const div = (divisionSlug || '').toLowerCase().trim();
  const prod = (productSlug || '').toLowerCase().trim();

  // Special case for OneFlexo flagship page
  if (prod === 'oneflexo') {
    return <ProductOneFlexo />;
  }

  // Women's Health / Femme
  if (['femme', 'womens-health', 'women-health', 'womenshealth', 'reproductive-health'].includes(div)) {
    return <FemmeProductDetail />;
  }

  // Paediatrics / Pediaplus
  if (['pediaplus', 'pediatrics', 'paediatrics', 'pediatric', 'paediatric', 'pedia'].includes(div)) {
    return <PediatricsProductDetail />;
  }

  // Orthopaedics / Ortheon
  if (['ortheon', 'orthopaedics', 'orthopedics', 'orthopaedic', 'orthopedic'].includes(div)) {
    return <OrthopaedicsProductDetail />;
  }

  // Neurology / Neurix
  if (['neurix', 'neurology', 'neuro', 'neurological'].includes(div)) {
    return <NeurologyProductDetail />;
  }

  // Ophthalmology / Eyerix
  if (['eyerix', 'ophthalmology', 'ophthalmic', 'ocular', 'eye-care', 'eye'].includes(div)) {
    return <OphthalmologyProductDetail />;
  }

  // Dermatology / Vellis
  if (['vellis', 'dermatology', 'derma', 'skin', 'skin-care'].includes(div)) {
    return <DermatologyProductDetail />;
  }

  // ENT / Otira
  if (['otira', 'ent', 'ear-nose-throat', 'ear-nose-and-throat'].includes(div)) {
    return <EntProductDetail />;
  }

  // Oncology / Cytos
  if (['cytos', 'oncology', 'cancer-care', 'cancer'].includes(div)) {
    return <OncologyProductDetail />;
  }

  // General Medicine / Omnara (and default fallback)
  return <GeneralMedicineProductDetail />;
}
