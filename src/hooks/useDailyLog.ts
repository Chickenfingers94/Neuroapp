import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { today } from '../utils/dateUtils';
import type { DailyLog } from '../types';

const DEFAULT_LOG: Omit<DailyLog, 'date'> = {
  sleep: 7,
  focus: 7,
  mood: 7,
  energy: 7,
  notes: '',
  training: 'none',
  smoking: false,
  sunlight: false,
  meditation: false,
  coldShower: false,
};

export function useDailyLog(date: string = today()) {
  const [log, setLog] = useState<DailyLog>({ date, ...DEFAULT_LOG });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    db.dailyLogs.get(date).then(existing => {
      if (existing) {
        setLog(existing);
      } else {
        setLog({ date, ...DEFAULT_LOG });
      }
      setLoading(false);
    });
  }, [date]);

  const update = useCallback(async (updates: Partial<Omit<DailyLog, 'date'>>) => {
    const updated = { ...log, ...updates };
    setLog(updated);
    await db.dailyLogs.put(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [log]);

  const getLogs = useCallback(async (days: number = 30): Promise<DailyLog[]> => {
    const allLogs = await db.dailyLogs.toArray();
    return allLogs
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }, []);

  const isTrainingDay = log.training !== 'none';

  return { log, loading, saved, update, getLogs, isTrainingDay };
}
