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
  { substances: ['lsd', 'methylenblau'], level: 'danger', description: 'Serotonin-Kaskade!' },
  // CAUTION
  { substances: ['5htp', 'l-tyrosin'], level: 'caution', description: 'AADC-Konkurrenz – ≥2h Abstand einhalten' },
  { substances: ['bromantane', 'bromantane'], level: 'caution', description: '>4 Wochen täglich → Toleranzentwicklung' },
  { substances: ['5htp', 'selank'], level: 'caution', description: '5-HTP NUR in Selank Off-Wochen!' },
  { substances: ['5htp', 'semax'], level: 'caution', description: '5-HTP NUR in Semax Off-Wochen!' },
  { substances: ['fasoracetam', 'tak653'], level: 'caution', description: 'Beide Glutamat-modulierend – Fasoracetam niedrig halten (20mg) an TAK-Tagen. Fasoracetam = Sicherheitsnetz.' },
  { substances: ['tak653', 'methylenblau'], level: 'caution', description: 'AMPA-Potenzierung + MAO-Hemmung – suboptimale Kombination.' },
  // SYNERGY
  { substances: ['creatin', 'cdp-cholin'], level: 'synergy', description: 'Energie + ACh' },
  { substances: ['lionsmane', 'semax'], level: 'synergy', description: 'NGF + BDNF/NGF/CNTF = verstärkte neurotrophine Achse' },
  { substances: ['semax', 'acd856'], level: 'synergy', description: 'BDNF↑ + TrkB-Sensitivierung = MULTIPLIKATOR-Effekt' },
  { substances: ['semax', 'sport'], level: 'synergy', description: 'BDNF↑ + BDNF↑ = additive Neuroplastizität' },
  { substances: ['selank', 'passionsblume'], level: 'synergy', description: 'GABA-A + Enkephalin = breite Anxiolyse' },
  { substances: ['selank', 'nac-morgens'], level: 'synergy', description: '5-HT-Stabilisierung + Glutamat-Regulation' },
  { substances: ['fasoracetam', 'nac-morgens'], level: 'synergy', description: 'mGluR-Feintuning + System-Xc-Regulation' },
  { substances: ['fasoracetam', 'passionsblume'], level: 'synergy', description: 'GABA-B↑ + GABA-A = GABAerge Vollabdeckung' },
  { substances: ['fasoracetam', 'selank'], level: 'synergy', description: 'GABA-B + GABA-A/Enkephalin = dreischichtige Anxiolyse' },
  { substances: ['fasoracetam', 'tak653'], level: 'synergy', description: 'mGluR-Thermostat + AMPA-Enhancement = sicherere Glutamat-Potenzierung' },
  { substances: ['acd856', 'lsd'], level: 'synergy', description: 'TrkB-Sensitivierung + 5-HT2A→BDNF = potenzierte Plastizitätskaskade' },
  { substances: ['acd856', 'lionsmane'], level: 'synergy', description: 'TrkB-PAM + NGF = verstärkte neurotrophine Signale' },
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
