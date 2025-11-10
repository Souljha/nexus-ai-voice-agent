import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CallRequestBody {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  honeypot?: string; // Bot detection
  recaptchaToken?: string; // reCAPTCHA v3 token
  formStartTime?: number; // When form was rendered
  userInteracted?: boolean; // Did user click/type before submit
}

// Verify reCAPTCHA token (serverless-safe)
async function verifyRecaptchaToken(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - allowing with warning');
    return { success: true, score: 0.5 };
  }

  if (!token) {
    console.warn('No reCAPTCHA token provided');
    return { success: false, error: 'Security verification required' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, error: 'Security verification failed' };
    }

    // reCAPTCHA v3 returns score 0.0-1.0 (1.0 = very likely human)
    if (data.score < 0.6) {
      console.warn(`Low reCAPTCHA score: ${data.score}`);
      return { success: false, score: data.score, error: 'Suspicious activity detected' };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

// Simple in-memory rate limiting (serverless-safe)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkSimpleRateLimit(key: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && entry.resetTime < now) {
    rateLimitStore.delete(key);
  }

  // Get or create entry
  const current = rateLimitStore.get(key);
  if (!current) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  // Check limit
  if (current.count >= maxCalls) {
    return false;
  }

  // Increment
  current.count++;
  return true;
}

// Simple phone validation
function validatePhoneFormat(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/[\s-]/g, '');
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(cleaned);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set JSON content type
  res.setHeader('Content-Type', 'application/json');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Initiating call request with enhanced security');
    const { phoneNumber, firstName, lastName, email, message, honeypot, recaptchaToken, formStartTime, userInteracted } = req.body as CallRequestBody;

    // 1. Honeypot check
    if (honeypot) {
      console.warn('Bot detected via honeypot');
      return res.status(200).json({ success: true, message: 'Call initiated successfully' });
    }

    // 2. reCAPTCHA verification (human detection)
    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken || '');
    if (!recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      return res.status(403).json({
        error: 'Security verification failed. Please refresh and try again.',
        details: recaptchaResult.error
      });
    }
    console.log(`reCAPTCHA score: ${recaptchaResult.score}`);

    // 3. Form timing check (bots submit too fast)
    if (formStartTime) {
      const formFillTime = Date.now() - formStartTime;
      const minFillTime = 3000; // Minimum 3 seconds to fill form

      if (formFillTime < minFillTime) {
        console.warn(`Form submitted too fast: ${formFillTime}ms`);
        return res.status(403).json({
          error: 'Please take your time to fill out the form.'
        });
      }
    }

    // 4. User interaction check
    if (userInteracted === false) {
      console.warn('No user interaction detected before submit');
      return res.status(403).json({
        error: 'Please interact with the form before submitting.'
      });
    }

    // 5. Basic validation
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Phone format validation
    if (!validatePhoneFormat(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use international format (e.g., +15551234567)' });
    }

    // Get client IP
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                     (req.headers['x-real-ip'] as string) ||
                     'unknown';

    // Rate limiting: 1 call per phone per 5 minutes (stricter)
    if (!checkSimpleRateLimit(`phone:${phoneNumber}`, 1, 5 * 60 * 1000)) {
      console.warn(`Rate limit exceeded for phone: ${phoneNumber}`);
      return res.status(429).json({
        error: 'Too many call requests. Please wait 5 minutes and try again.'
      });
    }

    // Rate limiting: 2 calls per IP per 5 minutes (stricter)
    if (!checkSimpleRateLimit(`ip:${clientIp}`, 2, 5 * 60 * 1000)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        error: 'Too many call requests from your location. Please wait 5 minutes and try again.'
      });
    }

    // Get Vapi credentials from environment
    const vapiPrivateKey = process.env.VAPI_PRIVATE_KEY;
    const vapiAssistantId = process.env.VITE_VAPI_ASSISTANT_ID;
    const vapiPhoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

    if (!vapiPrivateKey) {
      console.error('VAPI_PRIVATE_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!vapiAssistantId) {
      console.error('VAPI_ASSISTANT_ID not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!vapiPhoneNumberId) {
      console.error('VAPI_PHONE_NUMBER_ID not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare call metadata
    const callMetadata = {
      firstName: firstName || 'Guest',
      lastName: lastName || '',
      email: email || '',
      message: message || '',
    };

    // Make request to Vapi to initiate the call
    const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiPrivateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: vapiAssistantId,
        phoneNumberId: vapiPhoneNumberId, // Vapi Phone Number ID (configured in Vapi dashboard)
        customer: {
          number: phoneNumber, // The number to call TO (user's phone number)
        },
        metadata: callMetadata,
        // Add maximum call duration (3 minutes = 180 seconds) to prevent abuse
        maxDurationSeconds: 180,
      }),
    });

    const responseData = await vapiResponse.json();

    if (!vapiResponse.ok) {
      console.error('Vapi API error:', responseData);
      return res.status(vapiResponse.status).json({
        error: responseData.message || 'Failed to initiate call',
        details: responseData,
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Call initiated successfully',
      callId: responseData.id,
      data: responseData,
    });

  } catch (error: any) {
    console.error('Error initiating call:', error);
    console.error('Error stack:', error.stack);

    // Ensure we always return valid JSON
    try {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message || 'Failed to initiate call',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    } catch (jsonError) {
      // If even JSON response fails, return plain text
      return res.status(500).send(JSON.stringify({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      }));
    }
  }
}
