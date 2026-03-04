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

const PHASE_COLORS: Record<Phase, { gradient: string; text: string; glow: string; barFrom: string; barTo: string }> = {
  1: { gradient: 'from-sky-500 to-cyan-400',    text: 'text-sky-400',   glow: 'rgba(14,165,233,0.5)',  barFrom: '#0ea5e9', barTo: '#22d3ee' },
  2: { gradient: 'from-amber-500 to-orange-400', text: 'text-amber-400', glow: 'rgba(245,158,11,0.5)', barFrom: '#f59e0b', barTo: '#fb923c' },
  3: { gradient: 'from-red-500 to-rose-400',     text: 'text-red-400',   glow: 'rgba(239,68,68,0.5)',  barFrom: '#ef4444', barTo: '#fb7185' },
};

export const PhaseProgress: React.FC<PhaseProgressProps> = ({ phase, protocolWeek, progress, monitorLevel }) => {
  const c = PHASE_COLORS[phase];

  return (
    <Card className={`phase${phase}-gradient`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${c.text}`}>Phase {phase}</span>
          <p className="text-sm text-slate-300 mt-0.5">Protokoll-Woche {protocolWeek}</p>
        </div>
        <div className="text-right">
          <span className={`font-mono text-2xl font-bold ${c.text}`}>{progress}%</span>
          <p className="text-xs text-slate-400">Fortschritt</p>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="w-full bg-slate-800/60 rounded-full h-2.5 mb-3 overflow-hidden">
        <motion.div
          className={`h-2.5 rounded-full bg-gradient-to-r ${c.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ boxShadow: progress > 0 ? `0 0 10px 2px ${c.glow}` : 'none' }}
        />
      </div>

      {/* Monitor Metaphor */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Monitor:</span>
        <div className="flex gap-1 flex-1">
          {[40, 60, 80, 100].map(level => (
            <motion.div
              key={level}
              className="flex-1 h-3 rounded-sm"
              animate={{
                backgroundColor: monitorLevel >= level ? c.barFrom : 'rgba(51,65,85,0.5)',
                boxShadow: monitorLevel >= level ? `0 0 6px 1px ${c.glow}` : 'none',
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>
        <span className={`text-xs font-mono ${c.text}`}>{monitorLevel}%</span>
      </div>
    </Card>
  );
};
