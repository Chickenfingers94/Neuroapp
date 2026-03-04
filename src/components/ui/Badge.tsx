import React from 'react';
import type { RiskLevel, InteractionLevel } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: RiskLevel | InteractionLevel | 'phase1' | 'phase2' | 'phase3' | 'neutral';
  className?: string;
}

const variantClasses: Record<string, string> = {
  safe: 'badge-safe',
  monitored: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5 text-xs font-medium',
  experimental: 'badge-experimental',
  'research-only': 'bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium',
  danger: 'badge-danger',
  caution: 'badge-caution',
  synergy: 'badge-synergy',
  phase1: 'bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full px-2 py-0.5 text-xs font-medium',
  phase2: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 text-xs font-medium',
  phase3: 'bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium',
  neutral: 'bg-slate-700/50 text-slate-400 border border-slate-600/30 rounded-full px-2 py-0.5 text-xs font-medium',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => (
  <span className={`${variantClasses[variant] ?? variantClasses.neutral} ${className}`}>
    {children}
  </span>
);
