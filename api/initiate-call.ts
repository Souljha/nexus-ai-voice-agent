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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, firstName, lastName, email, message } = req.body as CallRequestBody;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Get Vapi credentials from environment
    const vapiPrivateKey = process.env.VAPI_PRIVATE_KEY;
    const vapiAssistantId = process.env.VITE_VAPI_ASSISTANT_ID;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!vapiPrivateKey) {
      console.error('VAPI_PRIVATE_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!vapiAssistantId) {
      console.error('VAPI_ASSISTANT_ID not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!twilioPhoneNumber) {
      console.error('TWILIO_PHONE_NUMBER not configured');
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
        phoneNumber: {
          twilioPhoneNumber: twilioPhoneNumber, // The Twilio number to call FROM
        },
        customer: {
          number: phoneNumber, // The number to call TO (user's phone number)
        },
        metadata: callMetadata,
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
