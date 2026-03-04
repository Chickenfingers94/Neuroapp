import { useMemo } from 'react';
import { getActiveInteractions, getSafetyColor, hasDangerousInteraction } from '../utils/interactionEngine';

export function useInteractions(activeSupplementIds: string[]) {
  const interactions = useMemo(
    () => getActiveInteractions(activeSupplementIds),
    [activeSupplementIds]
  );

  const dangerInteractions = useMemo(
    () => interactions.filter(i => i.level === 'danger'),
    [interactions]
  );

  const cautionInteractions = useMemo(
    () => interactions.filter(i => i.level === 'caution'),
    [interactions]
  );

  const synergyInteractions = useMemo(
    () => interactions.filter(i => i.level === 'synergy'),
    [interactions]
  );

  const safetyColor = useMemo(() => getSafetyColor(interactions), [interactions]);
  const hasDanger = useMemo(() => hasDangerousInteraction(activeSupplementIds), [activeSupplementIds]);

  return { interactions, dangerInteractions, cautionInteractions, synergyInteractions, safetyColor, hasDanger };
}
