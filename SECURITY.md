# Security & Anti-Abuse Measures

This document describes the comprehensive security measures implemented to prevent abuse of the Nexus AI Voice Agent demo system.

## Overview

The system implements multiple layers of security to prevent bot abuse, spam, and excessive API usage that could drain Vapi credits:

1. **Rate Limiting** - Limits call frequency per IP and phone number
2. **Phone Number Validation** - Validates format and detects suspicious patterns
3. **Honeypot Fields** - Catches automated bots
4. **reCAPTCHA v3** - Google's invisible bot detection
5. **Call Duration Limits** - Prevents long-running call abuse
6. **Phone Number Blacklist** - Blocks known problematic numbers

---

## 1. Rate Limiting

### Implementation
- **Location**: `api/rate-limiter.ts`
- **Type**: In-memory rate limiting (for production, consider Redis or Vercel KV)

### Limits
- **Per IP Address**: Maximum 3 calls per 15-minute window
- **Per Phone Number**: Maximum 2 calls per 15-minute window
- **Block Duration**: 1 hour for severe violations (exceeding limits by 2x)

### Auto-Blacklist
- Phone numbers that exceed 10+ call attempts are automatically blacklisted
- Prevents persistent bot attacks

### How It Works
```typescript
// Example rate limit check
const ipRateLimit = checkRateLimit(`ip:${clientIp}`, 3);
if (!ipRateLimit.allowed) {
  return res.status(429).json({
    error: 'Rate limit exceeded',
    retryAfter: ipRateLimit.retryAfter,
  });
}
```

---

## 2. Phone Number Validation

### Validation Rules
- Must be in E.164 international format (e.g., `+15551234567`)
- Cannot contain all same digits (e.g., `+11111111111`)
- Cannot contain sequential patterns (e.g., `+12345678901`)

### Implementation
```typescript
function validatePhoneNumber(phoneNumber: string): { valid: boolean; error?: string }
```

### Blocked Patterns
- All same digits: `111111`, `222222`, etc.
- Sequential: `012345`, `123456`, `234567`, etc.

---

## 3. Honeypot Field

### What It Is
A hidden form field that's invisible to users but visible to bots. Legitimate users won't fill it, but bots typically auto-fill all fields.

### Implementation
- **Field Name**: `website` (common honeypot name)
- **Hidden**: Using CSS `hidden` class
- **Attributes**:
  - `tabIndex={-1}` - Prevents keyboard navigation
  - `autoComplete="off"` - Prevents browser autofill
  - `aria-hidden="true"` - Hides from screen readers

### Detection
If the honeypot field is filled, the request is treated as a bot submission and receives a fake success response to avoid revealing the detection mechanism.

```typescript
if (honeypot) {
  console.warn('Bot detected via honeypot field');
  return res.status(200).json({ success: true }); // Fake success
}
```

---

## 4. Google reCAPTCHA v3

### Features
- **Invisible**: No user interaction required (no checkboxes)
- **Score-Based**: Returns a score (0.0-1.0) indicating likelihood of being human
- **Action Tracking**: Tracks specific actions (`initiate_call`)

### Configuration
- **Frontend**: `VITE_RECAPTCHA_SITE_KEY` (public key)
- **Backend**: `RECAPTCHA_SECRET_KEY` (private key for verification)
- **Threshold**: 0.5 (requests with score below this are rejected)

### Setup Instructions

1. Get reCAPTCHA keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Choose **reCAPTCHA v3**
3. Add your domain(s)
4. Add environment variables:

```bash
# In Vercel Dashboard or .env.local
VITE_RECAPTCHA_SITE_KEY=6Lc...your_site_key
RECAPTCHA_SECRET_KEY=6Lc...your_secret_key
```

### How It Works
```typescript
// Frontend: Execute reCAPTCHA
const captchaToken = await executeRecaptcha('initiate_call');

// Backend: Verify token
const recaptchaResult = await verifyRecaptcha(captchaToken);
if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
  return res.status(403).json({ error: 'Security verification failed' });
}
```

---

## 5. Call Duration Limits

### Maximum Duration
- **Demo Calls**: 3 minutes (180 seconds)
- Previous abuse showed 10-minute calls draining credits

### Implementation
```typescript
body: JSON.stringify({
  assistantId: vapiAssistantId,
  customer: { number: phoneNumber },
  maxDurationSeconds: 180, // Enforced by Vapi
})
```

### Cost Savings
- 10-minute call: ~$1.50-$1.60
- 3-minute call: ~$0.45-$0.50
- **Savings**: ~70% cost reduction per call

---

## 6. Phone Number Blacklist

### Manual Blacklist
Add problematic numbers to the blacklist in `api/rate-limiter.ts`:

```typescript
const BLACKLISTED_NUMBERS = new Set<string>([
  '+1234567890',
  '+9876543210',
]);
```

### Auto-Blacklist
- Automatically blacklists numbers exceeding 10+ call attempts
- Logged for monitoring: `console.log(\`Added \${phoneNumber} to blacklist\`)`

### Checking Blacklist
```typescript
if (isPhoneBlacklisted(phoneNumber)) {
  return res.status(403).json({
    error: 'This phone number is not allowed.'
  });
}
```

---

## Security Layers Summary

| Layer | Purpose | Effectiveness |
|-------|---------|---------------|
| Rate Limiting | Prevent spam | High - Blocks rapid-fire requests |
| Phone Validation | Block fake numbers | Medium - Catches obvious patterns |
| Honeypot | Catch dumb bots | Medium - Effective against simple bots |
| reCAPTCHA v3 | Catch smart bots | High - Google's ML-based detection |
| Duration Limits | Prevent cost abuse | High - Direct cost control |
| Blacklist | Block repeat offenders | High - Permanent blocking |

---

## Monitoring & Alerts

### Console Logs
All security events are logged:
- `Bot detected via honeypot field`
- `Rate limit exceeded for IP: ${clientIp}`
- `Blocked blacklisted number: ${phoneNumber}`
- `reCAPTCHA verification failed`
- `Low reCAPTCHA score: ${score}`

### Vapi Dashboard
Monitor your Vapi account:
- **Call Logs**: `https://dashboard.vapi.ai/calls`
- **Billing**: `https://dashboard.vapi.ai/org/billing/credits`
- **Set up alerts**: Enable email notifications when credits are low

### Recommended Monitoring
1. Set up Vapi credit alerts (e.g., alert at 25% remaining)
2. Enable auto-reload if you have a payment method
3. Review call logs daily for suspicious patterns
4. Check Vercel logs for security events

---

## What Was the Attack?

Based on your screenshots:
1. **Attack Pattern**: Bot-to-bot loop
   - Another AI chatbot repeatedly called your AI agent
   - Each call hit the 10-minute maximum duration
   - Calls happened every minute (15:00, 15:01, 15:02, etc.)

2. **Cost Impact**:
   - Each 10-minute call: ~$1.50-$1.60
   - Multiple calls drained your entire credit balance
   - Account frozen at -18.49 credits

3. **Why It Happened**:
   - No rate limiting (fixed ✅)
   - No call duration limits (fixed ✅)
   - No bot detection (fixed ✅)
   - Publicly exposed phone number endpoint (hardened ✅)

---

## Preventing Future Attacks

### ✅ Already Implemented
1. Rate limiting per IP and phone number
2. Call duration limited to 3 minutes
3. Honeypot field for bot detection
4. reCAPTCHA v3 verification
5. Phone number validation and blacklist

### 🔄 Additional Recommendations

1. **Vapi Settings**:
   - Enable spending limits in Vapi dashboard
   - Set up auto-reload with a reasonable monthly cap
   - Enable low balance alerts

2. **Network Level** (Optional):
   - Add Cloudflare in front of Vercel for additional DDoS protection
   - Use Cloudflare's bot management features

3. **Application Level**:
   - Consider adding user authentication for call requests
   - Implement daily/weekly caps per user
   - Add CAPTCHA challenge for suspicious activity

4. **Monitoring**:
   - Set up Sentry or LogRocket for error tracking
   - Create a dashboard to monitor call patterns
   - Alert on unusual spikes in call volume

---

## Emergency Response

If you detect abuse:

1. **Immediate Actions**:
   ```typescript
   // Add to blacklist in api/rate-limiter.ts
   const BLACKLISTED_NUMBERS = new Set<string>([
     '+PROBLEM_NUMBER',
   ]);
   ```

2. **Temporarily Disable**:
   - Comment out the call initiation code
   - Display maintenance message
   - Redeploy on Vercel

3. **Review Logs**:
   - Check Vercel logs: `vercel logs`
   - Check Vapi call logs in dashboard
   - Identify attack patterns

4. **Adjust Thresholds**:
   - Lower rate limits if needed
   - Increase reCAPTCHA score threshold
   - Add stricter validation

---

## Testing Security Measures

### Test Rate Limiting
1. Submit form 3 times in quick succession
2. 4th attempt should be blocked with 429 error
3. Wait 15 minutes and try again (should work)

### Test Honeypot
1. Use browser dev tools to unhide honeypot field
2. Fill it in and submit
3. Should receive fake success (but no call initiated)

### Test Phone Validation
Try invalid numbers:
- `1234567890` (no +)
- `+11111111111` (all same)
- `+11234567890` (sequential)
Should receive validation errors

### Test reCAPTCHA
1. Disable JavaScript in browser
2. Try to submit form
3. Should fail reCAPTCHA verification

---

## Configuration Checklist

Before deploying to production:

- [ ] Get Google reCAPTCHA v3 keys
- [ ] Add `VITE_RECAPTCHA_SITE_KEY` to Vercel env vars
- [ ] Add `RECAPTCHA_SECRET_KEY` to Vercel env vars
- [ ] Set Vapi spending limits
- [ ] Enable Vapi credit alerts
- [ ] Test all rate limits
- [ ] Test call duration limits
- [ ] Monitor logs for 24 hours post-deploy
- [ ] Document any blacklisted numbers

---

## Support

If you encounter issues or need to adjust security settings:

1. Review Vercel logs: `https://vercel.com/dashboard`
2. Check Vapi dashboard: `https://dashboard.vapi.ai`
3. Adjust rate limits in `api/rate-limiter.ts`
4. Adjust reCAPTCHA threshold in `api/verify-recaptcha.ts`
5. Add numbers to blacklist as needed

---

**Last Updated**: 2025-11-06
**Version**: 1.0
