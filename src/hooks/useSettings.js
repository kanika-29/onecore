import { useState } from 'react';
import { siteSettings as staticSettings } from '../data/siteSettings';

export function useSettings() {
  const [contact] = useState(staticSettings.contact);
  const [siteSettings] = useState({
    company_name: staticSettings.company_name,
    footer_tagline: staticSettings.footer_tagline,
    copyright_text: staticSettings.copyright_text,
    contact_email: staticSettings.contact.general_email,
    contact_phone: staticSettings.contact.phone,
    contact_hours: staticSettings.contact.office_hours,
    primary_cta_text: staticSettings.primary_cta_text,
  });
  const [loading] = useState(false);

  return { contact, siteSettings, loading };
}

