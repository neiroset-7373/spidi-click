import { useState, useEffect } from 'react';
import { GameState, NAV_ICONS, ICON_URLS } from './types';
import ClickerPanel from './ClickerPanel';
import UpgradesPanel from './UpgradesPanel';
import GiftsPanel from './GiftsPanel';
import SettingsPanel from './SettingsPanel';

type SideTab = 'upgrades' | 'gifts' | 'settings';

interface Props {
  state: GameState;
  onClickButton: () => void;
  onBuyMultiplier: (price: number, mult: number) => void;
  onBuyAutoClicker: (price: number, level: number, power: number) => void;
  onCollectGift: () => void;
  onUpdateSettings: (updates: Partial<GameState>) => void;
  onReset: () => void;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export default function LaptopLayout({
  state, onClickButton, onBuyMultiplier, onBuyAutoClicker,
  onCollectGift, onUpdateSettings, onReset
}: Props) {
  const [activeTab, setActiveTab] = useState<SideTab>('upgrades');
  const [isVisible, setIsVisible] = useState(false);

  const icons = ICON_URLS[state.iconPack];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const bgStyle: React.CSSProperties = state.background.startsWith('#')
    ? { backgroundColor: state.background }
    : { backgroundImage: `url(${state.background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' };

  const sideTabs: { id: SideTab; icon: string; label: string; badge?: boolean }[] = [
    { id: 'upgrades', icon: NAV_ICONS.upgrades, label: 'Улучшения' },
    { id: 'gifts', icon: NAV_ICONS.gifts, label: 'Подарки', badge: !state.giftCollected },
    { id: 'settings', icon: NAV_ICONS.settings, label: 'Настройки' },
  ];

  return (
    <div
      className="fixed inset-0 flex overflow-hidden"
      style={{
        ...bgStyle,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* BG overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(245,248,255,0.12)' }} />

      {/* Left: clicker area */}
      <div
        className="relative flex-1 flex flex-col overflow-hidden"
        style={{
          transform: isVisible ? 'translateX(0)' : 'translateX(-60px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-3.5 flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover-lift"
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: '1.5px solid rgba(59,130,246,0.2)',
              boxShadow: '0 2px 8px rgba(59,130,246,0.08)',
            }}
          >
            <img src={icons.coin} alt="coin" className="w-6 h-6 object-contain" />
            <span className="font-black text-slate-800 text-base">{formatNumber(state.coins)}</span>
          </div>
        </div>

        {/* Clicker center */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="w-full max-w-md p-8 rounded-3xl transition-all duration-500 hover-lift"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(28px)',
              border: '1.5px solid rgba(255,255,255,0.98)',
              boxShadow: '0 12px 60px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
              transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            }}
          >
            <ClickerPanel state={state} onClickButton={onClickButton} />
          </div>
        </div>
      </div>

      {/* Right: sidebar */}
      <div
        className="relative w-96 flex flex-col overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '-6px 0 28px rgba(0,0,0,0.06)',
          transform: isVisible ? 'translateX(0)' : 'translateX(60px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
        }}
      >
        {/* Sidebar header */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">
            Меню
          </div>
          <div className="flex gap-1.5">
            {sideTabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-all duration-300 relative hover-lift"
                style={{
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,197,253,0.08))'
                    : 'transparent',
                  border: activeTab === tab.id
                    ? '1.5px solid rgba(59,130,246,0.25)'
                    : '1.5px solid transparent',
                  transform: activeTab === tab.id ? 'scale(1.02)' : 'scale(1)',
                  opacity: isVisible ? 1 : 0,
                  transition: `all 0.3s ease ${idx * 80}ms`,
                }}
              >
                <div className="relative">
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    className="w-6 h-6 object-contain transition-all duration-300"
                    style={{ filter: activeTab === tab.id ? 'none' : 'grayscale(40%) opacity(0.5)' }}
                  />
                  {tab.badge && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-white animate-pulse" />
                  )}
                </div>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: activeTab === tab.id ? '#3b82f6' : '#94a3b8' }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
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
    </div>
  );
}
