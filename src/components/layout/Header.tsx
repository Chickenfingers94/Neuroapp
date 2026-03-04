import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, right }) => (
  <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-white/5 px-4 py-3">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  </header>
);
