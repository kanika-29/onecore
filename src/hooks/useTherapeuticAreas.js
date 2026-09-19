import { useState } from 'react';
import { areasOfCare as fallbackAreas } from '../data/areasOfCare';

export function useTherapeuticAreas() {
  const [areas] = useState(fallbackAreas);
  const [loading] = useState(false);

  return { areas, loading };
}

