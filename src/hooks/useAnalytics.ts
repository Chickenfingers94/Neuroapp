import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { computeScoreData, computeWeeklyAverage, computeRollingAverage, computeTrainingCorrelation } from '../utils/analyticsEngine';
import type { DailyLog, ScoreData } from '../types';

export function useAnalytics(days: number = 30) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    const all = await db.dailyLogs.toArray();
    const sorted = all.sort((a, b) => a.date.localeCompare(b.date)).slice(-days);
    setLogs(sorted);
    setLoading(false);
  }, [days]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const scoreData = computeScoreData(logs);
  const weeklyAverage = computeWeeklyAverage(logs.slice(-7));
  const rollingAverage = computeRollingAverage(scoreData, 7);
  const trainingCorrelation = computeTrainingCorrelation(logs);

  return { logs, scoreData, weeklyAverage, rollingAverage, trainingCorrelation, loading, reload: loadLogs };
}
