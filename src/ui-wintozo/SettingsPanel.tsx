import { useState } from 'react';
import { GameState, MusicTrack, IconPack, MUSIC_TRACKS, NAV_ICONS } from './types';

interface Props {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onReset: () => void;
}

const BACKGROUNDS_LIST = [
  { url: 'https://imgfy.ru/ib/BZbPPQFZNmv3qrd_1777051453.webp', label: 'Spidi' },
  { url: '#ffffff', label: 'Белый' },
];

export default function SettingsPanel({ state, onUpdate, onReset }: Props) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const bgIndex = BACKGROUNDS_LIST.findIndex(b => b.url === state.background);
  const currentBgIndex = bgIndex >= 0 ? bgIndex : 0;

  const prevBg = () => {
    const idx = (currentBgIndex - 1 + BACKGROUNDS_LIST.length) % BACKGROUNDS_LIST.length;
    onUpdate({ background: BACKGROUNDS_LIST[idx].url });
  };
  const nextBg = () => {
    const idx = (currentBgIndex + 1) % BACKGROUNDS_LIST.length;
    onUpdate({ background: BACKGROUNDS_LIST[idx].url });
  };

  const playPreview = (track: MusicTrack) => {
    const audio = new Audio(MUSIC_TRACKS[track]);
    audio.volume = 0.4;
    audio.play().catch(() => {});
    setTimeout(() => audio.pause(), 5000);
  };

  const trackNames: Record<MusicTrack, string> = {
    1: 'Неофициальная мелодия',
    2: 'Мелодия Spidi',
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-4">
      <div className="flex items-center justify-center gap-2 animate-slide-in-down">
        <img src={NAV_ICONS.gifts} alt="gifts" className="w-6 h-6 object-contain" />
        <h3 className="text-xl font-black text-slate-800">Настройки</h3>
      </div>

      {/* Music toggle */}
      <div
        className="p-4 rounded-2xl flex items-center gap-3 transition-all duration-300 hover-lift animate-slide-in-up"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1.5px solid #e2e8f0',
        }}
      >
        <span className="text-2xl">🔈</span>
        <div className="flex-1">
          <div className="font-black text-slate-800">Музыка</div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">Фоновая музыка в игре</div>
        </div>
        <button
          onClick={() => onUpdate({ isMusicOn: !state.isMusicOn })}
          className="relative w-14 h-7 rounded-full transition-all duration-300"
          style={{
            background: state.isMusicOn
              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
              : '#cbd5e1',
          }}
        >
          <div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300"
            style={{ left: state.isMusicOn ? '30px' : '4px' }}
          />
        </button>
      </div>

      {/* Music track */}
      <div
        className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover-lift animate-slide-in-up delay-100"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1.5px solid #e2e8f0',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <span className="font-black text-slate-800">Трек</span>
        </div>
        <div className="flex gap-2">
          {([1, 2] as MusicTrack[]).map(track => (
            <div key={track} className="flex-1 flex flex-col gap-2">
              <button
                onClick={() => onUpdate({ musicTrack: track })}
                className="w-full py-2.5 rounded-xl text-sm font-black transition-all duration-300 active:scale-95"
                style={{
                  background: state.musicTrack === track
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : '#f1f5f9',
                  color: state.musicTrack === track ? 'white' : '#64748b',
                  border: state.musicTrack === track ? 'none' : '1.5px solid #e2e8f0',
                  boxShadow: state.musicTrack === track
                    ? '0 4px 12px rgba(59,130,246,0.3)'
                    : 'none',
                }}
              >
                {trackNames[track]}
              </button>
              <button
                onClick={() => playPreview(track)}
                className="w-full py-1.5 rounded-xl text-xs font-bold text-blue-600 transition-all duration-300 active:scale-90 hover-lift"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                ▶ Слушать
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Icon pack */}
      <div
        className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover-lift animate-slide-in-up delay-200"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1.5px solid #e2e8f0',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <span className="font-black text-slate-800">Стиль иконок</span>
        </div>
        <div className="flex gap-2">
          {(['new', 'old'] as IconPack[]).map(pack => (
            <button
              key={pack}
              onClick={() => onUpdate({ iconPack: pack })}
              className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 active:scale-95"
              style={{
                background: state.iconPack === pack
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : '#f1f5f9',
                color: state.iconPack === pack ? 'white' : '#64748b',
                border: state.iconPack === pack ? 'none' : '1.5px solid #e2e8f0',
                boxShadow: state.iconPack === pack
                  ? '0 4px 12px rgba(59,130,246,0.3)'
                  : 'none',
              }}
            >
              {pack === 'new' ? 'Новые' : 'Старые'}
            </button>
          ))}
        </div>
        {state.iconPack === 'old' && (
          <div
            className="p-3 rounded-xl text-xs text-amber-700 font-bold animate-slide-in-up"
            style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
            }}
          >
            ⚠️ Эти иконки из Spidi Кликер 1.0. Возможны мелкие баги.
          </div>
        )}
      </div>

      {/* Background */}
      <div
        className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 hover-lift animate-slide-in-up delay-300"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1.5px solid #e2e8f0',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌄</span>
          <span className="font-black text-slate-800">Фон</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={prevBg}
            className="w-10 h-10 rounded-xl font-bold text-slate-600 transition-all duration-300 active:scale-90 hover-lift flex items-center justify-center"
            style={{
              background: '#f1f5f9',
              border: '1.5px solid #e2e8f0',
            }}
          >
            ◀
          </button>
          <div
            className="flex-1 h-20 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300"
            style={{
              background: BACKGROUNDS_LIST[currentBgIndex].url.startsWith('#')
                ? BACKGROUNDS_LIST[currentBgIndex].url
                : undefined,
              border: '2px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {!BACKGROUNDS_LIST[currentBgIndex].url.startsWith('#') && (
              <img
                src={BACKGROUNDS_LIST[currentBgIndex].url}
                alt="bg"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <button
            onClick={nextBg}
            className="w-10 h-10 rounded-xl font-bold text-slate-600 transition-all duration-300 active:scale-90 hover-lift flex items-center justify-center"
            style={{
              background: '#f1f5f9',
              border: '1.5px solid #e2e8f0',
            }}
          >
            ▶
          </button>
        </div>
        <div className="text-center text-sm text-slate-600 font-bold">
          {BACKGROUNDS_LIST[currentBgIndex].label}
        </div>
      </div>

      {/* Reset */}
      <div
        className="p-4 rounded-2xl transition-all duration-300 hover-lift animate-slide-in-up delay-400"
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1.5px solid #e2e8f0',
        }}
      >
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 rounded-xl text-sm font-black text-red-500 transition-all duration-300 active:scale-95 hover-lift"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1.5px solid rgba(239,68,68,0.25)',
            }}
          >
            🔄 Сбросить прогресс
          </button>
        ) : (
          <div className="flex flex-col gap-3 animate-scale-in">
            <p className="text-sm text-center font-black text-slate-700">
              ⚠️ Ты уверен? Весь прогресс будет удалён!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-slate-600 transition-all duration-300 active:scale-95 hover-lift"
                style={{
                  background: '#f1f5f9',
                  border: '1.5px solid #e2e8f0',
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-all duration-300 active:scale-95 hover-lift"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                }}
              >
                Да, сбросить
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
