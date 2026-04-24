import { useState, useEffect } from 'react';
import { Multiplier } from './types';

interface Props {
  multiplier: Multiplier;
}

export default function MultiplierTimer({ multiplier }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, multiplier.endTime - now);
  const totalMs = multiplier.duration;
  const progress = remaining / totalMs;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const label = `${mins}:${secs.toString().padStart(2, '0')}`;

  const R = 18;
  const C = 2 * Math.PI * R;
  const dash = C * progress;

  // Color based on remaining time
  const getColor = () => {
    if (progress > 0.5) return '#3b82f6'; // blue
    if (progress > 0.2) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-11 h-11">
        <svg width="44" height="44" viewBox="0 0 44 44" className="rotate-[-90deg]">
          <circle cx="22" cy="22" r={R} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
          <circle
            cx="22"
            cy="22"
            r={R}
            fill="none"
            stroke={getColor()}
            strokeWidth="3.5"
            strokeDasharray={`${dash} ${C}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.5s linear, stroke 0.3s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[10px] font-black"
            style={{ color: getColor() }}
          >
            {label}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className="text-base font-black leading-none"
          style={{ color: getColor() }}
        >
          x{multiplier.value}
        </span>
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
          Активен
        </span>
      </div>
    </div>
  );
}
