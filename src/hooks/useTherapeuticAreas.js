import { useState, useEffect } from 'react';
import { areasOfCare as fallbackAreas } from '../data/areasOfCare';

export function useTherapeuticAreas() {
  const [areas, setAreas] = useState(fallbackAreas);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAreas() {
      try {
        const res = await fetch('/api/therapeutic-areas');
        if (!res.ok) return;

        const json = await res.json();
        if (!isMounted || !json.success || !Array.isArray(json.data) || json.data.length === 0) return;

        const divisionMap = {
          'oncology': { divisionName: 'Cytos', therapeuticArea: 'Oncology', fallbackImage: '/assets/therapeutic-oncology.jpg' },
          'paediatrics': { divisionName: 'Pediaplus', therapeuticArea: 'Pediatrics', fallbackImage: '/assets/therapeutic-paediatrics.jpg' },
          'pediatrics': { divisionName: 'Pediaplus', therapeuticArea: 'Pediatrics', fallbackImage: '/assets/therapeutic-paediatrics.jpg' },
          'ent': { divisionName: 'OTIRA', therapeuticArea: 'ENT', fallbackImage: '/assets/therapeutic-ent.jpg' },
          'womens-health': { divisionName: 'Femme', therapeuticArea: "Women's Health", fallbackImage: '/assets/therapeutic-womens-health.jpg' },
          'general-medicine': { divisionName: 'Omnara', therapeuticArea: 'General', fallbackImage: '/assets/therapeutic-general-medicine.jpg' },
          'general': { divisionName: 'Omnara', therapeuticArea: 'General', fallbackImage: '/assets/therapeutic-general-medicine.jpg' },
          'dermatology': { divisionName: 'Vellis', therapeuticArea: 'Dermatology', fallbackImage: '/assets/therapeutic-dermatology.jpg' },
          'ophthalmology': { divisionName: 'Eyerix', therapeuticArea: 'Ophthalmology', fallbackImage: '/assets/therapeutic-ophthalmology.jpg' },
          'neurology': { divisionName: 'Neurix', therapeuticArea: 'Neurology', fallbackImage: '/assets/therapeutic-neurology.jpg' },
          'orthopaedics': { divisionName: 'Ortheon', therapeuticArea: 'Orthopaedics', fallbackImage: '/assets/therapeutic-orthopaedics.jpg' },
          'orthopedic': { divisionName: 'Ortheon', therapeuticArea: 'Orthopaedics', fallbackImage: '/assets/therapeutic-orthopaedics.jpg' },
        };

        const fallbackImageMap = Object.fromEntries(fallbackAreas.map((a) => [a.id, a.image]));

        // Map API objects to the format expected by components
        const formatted = json.data.map((item, idx) => {
          const slug = item.slug || `area-${item.id}`;
          const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');
          const normalizedName = (item.name || '').toLowerCase().replace(/['’]/g, '').replace(/\s+/g, '-');
          const mapInfo = divisionMap[normalizedSlug] || divisionMap[normalizedName] || {};
          const defaultImg = mapInfo.fallbackImage || fallbackImageMap[normalizedSlug] || '/assets/therapeutic-general-medicine.jpg';

          return {
            id: slug,
            dbId: item.id,
            num: String(idx + 1).padStart(2, '0'),
            title: item.name?.toUpperCase() || '',
            displayName: mapInfo.therapeuticArea || item.name || '',
            divisionName: item.division_name || mapInfo.divisionName || '',
            therapeuticArea: mapInfo.therapeuticArea || item.name || '',
            heading: item.heading || item.short_description || '',
            description: item.description || item.full_description || item.short_description || '',
            image: item.image_url || defaultImg,
            image_url: item.image_url || defaultImg,
            isActive: item.is_active !== 0,
          };
        });

        setAreas(formatted);
      } catch (err) {
        console.warn('Therapeutic areas fetch failed, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAreas();

    return () => {
      isMounted = false;
    };
  }, []);

  return { areas, loading };
}
