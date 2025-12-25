import { useState } from 'react';

type RequestStatus = 'idle' | 'accepting' | 'rejecting' | 'processed';

interface UseRequestActionsProps {
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
}

export const useRequestActions = ({ onAccept, onReject }: UseRequestActionsProps) => {
  const [status, setStatus] = useState<RequestStatus>('idle');

  const handleAccept = async () => {
    if (status !== 'idle') return;

    setStatus('accepting');
    try {
      if (onAccept) {
        await onAccept();
        setStatus('processed');
      }
    } catch (error) {
      setStatus('idle');
    }
  };

  const handleReject = async () => {
    if (status !== 'idle') return;

    setStatus('rejecting');
    try {
      if (onReject) {
        await onReject();
        setStatus('processed');
      }
    } catch (error) {
      setStatus('idle');
    }
  };

  return {
    handleAccept,
    handleReject,
    isAccepting: status === 'accepting',
    isRejecting: status === 'rejecting',
    isProcessed: status === 'processed',
    isIdle: status === 'idle',
  };
};
