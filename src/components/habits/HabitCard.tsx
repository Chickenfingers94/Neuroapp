import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Habit, HabitLog } from '../../types';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  onToggle: () => void;
  getStreak: (id: string) => Promise<number>;
  frequencyLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, log, onToggle, getStreak, frequencyLabel, onEdit, onDelete }) => {
  const [streak, setStreak] = useState(0);
  const isCompleted = Boolean(log?.value);

  useEffect(() => {
    getStreak(habit.id).then(setStreak);
  }, [habit.id, getStreak, log]);

  return (
    <div className={`glass-card p-3 flex items-center gap-3 w-full transition-all duration-200 ${
      isCompleted ? 'border-green-500/30 bg-green-500/5' : 'hover:border-white/15'
    }`}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 text-left"
        aria-label={`${habit.name} ${isCompleted ? 'abgehakt' : 'nicht abgehakt'}`}
      >
        <span className="text-2xl shrink-0">{habit.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-slate-200'}`}>
            {habit.name}
          </p>
          <div className="flex items-center gap-2">
            {habit.neuroBenefit && (
              <p className="text-xs text-slate-500 truncate">{habit.neuroBenefit}</p>
            )}
            {frequencyLabel && (
              <span className="text-xs text-slate-600 shrink-0">{frequencyLabel}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-600'
          }`}>
            {isCompleted && <span className="text-white text-xs">✓</span>}
          </div>
          {streak > 0 && (
            <span className="text-xs font-mono text-amber-400">🔥{streak}</span>
          )}
        </div>
      </motion.button>
      {(onEdit || onDelete) && (
        <div className="flex gap-1 shrink-0 border-l border-white/10 pl-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-slate-500 hover:text-sky-400 text-xs p-1 rounded transition-colors"
              aria-label="Bearbeiten"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-slate-500 hover:text-red-400 text-xs p-1 rounded transition-colors"
              aria-label="Löschen"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
};
