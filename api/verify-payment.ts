import type { VercelRequest, VercelResponse } from '@vercel/node';

interface VerifyPaymentBody {
  reference: string;
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
    const { reference } = req.body as VerifyPaymentBody;

    // Validate reference
    if (!reference) {
      return res.status(400).json({ error: 'Payment reference is required' });
    }

    // Get Paystack secret key from environment
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error('Paystack verification error:', verifyData);
      return res.status(verifyResponse.status).json({
        error: verifyData.message || 'Payment verification failed',
        details: verifyData,
      });
    }

    // Check if payment was successful
    if (verifyData.data.status !== 'success') {
      return res.status(400).json({
        error: 'Payment was not successful',
        status: verifyData.data.status,
      });
    }

    // Payment successful - return transaction details
    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        reference: verifyData.data.reference,
        amount: verifyData.data.amount / 100, // Convert from kobo to main currency
        currency: verifyData.data.currency,
        status: verifyData.data.status,
        paid_at: verifyData.data.paid_at,
        customer: {
          email: verifyData.data.customer.email,
          customer_code: verifyData.data.customer.customer_code,
        },
        metadata: verifyData.data.metadata,
      },
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to verify payment',
    });
  }
}
