import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0a192f] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Refund Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: October 29, 2025</p>

        <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6 mb-8">
          <p className="text-blue-300 text-lg">
            At Nexus AI Partners, we are committed to customer satisfaction. This Refund Policy outlines the circumstances
            under which refunds may be issued for our AI Voice Agent services.
          </p>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Setup Fee Refunds</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1.1 Full Refund (100%)</h3>
                <p className="mb-3">You are eligible for a full refund of the $799 setup fee if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You cancel your order within <strong className="text-white">48 hours of payment</strong> and before any setup work has commenced</li>
                  <li>We are unable to deliver the promised services due to technical limitations or circumstances beyond your control</li>
                  <li>There is a billing error or duplicate charge</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1.2 Partial Refund (50%)</h3>
                <p className="mb-3">You may be eligible for a 50% refund of the setup fee if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You cancel after 48 hours but within <strong className="text-white">7 days of payment</strong> and before significant setup work has been completed</li>
                  <li>Setup work has commenced but not exceeded 25% completion</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">1.3 No Refund</h3>
                <p className="mb-3">Setup fees are non-refundable if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cancellation occurs more than 7 days after payment</li>
                  <li>Setup work has been completed and delivered to you</li>
                  <li>Your AI voice agent is live and operational</li>
                  <li>Custom development work specific to your requirements has been completed</li>
                  <li>You violate our Terms of Service</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Monthly Subscription Refunds</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.1 Pro-Rated Refunds</h3>
                <p className="mb-3">
                  Monthly subscription fees are generally non-refundable. However, we may issue pro-rated refunds at our discretion if:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>There is a service outage lasting more than 48 consecutive hours due to our technical issues</li>
                  <li>We fail to provide the core functionality as described in your service agreement</li>
                  <li>There is a billing error resulting in overcharges</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.2 Cancellation Notice</h3>
                <p>
                  If you wish to cancel your monthly subscription, you must provide notice at least <strong className="text-white">5 days before</strong> your
                  next billing date. Cancellation will take effect at the end of your current billing period. No refunds will be issued for
                  the current month's subscription fee.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Additional Call Charges</h2>
            <p>
              Charges for additional calls beyond your plan limit ($0.50 per call) are final and non-refundable once the calls
              have been completed and logged in our system.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Service Quality Guarantee</h2>
            <div className="space-y-3">
              <p>
                We stand behind the quality of our AI Voice Agent services. If you experience issues with service quality,
                we will work with you to resolve them, which may include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Free technical support and troubleshooting</li>
                <li>AI voice agent retraining or adjustments</li>
                <li>System optimizations</li>
                <li>Additional setup assistance</li>
              </ul>
              <p className="mt-4">
                Refunds are issued only when we cannot resolve the issues through these support measures.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. How to Request a Refund</h2>
            <div className="space-y-3">
              <p>To request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team via email at <a href="mailto:info@nexusaipartners.com" className="text-blue-400 hover:text-blue-300">info@nexusaipartners.com</a></li>
                <li>Include your payment reference number and order details</li>
                <li>Provide a brief explanation of your refund request</li>
                <li>Allow 3-5 business days for us to review your request</li>
              </ol>
              <p className="mt-4">
                We will respond to your refund request within <strong className="text-white">3-5 business days</strong> and notify
                you of the approval or denial.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Refund Processing Time</h2>
            <div className="space-y-3">
              <p>
                <strong className="text-white">Approved refunds will be processed within 7-10 business days</strong> and will be
                returned to your original payment method via Paystack.
              </p>
              <p>
                Depending on your bank or card issuer, it may take an additional 3-5 business days for the refund to appear
                in your account.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Disputes and Chargebacks</h2>
            <p className="mb-4">
              We encourage you to contact us directly to resolve any payment disputes before initiating a chargeback with your
              bank or card issuer. Chargebacks may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Immediate suspension of services</li>
              <li>Additional fees to cover chargeback processing costs</li>
              <li>Termination of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be posted on this page with an
              updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the modified policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our Refund Policy or need to request a refund, please contact us:
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="mb-2"><strong className="text-white">Nexus AI Partners</strong></p>
              <p className="mb-2">Email: <a href="mailto:info@nexusaipartners.com" className="text-blue-400 hover:text-blue-300">info@nexusaipartners.com</a></p>
              <p className="mb-2">Website: <a href="https://nexusaipartners.com/contact/" className="text-blue-400 hover:text-blue-300">https://nexusaipartners.com/contact/</a></p>
              <p className="mt-4 text-sm text-gray-400">Support hours: Monday - Friday, 9:00 AM - 5:00 PM SAST</p>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-700">
            <div className="bg-green-900/30 border border-green-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Our Commitment</h3>
              <p className="text-green-300">
                At Nexus AI Partners, we value your trust and business. While our refund policy outlines specific conditions,
                we are committed to working with you to ensure your satisfaction. If you're experiencing issues with our services,
                please reach out to us first—we're here to help!
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12">
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;
