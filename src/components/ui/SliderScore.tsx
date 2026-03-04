import React from 'react';

interface SliderScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  emoji?: string;
  color?: string;
}

export const SliderScore: React.FC<SliderScoreProps> = ({
  label, value, onChange, emoji = '⭐', color = 'sky'
}) => {
  const colorMap: Record<string, string> = {
    sky: 'accent-sky-500',
    green: 'accent-green-500',
    amber: 'accent-amber-500',
    purple: 'accent-purple-500',
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300 flex items-center gap-1">
          {emoji} {label}
        </span>
        <span className="font-mono text-lg font-bold text-white tabular-nums">
          {value}<span className="text-slate-500 text-sm">/10</span>
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full bg-slate-700 ${colorMap[color] ?? colorMap.sky} cursor-pointer`}
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-slate-600">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};
