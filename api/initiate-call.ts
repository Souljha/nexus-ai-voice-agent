import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  checkRateLimit,
  validatePhoneNumber,
  isPhoneBlacklisted,
  addToBlacklist
} from './rate-limiter';
import { verifyRecaptcha } from './verify-recaptcha';

interface CallRequestBody {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  honeypot?: string; // Bot detection field
  captchaToken?: string; // reCAPTCHA token
}

// Get client IP address
function getClientIp(req: VercelRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    'unknown'
  );
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, firstName, lastName, email, message, honeypot, captchaToken } = req.body as CallRequestBody;

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      console.warn('Bot detected via honeypot field');
      // Return success to avoid revealing the honeypot
      return res.status(200).json({
        success: true,
        message: 'Call initiated successfully',
      });
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(captchaToken || '');
    if (!recaptchaResult.success) {
      console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
      return res.status(403).json({
        error: recaptchaResult.error || 'Security verification failed. Please try again.',
      });
    }

    // Log reCAPTCHA score for monitoring
    if (recaptchaResult.score !== undefined) {
      console.log(`reCAPTCHA score: ${recaptchaResult.score}`);
    }

    // Validate phone number presence
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone number format and pattern
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({ error: phoneValidation.error });
    }

    // Check if phone number is blacklisted
    if (isPhoneBlacklisted(phoneNumber)) {
      console.warn(`Blocked blacklisted number: ${phoneNumber}`);
      return res.status(403).json({
        error: 'This phone number is not allowed. Please contact support if you believe this is an error.'
      });
    }

    // Get client IP for rate limiting
    const clientIp = getClientIp(req);

    // Rate limit by IP address (stricter: 2 calls per 15 min)
    const ipRateLimit = checkRateLimit(`ip:${clientIp}`, 2);
    if (!ipRateLimit.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({
        error: ipRateLimit.reason,
        retryAfter: ipRateLimit.retryAfter,
      });
    }

    // Rate limit by phone number (stricter: 1 call per 15 min)
    const phoneRateLimit = checkRateLimit(`phone:${phoneNumber}`, 1);
    if (!phoneRateLimit.allowed) {
      console.warn(`Rate limit exceeded for phone: ${phoneNumber}`);

      // Auto-blacklist if severely abused (reduced from 10+ to 5+ attempts for faster blocking)
      const entry = phoneRateLimit as any;
      if (entry.count && entry.count > 5) {
        addToBlacklist(phoneNumber);
      }

      return res.status(429).json({
        error: ipRateLimit.reason || 'Too many call requests for this number. Please try again later.',
        retryAfter: phoneRateLimit.retryAfter,
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
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to initiate call',
    });
  }
}
