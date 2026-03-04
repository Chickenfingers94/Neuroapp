import React, { useCallback, useRef, useState } from 'react';

interface SliderScoreProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  emoji?: string;
  color?: string;
}

const COLOR_MAP: Record<string, { track: string; glow: string; text: string }> = {
  sky:    { track: '#0ea5e9', glow: 'rgba(14,165,233,0.4)',  text: 'text-sky-400' },
  green:  { track: '#22c55e', glow: 'rgba(34,197,94,0.4)',   text: 'text-green-400' },
  amber:  { track: '#f59e0b', glow: 'rgba(245,158,11,0.4)',  text: 'text-amber-400' },
  purple: { track: '#a855f7', glow: 'rgba(168,85,247,0.4)',  text: 'text-purple-400' },
};

export const SliderScore: React.FC<SliderScoreProps> = ({
  label, value, onChange, emoji = '⭐', color = 'sky'
}) => {
  const c = COLOR_MAP[color] ?? COLOR_MAP.sky;
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const fillPct = ((value - 1) / 9) * 100;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300 flex items-center gap-1.5">
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className={`font-mono text-lg font-bold tabular-nums ${c.text}`}>
          {value}<span className="text-slate-600 text-sm font-normal">/10</span>
        </span>
      </div>

      <div ref={trackRef} className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-700/80" />
        {/* Filled track */}
        <div
          className="absolute left-0 h-1.5 rounded-full transition-all duration-100"
          style={{
            width: `${fillPct}%`,
            background: `linear-gradient(90deg, ${c.track}99, ${c.track})`,
            boxShadow: isDragging ? `0 0 8px 2px ${c.glow}` : `0 0 4px 1px ${c.glow}55`,
          }}
        />
        {/* Native input on top for interaction */}
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="slider-thumb absolute inset-x-0"
          style={{ color: c.track }}
          aria-label={label}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-600 font-mono">
        <span>1</span>
        {[2,3,4,5,6,7,8,9].map(n => <span key={n} className="opacity-40">|</span>)}
        <span>10</span>
      </div>
    </div>
  );
};
