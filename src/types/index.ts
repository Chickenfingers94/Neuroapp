export type Phase = 1 | 2 | 3;
export type RiskLevel = 'safe' | 'monitored' | 'experimental' | 'research-only';
export type InteractionLevel = 'danger' | 'caution' | 'synergy';
export type TimeOfDay = 'nüchtern' | 'morgens' | 'nachmittags' | 'abends';
export type CycleStatus = 'active' | 'inactive' | 'pause' | 'not-started';
export type TrackingType = 'boolean' | 'counter' | 'duration' | 'scale';
export type TrainingType = 'kraft' | 'cardio' | 'hiit' | 'kraft+cardio' | 'none';
export type StrategyMode = 'conservative' | 'experimental';
export type Theme = 'dark' | 'light' | 'auto';

export interface CyclingRule {
  microCycle?: 'daily' | '5on2off' | 'mo+do' | 'di+fr' | 'mo+mi' | 'do+sa' | 'fadiman' | 'training' | '3x-week' | 'mo-mi-fr' | 'mi-fr-so';
  macroCycle?: { onWeeks: number; offWeeks: number };
  startWeek?: number; // minimum week to start (e.g., 16 for TAK-653)
}

export interface Interaction {
  with: string;
  level: InteractionLevel;
  description: string;
}

export interface Supplement {
  id: string;
  name: string;
  nameFull?: string;
  phase: Phase;
  dose: string;
  timing: TimeOfDay[];
  mechanism: string;
  effects: string[];
  riskLevel: RiskLevel;
  cycling?: CyclingRule;
  interactions?: Interaction[];
  synergies?: string[];
  criticalNote?: string;
  isOptional?: boolean;
  category?: string;
}

export interface DailyLog {
  date: string; // ISO date YYYY-MM-DD
  sleep: number; // 1-10
  focus: number;
  mood: number;
  energy: number;
  notes?: string;
  training: TrainingType;
  smoking: boolean;
  sunlight: boolean;
  meditation: boolean;
  coldShower: boolean;
}

export interface ChecklistCompletion {
  date: string;
  itemId: string;
  completed: boolean;
  completedAt?: string;
}

export interface AppSettings {
  key: string;
  value: string | number | boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[]; // 0=Sun..6=Sat
  trackingType: TrackingType;
  unit?: string;
  isSystem: boolean;
  neuroBenefit?: string;
  order: number;
  active: boolean;
}

export interface HabitLog {
  id?: number;
  habitId: string;
  date: string;
  value: boolean | number;
  note?: string;
}

export interface Todo {
  id?: number;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CyclingStatus {
  supplementId: string;
  status: CycleStatus;
  reason?: string;
  nextChangeDate?: string;
  weekInCycle?: number;
  daysUntilBreak?: number;
}

export interface TodayInteraction {
  level: InteractionLevel;
  substance1: string;
  substance2: string;
  description: string;
}

export interface ScoreData {
  date: string;
  sleep: number;
  focus: number;
  mood: number;
  energy: number;
  avg: number;
}
