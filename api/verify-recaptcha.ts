// Server-side reCAPTCHA verification

interface RecaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

/**
 * Verify a reCAPTCHA token with Google's API
 * @param token - The reCAPTCHA token from the client
 * @returns Object with verification result
 */
export async function verifyRecaptcha(
  token: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If no secret key is configured, allow the request (degraded security)
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - skipping verification');
    return { success: true };
  }

  // If no token provided, allow with warning (graceful degradation)
  if (!token) {
    console.warn('No reCAPTCHA token provided - allowing request with degraded security');
    return {
      success: true,
      score: 0.5, // Neutral score
    };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
      };
    }

    // Check the score (0.0 - 1.0, where 1.0 is very likely a good interaction)
    // reCAPTCHA v3 returns a score instead of a pass/fail
    // Increased from 0.5 to 0.6 for stricter bot detection
    const threshold = 0.6; // Adjust this threshold based on your needs
    if (data.score < threshold) {
      console.warn(`Low reCAPTCHA score: ${data.score} for action: ${data.action}`);
      return {
        success: false,
        score: data.score,
        error: 'Suspicious activity detected. Please try again.',
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    // On error, allow the request to avoid blocking legitimate users
    return { success: true };
  }
}
