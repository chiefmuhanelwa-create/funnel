import { analytics } from './analytics';

export async function loadAnalytics() {
  try {
    // Fetch analytics config from API
    const response = await fetch('/api/analytics/config');
    const config = await response.json();

    if (config.ga4MeasurementId) {
      loadGA4(config.ga4MeasurementId);
    }

    if (config.facebookPixelId) {
      loadFacebookPixel(config.facebookPixelId);
    }

    // Set config in analytics instance
    analytics.setConfig(config.ga4MeasurementId, config.facebookPixelId);
  } catch (error) {
    console.error('Failed to load analytics config:', error);
  }
}

function loadGA4(measurementId: string) {
  // Check if already loaded
  if (window.gtag) return;

  // Create script elements
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
  });
}

function loadFacebookPixel(pixelId: string) {
  // Check if already loaded
  if (window.fbq) return;

  // Facebook Pixel base code
  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
}
