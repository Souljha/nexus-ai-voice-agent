import { useEffect, useState, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';

export type CallStatus = 'inactive' | 'connecting' | 'active' | 'ending' | 'ended';

interface UseVapiReturn {
  isConnected: boolean;
  callStatus: CallStatus;
  error: string | null;
  startCall: () => void;
  endCall: () => void;
  isSpeaking: boolean;
  volumeLevel: number;
}

export const useVapi = (): UseVapiReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>('inactive');
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

    if (!publicKey) {
      console.error('Vapi public key not found in environment variables');
      setError('Configuration error: Vapi key not found');
      return;
    }

    // Initialize Vapi client
    vapiRef.current = new Vapi(publicKey);

    // Set up event listeners
    const vapi = vapiRef.current;

    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStatus('active');
      setIsConnected(true);
      setError(null);
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStatus('ended');
      setIsConnected(false);
      setIsSpeaking(false);
      setVolumeLevel(0);

      // Reset to inactive after a short delay
      setTimeout(() => setCallStatus('inactive'), 1000);
    });

    vapi.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setError(error?.message || 'An error occurred during the call');
      setCallStatus('ended');
      setIsConnected(false);
    });

    vapi.on('message', (message: any) => {
      console.log('Vapi message:', message);
    });

    // Cleanup on unmount
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = useCallback(() => {
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

    if (!assistantId) {
      setError('Configuration error: Assistant ID not found');
      return;
    }

    if (!vapiRef.current) {
      setError('Vapi client not initialized');
      return;
    }

    try {
      setCallStatus('connecting');
      setError(null);

      vapiRef.current.start(assistantId);
    } catch (err: any) {
      console.error('Error starting call:', err);
      setError(err?.message || 'Failed to start call');
      setCallStatus('inactive');
    }
  }, []);

  const endCall = useCallback(() => {
    if (vapiRef.current && isConnected) {
      setCallStatus('ending');
      vapiRef.current.stop();
    }
  }, [isConnected]);

  return {
    isConnected,
    callStatus,
    error,
    startCall,
    endCall,
    isSpeaking,
    volumeLevel,
  };
};
