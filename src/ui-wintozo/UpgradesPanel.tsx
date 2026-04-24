import { GameState, MULTIPLIER_UPGRADES, AUTOCLIK_UPGRADES, UPGRADES_ICON, ICON_URLS, AUTOCLICKER_ICON } from './types';

interface Props {
  state: GameState;
  onBuyMultiplier: (price: number, mult: number) => void;
  onBuyAutoClicker: (price: number, level: number, power: number) => void;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

export default function UpgradesPanel({ state, onBuyMultiplier, onBuyAutoClicker }: Props) {
  const icons = ICON_URLS[state.iconPack];
  const hasActiveMultiplier = state.activeMultiplier && state.activeMultiplier.endTime > Date.now();

  return (
    <div className="flex flex-col gap-6 w-full pb-4">
      {/* Multipliers */}
      <section className="animate-slide-in-up">
        <div className="flex items-center gap-2 mb-4">
          <img src={UPGRADES_ICON} alt="upgrades" className="w-7 h-7 object-contain" />
          <h3 className="font-black text-slate-800 text-lg">Улучшения Спиди</h3>
          {hasActiveMultiplier && (
            <span
              className="ml-auto text-xs font-black px-2.5 py-1 rounded-full text-blue-700 animate-pulse"
              style={{ background: 'rgba(59,130,246,0.12)' }}
            >
              x{state.activeMultiplier!.value} Активен
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 mb-4 font-semibold">⏰ Множитель действует 30 минут</div>
        <div className="flex flex-col gap-2.5">
          {MULTIPLIER_UPGRADES.map((upg, idx) => {
            const canBuy = state.coins >= upg.price;
            return (
              <button
                key={upg.price}
                disabled={!canBuy}
                onClick={() => onBuyMultiplier(upg.price, upg.multiplier)}
                className="flex items-center gap-3 p-4 rounded-2xl w-full text-left transition-all duration-300 animate-slide-in-up hover-lift"
                style={{
                  background: canBuy
                    ? 'rgba(255,255,255,0.98)'
                    : 'rgba(255,255,255,0.6)',
                  border: canBuy
                    ? '1.5px solid rgba(59,130,246,0.3)'
                    : '1.5px solid #e2e8f0',
                  boxShadow: canBuy
                    ? '0 4px 16px rgba(59,130,246,0.12)'
                    : 'none',
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: canBuy ? 1 : 0.65,
                  animationDelay: `${idx * 50}ms`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all duration-300"
                  style={{
                    background: canBuy
                      ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)'
                      : '#f1f5f9',
                    color: canBuy ? '#2563eb' : '#94a3b8',
                    transform: canBuy ? 'scale(1)' : 'scale(0.95)',
                  }}
                >
                  x{upg.multiplier}
                </div>
                <div className="flex-1">
                  <div className="font-black text-sm text-slate-800">Множитель x{upg.multiplier}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">⏱️ 30 минут</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src={icons.coin} alt="coin" className="w-5 h-5 object-contain" />
                  <span
                    className="font-black text-base"
                    style={{ color: canBuy ? '#3b82f6' : '#94a3b8' }}
                  >
                    {formatNumber(upg.price)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Auto-clicker */}
      <section className="animate-slide-in-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <img src={AUTOCLICKER_ICON} alt="autoclicker" className="w-7 h-7 object-contain" />
          <h3 className="font-black text-slate-800 text-lg">Авто-кликер</h3>
          {state.autoClickerLevel > 0 && (
            <span
              className="ml-auto text-xs font-black px-2.5 py-1 rounded-full text-green-700 animate-pulse"
              style={{ background: 'rgba(34,197,94,0.12)' }}
            >
              Уровень {state.autoClickerLevel}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          {AUTOCLIK_UPGRADES.map((upg, idx) => {
            const canBuy = state.coins >= upg.price && state.autoClickerLevel < upg.level;
            const owned = state.autoClickerLevel >= upg.level;
            return (
              <button
                key={upg.level}
                disabled={!canBuy}
                onClick={() => !owned && onBuyAutoClicker(upg.price, upg.level, upg.power)}
                className="flex items-center gap-3 p-4 rounded-2xl w-full text-left transition-all duration-300 animate-slide-in-up hover-lift"
                style={{
                  background: owned
                    ? 'rgba(34,197,94,0.1)'
                    : canBuy
                    ? 'rgba(255,255,255,0.98)'
                    : 'rgba(255,255,255,0.6)',
                  border: owned
                    ? '1.5px solid rgba(34,197,94,0.4)'
                    : canBuy
                    ? '1.5px solid rgba(59,130,246,0.3)'
                    : '1.5px solid #e2e8f0',
                  boxShadow: owned
                    ? '0 4px 16px rgba(34,197,94,0.15)'
                    : canBuy
                    ? '0 4px 16px rgba(59,130,246,0.12)'
                    : 'none',
                  cursor: canBuy ? 'pointer' : 'not-allowed',
                  opacity: !owned && !canBuy ? 0.65 : 1,
                  animationDelay: `${idx * 50}ms`,
                }}
              >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: owned
                    ? 'rgba(34,197,94,0.15)'
                    : '#f1f5f9',
                  transform: owned ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {owned ? (
                  <span className="text-xl">✅</span>
                ) : (
                  <img src={AUTOCLICKER_ICON} alt="autoclicker" className="w-7 h-7 object-contain" />
                )}
              </div>
                <div className="flex-1">
                  <div className="font-black text-sm text-slate-800">{upg.label}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    ⚡ {upg.power} кликов/сек
                  </div>
                </div>
                {owned ? (
                  <span className="text-xs font-black text-green-700 px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    Куплено
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <img src={icons.coin} alt="coin" className="w-5 h-5 object-contain" />
                    <span
                      className="font-black text-base"
                      style={{ color: canBuy ? '#3b82f6' : '#94a3b8' }}
                    >
                      {formatNumber(upg.price)}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
