import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Toast } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const TYPE_STYLES: Record<Toast['type'], string> = {
  success: 'text-green-400 border-green-500/30',
  info: 'text-sky-400 border-sky-500/30',
  warning: 'text-amber-400 border-amber-500/30',
  error: 'text-red-400 border-red-500/30',
};

const TYPE_ICONS: Record<Toast['type'], string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  error: '✕',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          layout
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`toast ${TYPE_STYLES[toast.type]}`}
          onClick={() => onDismiss(toast.id)}
        >
          <span className="font-bold text-base w-4 text-center shrink-0">{TYPE_ICONS[toast.type]}</span>
          <span className="text-slate-200">{toast.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
