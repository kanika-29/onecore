import { useState, useEffect } from 'react';

const defaultContact = {
  general_email: 'contact@onecorepharma.com',
  product_email: 'productinfo@onecorepharma.com',
  business_email: 'commercial@onecorepharma.com',
  careers_email: 'careers@onecorepharma.com',
  safety_email: 'patientsafety@onecorepharma.com',
  phone: '+91 (0) 22 4500 8900',
  address: 'Onecore Pharma Corporate Headquarters, Bio-Innovation Park, Level 7, Mumbai, Maharashtra 400051, India',
  office_hours: 'Monday to Friday, 9:00 AM – 6:00 PM IST',
};

export function useSettings() {
  const [contact, setContact] = useState(defaultContact);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) return;

        const json = await res.json();
        if (!isMounted || !json.success || !json.data) return;

        const map = json.data.settingsMap || {};
        if (Array.isArray(json.data.siteSettings)) {
          json.data.siteSettings.forEach((item) => {
            map[item.setting_key] = item.setting_value;
          });
        }
        setSiteSettings(map);

        const c = json.data.contactSettings || {};
        setContact({
          general_email: map.general_email || c.email || defaultContact.general_email,
          product_email: map.product_email || c.email || defaultContact.product_email,
          business_email: map.business_email || c.email || defaultContact.business_email,
          careers_email: map.careers_email || c.email || defaultContact.careers_email,
          safety_email: map.safety_email || c.email || defaultContact.safety_email,
          phone: map.phone || map.contact_phone || c.phone || defaultContact.phone,
          address: map.address || defaultContact.address,
          office_hours: map.office_hours || map.contact_hours || c.business_hours || defaultContact.office_hours,
        });
      } catch (err) {
        console.warn('Settings fetch failed, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { contact, siteSettings, loading };
}

