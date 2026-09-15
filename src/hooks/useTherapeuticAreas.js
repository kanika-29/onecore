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
          'oncology': { divisionName: 'Cytos', therapeuticArea: 'Oncology' },
          'paediatrics': { divisionName: 'Pediaplus', therapeuticArea: 'Pediatrics' },
          'pediatrics': { divisionName: 'Pediaplus', therapeuticArea: 'Pediatrics' },
          'ent': { divisionName: 'OTIRA', therapeuticArea: 'ENT' },
          'womens-health': { divisionName: 'Femme', therapeuticArea: "Women's Health" },
          'general-medicine': { divisionName: 'Omnara', therapeuticArea: 'General' },
          'general': { divisionName: 'Omnara', therapeuticArea: 'General' },
          'dermatology': { divisionName: 'Vellis', therapeuticArea: 'Dermatology' },
          'ophthalmology': { divisionName: 'Eyerix', therapeuticArea: 'Ophthalmology' },
          'neurology': { divisionName: 'Neurix', therapeuticArea: 'Neurology' },
          'orthopaedics': { divisionName: 'Ortheon', therapeuticArea: 'Orthopedic' },
          'orthopedic': { divisionName: 'Ortheon', therapeuticArea: 'Orthopedic' },
        };

        // Map API objects to the format expected by components
        const formatted = json.data.map((item, idx) => {
          const slug = item.slug || `area-${item.id}`;
          const mapInfo = divisionMap[slug] || divisionMap[item.name?.toLowerCase().replace(/\s+/g, '-')] || {};
          return {
            id: slug,
            dbId: item.id,
            num: String(idx + 1).padStart(2, '0'),
            title: item.name?.toUpperCase() || '',
            displayName: mapInfo.therapeuticArea || item.name || '',
            divisionName: item.division_name || mapInfo.divisionName || '',
            therapeuticArea: mapInfo.therapeuticArea || item.name || '',
            heading: item.short_description || '',
            description: item.full_description || item.short_description || '',
            image: item.image_url || '/assets/therapeutic-general-medicine.jpg',
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
