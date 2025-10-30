import React, { useState } from 'react';
import { usePaystack } from '../hooks/usePaystack';
import { trackEvent } from '../utils/analytics';

interface PricingTierProps {
  name: string;
  price: string;
  setup: string;
  setupAmount: number; // numeric value for payment
  calls: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  onPaymentClick: (tierName: string, setupAmount: number) => void;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  setup,
  setupAmount,
  calls,
  features,
  highlighted = false,
  ctaText = "Get Started",
  onPaymentClick
}) => {
  const handleClick = () => {
    if (name === "Enterprise") {
      // Enterprise redirects to contact page
      window.location.href = "https://nexusaipartners.com/contact/";
    } else {
      onPaymentClick(name, setupAmount);
    }
  };

  return (
    <div className={`relative rounded-lg ${highlighted ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl scale-105' : 'bg-slate-800'} p-8 border ${highlighted ? 'border-blue-400' : 'border-slate-700'} transition-all duration-300 hover:shadow-xl`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-extrabold text-white">${price}</span>
          <span className="text-gray-400">/month</span>
        </div>
        <p className="text-gray-400 mt-2">+ ${setup} one-time setup</p>
        <p className="text-blue-400 font-semibold mt-1">{calls}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="flex-shrink-0 h-6 w-6 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${highlighted ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {ctaText}
      </button>
    </div>
  );
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: string;
  amount: number;
  onSubmit: (email: string, name: string, phone: string) => void;
  isProcessing: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, tierName, amount, onSubmit, isProcessing }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, name, phone);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-8 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Complete Your Purchase</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isProcessing}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-800">
          <p className="text-gray-300 text-sm mb-2">Plan: <span className="font-semibold text-white">{tierName}</span></p>
          <p className="text-gray-300 text-sm">Setup Fee: <span className="font-semibold text-white">${amount}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+27XXXXXXXXX"
              disabled={isProcessing}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Pay $${amount} Setup Fee`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const { isLoaded, initializePayment } = usePaystack();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{ name: string; amount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingTiers = [
    {
      name: "Starter",
      price: "149",
      setup: "799",
      setupAmount: 799,
      calls: "100 calls per month",
      features: [
        "1 AI Voice Agent",
        "Custom landing page integration",
        "Appointment booking & scheduling",
        "Email notifications",
        "Basic call analytics",
        "Standard support (email)"
      ]
    },
    {
      name: "Professional",
      price: "349",
      setup: "799",
      setupAmount: 799,
      calls: "500 calls per month",
      features: [
        "Up to 3 AI Voice Agents",
        "Full website integration",
        "Advanced booking features",
        "CRM integration (HubSpot, etc.)",
        "Custom voice training",
        "Advanced analytics dashboard",
        "Priority support (phone & email)",
        "Multi-language support"
      ],
      highlighted: true,
      ctaText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "999",
      setup: "Custom",
      setupAmount: 0, // Custom pricing - redirects to contact
      calls: "2,000+ calls per month",
      features: [
        "Unlimited AI Voice Agents",
        "Complete custom web development",
        "Full API access & integrations",
        "White-label solution",
        "Dedicated account manager",
        "Custom workflows & automations",
        "Advanced security & compliance",
        "24/7 premium support"
      ],
      ctaText: "Contact Sales"
    }
  ];

  const handlePaymentClick = (tierName: string, setupAmount: number) => {
    setSelectedTier({ name: tierName, amount: setupAmount });
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (email: string, name: string, phone: string) => {
    if (!selectedTier || !isLoaded) return;

    setIsProcessing(true);

    try {
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        alert('Payment system not configured. Please contact support.');
        setIsProcessing(false);
        return;
      }

      // Track payment initiation
      trackEvent('initiate_payment', {
        event_category: 'Payment',
        event_label: selectedTier.name,
        value: selectedTier.amount,
      });

      // Initialize Paystack payment
      initializePayment({
        email,
        amount: selectedTier.amount * 100, // Convert to kobo/cents
        publicKey,
        currency: 'ZAR',
        metadata: {
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: name,
            },
            {
              display_name: 'Phone Number',
              variable_name: 'phone_number',
              value: phone,
            },
            {
              display_name: 'Plan Type',
              variable_name: 'plan_type',
              value: selectedTier.name,
            },
          ],
        },
        onSuccess: async (response) => {
          console.log('Payment successful:', response);

          // Verify payment on backend
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reference: response.reference,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Track successful payment
              trackEvent('payment_success', {
                event_category: 'Payment',
                event_label: selectedTier.name,
                value: selectedTier.amount,
                transaction_id: response.reference,
              });

              alert(`Payment successful! Reference: ${response.reference}\n\nWe'll contact you shortly to begin setup.`);
              setIsModalOpen(false);
              setSelectedTier(null);
            } else {
              alert('Payment verification failed. Please contact support with reference: ' + response.reference);
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment received but verification failed. We\'ll contact you shortly. Reference: ' + response.reference);
          }

          setIsProcessing(false);
        },
        onClose: () => {
          console.log('Payment modal closed');
          setIsProcessing(false);

          // Track payment abandonment
          trackEvent('payment_abandoned', {
            event_category: 'Payment',
            event_label: selectedTier.name,
          });
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-[#0a192f]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include AI voice agent setup, web integration, and ongoing support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} onPaymentClick={handlePaymentClick} />
          ))}
        </div>

        {/* Payment Modal */}
        {isModalOpen && selectedTier && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTier(null);
            }}
            tierName={selectedTier.name}
            amount={selectedTier.amount}
            onSubmit={handlePaymentSubmit}
            isProcessing={isProcessing}
          />
        )}

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Need more calls? Additional capacity available at <span className="text-blue-400 font-semibold">$0.50 per call</span>
          </p>
          <p className="text-gray-500 text-sm">
            All plans include: SSL security, automatic backups, and regular updates. No hidden fees.
          </p>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Not sure which plan is right for you?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Schedule a free consultation with our team. We'll analyze your needs and recommend the best solution for your business.
          </p>
          <a href="https://nexusaipartners.com/contact/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
            Schedule Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
