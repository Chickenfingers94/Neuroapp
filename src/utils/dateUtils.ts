import { format, differenceInDays, addDays, isMonday, isTuesday, isWednesday, isFriday, isSaturday, isThursday, getDay } from 'date-fns';

export const today = (): string => format(new Date(), 'yyyy-MM-dd');
export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');
export const parseDate = (dateStr: string): Date => new Date(dateStr + 'T00:00:00');

export function getProtocolWeek(startDate: string): number {
  const start = parseDate(startDate);
  const now = new Date();
  const days = differenceInDays(now, start);
  return Math.max(1, Math.floor(days / 7) + 1);
}

export function getDayOfWeek(date: Date = new Date()): number {
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  return getDay(date);
}

export function isWeekend(date: Date = new Date()): boolean {
  const dow = getDay(date);
  return dow === 0 || dow === 6;
}

export function getWeekNumber(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = differenceInDays(date, start);
  return Math.ceil((days + start.getDay() + 1) / 7);
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    formatDate(addDays(new Date(), -6 + i))
  );
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    formatDate(addDays(new Date(), -29 + i))
  );
}

export function formatDisplayDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return format(d, 'dd.MM.yyyy');
}

export function formatDayName(dateStr: string): string {
  const d = parseDate(dateStr);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  return days[getDay(d)];
}

export { isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, addDays, differenceInDays };
