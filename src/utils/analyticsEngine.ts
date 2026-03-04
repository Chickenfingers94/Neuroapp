import type { DailyLog, ScoreData } from '../types';

export function computeScoreData(logs: DailyLog[]): ScoreData[] {
  return logs.map(log => ({
    date: log.date,
    sleep: log.sleep,
    focus: log.focus,
    mood: log.mood,
    energy: log.energy,
    avg: parseFloat(((log.sleep + log.focus + log.mood + log.energy) / 4).toFixed(1)),
  }));
}

export function computeWeeklyAverage(logs: DailyLog[]): { sleep: number; focus: number; mood: number; energy: number; avg: number } {
  if (logs.length === 0) return { sleep: 0, focus: 0, mood: 0, energy: 0, avg: 0 };
  const sum = logs.reduce(
    (acc, log) => ({
      sleep: acc.sleep + log.sleep,
      focus: acc.focus + log.focus,
      mood: acc.mood + log.mood,
      energy: acc.energy + log.energy,
    }),
    { sleep: 0, focus: 0, mood: 0, energy: 0 }
  );
  const n = logs.length;
  const avg = (sum.sleep + sum.focus + sum.mood + sum.energy) / (4 * n);
  return {
    sleep: parseFloat((sum.sleep / n).toFixed(1)),
    focus: parseFloat((sum.focus / n).toFixed(1)),
    mood: parseFloat((sum.mood / n).toFixed(1)),
    energy: parseFloat((sum.energy / n).toFixed(1)),
    avg: parseFloat(avg.toFixed(1)),
  };
}

export function computeRollingAverage(data: ScoreData[], window: number): ScoreData[] {
  return data.map((item, index) => {
    const slice = data.slice(Math.max(0, index - window + 1), index + 1);
    const avg = slice.reduce((sum, d) => sum + d.avg, 0) / slice.length;
    return { ...item, avg: parseFloat(avg.toFixed(1)) };
  });
}

export function computeTrainingCorrelation(logs: DailyLog[]): number {
  const withTraining = logs.filter(l => l.training !== 'none');
  const withoutTraining = logs.filter(l => l.training === 'none');
  if (withTraining.length === 0 || withoutTraining.length === 0) return 0;
  const avgWith = withTraining.reduce((sum, l) => sum + l.focus, 0) / withTraining.length;
  const avgWithout = withoutTraining.reduce((sum, l) => sum + l.focus, 0) / withoutTraining.length;
  return parseFloat((avgWith - avgWithout).toFixed(2));
}
