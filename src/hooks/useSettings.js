import { useState, useEffect } from 'react';

const defaultContact = {
  general_email: 'info@onecorepharma.in',
  product_email: 'info@onecorepharma.in',
  business_email: 'info@onecorepharma.in',
  careers_email: 'info@onecorepharma.in',
  safety_email: 'info@onecorepharma.in',
  phone: '8169255034',
  address: 'Onecore Pharma Corporate Headquarters, Bio-Innovation Park, Level 7, Mumbai, Maharashtra 400051, India',
  office_hours: '10 AM - 7 PM',
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
          general_email: map.general_email || map.contact_email || c.email || defaultContact.general_email,
          product_email: map.product_email || map.contact_email || c.email || defaultContact.product_email,
          business_email: map.business_email || map.contact_email || c.email || defaultContact.business_email,
          careers_email: map.careers_email || map.contact_email || c.email || defaultContact.careers_email,
          safety_email: map.safety_email || map.contact_email || c.email || defaultContact.safety_email,
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
