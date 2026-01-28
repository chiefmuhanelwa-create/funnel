// Analytics utility for GA4 and Facebook Pixel tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
}

interface EcommerceData {
  value: number;
  currency: string;
  items?: AnalyticsItem[];
  transaction_id?: string;
}

class Analytics {
  private ga4Id: string | null = null;
  private fbPixelId: string | null = null;

  setConfig(ga4Id: string, fbPixelId: string) {
    this.ga4Id = ga4Id;
    this.fbPixelId = fbPixelId;
  }

  // Page view tracking
  pageView(path: string, title?: string) {
    // GA4
    if (window.gtag && this.ga4Id) {
      window.gtag('config', this.ga4Id, {
        page_path: path,
        page_title: title,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  // Custom event tracking
  event(eventName: string, params?: Record<string, any>) {
    // GA4
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }

    // Facebook Pixel custom event
    if (window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }
  }

  // E-commerce: Begin checkout
  beginCheckout(data: EcommerceData) {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: data.currency,
        value: data.value / 100, // Convert cents to dollars
        items: data.items?.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price / 100,
          quantity: item.quantity || 1,
        })),
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: data.value / 100,
        currency: data.currency,
        num_items: data.items?.length || 1,
      });
    }
  }

  // E-commerce: Add payment info
  addPaymentInfo(data: EcommerceData) {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'add_payment_info', {
        currency: data.currency,
        value: data.value / 100,
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AddPaymentInfo', {
        value: data.value / 100,
        currency: data.currency,
      });
    }
  }

  // E-commerce: Purchase completed
  purchase(data: EcommerceData) {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: data.transaction_id,
        value: data.value / 100,
        currency: data.currency,
        items: data.items?.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price / 100,
          quantity: item.quantity || 1,
        })),
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: data.value / 100,
        currency: data.currency,
        content_type: 'product',
        content_ids: data.items?.map(item => item.item_id),
      });
    }
  }

  // Lead generation
  generateLead(data: { value?: number; currency?: string; source?: string }) {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'generate_lead', {
        value: (data.value || 0) / 100,
        currency: data.currency || 'USD',
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        value: (data.value || 0) / 100,
        currency: data.currency || 'USD',
      });
    }
  }

  // Sign up
  signUp(method: string = 'email') {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'sign_up', { method });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration', { method });
    }
  }
}

export const analytics = new Analytics();
