/**
 * Onecore Pharma Cookie Consent Service
 * Compliant with India DPDP Act 2023, EU GDPR, and CCPA standards.
 * 
 * Manages user cookie preferences in localStorage with versioning,
 * event dispatching, and fallback defaults.
 */

export const COOKIE_CONSENT_STORAGE_KEY = 'onecore_cookie_consent';
export const COOKIE_CONSENT_VERSION = 1;

export const COOKIE_CATEGORIES = [
  {
    id: 'essential',
    name: 'Strictly Necessary',
    required: true,
    description: 'Essential for website navigation, cybersecurity, CSRF protection, and remembering your cookie consent choice. These cannot be disabled.',
    examples: 'Session cookies, security tokens, consent status'
  },
  {
    id: 'analytics',
    name: 'Analytics & Performance',
    required: false,
    description: 'Helps us anonymously measure page visits, traffic sources, and navigation patterns to improve website responsiveness and clinical content delivery.',
    examples: 'Google Analytics 4, aggregate pageview counters'
  },
  {
    id: 'functional',
    name: 'Functional & Preferences',
    required: false,
    description: 'Enables enhanced functionality and personalization, such as remembering your viewing preferences, regional settings, and form state.',
    examples: 'UI density, regional preferences'
  },
  {
    id: 'marketing',
    name: 'Communications & Regulatory Outreach',
    required: false,
    description: 'Used solely for measuring institutional healthcare outreach and partner distribution campaigns. Onecore Pharma does not sell your personal data.',
    examples: 'Campaign attribution, partner referral metrics'
  }
];

export const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  functional: false,
  marketing: false,
  timestamp: null,
  version: COOKIE_CONSENT_VERSION,
};

/**
 * Read the current stored cookie consent.
 * Returns null if user has never interacted with the banner.
 */
export function getStoredConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        essential: true, // Always required
        analytics: Boolean(parsed.analytics),
        functional: Boolean(parsed.functional),
        marketing: Boolean(parsed.marketing),
        timestamp: parsed.timestamp || null,
        version: parsed.version || COOKIE_CONSENT_VERSION,
      };
    }
  } catch (err) {
    console.warn('[CookieConsent] Failed to parse stored consent:', err);
  }
  return null;
}

/**
 * Save cookie consent choices and notify all application listeners.
 */
export function saveConsent(choices) {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  const consentRecord = {
    essential: true,
    analytics: Boolean(choices.analytics),
    functional: Boolean(choices.functional),
    marketing: Boolean(choices.marketing),
    timestamp: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION,
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consentRecord));
  } catch (err) {
    console.warn('[CookieConsent] Failed to write consent to localStorage:', err);
  }

  // Dispatch custom event for immediate script / analytics activation
  window.dispatchEvent(
    new CustomEvent('onecore:cookie-consent-updated', { detail: consentRecord })
  );

  return consentRecord;
}

/**
 * Accept all cookie categories
 */
export function acceptAllCookies() {
  return saveConsent({
    essential: true,
    analytics: true,
    functional: true,
    marketing: true,
  });
}

/**
 * Reject non-essential cookies (keep only Strictly Necessary)
 */
export function rejectNonEssentialCookies() {
  return saveConsent({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });
}

/**
 * Programmatically open the Cookie Preferences modal
 */
export function openCookiePreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('onecore:open-cookie-preferences'));
  }
}
