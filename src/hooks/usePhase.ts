import { useMemo } from 'react';
import { getProtocolWeek } from '../utils/dateUtils';
import type { Phase } from '../types';

export function usePhase(startDate: string, phase: Phase) {
  const protocolWeek = useMemo(() => getProtocolWeek(startDate), [startDate]);

  const phaseLabel = useMemo(() => `Phase ${phase}`, [phase]);

  const phaseProgress = useMemo(() => {
    // Phase 1: weeks 1-8, Phase 2: weeks 9-16, Phase 3: weeks 17+
    const totalWeeks = 24;
    const progress = Math.min(100, Math.round((protocolWeek / totalWeeks) * 100));
    return progress;
  }, [protocolWeek]);

  const monitorLevel = useMemo(() => {
    if (phaseProgress >= 80) return 100;
    if (phaseProgress >= 60) return 80;
    if (phaseProgress >= 40) return 60;
    return 40;
  }, [phaseProgress]);

  const phaseColor = useMemo(() => {
    if (phase === 3) return 'text-red-400';
    if (phase === 2) return 'text-amber-400';
    return 'text-sky-400';
  }, [phase]);

  return { protocolWeek, phaseLabel, phaseProgress, monitorLevel, phaseColor };
}
