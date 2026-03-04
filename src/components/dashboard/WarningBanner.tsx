import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TodayInteraction } from '../../types';

interface WarningBannerProps {
  interactions: TodayInteraction[];
}

export const WarningBanner: React.FC<WarningBannerProps> = ({ interactions }) => {
  const dangerous = interactions.filter(i => i.level === 'danger');
  const cautious = interactions.filter(i => i.level === 'caution');

  if (dangerous.length === 0 && cautious.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {dangerous.map((i, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <span className="text-lg shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-400">DANGER: {i.substance1} + {i.substance2}</p>
              <p className="text-xs text-red-300/80 mt-0.5">{i.description}</p>
            </div>
          </div>
        ))}
        {cautious.map((i, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <span className="text-lg shrink-0">⚡</span>
            <div>
              <p className="text-sm font-semibold text-yellow-400">Achtung: {i.substance1} + {i.substance2}</p>
              <p className="text-xs text-yellow-300/80 mt-0.5">{i.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
