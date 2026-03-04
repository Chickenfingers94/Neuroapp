import Dexie, { type EntityTable } from 'dexie';
import type { DailyLog, ChecklistCompletion, AppSettings, Habit, HabitLog, Todo } from '../types';

export class NeuroDatabase extends Dexie {
  dailyLogs!: EntityTable<DailyLog, 'date'>;
  checklistCompletions!: EntityTable<ChecklistCompletion & { id?: number }, 'id'>;
  settings!: EntityTable<AppSettings, 'key'>;
  habits!: EntityTable<Habit, 'id'>;
  habitLogs!: EntityTable<HabitLog, 'id'>;
  todos!: EntityTable<Todo, 'id'>;

  constructor() {
    super('NeuroappDB');
    this.version(1).stores({
      dailyLogs: 'date',
      checklistCompletions: '++id, date, itemId, [date+itemId]',
      settings: 'key',
      habits: 'id, isSystem, active',
      habitLogs: '++id, habitId, date, [habitId+date]',
      todos: '++id, completed, priority',
    });
  }
}

export const db = new NeuroDatabase();

// Default settings
export const DEFAULT_SETTINGS = {
  startDate: new Date().toISOString().split('T')[0],
  phase: 1,
  strategy: 'conservative',
  theme: 'dark',
  onboardingComplete: false,
};

export async function initializeSettings(): Promise<void> {
  const existing = await db.settings.count();
  if (existing === 0) {
    const entries = Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value }));
    await db.settings.bulkPut(entries as AppSettings[]);
  }
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const setting = await db.settings.get(key);
  return setting?.value as T | undefined;
}

export async function setSetting(key: string, value: string | number | boolean): Promise<void> {
  await db.settings.put({ key, value });
}
