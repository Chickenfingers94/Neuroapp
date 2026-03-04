import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { SYSTEM_HABITS } from '../data/habits';
import { today } from '../utils/dateUtils';
import type { Habit, HabitLog } from '../types';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    let dbHabits = await db.habits.orderBy('order').toArray();
    if (dbHabits.length === 0) {
      await db.habits.bulkPut(SYSTEM_HABITS);
      dbHabits = SYSTEM_HABITS;
    }
    const todayStr = today();
    const logs = await db.habitLogs.where('date').equals(todayStr).toArray();
    const logMap: Record<string, HabitLog> = {};
    logs.forEach(l => { logMap[l.habitId] = l; });
    setHabits(dbHabits.filter(h => h.active));
    setTodayLogs(logMap);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleHabit = useCallback(async (habitId: string) => {
    const todayStr = today();
    const existing = todayLogs[habitId];
    if (existing?.id != null) {
      const newValue = !existing.value;
      await db.habitLogs.update(existing.id, { value: newValue });
      setTodayLogs(prev => ({ ...prev, [habitId]: { ...existing, value: newValue } }));
    } else {
      const id = await db.habitLogs.add({ habitId, date: todayStr, value: true });
      setTodayLogs(prev => ({ ...prev, [habitId]: { id, habitId, date: todayStr, value: true } }));
    }
  }, [todayLogs]);

  const getStreak = useCallback(async (habitId: string): Promise<number> => {
    const logs = await db.habitLogs
      .where('habitId').equals(habitId)
      .sortBy('date');
    let streak = 0;
    const todayStr = today();
    const checkDate = new Date(todayStr);
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      if (log && log.value) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, []);

  const addCustomHabit = useCallback(async (habit: Omit<Habit, 'isSystem' | 'order'>) => {
    const count = await db.habits.count();
    const newHabit: Habit = { ...habit, isSystem: false, order: count + 1 };
    await db.habits.put(newHabit);
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback(async (id: string, updates: Partial<Omit<Habit, 'id' | 'isSystem'>>) => {
    await db.habits.update(id, updates);
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    await db.habits.update(id, { active: false });
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const reorderHabits = useCallback(async (orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) => db.habits.update(id, { order: index + 1 }));
    await Promise.all(updates);
    setHabits(prev => {
      const sorted = [...prev].sort((a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id));
      return sorted.map((h, i) => ({ ...h, order: i + 1 }));
    });
  }, []);

  return { habits, todayLogs, loading, toggleHabit, getStreak, addCustomHabit, updateHabit, deleteHabit, reorderHabits, reload: loadData };
}
