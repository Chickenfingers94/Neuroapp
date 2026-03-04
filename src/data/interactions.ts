import type { TodayInteraction } from '../types';

export interface InteractionRule {
  substances: [string, string];
  level: 'danger' | 'caution' | 'synergy';
  description: string;
}

export const INTERACTION_RULES: InteractionRule[] = [
  // DANGER
  { substances: ['5htp', 'methylenblau'], level: 'danger', description: 'Serotonin-Syndrom-Risiko!' },
  { substances: ['5htp', 'lsd'], level: 'danger', description: 'Serotonin-Überschuss!' },
  { substances: ['9mebc', 'methylenblau'], level: 'danger', description: 'Doppelte MAO-Hemmung → Tyramin-Krise + Serotonin-Syndrom-Risiko!' },
  { substances: ['tak653', 'phenylpiracetam'], level: 'danger', description: 'Glutamat-Überlast!' },
  { substances: ['tak653', '9mebc'], level: 'danger', description: 'Glutamat + DA Überaktivierung!' },
  { substances: ['lsd', 'methylenblau'], level: 'danger', description: 'Serotonin-Kaskade!' },
  // CAUTION
  { substances: ['5htp', 'l-tyrosin'], level: 'caution', description: 'AADC-Konkurrenz – ≥2h Abstand einhalten' },
  { substances: ['bromantane', 'bromantane'], level: 'caution', description: '>4 Wochen täglich → Toleranzentwicklung' },
  { substances: ['9mebc', 'lsd'], level: 'caution', description: 'MAO + 5-HT2A – Serotonin-Risiko' },
  { substances: ['l-tyrosin', '9mebc'], level: 'caution', description: 'DA-Akkumulation – L-Tyrosin auf 500mg reduzieren' },
  { substances: ['dihexa', 'dihexa'], level: 'caution', description: 'HGF/c-Met Pathway ist onkogen' },
  // SYNERGY
  { substances: ['creatin', 'cdp-cholin'], level: 'synergy', description: 'Energie + ACh' },
  { substances: ['lionsmane', 'dihexa'], level: 'synergy', description: 'NGF + HGF = maximale Neurogenese' },
  { substances: ['nac-morgens', 'vitamin-c-morgens'], level: 'synergy', description: 'Antioxidans-Synergie' },
  { substances: ['l-theanin-nachmittags', 'koffein'], level: 'synergy', description: 'Fokus-Stack' },
  { substances: ['lionsmane', 'sport'], level: 'synergy', description: 'BDNF + NGF' },
  { substances: ['magnesium', 'passionsblume'], level: 'synergy', description: 'Schlaf-Stack' },
  { substances: ['l-tyrosin', 'bromantane'], level: 'synergy', description: 'Substrat + TH-Upregulation = max DA-Synthese' },
  { substances: ['omega3', 'phosphatidylserin'], level: 'synergy', description: 'Membranreparatur' },
  { substances: ['nac-morgens', 'taurin'], level: 'synergy', description: 'Glutamat-Protektion' },
];

export function checkInteractions(activeIds: string[]): TodayInteraction[] {
  const results: TodayInteraction[] = [];
  const seen = new Set<string>();

  for (const rule of INTERACTION_RULES) {
    const [a, b] = rule.substances;
    if (a === b) continue; // skip self-rules for daily check
    if (activeIds.includes(a) && activeIds.includes(b)) {
      const key = [a, b].sort().join('+');
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          level: rule.level,
          substance1: a,
          substance2: b,
          description: rule.description,
        });
      }
    }
  }

  return results.sort((a, b) => {
    const order = { danger: 0, caution: 1, synergy: 2 };
    return order[a.level] - order[b.level];
  });
}
