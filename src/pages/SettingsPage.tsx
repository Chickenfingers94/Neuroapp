import React, { useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSettings } from '../hooks/useSettings';
import { getProtocolWeek } from '../utils/dateUtils';
import type { Phase, StrategyMode } from '../types';

export const SettingsPage: React.FC = () => {
  const { settings, update, exportData } = useSettings();
  const protocolWeek = getProtocolWeek(settings.startDate);

  const handlePhaseChange = useCallback((phase: Phase) => {
    update('phase', phase);
  }, [update]);

  const handleStrategyChange = useCallback((strategy: StrategyMode) => {
    update('strategy', strategy);
  }, [update]);

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    update('startDate', e.target.value);
  }, [update]);

  return (
    <>
      <Header title="⚙️ Einstellungen" />
      <PageContainer>
        <div className="space-y-4">

          {/* Protocol Date */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📅 Protokoll-Startdatum</h3>
            <input
              type="date"
              value={settings.startDate}
              onChange={handleStartDateChange}
              className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50"
            />
            <p className="text-xs text-slate-500 mt-2">Aktuelle Protokoll-Woche: <span className="font-mono text-white">{protocolWeek}</span></p>
          </Card>

          {/* Phase */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">🔬 Aktive Phase</h3>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as Phase[]).map(p => (
                <button
                  key={p}
                  onClick={() => handlePhaseChange(p)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                    settings.phase === p
                      ? p === 1 ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                      : p === 2 ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Phase {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Phase 1: Basics (1-8 Wo) · Phase 2: Nootropika (9-16 Wo) · Phase 3: Advanced (17+ Wo)
            </p>
          </Card>

          {/* Strategy */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">🎯 Strategie-Modus</h3>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'conservative' as StrategyMode, label: '🛡️ Konservativ', desc: 'Ohne Dihexa & LSD' },
                { value: 'experimental' as StrategyMode, label: '🧪 Experimentell', desc: 'Volles Protokoll' },
              ]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStrategyChange(opt.value)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    settings.strategy === opt.value
                      ? 'bg-sky-600/30 border border-sky-500/50 text-white'
                      : 'bg-slate-800 border border-transparent text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Data */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">💾 Daten</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full" onClick={exportData}>
                📤 Daten exportieren (JSON)
              </Button>
            </div>
          </Card>

          {/* About */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">ℹ️ Über Neuroapp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Neuroapp v3.0 – Neurobiologischer Supplement & Habit Tracker.<br />
              Alle Daten werden lokal auf deinem Gerät gespeichert.<br />
              Keine Daten werden an externe Server übertragen.<br /><br />
              ⚠️ Diese App ersetzt keine medizinische Beratung.
            </p>
          </Card>

        </div>
      </PageContainer>
    </>
  );
};
