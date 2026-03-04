import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDayName } from '../utils/dateUtils';

type Period = '7' | '30';

export const TrackingPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('7');
  const { scoreData, weeklyAverage, trainingCorrelation, loading } = useAnalytics(Number(period));

  const chartData = scoreData.map(d => ({
    ...d,
    name: formatDayName(d.date),
  }));

  if (loading) {
    return (
      <>
        <Header title="📊 Analytics & Tracking" />
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <span className="text-slate-400 animate-pulse">Lade Daten...</span>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header title="📊 Analytics & Tracking" subtitle="Trends & Korrelationen" />
      <PageContainer>
        <div className="space-y-4">

          {/* Period selector */}
          <div className="flex gap-2">
            {(['7', '30'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p} Tage
              </button>
            ))}
          </div>

          {/* Weekly averages */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📈 Durchschnitte (letzte {period} Tage)</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'sleep' as const, label: 'Schlaf', emoji: '😴', color: 'text-sky-400' },
                { key: 'focus' as const, label: 'Fokus', emoji: '🎯', color: 'text-purple-400' },
                { key: 'mood' as const, label: 'Stimmung', emoji: '😊', color: 'text-green-400' },
                { key: 'energy' as const, label: 'Energie', emoji: '⚡', color: 'text-amber-400' },
              ].map(item => (
                <div key={item.key} className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <span className="text-lg">{item.emoji}</span>
                  <p className={`font-mono text-xl font-bold mt-1 ${item.color}`}>
                    {weeklyAverage[item.key]}
                  </p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Training correlation */}
          {trainingCorrelation !== 0 && (
            <Card>
              <p className="text-sm text-slate-300">
                🏋️ Training Korrelation (Fokus):
                <span className={`font-mono font-bold ml-2 ${trainingCorrelation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trainingCorrelation > 0 ? '+' : ''}{trainingCorrelation}
                </span>
              </p>
            </Card>
          )}

          {/* Line Chart */}
          {chartData.length > 1 ? (
            <Card>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Verlauf</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={[1, 10]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="sleep" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Schlaf" />
                  <Line type="monotone" dataKey="focus" stroke="#a855f7" strokeWidth={2} dot={false} name="Fokus" />
                  <Line type="monotone" dataKey="mood" stroke="#22c55e" strokeWidth={2} dot={false} name="Stimmung" />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} name="Energie" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <Card>
              <p className="text-sm text-slate-400 text-center py-6">
                Noch keine Tracking-Daten vorhanden.<br />
                <span className="text-xs text-slate-500">Tracke dein Wohlbefinden täglich im Dashboard.</span>
              </p>
            </Card>
          )}

        </div>
      </PageContainer>
    </>
  );
};
