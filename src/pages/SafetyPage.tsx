import React from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { SafetyStatus } from '../components/safety/SafetyStatus';
import { useSettings } from '../hooks/useSettings';
import { useCycling } from '../hooks/useCycling';
import { useInteractions } from '../hooks/useInteractions';
import { useDailyLog } from '../hooks/useDailyLog';
import { today } from '../utils/dateUtils';

const EMERGENCY_INFO = [
  { symptom: 'Kieferspannung / unwillkürliche Bewegungen', action: 'TAK-653 sofort stoppen. Keine weiteren Substanzen heute. Fasoracetam 20mg als Sicherheitsnetz.', severity: 'danger' as const },
  { symptom: 'Angst, Panik, Herzrasen', action: 'Alle stimulierenden Substanzen stoppen. L-Theanin 200mg. Selank-Nasenspray (anxiolytisch). Ruhe suchen.', severity: 'danger' as const },
  { symptom: 'Nasale Reizung (Selank/Semax)', action: 'Dosis reduzieren auf 250µg. 1 Tag Pause. Isotonische Kochsalzlösung zur Spülung.', severity: 'caution' as const },
  { symptom: 'Schlafstörungen', action: 'Stimulanzien früher einnehmen. Mg/Passionsblume/Theanin abends hochdosieren.', severity: 'caution' as const },
  { symptom: 'Extremer Fokus/Unruhe nach LSD', action: 'L-Theanin 400mg. Keine weitere Stimulation. Spaziergehen.', severity: 'caution' as const },
];

export const SafetyPage: React.FC = () => {
  const { settings } = useSettings();
  const { isTrainingDay } = useDailyLog(today());
  const { activeTodayIds } = useCycling(settings.startDate, settings.phase, isTrainingDay);
  const { interactions, safetyColor, dangerInteractions, cautionInteractions, synergyInteractions } = useInteractions(activeTodayIds);

  return (
    <>
      <Header title="🛡️ Sicherheits-Dashboard" subtitle="Interaktionen & Notfallinformationen" />
      <PageContainer>
        <div className="space-y-4">

          <SafetyStatus interactions={interactions} safetyColor={safetyColor} />

          {/* All Interactions */}
          {dangerInteractions.length > 0 && (
            <Card className="border-red-500/30">
              <h3 className="text-sm font-bold text-red-400 mb-3">⚠️ DANGER ({dangerInteractions.length})</h3>
              <div className="space-y-2">
                {dangerInteractions.map((i, idx) => (
                  <div key={idx} className="text-xs bg-red-500/10 rounded-lg p-3">
                    <p className="font-semibold text-red-400">{i.substance1} + {i.substance2}</p>
                    <p className="text-red-300/80 mt-0.5">{i.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {cautionInteractions.length > 0 && (
            <Card className="border-yellow-500/30">
              <h3 className="text-sm font-bold text-yellow-400 mb-3">⚡ Vorsicht ({cautionInteractions.length})</h3>
              <div className="space-y-2">
                {cautionInteractions.map((i, idx) => (
                  <div key={idx} className="text-xs bg-yellow-500/10 rounded-lg p-3">
                    <p className="font-semibold text-yellow-400">{i.substance1} + {i.substance2}</p>
                    <p className="text-yellow-300/80 mt-0.5">{i.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {synergyInteractions.length > 0 && (
            <Card className="border-purple-500/30">
              <h3 className="text-sm font-bold text-purple-400 mb-3">✨ Synergien ({synergyInteractions.length})</h3>
              <div className="space-y-2">
                {synergyInteractions.map((i, idx) => (
                  <div key={idx} className="text-xs bg-purple-500/10 rounded-lg p-3">
                    <p className="font-semibold text-purple-400">{i.substance1} + {i.substance2}</p>
                    <p className="text-purple-300/80 mt-0.5">{i.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Emergency Info */}
          <Card>
            <h3 className="text-sm font-bold text-slate-300 mb-3">🚨 Notfall-Protokoll</h3>
            <div className="space-y-3">
              {EMERGENCY_INFO.map((info, idx) => (
                <div key={idx} className={`text-xs rounded-lg p-3 ${
                  info.severity === 'danger' ? 'bg-red-500/10 border border-red-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}>
                  <p className={`font-semibold mb-1 ${info.severity === 'danger' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {info.symptom}
                  </p>
                  <p className="text-slate-300/80 leading-relaxed">{info.action}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Contraindications */}
          <Card>
            <h3 className="text-sm font-bold text-slate-300 mb-3">🚫 Absolute Kontraindikationen</h3>
            <div className="space-y-2 text-xs text-slate-400">
              <p>• 5-HTP + Methylenblau → NIEMALS kombinieren (Serotonin-Syndrom)</p>
              <p>• Selank/Semax + 5-HTP → NUR in Off-Wochen</p>
              <p>• TAK-653 &gt;1mg in Kombination → NIEMALS</p>
            </div>
          </Card>

        </div>
      </PageContainer>
    </>
  );
};
