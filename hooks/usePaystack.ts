import { useEffect, useState } from 'react';

interface PaystackConfig {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  publicKey: string;
  reference?: string;
  currency?: string;
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
    [key: string]: any;
  };
  onSuccess?: (response: any) => void;
  onClose?: () => void;
}

// Declare Paystack on window
declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const usePaystack = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack inline script
    if (!document.getElementById('paystack-inline-js')) {
      const script = document.createElement('script');
      script.id = 'paystack-inline-js';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const initializePayment = (config: PaystackConfig) => {
    if (!isLoaded || !window.PaystackPop) {
      console.error('Paystack not loaded yet');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      currency: config.currency || 'ZAR',
      ref: config.reference || `${Date.now()}`,
      metadata: config.metadata,
      callback: (response: any) => {
        if (config.onSuccess) {
          config.onSuccess(response);
        }
      },
      onClose: () => {
        if (config.onClose) {
          config.onClose();
        }
      },
    });

    handler.openIframe();
  };

  return {
    isLoaded,
    initializePayment,
  };
};
