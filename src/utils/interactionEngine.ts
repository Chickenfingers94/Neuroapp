import { checkInteractions } from '../data/interactions';
import type { TodayInteraction } from '../types';

export function getActiveInteractions(activeSupplementIds: string[]): TodayInteraction[] {
  return checkInteractions(activeSupplementIds);
}

export function hasDangerousInteraction(activeSupplementIds: string[]): boolean {
  const interactions = checkInteractions(activeSupplementIds);
  return interactions.some(i => i.level === 'danger');
}

export function getSafetyColor(interactions: TodayInteraction[]): 'green' | 'yellow' | 'red' {
  if (interactions.some(i => i.level === 'danger')) return 'red';
  if (interactions.some(i => i.level === 'caution')) return 'yellow';
  return 'green';
}
