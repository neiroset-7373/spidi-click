import { GameState, DAILY_GIFTS, GOLDEN_SPIDI, ICON_URLS } from './types';

interface Props {
  state: GameState;
  onCollect: () => void;
}

export default function GiftsPanel({ state, onCollect }: Props) {
  const icons = ICON_URLS[state.iconPack];

  return (
    <div className="flex flex-col gap-5 w-full pb-4">
      <div className="text-center animate-slide-in-down">
        <h3 className="text-xl font-black text-slate-800">🎁 Ежедневные Подарки</h3>
        <p className="text-sm text-slate-500 mt-2 font-semibold">Заходи каждый день за наградой!</p>
      </div>

      <div className="flex flex-col gap-3">
        {DAILY_GIFTS.map((gift, idx) => {
          const isToday = gift.day === state.dailyGiftDay;
          const isPast = gift.day < state.dailyGiftDay || (gift.day === state.dailyGiftDay && state.giftCollected);
          const isFuture = !isToday && !isPast;

          return (
            <div
              key={gift.day}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 animate-slide-in-up hover-lift"
              style={{
                background: isPast
                  ? 'rgba(34,197,94,0.1)'
                  : isToday
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,197,253,0.08))'
                  : 'rgba(255,255,255,0.8)',
                border: isPast
                  ? '1.5px solid rgba(34,197,94,0.4)'
                  : isToday
                  ? '2px solid #3b82f6'
                  : '1.5px solid #e2e8f0',
                boxShadow: isToday
                  ? '0 6px 24px rgba(59,130,246,0.2)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
                animationDelay: `${idx * 80}ms`,
              }}
            >
              {/* Day number */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 transition-all duration-300"
                style={{
                  background: isPast
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : isToday
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : '#f1f5f9',
                  color: isPast || isToday ? 'white' : '#94a3b8',
                  boxShadow: isPast || isToday
                    ? '0 4px 12px rgba(0,0,0,0.15)'
                    : 'none',
                  transform: isToday ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {isPast ? '✓' : gift.day}
              </div>

              {/* Reward info */}
              <div className="flex-1">
                <div className="font-black text-base text-slate-800">День {gift.day}</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {gift.bonus === 'golden_spidi'
                    ? '⭐ Золотой Спиди (+50 к силе клика)'
                    : `💰 ${gift.coins.toLocaleString()} монет`}
                </div>
              </div>

              {/* Icon */}
              <div className="flex items-center gap-1">
                {gift.bonus === 'golden_spidi' ? (
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: '2px solid #fbbf24',
                      boxShadow: '0 0 12px rgba(251,191,36,0.4)',
                      transform: isToday ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <img src={GOLDEN_SPIDI} alt="golden" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <img src={icons.coin} alt="coin" className="w-6 h-6 object-contain" />
                    <span className="text-sm font-black text-slate-600">
                      {gift.coins >= 1000 ? (gift.coins / 1000) + 'K' : gift.coins}
                    </span>
                  </div>
                )}
              </div>

              {/* Collect button */}
              {isToday && !state.giftCollected && (
                <button
                  onClick={onCollect}
                  className="ml-1 px-4 py-2 rounded-xl text-xs font-black text-white transition-all duration-300 active:scale-90 hover-lift animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                  }}
                >
                  Забрать! 🎁
                </button>
              )}
              {isToday && state.giftCollected && (
                <span className="text-xs font-black text-green-700 px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  ✅ Получено
                </span>
              )}
              {isFuture && (
                <span className="text-xl text-slate-300">🔒</span>
              )}
            </div>
          );
        })}
      </div>

      {state.giftCollected && (
        <div
          className="p-4 rounded-2xl text-center text-base font-bold text-green-700 animate-slide-in-up"
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1.5px solid rgba(34,197,94,0.3)',
          }}
        >
          🎉 Подарок дня получен! Возвращайся завтра.
        </div>
      )}
    </div>
  );
}
