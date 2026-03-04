import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';
import { today } from '../utils/dateUtils';

export interface ChecklistItem {
  id: string;
  completed: boolean;
  completedAt?: string;
}

export function useChecklist(date: string = today()) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.checklistCompletions
      .where('date').equals(date)
      .toArray()
      .then(records => {
        const map: Record<string, boolean> = {};
        records.forEach(r => { map[r.itemId] = r.completed; });
        setCompletions(map);
        setLoading(false);
      });
  }, [date]);

  const toggle = useCallback(async (itemId: string) => {
    const current = completions[itemId] ?? false;
    const newValue = !current;

    const existing = await db.checklistCompletions
      .where('[date+itemId]').equals([date, itemId])
      .first();

    if (existing?.id != null) {
      await db.checklistCompletions.update(existing.id, {
        completed: newValue,
        completedAt: newValue ? new Date().toISOString() : undefined,
      });
    } else {
      await db.checklistCompletions.add({
        date,
        itemId,
        completed: newValue,
        completedAt: newValue ? new Date().toISOString() : undefined,
      });
    }

    setCompletions(prev => ({ ...prev, [itemId]: newValue }));
  }, [date, completions]);

  const getCompletionRate = useCallback((ids: string[]): number => {
    if (ids.length === 0) return 0;
    const completed = ids.filter(id => completions[id]).length;
    return Math.round((completed / ids.length) * 100);
  }, [completions]);

  return { completions, loading, toggle, getCompletionRate };
}
