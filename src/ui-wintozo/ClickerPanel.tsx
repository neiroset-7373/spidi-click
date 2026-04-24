import { useRef, useState, useCallback } from 'react';
import { GameState, ICON_URLS, CLICKER_POWER_ICON, MEDAL_ICON, AUTOCLICKER_ICON } from './types';
import FloatingNumbers from './FloatingNumber';
import MultiplierTimer from './MultiplierTimer';

interface Props {
  state: GameState;
  onClickButton: () => void;
}

function formatNumber(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

let rippleCounter = 0;

export default function ClickerPanel({ state, onClickButton }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [clickTrigger, setClickTrigger] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const mult = state.activeMultiplier && state.activeMultiplier.endTime > Date.now()
    ? state.activeMultiplier.value : 1;
  const effectivePower = (state.clickPower + state.permanentClickBonus) * mult;

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    onClickButton();
    setClickTrigger(t => t + 1);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Ripple
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else if ('clientX' in e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = rect.width / 2;
        y = rect.height / 2;
      }
      const id = ++rippleCounter;
      setRipples(prev => [...prev, { id, x, y }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    }
  }, [onClickButton]);

  const icons = ICON_URLS[state.iconPack];

  return (
    <div className="flex flex-col items-center gap-5 w-full select-none">
      {/* Coin count */}
      <div
        className="flex items-center gap-2.5 px-6 py-3 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
          border: '1.5px solid rgba(255,255,255,1)',
        }}
      >
        <img src={icons.coin} alt="coin" className="w-7 h-7 object-contain drop-shadow-sm" />
        <span className="text-3xl font-black text-slate-800 tracking-tight">{formatNumber(state.coins)}</span>
      </div>

      {/* Info row: click power + multiplier */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(59,130,246,0.15)', boxShadow: '0 2px 8px rgba(59,130,246,0.06)' }}
        >
          <img src={CLICKER_POWER_ICON} alt="power" className="w-4 h-4 object-contain" />
          <span className="text-sm font-bold text-slate-600">
            Сила клика: <span className="text-blue-600">{effectivePower}</span>
          </span>
        </div>

        {state.activeMultiplier && state.activeMultiplier.endTime > Date.now() && (
          <div
            className="px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(59,130,246,0.2)', boxShadow: '0 2px 8px rgba(59,130,246,0.1)' }}
          >
            <MultiplierTimer multiplier={state.activeMultiplier} />
          </div>
        )}
      </div>

      {/* Medal badge */}
      {state.medal100k && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1.5px solid rgba(251,191,36,0.4)', boxShadow: '0 2px 8px rgba(251,191,36,0.15)' }}
        >
          <img src={MEDAL_ICON} alt="medal" className="w-5 h-5 object-contain" />
          <span className="text-xs font-black text-amber-700">🏅 100K Кликов!</span>
        </div>
      )}

      {/* Click button */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center"
        style={{ width: 220, height: 220 }}
      >
        <FloatingNumbers trigger={clickTrigger} value={effectivePower} containerRef={containerRef as React.RefObject<HTMLElement | null>} />

        <button
          ref={btnRef}
          onMouseDown={handleClick}
          onTouchStart={e => { e.preventDefault(); handleClick(e); }}
          className="relative w-full h-full overflow-hidden focus:outline-none"
          style={{
            borderRadius: '50%',
            transform: isPressed ? 'scale(0.91)' : 'scale(1)',
            transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: isPressed
              ? '0 6px 20px rgba(59,130,246,0.25), 0 2px 6px rgba(0,0,0,0.08)'
              : '0 12px 48px rgba(59,130,246,0.22), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
            border: '3px solid rgba(255,255,255,0.95)',
          }}
        >
          <img
            src={icons.button}
            alt="click"
            className="w-full h-full object-cover"
            draggable={false}
            style={{ borderRadius: '50%' }}
          />
          {/* Ripple effects */}
          {ripples.map(r => (
            <span
              key={r.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: r.x - 10,
                top: r.y - 10,
                width: 20,
                height: 20,
                background: 'rgba(255,255,255,0.5)',
                animation: 'rippleAnim 0.6s ease-out forwards',
              }}
            />
          ))}
        </button>

        <style>{`
          @keyframes rippleAnim {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(12); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 flex-wrap justify-center">
        <div
          className="px-4 py-2.5 rounded-2xl text-center min-w-[80px]"
          style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Кликов</div>
          <div className="text-base font-black text-slate-700 mt-0.5">{formatNumber(state.totalClicks)}</div>
        </div>

        {state.autoClickerLevel > 0 && (
          <div
            className="px-4 py-2.5 rounded-2xl flex items-center gap-1.5 min-w-[100px]"
            style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(34,197,94,0.2)', boxShadow: '0 2px 8px rgba(34,197,94,0.06)' }}
          >
            <img src={AUTOCLICKER_ICON} alt="autoclicker" className="w-4 h-4 object-contain" />
            <div>
              <div className="text-[9px] text-green-500 font-bold uppercase tracking-wide">Авто/сек</div>
              <div className="text-base font-black text-green-700">{formatNumber(state.autoClickerLevel * state.autoClickerPower * mult)}</div>
            </div>
          </div>
        )}

        {state.permanentClickBonus > 0 && (
          <div
            className="px-4 py-2.5 rounded-2xl text-center min-w-[80px]"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1.5px solid rgba(251,191,36,0.3)', boxShadow: '0 2px 8px rgba(251,191,36,0.08)' }}
          >
            <div className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">⭐ Бонус</div>
            <div className="text-base font-black text-amber-700 mt-0.5">+{state.permanentClickBonus}</div>
          </div>
        )}
      </div>
    </div>
  );
}
