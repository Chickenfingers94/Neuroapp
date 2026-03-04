import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { SupplementCard } from '../components/supplements/SupplementCard';
import { useSettings } from '../hooks/useSettings';
import { useCycling } from '../hooks/useCycling';
import { useChecklist } from '../hooks/useChecklist';
import { useDailyLog } from '../hooks/useDailyLog';
import { SUPPLEMENTS } from '../data/supplements';
import { today } from '../utils/dateUtils';
import type { TimeOfDay } from '../types';

const TIME_GROUPS: { key: TimeOfDay; label: string; emoji: string }[] = [
  { key: 'nüchtern', label: 'Nüchtern (30min vor Frühstück)', emoji: '🌅' },
  { key: 'morgens', label: 'Morgens', emoji: '☀️' },
  { key: 'nachmittags', label: 'Nachmittags', emoji: '🌤' },
  { key: 'abends', label: 'Abends', emoji: '🌙' },
];

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ChecklistPage: React.FC = () => {
  const { settings } = useSettings();
  const { isTrainingDay } = useDailyLog(today());
  const { cyclingStatuses } = useCycling(settings.startDate, settings.phase, isTrainingDay);
  const { completions, toggle, getCompletionRate } = useChecklist(today());

  const availableSupplements = useMemo(() =>
    SUPPLEMENTS.filter(s => s.phase <= settings.phase),
    [settings.phase]
  );

  const grouped = useMemo(() => {
    const groups: Record<TimeOfDay, typeof availableSupplements> = {
      'nüchtern': [], 'morgens': [], 'nachmittags': [], 'abends': []
    };
    availableSupplements.forEach(s => {
      s.timing.forEach(t => {
        if (groups[t]) groups[t].push(s);
      });
    });
    return groups;
  }, [availableSupplements]);

  const allIds = availableSupplements.map(s => s.id);
  const completionRate = getCompletionRate(allIds);
  const strokeDash = (completionRate / 100) * CIRCUMFERENCE;
  const isComplete = completionRate === 100;

  return (
    <>
      <Header
        title="✅ Tages-Checklist"
        subtitle={`${completionRate}% abgehakt`}
      />
      <PageContainer>
        {/* Circular Progress + Linear Bar */}
        <div className="glass-card p-4 mb-4 flex items-center gap-4">
          <div className="relative shrink-0 w-16 h-16">
            <svg width="64" height="64" className="-rotate-90">
              <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <motion.circle
                cx="32" cy="32" r={RADIUS}
                fill="none"
                stroke={isComplete ? '#22c55e' : '#0ea5e9'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: CIRCUMFERENCE - strokeDash }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                style={{ filter: isComplete ? 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' : 'drop-shadow(0 0 4px rgba(14,165,233,0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono text-xs font-bold ${isComplete ? 'text-green-400' : 'text-white'}`}>
                {isComplete ? '✓' : `${completionRate}%`}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300 mb-1.5">Heutiger Fortschritt</p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ background: isComplete ? '#22c55e' : 'linear-gradient(90deg, #0284c7, #0ea5e9)' }}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            {isComplete && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-400 font-medium mt-1.5"
              >
                🎉 Alles erledigt! Gut gemacht!
              </motion.p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {TIME_GROUPS.map(group => {
            const items = grouped[group.key];
            if (items.length === 0) return null;

            return (
              <div key={group.key}>
                <h2 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                  {group.emoji} {group.label}
                </h2>
                <div className="space-y-2">
                  {items.map(supp => {
                    const cycling = cyclingStatuses[supp.id];
                    const isActive = !cycling || cycling.status === 'active';
                    return (
                      <SupplementCard
                        key={`${supp.id}-${group.key}`}
                        supplement={supp}
                        cyclingStatus={cycling}
                        onToggleComplete={isActive ? () => toggle(supp.id) : undefined}
                        isCompleted={completions[supp.id] ?? false}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </>
  );
};
