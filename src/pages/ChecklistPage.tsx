import React, { useMemo } from 'react';
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

  return (
    <>
      <Header
        title="✅ Tages-Checklist"
        subtitle={`${completionRate}% abgehakt`}
      />
      <PageContainer>
        {/* Progress bar */}
        <div className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Heutiger Fortschritt</span>
            <span className="font-mono text-white font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
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
