import { useState, useEffect, useCallback } from 'react';
import { db, initializeSettings, getSetting, setSetting } from '../db/database';
import type { Phase, StrategyMode, Theme } from '../types';

export interface Settings {
  startDate: string;
  phase: Phase;
  strategy: StrategyMode;
  theme: Theme;
  onboardingComplete: boolean;
}

const DEFAULT: Settings = {
  startDate: new Date().toISOString().split('T')[0],
  phase: 1,
  strategy: 'conservative',
  theme: 'dark',
  onboardingComplete: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSettings().then(async () => {
      const [startDate, phase, strategy, theme, onboardingComplete] = await Promise.all([
        getSetting<string>('startDate'),
        getSetting<number>('phase'),
        getSetting<string>('strategy'),
        getSetting<string>('theme'),
        getSetting<boolean>('onboardingComplete'),
      ]);
      setSettings({
        startDate: startDate ?? DEFAULT.startDate,
        phase: (phase as Phase) ?? DEFAULT.phase,
        strategy: (strategy as StrategyMode) ?? DEFAULT.strategy,
        theme: (theme as Theme) ?? DEFAULT.theme,
        onboardingComplete: onboardingComplete ?? DEFAULT.onboardingComplete,
      });
      setLoading(false);
    });
  }, []);

  const update = useCallback(async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    await setSetting(key, value as string | number | boolean);
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const exportData = useCallback(async () => {
    const [dailyLogs, checklistCompletions, habits, habitLogs, todos] = await Promise.all([
      db.dailyLogs.toArray(),
      db.checklistCompletions.toArray(),
      db.habits.toArray(),
      db.habitLogs.toArray(),
      db.todos.toArray(),
    ]);
    const data = { settings, dailyLogs, checklistCompletions, habits, habitLogs, todos, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroapp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  return { settings, loading, update, exportData };
}
