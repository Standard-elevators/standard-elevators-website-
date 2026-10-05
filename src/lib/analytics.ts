/**
 * Privacy-First Measurement & Conversion Tracking Utility
 * 
 * Complies with strict privacy standards:
 * - Captures ONLY aggregate interaction events (clicks, form starts, completions).
 * - NEVER captures or transmits personal form data (names, phones, emails).
 * - Dispatches to Google Analytics (gtag) if measurement ID is active,
 *   or records safely in development console.
 */

type AnalyticsEvent = 
  | 'page_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'click_phone'
  | 'click_email';

interface EventPayload {
  category?: string;
  label?: string;
  service?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: AnalyticsEvent, payload: EventPayload = {}): void {
  try {
    // Sanitization: Ensure NO personal data is ever logged
    const safePayload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      category: payload.category || 'general',
      label: payload.label || '',
      service: payload.service || '',
    };

    if (typeof window !== 'undefined') {
      // 1. Google Analytics / Tag Manager
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, safePayload);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(safePayload);
      }

      // 2. Development logging
      if (process.env.NODE_ENV === 'development') {
        // Safe anonymous debug
        // console.log(`[Analytics Event] ${eventName}:`, safePayload);
      }
    }
  } catch {
    // Analytics failures must never break user experience
  }
}
