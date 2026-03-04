import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { TodayInteraction } from '../../types';

interface SafetyStatusProps {
  interactions: TodayInteraction[];
  safetyColor: 'green' | 'yellow' | 'red';
}

const STATUS_CONFIG = {
  green:  { icon: '🟢', label: 'Sicher',  desc: 'Keine Konflikte heute',     cardClass: 'border-green-500/30 bg-green-500/5' },
  yellow: { icon: '🟡', label: 'Vorsicht', desc: 'Vorsichtshinweise aktiv',  cardClass: 'border-yellow-500/30 bg-yellow-500/5' },
  red:    { icon: '🔴', label: 'GEFAHR',  desc: 'Gefährliche Interaktionen!', cardClass: 'border-red-500/30 bg-red-500/5 pulse-danger' },
};

export const SafetyStatus: React.FC<SafetyStatusProps> = ({ interactions, safetyColor }) => {
  const config = STATUS_CONFIG[safetyColor];
  const dangers = interactions.filter(i => i.level === 'danger');
  const cautions = interactions.filter(i => i.level === 'caution');

  return (
    <Card className={config.cardClass}>
      <div className="flex items-center gap-3 mb-2">
        <motion.span
          className="text-2xl"
          animate={safetyColor === 'red' ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          {config.icon}
        </motion.span>
        <div>
          <p className="text-sm font-bold text-white">{config.label}</p>
          <p className="text-xs text-slate-400">{config.desc}</p>
        </div>
      </div>
      {dangers.length > 0 && (
        <div className="space-y-1 mt-2">
          {dangers.map((d, i) => (
            <p key={i} className="text-xs text-red-400 font-medium">⚠ {d.substance1}+{d.substance2}: {d.description}</p>
          ))}
        </div>
      )}
      {cautions.length > 0 && (
        <div className="space-y-1 mt-2">
          {cautions.map((c, i) => (
            <p key={i} className="text-xs text-yellow-400">⚡ {c.substance1}+{c.substance2}: {c.description}</p>
          ))}
        </div>
      )}
    </Card>
  );
};
