/**
 * Onecore Analytics & Script Consent Manager
 * Dynamically loads and pauses external scripts (like Google Analytics)
 * strictly in accordance with user cookie consent.
 */

import { getStoredConsent } from './cookieConsent';

let isInitialized = false;
let currentTrackingId = null;

export function initAnalyticsManager(trackingId) {
  if (typeof window === 'undefined') return;
  if (!trackingId || typeof trackingId !== 'string') return;

  const cleanId = trackingId.trim();
  if (!cleanId) return;
  currentTrackingId = cleanId;

  const consent = getStoredConsent();
  if (consent && consent.analytics) {
    loadGoogleAnalytics(cleanId);
  } else {
    disableGoogleAnalytics(cleanId);
  }

  if (!isInitialized) {
    isInitialized = true;
    window.addEventListener('onecore:cookie-consent-updated', (e) => {
      const updatedConsent = e.detail;
      if (currentTrackingId) {
        if (updatedConsent?.analytics) {
          loadGoogleAnalytics(currentTrackingId);
        } else {
          disableGoogleAnalytics(currentTrackingId);
        }
      }
    });
  }
}

function loadGoogleAnalytics(trackingId) {
  if (typeof window === 'undefined') return;

  // Re-enable in case it was disabled previously
  window[`ga-disable-${trackingId}`] = false;

  const scriptId = `ga-gtag-${trackingId}`;
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', trackingId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }
}

function disableGoogleAnalytics(trackingId) {
  if (typeof window === 'undefined') return;
  window[`ga-disable-${trackingId}`] = true;
}
