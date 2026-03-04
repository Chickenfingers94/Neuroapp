import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';
import type { Toast } from '../hooks/useToast';

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, showToast, dismiss } = useToast();
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
