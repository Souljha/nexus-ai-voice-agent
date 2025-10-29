// Google Analytics tracking utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Lead tracking events
export const trackLead = (leadData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  source: 'phone_call' | 'browser_demo';
}) => {
  trackEvent('generate_lead', {
    event_category: 'Lead',
    event_label: leadData.source,
    value: 1,
    lead_email: leadData.email,
    lead_phone: leadData.phoneNumber,
  });
};

export const trackCallRequest = (phoneNumber: string) => {
  trackEvent('request_call', {
    event_category: 'Engagement',
    event_label: 'AI Voice Call',
    phone_number: phoneNumber,
  });
};

export const trackBrowserDemo = () => {
  trackEvent('start_browser_demo', {
    event_category: 'Engagement',
    event_label: 'Try In Browser',
  });
};

export const trackPricingView = (tier: string) => {
  trackEvent('view_pricing', {
    event_category: 'Pricing',
    event_label: tier,
  });
};
