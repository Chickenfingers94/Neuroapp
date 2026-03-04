import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDayName } from '../utils/dateUtils';

type Period = '7' | '30';

const SCORE_ITEMS = [
  { key: 'sleep' as const,  label: 'Schlaf',    emoji: '😴', color: 'text-sky-400',    bar: 'bg-sky-500' },
  { key: 'focus' as const,  label: 'Fokus',     emoji: '🎯', color: 'text-purple-400', bar: 'bg-purple-500' },
  { key: 'mood' as const,   label: 'Stimmung',  emoji: '😊', color: 'text-green-400',  bar: 'bg-green-500' },
  { key: 'energy' as const, label: 'Energie',   emoji: '⚡', color: 'text-amber-400',  bar: 'bg-amber-500' },
] as const;

const TrackingSkeleton: React.FC = () => (
  <PageContainer>
    <div className="space-y-4">
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-56 w-full" />
    </div>
  </PageContainer>
);

export const TrackingPage: React.FC = () => {
  const [period, setPeriod] = useState<Period>('7');
  const { scoreData, weeklyAverage, trainingCorrelation, loading } = useAnalytics(Number(period));

  const chartData = scoreData.map(d => ({ ...d, name: formatDayName(d.date) }));

  if (loading) {
    return (
      <>
        <Header title="📊 Analytics & Tracking" />
        <TrackingSkeleton />
      </>
    );
  }

  return (
    <>
      <Header title="📊 Analytics & Tracking" subtitle="Trends & Korrelationen" />
      <PageContainer>
        <div className="space-y-4">

          {/* Period selector with sliding indicator */}
          <div className="relative flex gap-2 p-1 glass-card rounded-2xl">
            {(['7', '30'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="flex-1 py-2 rounded-xl text-sm font-medium relative z-10 transition-colors duration-200"
              >
                {period === p && (
                  <motion.div
                    layoutId="period-indicator"
                    className="absolute inset-0 bg-sky-600 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <span className={period === p ? 'text-white' : 'text-slate-400'}>
                  {p} Tage
                </span>
              </button>
            ))}
          </div>

          {/* Weekly averages with mini bar */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">📈 Durchschnitte (letzte {period} Tage)</h3>
            <div className="grid grid-cols-2 gap-3">
              {SCORE_ITEMS.map(item => {
                const val = weeklyAverage[item.key];
                const pct = ((Number(val) - 1) / 9) * 100;
                return (
                  <div key={item.key} className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base">{item.emoji}</span>
                      <span className={`font-mono text-xl font-bold ${item.color}`}>{val}</span>
                    </div>
                    <div className="w-full bg-slate-700/60 rounded-full h-1 overflow-hidden">
                      <motion.div
                        className={`h-1 rounded-full ${item.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                  </div>
                );
              })}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={[1, 10]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,23,42,0.95)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="sleep"  stroke="#0ea5e9" strokeWidth={2} dot={false} name="Schlaf"   activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="focus"  stroke="#a855f7" strokeWidth={2} dot={false} name="Fokus"    activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="mood"   stroke="#22c55e" strokeWidth={2} dot={false} name="Stimmung" activeDot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} name="Energie"  activeDot={{ r: 4, strokeWidth: 0 }} />
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
