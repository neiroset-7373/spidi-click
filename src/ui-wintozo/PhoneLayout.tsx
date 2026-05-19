import { useState, useRef, useEffect } from 'react';
import { GameState, NAV_ICONS, ICON_URLS } from './types';
import ClickerPanel from './ClickerPanel';
import UpgradesPanel from './UpgradesPanel';
import GiftsPanel from './GiftsPanel';
import SettingsPanel from './SettingsPanel';

type Tab = 'game' | 'upgrades' | 'gifts' | 'settings';

interface Props {
  state: GameState;
  onClickButton: () => void;
  onBuyMultiplier: (price: number, mult: number) => void;
  onBuyAutoClicker: (price: number, level: number, power: number) => void;
  onCollectGift: () => void;
  onUpdateSettings: (updates: Partial<GameState>) => void;
  onReset: () => void;
  getRemainingTime?: () => number | null;
  isGameLocked?: boolean;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export default function PhoneLayout({
  state, onClickButton, onBuyMultiplier, onBuyAutoClicker,
  onCollectGift, onUpdateSettings, onReset, getRemainingTime, isGameLocked
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('game');
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const icons = ICON_URLS[state.iconPack];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!getRemainingTime || isGameLocked) {
      setTimeLeft(null);
      return;
    }
    const updateTimer = () => {
      const remaining = getRemainingTime();
      setTimeLeft(remaining);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [getRemainingTime, isGameLocked]);

  const bgStyle: React.CSSProperties = state.background.startsWith('#')
    ? { backgroundColor: state.background }
    : { backgroundImage: `url(${state.background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };

  const tabs: { id: Tab; icon: string; label: string; badge?: boolean }[] = [
    { id: 'game', icon: NAV_ICONS.game, label: 'Игра' },
    { id: 'upgrades', icon: NAV_ICONS.upgrades, label: 'Улучшения' },
    { id: 'gifts', icon: NAV_ICONS.gifts, label: 'Подарки', badge: !state.giftCollected },
    { id: 'settings', icon: NAV_ICONS.settings, label: 'Настройки' },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        ...bgStyle,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(245,248,255,0.15)' }} />

      {/* Top header bar */}
      <div
        className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(59,130,246,0.15)' }}>
          <img src={icons.coin} alt="coin" className="w-5 h-5 object-contain" />
          <span className="font-black text-slate-800 text-sm">{formatNumber(state.coins)}</span>
        </div>

        {/* Timer display */}
        {timeLeft !== null && timeLeft > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.3)' }}>
            <span className="font-bold text-red-600 text-sm">⏱️ {Math.floor(timeLeft / 60000)}:{String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative flex-1 overflow-hidden">
        {/* Game Locked Overlay */}
        {isGameLocked && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
            <div className="text-center px-8">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-4xl font-black text-red-500 mb-2">ОТКЛЮЧЕНО</h1>
              <p className="text-slate-300 text-sm">Время игры истекло</p>
            </div>
          </div>
        )}

        {/* Game tab */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 py-4 overflow-y-auto"
          style={{
            display: activeTab === 'game' ? 'flex' : 'none',
            opacity: activeTab === 'game' ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }}
        >
          <ClickerPanel state={state} onClickButton={onClickButton} />
        </div>

        {/* Full-screen side panels */}
        {activeTab !== 'game' && (
          <div
            className="absolute inset-0 z-30 flex flex-col"
            style={{
              background: 'rgba(248,250,252,0.98)',
              backdropFilter: 'blur(28px)',
              animation: 'slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0"
              style={{ borderBottom: '1px solid #f1f5f9' }}
            >
              <h2 className="text-xl font-black text-slate-800">
                {activeTab === 'upgrades' && '⚡ Улучшения'}
                {activeTab === 'gifts' && '🎁 Подарки'}
                {activeTab === 'settings' && '⚙️ Настройки'}
              </h2>
              <button
                onClick={() => setActiveTab('game')}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-500 transition-all duration-300 active:scale-90 hover-lift"
                style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0' }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div ref={panelRef} className="flex-1 overflow-y-auto px-4 py-4">
              {activeTab === 'upgrades' && (
                <UpgradesPanel state={state} onBuyMultiplier={onBuyMultiplier} onBuyAutoClicker={onBuyAutoClicker} />
              )}
              {activeTab === 'gifts' && (
                <GiftsPanel state={state} onCollect={onCollectGift} />
              )}
              {activeTab === 'settings' && (
                <SettingsPanel state={state} onUpdate={onUpdateSettings} onReset={onReset} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div
        className="relative z-40 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(28px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 4px)',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="flex">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 px-1 transition-all duration-300 active:scale-90 relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 80}ms`,
              }}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full"
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
                  }}
                />
              )}

              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative"
                style={{
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(147,197,253,0.1))'
                    : 'transparent',
                  transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className="w-5 h-5 object-contain transition-all duration-300"
                  style={{ filter: activeTab === tab.id ? 'none' : 'grayscale(40%) opacity(0.55)' }}
                />
                {/* Badge dot */}
                {tab.badge && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                )}
              </div>

              <span
                className="text-[10px] font-bold transition-all duration-300"
                style={{ color: activeTab === tab.id ? '#3b82f6' : '#94a3b8' }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
