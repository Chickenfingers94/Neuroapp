import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { Phase } from '../../types';

interface PhaseProgressProps {
  phase: Phase;
  protocolWeek: number;
  progress: number;
  monitorLevel: number;
}

const PHASE_COLORS: Record<Phase, { bar: string; text: string; glow: string }> = {
  1: { bar: 'bg-sky-500', text: 'text-sky-400', glow: 'shadow-sky-500/30' },
  2: { bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
  3: { bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/30' },
};

export const PhaseProgress: React.FC<PhaseProgressProps> = ({ phase, protocolWeek, progress, monitorLevel }) => {
  const colors = PHASE_COLORS[phase];

  return (
    <Card className={`phase${phase}-gradient`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>Phase {phase}</span>
          <p className="text-sm text-slate-300 mt-0.5">Protokoll-Woche {protocolWeek}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-bold text-white">{progress}%</span>
          <p className="text-xs text-slate-400">Fortschritt</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/50 rounded-full h-2 mb-3">
        <motion.div
          className={`${colors.bar} h-2 rounded-full shadow-lg ${colors.glow}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Monitor Metaphor */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Monitor-Metapher:</span>
        <div className="flex gap-1">
          {[40, 60, 80, 100].map(level => (
            <div
              key={level}
              className={`w-6 h-3 rounded-sm transition-all duration-500 ${
                monitorLevel >= level ? colors.bar : 'bg-slate-700/50'
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-mono ${colors.text}`}>{monitorLevel}%</span>
      </div>
    </Card>
  );
};
