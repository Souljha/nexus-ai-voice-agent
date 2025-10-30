# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nexus AI Voice Agent Demo is a React-based landing page that allows users to test a live AI voice agent service. Users can submit their contact information to receive a phone call from an AI agent, or try the service directly in their browser (coming soon).

AI Studio App: https://ai.studio/apps/drive/1CxAIQEQwFg3HnILty1rlKKWzO15gm2EH

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (starts on http://0.0.0.0:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Environment Configuration

Set the following variables in `.env.local` (local development) and Vercel Dashboard (production):

**Frontend Variables (VITE_ prefix):**
- `VITE_VAPI_PUBLIC_KEY` - Vapi public key for browser-based voice chat
- `VITE_VAPI_ASSISTANT_ID` - Vapi assistant ID (currently: `83336d7f-c0ec-4f7d-af9c-431b26be1729`)
- `VITE_GA_MEASUREMENT_ID` - Google Analytics Measurement ID (format: G-XXXXXXXXXX)
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack public key for payment processing (starts with `pk_test_` or `pk_live_`)
- `GEMINI_API_KEY` - Gemini API key (exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`)

**Backend Variables (Serverless Functions):**
- `VAPI_PRIVATE_KEY` - Vapi private key for initiating outbound calls (server-side only, DO NOT expose to frontend)
- `VAPI_PHONE_NUMBER_ID` - Vapi Phone Number ID from your Vapi dashboard (e.g., `0e0a14cf-c747-44df-add1-3d6a3c3e409c`)
- `PAYSTACK_SECRET_KEY` - Paystack secret key for payment verification (starts with `sk_test_` or `sk_live_`, server-side only)

## Architecture

### Component Structure

The app follows a single-page layout with a component-based architecture:

- `App.tsx` - Root component with main layout structure
- `components/Header.tsx` - Navigation header with links to main Nexus AI Partners site
- `components/Hero.tsx` - Main hero section that embeds the DemoForm
- `components/DemoForm.tsx` - Core form handling user input and voice agent demos
- `components/Testimonials.tsx` - Case studies and social proof section
- `components/Pricing.tsx` - 3-tier pricing model (Starter $149, Professional $349, Enterprise $999)
- `components/FAQ.tsx` - Frequently asked questions
- `components/Footer.tsx` - Footer with links and information

### Form Handling and Voice Integration

The DemoForm component (`components/DemoForm.tsx`) manages two interaction modes:

**Browser-Based Voice Chat (Active):**
- Uses Vapi Web SDK via the `useVapi` hook (`hooks/useVapi.ts`)
- "Try In Browser" button initiates WebRTC voice call directly in browser
- Real-time call status indicators: connecting → active → ending → ended
- Visual feedback: call status card, speaking indicator, volume level meter
- No backend required (uses Vapi public key)

**Phone Call Feature (Active):**
- Form collects: firstName, lastName, email, contactNumber, message (optional)
- Calls `/api/initiate-call` serverless function to trigger outbound call via Vapi + Twilio
- Backend API securely uses Vapi private key (not exposed to frontend)
- Status management: idle → loading → success/error → idle (5s delay)
- User receives phone call from AI agent on their device

### Type System

All form data types are centralized in `types.ts`. The `FormData` interface defines the structure for user submissions.

### Styling

Uses Tailwind CSS utility classes for all styling. Color scheme is based on dark slate/navy tones (`bg-[#0a192f]`, slate-800, slate-900) with blue accent colors (blue-400, blue-600).

### Path Aliasing

The project uses `@/*` as an alias for the project root (configured in both `vite.config.ts` and `tsconfig.json`).

## Key Integration Points

### Vapi Voice Agent Integration (Active)

**Browser-Based Voice Chat:**
- Fully implemented using `@vapi-ai/web` SDK
- `hooks/useVapi.ts` manages Vapi client lifecycle and events
- Handles: call-start, call-end, speech-start, speech-end, volume-level, error, message events
- Microphone permissions already declared in `metadata.json`
- Assistant ID: `83336d7f-c0ec-4f7d-af9c-431b26be1729` (Nexus AI Voice Agent)

**Event Listeners:**
- `call-start` - Updates UI to show active call status
- `call-end` - Resets UI after brief delay
- `speech-start/end` - Shows "AI Speaking..." indicator
- `volume-level` - Updates visual volume meter
- `error` - Displays error messages to user

### Backend Integration for Phone Calls (Implemented)

**Vercel Serverless Function:** `api/initiate-call.ts`
- Uses Vercel serverless architecture (no separate server needed)
- Receives phone number and user details from frontend
- Makes authenticated request to Vapi API to initiate outbound call
- Vapi private key stored securely in Vercel environment variables (not exposed to frontend)
- Returns success/error response to frontend

**API Endpoint:** `POST /api/initiate-call`

**Request Body:**
```json
{
  "phoneNumber": "+15551234567",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Call initiated successfully",
  "callId": "call_xyz123"
}
```

**Future Enhancement:** Consider adding phone number validation using libphonenumber-js

## Analytics & Tracking

### Google Analytics Integration

The app includes Google Analytics 4 (GA4) tracking:
- Configured in `index.html` with environment variable replacement
- Tracking utilities in `utils/analytics.ts`
- Automatically tracks: page views, lead submissions, call requests, browser demo starts

**Events Tracked:**
- `generate_lead` - When user submits contact information
- `request_call` - When user requests a phone call
- `start_browser_demo` - When user starts browser voice chat
- `view_pricing` - When user views pricing tiers

**Setup:**
1. Create a Google Analytics 4 property at https://analytics.google.com
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add `VITE_GA_MEASUREMENT_ID` to Vercel environment variables
4. Redeploy - tracking will work automatically

### Lead Tracking

All form submissions are tracked via:
- Google Analytics events (for analytics dashboards)
- Can be extended to integrate with CRMs (HubSpot, Salesforce, etc.)

## Payment Processing

### Paystack Integration

The app includes Paystack payment processing for setup fee payments:
- Setup fee payment collection ($799 for Starter/Professional tiers)
- Secure payment modal with customer information collection
- Backend payment verification via `/api/verify-payment`
- Payment tracking through Google Analytics

**Payment Flow:**
1. User clicks "Get Started" on pricing tier
2. Payment modal appears collecting: name, email, phone
3. Paystack popup handles secure payment
4. Backend verifies payment with Paystack API
5. Success confirmation and analytics tracking

**Files:**
- `hooks/usePaystack.ts` - Paystack integration hook
- `api/verify-payment.ts` - Backend payment verification
- `components/Pricing.tsx` - Payment UI and logic

**Events Tracked:**
- `initiate_payment` - When payment modal opens
- `payment_success` - Successful payment completion
- `payment_abandoned` - User closes payment without completing

**Setup:**
1. Get Paystack API keys from https://dashboard.paystack.com
2. Add `VITE_PAYSTACK_PUBLIC_KEY` for frontend (test: `pk_test_...`, live: `pk_live_...`)
3. Add `PAYSTACK_SECRET_KEY` for backend (test: `sk_test_...`, live: `sk_live_...`)
4. Use test keys for development, switch to live for production

## Technology Stack

- React 19.2.0 with TypeScript
- Vite 6.2.0 for build tooling
- Tailwind CSS for styling (inline utility classes)
- Vapi Web SDK (@vapi-ai/web) for voice agent integration
- Google Analytics 4 for tracking and analytics
- Gemini API integration (configured but not yet actively used in the codebase)
