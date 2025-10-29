import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-6"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <svg
          className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="pb-6 pr-4 text-gray-400 animate-[fadeIn_0.5s_ease-in-out]">
          {children}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem question="What does this demo do?">
              <p>
                This demo showcases our AI Voice Agent's capabilities. When you enter your phone number and submit the form, our AI will call you. You can then interact with it by asking questions or giving commands, such as booking an appointment. It's a real-time demonstration of our conversational AI technology.
              </p>
            </FAQItem>
            <FAQItem question="What is the expected response time?">
              <p>
                You should receive a call almost instantly after submitting the form, typically within 5-10 seconds. The AI agent itself responds in real-time during the conversation, just like talking to a human agent.
              </p>
            </FAQItem>
            <FAQItem question="Is my information secure?">
              <p>
                Absolutely. We take data privacy very seriously. Your information is used solely for the purpose of this demonstration and is not shared with third parties. Please review our Privacy Policy for more details.
              </p>
            </FAQItem>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
