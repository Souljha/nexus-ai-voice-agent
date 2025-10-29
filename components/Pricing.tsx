import React from 'react';

interface PricingTierProps {
  name: string;
  price: string;
  setup: string;
  calls: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

const PricingTier: React.FC<PricingTierProps> = ({ name, price, setup, calls, features, highlighted = false, ctaText = "Get Started" }) => {
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

      <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${highlighted ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
        {ctaText}
      </button>
    </div>
  );
};

const Pricing: React.FC = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "149",
      setup: "799",
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
            <PricingTier key={index} {...tier} />
          ))}
        </div>

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
