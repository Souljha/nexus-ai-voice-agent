import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0a192f] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last Updated: October 29, 2025</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Nexus AI Partners' AI Voice Agent services ("Services"), you agree to be bound by these Terms of Service ("Terms").
              If you do not agree to these Terms, please do not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Services Description</h2>
            <p className="mb-4">
              Nexus AI Partners provides AI-powered voice agent solutions including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI voice agents for inbound and outbound customer service calls</li>
              <li>Web development and AI voice integration services</li>
              <li>Custom landing page development</li>
              <li>24/7 automated customer support solutions</li>
              <li>CRM integration and custom workflow automation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Payment Terms</h2>
            <div className="space-y-3">
              <p><strong className="text-white">Setup Fees:</strong> A one-time setup fee of $799 is required for Starter and Professional plans. Payment is processed securely through Paystack.</p>
              <p><strong className="text-white">Monthly Subscription:</strong> After setup, monthly subscription fees apply based on your selected plan (Starter $149/mo, Professional $349/mo, Enterprise $999/mo).</p>
              <p><strong className="text-white">Call Usage:</strong> Each plan includes a specific number of monthly calls. Additional calls beyond your plan limit are charged at $0.50 per call.</p>
              <p><strong className="text-white">Payment Processing:</strong> All payments are processed through Paystack. By making a payment, you agree to Paystack's terms and conditions.</p>
              <p><strong className="text-white">Auto-Renewal:</strong> Monthly subscriptions auto-renew unless cancelled before the renewal date.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Service Delivery</h2>
            <div className="space-y-3">
              <p><strong className="text-white">Setup Timeline:</strong> Upon payment confirmation, we will contact you within 1-2 business days to begin the setup process.</p>
              <p><strong className="text-white">Delivery Time:</strong> Standard setup and deployment typically takes 5-10 business days, depending on complexity and customization requirements.</p>
              <p><strong className="text-white">Service Availability:</strong> We strive for 99.9% uptime for AI voice agents, though we cannot guarantee uninterrupted service due to maintenance or technical issues.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete information during registration and payment</li>
              <li>Use the Services only for lawful purposes</li>
              <li>Not misuse or attempt to disrupt the Services</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Comply with all applicable laws and regulations when using our Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our Services, including but not limited to AI models, software, designs, text, graphics,
              and logos, are owned by Nexus AI Partners and are protected by copyright, trademark, and other intellectual property laws.
              You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Privacy</h2>
            <p>
              We collect and process data in accordance with our Privacy Policy. By using our Services, you consent to our collection
              and use of data as described in our Privacy Policy. We implement industry-standard security measures to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cancellation and Termination</h2>
            <div className="space-y-3">
              <p><strong className="text-white">By You:</strong> You may cancel your subscription at any time by contacting our support team.
              Cancellation will take effect at the end of your current billing period.</p>
              <p><strong className="text-white">By Us:</strong> We reserve the right to suspend or terminate your access to our Services
              if you violate these Terms or engage in fraudulent or illegal activities.</p>
              <p><strong className="text-white">Effect of Termination:</strong> Upon termination, your right to use the Services will cease immediately.
              You will not receive refunds for any pre-paid subscription fees unless stated in our Refund Policy.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Nexus AI Partners shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Service interruptions or technical issues beyond our reasonable control</li>
              <li>Actions or omissions of third-party service providers</li>
            </ul>
            <p className="mt-4">
              Our total liability shall not exceed the amount you paid for the Services in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated
              Terms on our website with a new "Last Updated" date. Your continued use of the Services after changes constitutes
              acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of South Africa, without regard to
              its conflict of law provisions. Any disputes shall be resolved in the courts of South Africa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <p className="mb-2"><strong className="text-white">Nexus AI Partners</strong></p>
              <p className="mb-2">Email: <a href="mailto:info@nexusaipartners.com" className="text-blue-400 hover:text-blue-300">info@nexusaipartners.com</a></p>
              <p className="mb-2">Website: <a href="https://nexusaipartners.com/contact/" className="text-blue-400 hover:text-blue-300">https://nexusaipartners.com/contact/</a></p>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-700">
            <p className="text-sm text-gray-500">
              By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
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

export default TermsOfService;
