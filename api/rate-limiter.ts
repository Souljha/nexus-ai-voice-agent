// In-memory rate limiting storage
// For production, consider using Redis or Vercel KV
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_CONFIG = {
  // Max calls per time window per IP
  maxCallsPerIP: 3,
  // Max calls per time window per phone number
  maxCallsPerPhone: 2,
  // Time window in milliseconds (15 minutes)
  windowMs: 15 * 60 * 1000,
  // Block duration for repeated violations (1 hour)
  blockDurationMs: 60 * 60 * 1000,
  // Cleanup old entries every 30 minutes
  cleanupIntervalMs: 30 * 60 * 1000,
};

// Phone number blacklist (add problematic numbers here)
const BLACKLISTED_NUMBERS = new Set<string>([
  // Example: '+1234567890'
]);

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}, RATE_LIMIT_CONFIG.cleanupIntervalMs);

export function isPhoneBlacklisted(phoneNumber: string): boolean {
  return BLACKLISTED_NUMBERS.has(phoneNumber);
}

export function addToBlacklist(phoneNumber: string): void {
  BLACKLISTED_NUMBERS.add(phoneNumber);
  console.log(`Added ${phoneNumber} to blacklist`);
}

export function checkRateLimit(
  identifier: string,
  maxCalls: number
): { allowed: boolean; retryAfter?: number; reason?: string } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Check if blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      reason: 'Temporarily blocked due to excessive requests',
    };
  }

  // Initialize or reset if window expired
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true };
  }

  // Increment counter
  entry.count++;

  // Check if limit exceeded
  if (entry.count > maxCalls) {
    // Block if significantly over limit (indicates bot behavior)
    if (entry.count > maxCalls * 2) {
      entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
      console.warn(`Blocking ${identifier} for ${RATE_LIMIT_CONFIG.blockDurationMs / 1000}s due to excessive requests`);
    }

    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      reason: 'Rate limit exceeded. Please try again later.',
    };
  }

  return { allowed: true };
}

export function validatePhoneNumber(phoneNumber: string): { valid: boolean; error?: string } {
  // Remove spaces and dashes
  const cleaned = phoneNumber.replace(/[\s-]/g, '');

  // Check if it's in E.164 format (international format)
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(cleaned)) {
    return {
      valid: false,
      error: 'Phone number must be in international format (e.g., +15551234567)',
    };
  }

  // Check for suspicious patterns (all same digits, sequential, etc.)
  const digits = cleaned.substring(1); // Remove the +
  const allSame = /^(\d)\1+$/.test(digits);
  const sequential = /01234|12345|23456|34567|45678|56789|67890/.test(digits);

  if (allSame || sequential) {
    return {
      valid: false,
      error: 'Invalid phone number pattern',
    };
  }

  return { valid: true };
}

export function getRateLimitInfo(identifier: string): { remaining: number; resetIn: number } | null {
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxCallsPerIP - entry.count);
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);

  return { remaining, resetIn };
}
