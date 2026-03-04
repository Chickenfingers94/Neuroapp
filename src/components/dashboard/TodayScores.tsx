import React, { useCallback } from 'react';
import { Card } from '../ui/Card';
import { SliderScore } from '../ui/SliderScore';
import type { DailyLog, TrainingType } from '../../types';

interface TodayScoresProps {
  log: DailyLog;
  onUpdate: (updates: Partial<Omit<DailyLog, 'date'>>) => void;
}

const TRAINING_OPTIONS: { value: TrainingType; label: string; emoji: string }[] = [
  { value: 'none', label: 'Kein Training', emoji: '😴' },
  { value: 'kraft', label: 'Kraft', emoji: '🏋️' },
  { value: 'cardio', label: 'Cardio', emoji: '🏃' },
  { value: 'hiit', label: 'HIIT', emoji: '⚡' },
  { value: 'kraft+cardio', label: 'Kraft+Cardio', emoji: '💪' },
];

export const TodayScores: React.FC<TodayScoresProps> = ({ log, onUpdate }) => {
  const handleSlider = useCallback((key: keyof Pick<DailyLog, 'sleep' | 'focus' | 'mood' | 'energy'>) =>
    (value: number) => onUpdate({ [key]: value }),
    [onUpdate]
  );

  const toggleLifestyle = useCallback((key: 'smoking' | 'sunlight' | 'meditation' | 'coldShower') => {
    onUpdate({ [key]: !log[key] });
  }, [log, onUpdate]);

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        📊 Heutiges Wohlbefinden
      </h3>
      <div className="space-y-4">
        <SliderScore label="Schlaf" value={log.sleep} onChange={handleSlider('sleep')} emoji="😴" color="sky" />
        <SliderScore label="Fokus" value={log.focus} onChange={handleSlider('focus')} emoji="🎯" color="purple" />
        <SliderScore label="Stimmung" value={log.mood} onChange={handleSlider('mood')} emoji="😊" color="green" />
        <SliderScore label="Energie" value={log.energy} onChange={handleSlider('energy')} emoji="⚡" color="amber" />
      </div>

      {/* Training */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-400 mb-2">Training heute</p>
        <div className="flex flex-wrap gap-2">
          {TRAINING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ training: opt.value })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                log.training === opt.value
                  ? 'bg-sky-500/30 border-sky-500/50 text-sky-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500'
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lifestyle toggles */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-400 mb-2">Lifestyle</p>
        <div className="grid grid-cols-2 gap-2">
          {([
            { key: 'smoking' as const, label: 'Geraucht', emoji: '🚬', danger: true },
            { key: 'sunlight' as const, label: 'Sonnenlicht', emoji: '☀️', danger: false },
            { key: 'meditation' as const, label: 'Meditation', emoji: '🧘', danger: false },
            { key: 'coldShower' as const, label: 'Kalt geduscht', emoji: '🚿', danger: false },
          ]).map(item => (
            <button
              key={item.key}
              onClick={() => toggleLifestyle(item.key)}
              className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${
                log[item.key]
                  ? item.danger
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
              <span className="ml-auto">{log[item.key] ? '✓' : '○'}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
