import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, right }) => (
  <header
    className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.06] px-4 pb-3"
    style={{
      paddingTop: 'calc(0.75rem + env(safe-area-inset-top))',
      background: 'linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.85) 100%)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
    }}
  >
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  </header>
);
