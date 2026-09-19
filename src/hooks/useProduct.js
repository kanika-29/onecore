import { useState, useEffect } from 'react';

const staticOneFlexoData = {
  id: 1,
  therapeutic_area_id: 3,
  brand_name: 'OneFLEXO',
  slug: 'oneflexo',
  short_description: 'Specialised joint health formulation combining Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule.',
  full_description: 'OneFLEXO is a specialised joint health formulation that combines Aflapin®, native undenatured Type II collagen and Mobilee® in a single capsule. The formulation is designed to bring together complementary ingredients used in musculoskeletal and joint support.',
  packshot_url: '/assets/products/oneflexo-packshot.png',
  compositions: [
    {
      ingredient_name: 'Aflapin®',
      ingredient_subtitle: 'Boswellia serrata gum resin extract',
      amount: '100 mg',
      role_description: 'Standardized Boswellia extract specialized in joint comfort.',
    },
    {
      ingredient_name: 'Native Type II Collagen',
      ingredient_subtitle: 'Undenatured collagen Type II',
      amount: '40 mg',
      role_description: 'Intact molecular collagen supporting joint cartilage integrity.',
    },
    {
      ingredient_name: 'Mobilee®',
      ingredient_subtitle: 'Sodium hyaluronate, polysaccharides and collagen complex',
      amount: '40 mg',
      role_description: 'Patented hyaluronic acid matrix supporting joint fluid nourishment.',
    },
  ],
  benefits: [
    {
      title: 'JOINT COMFORT',
      description: 'Supports the formulation’s role in maintaining comfort during everyday movement.',
    },
    {
      title: 'MOBILITY',
      description: 'Designed to support mobility as part of an overall musculoskeletal care approach.',
    },
    {
      title: 'JOINT STRUCTURE SUPPORT',
      description: 'Combines ingredients selected for complementary roles in joint and connective tissue support.',
    },
  ],
  safety_sections: [
    {
      section_title: 'WHO SHOULD NOT USE THIS PRODUCT',
      content: 'Individuals with known hypersensitivity to any of the ingredients should not consume this product. Consult your physician if pregnant, nursing, or undergoing concurrent medical therapy.',
    },
    {
      section_title: 'STORAGE INSTRUCTIONS',
      content: 'Store in a cool, dry place away from direct sunlight and moisture. Keep out of reach of children.',
    },
  ],
};

export function useProduct(slugOrId = 'oneflexo') {
  const [product, setProduct] = useState(() => {
    return slugOrId === 'oneflexo' || slugOrId === '1' ? staticOneFlexoData : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slugOrId === 'oneflexo' || slugOrId === '1') {
      setProduct(staticOneFlexoData);
    } else {
      setProduct(null);
    }
    setLoading(false);
  }, [slugOrId]);

  return { product, loading };
}

