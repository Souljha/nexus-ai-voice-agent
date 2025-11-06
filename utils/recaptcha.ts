// Google reCAPTCHA v3 utility functions

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Execute reCAPTCHA and get a token
 * @param action - The action name for this captcha (e.g., 'submit_form', 'initiate_call')
 * @returns Promise with the captcha token
 */
export async function executeRecaptcha(action: string): Promise<string> {
  if (!RECAPTCHA_SITE_KEY) {
    console.warn('reCAPTCHA site key not configured');
    return ''; // Return empty string if not configured
  }

  try {
    // Wait for grecaptcha to be ready
    await new Promise<void>((resolve) => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(resolve);
      } else {
        // If grecaptcha is not loaded, resolve anyway to avoid blocking
        console.warn('grecaptcha not loaded');
        resolve();
      }
    });

    // Execute reCAPTCHA
    const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    return token;
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    return ''; // Return empty string on error to avoid blocking legitimate users
  }
}

/**
 * Check if reCAPTCHA is loaded and ready
 */
export function isRecaptchaLoaded(): boolean {
  return typeof window !== 'undefined' &&
         typeof window.grecaptcha !== 'undefined' &&
         typeof window.grecaptcha.execute === 'function';
}
