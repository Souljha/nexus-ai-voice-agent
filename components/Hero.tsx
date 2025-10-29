import React from 'react';
import DemoForm from './DemoForm';

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="flex-shrink-0 h-6 w-6 text-blue-400 mr-3 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-gray-300">{children}</span>
    </li>
);

const Hero: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Try Our AI Voice Agent — <span className="text-blue-400">Live Demo</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
          Enter your phone number and we’ll call you now. Say ‘book an appointment’ or ask a question.
        </p>

        <div className="max-w-2xl mx-auto">
          <DemoForm />
        </div>
        
        <div className="mt-12 text-left max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Short sample utterances to try:</h3>
            <ul className="space-y-3">
                <ListItem>“I’d like to book an appointment for next Tuesday.”</ListItem>
                <ListItem>“What are your business hours?”</ListItem>
                <ListItem>“Can you tell me about your AI Web Development services?”</ListItem>
            </ul>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Calls may be recorded for quality and improvement purposes. </p>
          <a href="#" className="underline hover:text-blue-400">Read our Privacy Policy</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
