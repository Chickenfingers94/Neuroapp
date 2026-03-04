import { useMemo } from 'react';
import {
  getMethylenblauStatus,
  get9MeBCCycle,
  getBromantaneCycle,
  getDihexaCycle,
  getLSDCycle,
  getPhenylpiracetamStatus,
  getTAK653Status,
  getZinkStatus,
  get5HTPStatus,
} from '../utils/cyclingEngine';
import { getProtocolWeek } from '../utils/dateUtils';
import type { CyclingStatus, Phase } from '../types';

export function useCycling(startDate: string, phase: Phase, isTrainingDay: boolean = false) {
  const protocolWeek = useMemo(() => getProtocolWeek(startDate), [startDate]);

  const cyclingStatuses = useMemo((): Record<string, CyclingStatus> => {
    const date = new Date();

    const statuses: Record<string, CyclingStatus> = {};

    // Always active (no cycling)
    ['multivitamin', 'd3k2', 'creatin', 'nac-morgens', 'nac-abends', 'vitamin-c-morgens',
     'vitamin-c-nachmittags', 'omega3', 'l-tyrosin', 'taurin', 'l-theanin-nachmittags',
     'l-theanin-abends', 'lionsmane', 'magnesium', 'passionsblume', 'b-komplex',
     'phosphatidylserin', 'cdp-cholin'].forEach(id => {
      statuses[id] = { supplementId: id, status: 'active' };
    });

    // Zink: Mo/Mi/Fr
    const zinkResult = getZinkStatus(date);
    statuses['zink'] = { supplementId: 'zink', status: zinkResult.status, reason: zinkResult.reason };

    // 5-HTP optional: max 3x/week
    const htpResult = get5HTPStatus(date);
    statuses['5htp'] = { supplementId: '5htp', status: htpResult.status, reason: htpResult.reason };

    if (phase >= 2) {
      // Methylenblau: Mo+Do
      const mbResult = getMethylenblauStatus(date);
      statuses['methylenblau'] = { supplementId: 'methylenblau', status: mbResult.status, reason: mbResult.reason };

      // Bromantane: 5on2off + 4w/1w
      const bromResult = getBromantaneCycle(startDate, date);
      statuses['bromantane'] = { supplementId: 'bromantane', status: bromResult.status, reason: bromResult.reason, weekInCycle: bromResult.weekInMacro };
    }

    if (phase >= 3) {
      // Phenylpiracetam: Mo+Mi
      const phpResult = getPhenylpiracetamStatus(date);
      statuses['phenylpiracetam'] = { supplementId: 'phenylpiracetam', status: phpResult.status, reason: phpResult.reason };

      // 9-Me-BC: Di+Fr + 2w/4w macro
      const mebcResult = get9MeBCCycle(startDate, date);
      statuses['9mebc'] = { supplementId: '9mebc', status: mebcResult.status, reason: mebcResult.reason, weekInCycle: mebcResult.weekInMacro };

      // Dihexa: training days + 4w/4w
      const dihexaResult = getDihexaCycle(startDate, isTrainingDay, date);
      statuses['dihexa'] = { supplementId: 'dihexa', status: dihexaResult.status, reason: dihexaResult.reason };

      // LSD: Fadiman 1/2
      const lsdResult = getLSDCycle(startDate, date);
      statuses['lsd'] = { supplementId: 'lsd', status: lsdResult.status, reason: lsdResult.reason };

      // TAK-653: Do+Sa, ab Woche 16
      const takResult = getTAK653Status(startDate, protocolWeek, date);
      statuses['tak653'] = { supplementId: 'tak653', status: takResult.status, reason: takResult.reason };
    }

    return statuses;
  }, [startDate, phase, isTrainingDay, protocolWeek]);

  const activeTodayIds = useMemo(() =>
    Object.entries(cyclingStatuses)
      .filter(([, s]) => s.status === 'active')
      .map(([id]) => id),
    [cyclingStatuses]
  );

  return { cyclingStatuses, activeTodayIds, protocolWeek };
}
