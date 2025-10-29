import React, { useState } from 'react';
import { FormData } from '../types';
import { useVapi } from '../hooks/useVapi';

const InputField: React.FC<{ id: string; name: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = (props) => (
  <input
    className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
    {...props}
  />
);

const TextAreaField: React.FC<{ id: string; name: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = (props) => (
    <textarea
        className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
        {...props}
    />
);

const DemoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Vapi integration for browser-based voice chat
  const { isConnected, callStatus, error: vapiError, startCall, endCall, isSpeaking, volumeLevel } = useVapi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // Call the Vercel serverless function to initiate the phone call
      const response = await fetch('/api/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.contactNumber,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate call');
      }

      setStatus('success');
      setMessage('Success! You should receive a call from our AI agent shortly.');
      setFormData({ firstName: '', lastName: '', email: '', contactNumber: '', message: '' });
    } catch (error: any) {
      console.error('Error initiating call:', error);
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again later.');
    } finally {
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  const handleTryInBrowser = () => {
    if (isConnected) {
      endCall();
    } else {
      startCall();
    }
  };

  // Get button text and styling based on call status
  const getButtonConfig = () => {
    switch (callStatus) {
      case 'connecting':
        return { text: 'Connecting...', disabled: true, className: 'bg-yellow-600 hover:bg-yellow-600' };
      case 'active':
        return { text: 'End Call', disabled: false, className: 'bg-red-600 hover:bg-red-700' };
      case 'ending':
        return { text: 'Ending...', disabled: true, className: 'bg-red-800 hover:bg-red-800' };
      default:
        return { text: 'Try In Browser', disabled: false, className: 'border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white' };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="bg-slate-900/50 p-6 md:p-8 rounded-lg border border-slate-800 shadow-xl">
      {/* Active Call Status Card */}
      {isConnected && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-green-400 font-semibold">Call Active</span>
            </div>
            {isSpeaking && (
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-400 text-sm">AI Speaking...</span>
              </div>
            )}
          </div>
          {volumeLevel > 0 && (
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 transition-all duration-100"
                style={{ width: `${Math.min(volumeLevel * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {vapiError && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{vapiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <InputField id="firstName" name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="w-full">
            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <InputField id="lastName" name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email Address</label>
          <InputField id="email" name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
          <InputField id="contactNumber" name="contactNumber" type="tel" placeholder="Contact Number (e.g., +15551234567)" value={formData.contactNumber} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Message</label>
          <TextAreaField id="message" name="message" placeholder="Your message (optional)" value={formData.message} onChange={handleChange} rows={3}/>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button type="submit" disabled={status === 'loading' || isConnected} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300 disabled:opacity-50">
            {status === 'loading' ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call My Phone
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleTryInBrowser}
            disabled={buttonConfig.disabled || callStatus === 'connecting'}
            className={`w-full inline-flex justify-center items-center px-6 py-3 border text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${buttonConfig.className}`}
          >
            {callStatus === 'connecting' && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isConnected ? (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {buttonConfig.text}
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {buttonConfig.text}
              </>
            )}
          </button>
        </div>
        {message && status !== 'idle' && (
          <p className={`mt-4 text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>

      {/* Instructions */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
          <p className="text-blue-300 text-sm text-center">
            Click "Try In Browser" to start talking with the AI voice agent instantly!
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoForm;
