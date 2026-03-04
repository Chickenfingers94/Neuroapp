import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { SupplementCard } from '../components/supplements/SupplementCard';
import { SUPPLEMENTS } from '../data/supplements';
import type { RiskLevel } from '../types';

type FilterPhase = 'all' | '1' | '2' | '3';
type FilterRisk = 'all' | RiskLevel;

export const KnowledgePage: React.FC = () => {
  const [phaseFilter, setPhaseFilter] = useState<FilterPhase>('all');
  const [riskFilter, setRiskFilter] = useState<FilterRisk>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return SUPPLEMENTS.filter(s => {
      if (phaseFilter !== 'all' && s.phase !== Number(phaseFilter)) return false;
      if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [phaseFilter, riskFilter, search]);

  return (
    <>
      <Header title="📚 Supplement-Bibliothek" subtitle={`${filtered.length} von ${SUPPLEMENTS.length} Substanzen`} />
      <PageContainer>
        <div className="space-y-4">

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Supplement suchen..."
            className="w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />

          {/* Phase filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all', '1', '2', '3'] as FilterPhase[]).map(p => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  phaseFilter === p
                    ? p === 'all' ? 'bg-slate-600 text-white' :
                      p === '1' ? 'bg-sky-600 text-white' :
                      p === '2' ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {p === 'all' ? 'Alle Phasen' : `Phase ${p}`}
              </button>
            ))}
          </div>

          {/* Risk filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {([
              { value: 'all', label: 'Alle' },
              { value: 'safe', label: '🟢 Sicher' },
              { value: 'monitored', label: '🟡 Überwacht' },
              { value: 'experimental', label: '🟠 Experimentell' },
              { value: 'research-only', label: '🔴 Forschung' },
            ] as { value: FilterRisk; label: string }[]).map(r => (
              <button
                key={r.value}
                onClick={() => setRiskFilter(r.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  riskFilter === r.value ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Supplements list */}
          <div className="space-y-2">
            {filtered.map(s => (
              <SupplementCard key={s.id} supplement={s} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Keine Supplements gefunden
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
};
