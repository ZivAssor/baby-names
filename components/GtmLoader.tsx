'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Module-level so React strict-mode re-runs / remounts can never inject twice.
let gtmInjected = false;

/**
 * Injects the GTM container outside the first-tap window. With
 * strategy="afterInteractive" its ~365KB eval (GTM + bundled GA4) ran right
 * where mobile users make their first tap - the largest INP long task on
 * every page. Instead: inject on the first pointerdown/keydown (network
 * latency pushes the eval past that tap's paint), on first scroll (idle-
 * scheduled - scrolling is not INP-measured and most sessions scroll before
 * tapping), or after a ~3.5s idle fallback so read-only sessions still
 * record a page_view. Known trade-off: zero-gesture sessions shorter than
 * the fallback fire nothing (Vercel Analytics still counts them).
 */
export default function GtmLoader({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    if (!gtmId || gtmInjected) return;
    // If the user's first gesture is a nav tap, the container loads after the
    // client-side navigation - keep the true landing URL for attribution
    // (map dataLayer var originalLocation -> page_location in the container).
    const landingHref = window.location.href;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const cleanup = () => {
      document.removeEventListener('pointerdown', inject);
      document.removeEventListener('keydown', inject);
      document.removeEventListener('scroll', scheduleInject);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
    };
    function inject() {
      if (gtmInjected) return;
      gtmInjected = true;
      cleanup();
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ originalLocation: landingHref });
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      document.head.appendChild(script);
    }
    function scheduleInject() {
      // Wait for an idle slice so the container eval does not land mid-scroll
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(inject, { timeout: 2000 });
      } else {
        inject();
      }
    }
    document.addEventListener('pointerdown', inject, { passive: true });
    document.addEventListener('keydown', inject, { passive: true });
    document.addEventListener('scroll', scheduleInject, { passive: true });
    timeoutId = setTimeout(scheduleInject, 3500);
    return cleanup;
  }, [gtmId]);

  return null;
}
