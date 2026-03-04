import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { PhaseProgress } from '../components/dashboard/PhaseProgress';
import { TodayScores } from '../components/dashboard/TodayScores';
import { WarningBanner } from '../components/dashboard/WarningBanner';
import { SafetyStatus } from '../components/safety/SafetyStatus';
import { HabitCard } from '../components/habits/HabitCard';
import { DailyReminderPage } from './DailyReminderPage';
import { useSettings } from '../hooks/useSettings';
import { usePhase } from '../hooks/usePhase';
import { useCycling } from '../hooks/useCycling';
import { useInteractions } from '../hooks/useInteractions';
import { useDailyLog } from '../hooks/useDailyLog';
import { useHabits } from '../hooks/useHabits';
import { today, formatDisplayDate } from '../utils/dateUtils';

export const DashboardPage: React.FC = () => {
  const { settings } = useSettings();
  const { protocolWeek, phaseProgress, monitorLevel } = usePhase(settings.startDate, settings.phase);
  const { log, update, isTrainingDay } = useDailyLog(today());
  const { activeTodayIds } = useCycling(settings.startDate, settings.phase, isTrainingDay);
  const { interactions, safetyColor } = useInteractions(activeTodayIds);
  const { habits, todayLogs, toggleHabit, getStreak } = useHabits();
  const [showReminder, setShowReminder] = useState(false);

  const dateDisplay = useMemo(() => formatDisplayDate(today()), []);

  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const todayName = dayNames[new Date().getDay()];

  return (
    <>
      <Header
        title="🧠 Neuroapp"
        subtitle={`${todayName}, ${dateDisplay} · Woche ${protocolWeek}`}
      />
      <PageContainer>
        <div className="space-y-4">

          {/* Daily Reminder Quick Access */}
          <button
            onClick={() => setShowReminder(true)}
            className="w-full glass-card p-3 flex items-center gap-3 text-left active:scale-95 transition-all duration-200"
          >
            <span className="text-2xl">🧠</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Täglicher Reminder</p>
              <p className="text-xs text-slate-500">Deine 6 Wahrheiten – jederzeit abrufbar</p>
            </div>
            <span className="text-slate-600 ml-auto text-lg">→</span>
          </button>

          {/* Phase Progress */}
          <PhaseProgress
            phase={settings.phase}
            protocolWeek={protocolWeek}
            progress={phaseProgress}
            monitorLevel={monitorLevel}
          />

          {/* Safety / Warnings */}
          <WarningBanner interactions={interactions} />
          <SafetyStatus interactions={interactions} safetyColor={safetyColor} />

          {/* Today's Scores */}
          <TodayScores log={log} onUpdate={update} />

          {/* Habits */}
          {habits.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                🎯 Gewohnheiten heute
              </h2>
              <div className="space-y-2">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    log={todayLogs[habit.id]}
                    onToggle={() => toggleHabit(habit.id)}
                    getStreak={getStreak}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Supplements Today */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">⚗️ Heute aktive Substanzen</h3>
            <div className="flex flex-wrap gap-1.5">
              {activeTodayIds.map(id => (
                  <span key={id} className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full font-mono">
                    {id}
                  </span>
              ))}
            </div>
            {activeTodayIds.length === 0 && (
              <p className="text-xs text-slate-500">Keine Substanzen heute aktiv.</p>
            )}
          </div>

        </div>
      </PageContainer>

      <AnimatePresence>
        {showReminder && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-950 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <DailyReminderPage onStart={() => setShowReminder(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
