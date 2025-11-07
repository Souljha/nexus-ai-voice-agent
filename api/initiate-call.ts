import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CallRequestBody {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
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
    console.log('Initiating call request - MINIMAL VERSION');
    const { phoneNumber, firstName, lastName, email, message } = req.body as CallRequestBody;

    // Basic validation
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
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
