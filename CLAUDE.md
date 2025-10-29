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
- `GEMINI_API_KEY` - Gemini API key (exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`)

**Backend Variables (Serverless Functions):**
- `VAPI_PRIVATE_KEY` - Vapi private key for initiating outbound calls (server-side only, DO NOT expose to frontend)
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number to call FROM (e.g., `+27872502639`)

## Architecture

### Component Structure

The app follows a single-page layout with a component-based architecture:

- `App.tsx` - Root component with main layout structure (Header, Hero, FAQ, Footer, HelpWidget)
- `components/Hero.tsx` - Main hero section that embeds the DemoForm
- `components/DemoForm.tsx` - Core form handling user input and submission (currently simulates backend call)
- `components/Header.tsx`, `components/FAQ.tsx`, `components/Footer.tsx`, `components/HelpWidget.tsx` - Supporting UI sections

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

## Technology Stack

- React 19.2.0 with TypeScript
- Vite 6.2.0 for build tooling
- Tailwind CSS for styling (inline utility classes)
- Vapi Web SDK (@vapi-ai/web) for voice agent integration
- Gemini API integration (configured but not yet actively used in the codebase)
