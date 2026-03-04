import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import type { Supplement, CyclingStatus } from '../../types';

interface SupplementCardProps {
  supplement: Supplement;
  cyclingStatus?: CyclingStatus;
  onToggleComplete?: () => void;
  isCompleted?: boolean;
}

const RISK_LABELS: Record<string, string> = {
  safe: 'Sicher',
  monitored: 'Überwacht',
  experimental: 'Experimentell',
  'research-only': 'Nur Forschung',
};

export const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement, cyclingStatus, onToggleComplete, isCompleted = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const isActive = !cyclingStatus || cyclingStatus.status === 'active';

  return (
    <div className={`glass-card transition-all duration-200 ${!isActive ? 'opacity-50' : ''}`}>
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {onToggleComplete && (
          <button
            onClick={e => { e.stopPropagation(); onToggleComplete(); }}
            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              isCompleted
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-slate-600 hover:border-green-500'
            }`}
            aria-label={isCompleted ? 'Als nicht eingenommen markieren' : 'Als eingenommen markieren'}
          >
            {isCompleted && <span className="text-xs">✓</span>}
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                {supplement.name}
              </h3>
              <p className="font-mono text-xs text-slate-400 mt-0.5">{supplement.dose}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant={supplement.riskLevel}>{RISK_LABELS[supplement.riskLevel]}</Badge>
              {cyclingStatus && (
                <Badge variant={
                  cyclingStatus.status === 'active' ? 'safe' :
                  cyclingStatus.status === 'pause' ? 'caution' : 'neutral'
                }>
                  {cyclingStatus.status === 'active' ? '●' :
                   cyclingStatus.status === 'pause' ? '⏸' : '○'}
                </Badge>
              )}
            </div>
          </div>

          {cyclingStatus?.reason && (
            <p className="text-xs text-slate-500 mt-1">{cyclingStatus.reason}</p>
          )}

          {supplement.criticalNote && (
            <p className="text-xs text-amber-400/90 mt-1 font-medium">⚠ {supplement.criticalNote}</p>
          )}
        </div>
        <span className={`text-slate-500 transition-transform duration-200 shrink-0 ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/5">
              <p className="text-xs text-slate-400 leading-relaxed">{supplement.mechanism}</p>

              {supplement.effects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Effekte:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplement.effects.map(e => (
                      <span key={e} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {supplement.interactions && supplement.interactions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Interaktionen:</p>
                  <div className="space-y-1">
                    {supplement.interactions.map((inter, i) => (
                      <div key={i} className={`text-xs px-2 py-1 rounded ${
                        inter.level === 'danger' ? 'bg-red-500/10 text-red-400' :
                        inter.level === 'caution' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-purple-500/10 text-purple-400'
                      }`}>
                        {inter.level === 'danger' ? '⚠' : inter.level === 'caution' ? '⚡' : '✨'} {inter.with}: {inter.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {supplement.synergies && supplement.synergies.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Synergien:</p>
                  <div className="flex flex-wrap gap-1">
                    {supplement.synergies.map(s => (
                      <span key={s} className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">✨ {s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span>📅 Phase {supplement.phase}</span>
                <span>⏰ {supplement.timing.join(', ')}</span>
                {supplement.isOptional && <span className="text-slate-500">(Optional)</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
