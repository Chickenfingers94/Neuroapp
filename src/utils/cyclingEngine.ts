import { differenceInDays, getDay } from 'date-fns';
import { parseDate } from './dateUtils';
import type { CycleStatus } from '../types';

interface CycleResult {
  status: CycleStatus;
  reason?: string;
  weekInMacro?: number;
}

function daysSinceStart(startDate: string, now: Date = new Date()): number {
  return Math.max(0, differenceInDays(now, parseDate(startDate)));
}

function weeksSinceStart(startDate: string, now: Date = new Date()): number {
  return Math.floor(daysSinceStart(startDate, now) / 7);
}

export function getMethylenblauStatus(date: Date = new Date()): CycleResult {
  const dow = getDay(date); // 1=Mon, 4=Thu
  if (dow === 1 || dow === 4) {
    return { status: 'active', reason: 'Mo+Do aktiv' };
  }
  return { status: 'inactive', reason: 'Nur Mo+Do' };
}


export function getBromantaneCycle(startDate: string, date: Date = new Date()): CycleResult {
  const dow = getDay(date);
  const isWeekend = dow === 0 || dow === 6;
  // Macro: 4 weeks on / 1 week off
  const weeks = weeksSinceStart(startDate);
  const cyclePos = weeks % 5;
  const inMacroOn = cyclePos < 4;

  if (!inMacroOn) {
    return { status: 'pause', reason: 'Macro-Pause (1 Woche off)', weekInMacro: cyclePos + 1 };
  }
  if (isWeekend) {
    return { status: 'inactive', reason: 'Wochenende – Pause', weekInMacro: cyclePos + 1 };
  }
  return { status: 'active', reason: 'Mo-Fr aktiv', weekInMacro: cyclePos + 1 };
}

export function getPeptideCycle(startDate: string, date: Date = new Date()): CycleResult {
  // Macro: 3 weeks on / 1 week off
  const weeks = weeksSinceStart(startDate, date);
  const cyclePos = weeks % 4;
  const inMacroOn = cyclePos < 3;

  if (!inMacroOn) {
    return { status: 'pause', reason: 'Macro-Pause (1 Woche off)', weekInMacro: cyclePos + 1 };
  }
  return { status: 'active', reason: `Woche ${cyclePos + 1}/3 aktiv`, weekInMacro: cyclePos + 1 };
}

export function getFasoracetamStatus(date: Date = new Date()): CycleResult {
  const dow = getDay(date);
  const isWeekend = dow === 0 || dow === 6;
  if (isWeekend) {
    return { status: 'inactive', reason: 'Wochenende – Pause (synchron mit Bromantane)' };
  }
  return { status: 'active', reason: 'Mo-Fr aktiv' };
}

export function getACD856Cycle(startDate: string, date: Date = new Date()): CycleResult {
  // Macro: 4 weeks on / 2 weeks off
  const weeks = weeksSinceStart(startDate, date);
  const cyclePos = weeks % 6;
  const inMacroOn = cyclePos < 4;

  if (!inMacroOn) {
    return { status: 'pause', reason: `Macro-Pause (Woche ${cyclePos - 3}/2)`, weekInMacro: cyclePos + 1 };
  }
  return { status: 'active', reason: `Woche ${cyclePos + 1}/4 aktiv`, weekInMacro: cyclePos + 1 };
}

export function getLSDCycle(startDate: string, date: Date = new Date()): CycleResult {
  // Fadiman: 1 day on / 2 days off (every 3rd day)
  const days = daysSinceStart(startDate, date);
  const cyclePos = days % 3;
  if (cyclePos === 0) {
    return { status: 'active', reason: 'Fadiman: Tag 1 von 3' };
  }
  return { status: 'inactive', reason: `Fadiman: Pause (Tag ${cyclePos + 1} von 3)` };
}

export function getTAK653Status(protocolWeek: number, date: Date = new Date()): CycleResult {
  if (protocolWeek < 16) {
    return { status: 'not-started', reason: `Erst ab Woche 16 (aktuell Woche ${protocolWeek})` };
  }
  const dow = getDay(date); // 3=Wed, 6=Sat
  if (dow === 3 || dow === 6) {
    return { status: 'active', reason: 'Mi+Sa aktiv' };
  }
  return { status: 'inactive', reason: 'Nur Mi+Sa' };
}

export function getZinkStatus(date: Date = new Date()): CycleResult {
  const dow = getDay(date); // 1=Mon, 3=Wed, 5=Fri
  if (dow === 1 || dow === 3 || dow === 5) {
    return { status: 'active', reason: 'Mo/Mi/Fr aktiv' };
  }
  return { status: 'inactive', reason: 'Nur Mo/Mi/Fr' };
}

export function get5HTPStatus(date: Date = new Date()): CycleResult {
  // Max 3x/week – use Mo/Mi/Fr as default
  const dow = getDay(date);
  if (dow === 1 || dow === 3 || dow === 5) {
    return { status: 'active', reason: 'Optional (max 3x/Woche)' };
  }
  return { status: 'inactive', reason: 'Pause (max 3x/Woche)' };
}
