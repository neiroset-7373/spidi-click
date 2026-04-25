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
}

function formatNumber(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export default function PhoneLayout({
  state, onClickButton, onBuyMultiplier, onBuyAutoClicker,
  onCollectGift, onUpdateSettings, onReset
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('game');
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const icons = ICON_URLS[state.iconPack];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

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
    /* Внешний контейнер для центрирования телефона на странице */
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-900 p-4">
      
      /* Рамка телефона */
      <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] border-[10px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        
        /* Notch (Челка) */
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-800 rounded-b-2xl z-50 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
            <div className="w-10 h-1 rounded-full bg-zinc-900"></div>
        </div>

        /* Контент внутри телефона (твой оригинальный код с правками) */
        <div
          className="relative flex-1 flex flex-col overflow-hidden"
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
            className="relative z-10 flex items-center justify-between px-4 pt-8 pb-2 flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(59,130,246,0.15)' }}>
              <img src={icons.coin} alt="coin" className="w-5 h-5 object-contain" />
              <span className="font-black text-slate-800 text-sm">{formatNumber(state.coins)}</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 py-4 overflow-y-auto"
              style={{
                display: activeTab === 'game' ? 'flex' : 'none',
                opacity: activeTab === 'game' ? 1 : 0,
              }}
            >
              <ClickerPanel state={state} onClickButton={onClickButton} />
            </div>

            {activeTab !== 'game' && (
              <div className="absolute inset-0 z-30 flex flex-col bg-slate-50/98 backdrop-blur-2xl animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                  <h2 className="text-xl font-black text-slate-800">
                    {activeTab === 'upgrades' && '⚡ Улучшения'}
                    {activeTab === 'gifts' && '🎁 Подарки'}
                    {activeTab === 'settings' && '⚙️ Настройки'}
                  </h2>
                  <button onClick={() => setActiveTab('game')} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold">✕</button>
                </div>
                <div ref={panelRef} className="flex-1 overflow-y-auto px-4 py-4">
                  {activeTab === 'upgrades' && <UpgradesPanel state={state} onBuyMultiplier={onBuyMultiplier} onBuyAutoClicker={onBuyAutoClicker} />}
                  {activeTab === 'gifts' && <GiftsPanel state={state} onCollect={onCollectGift} />}
                  {activeTab === 'settings' && <SettingsPanel state={state} onUpdate={onUpdateSettings} onReset={onReset} />}
                </div>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="relative z-40 bg-white/97 backdrop-blur-xl border-t border-black/5 pb-6">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-3 px-1 relative"
                >
                  {activeTab === tab.id && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500 rounded-b-full shadow-lg" />
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-blue-50' : ''}`}>
                    <img src={tab.icon} className={`w-5 h-5 object-contain ${activeTab === tab.id ? '' : 'grayscale opacity-50'}`} alt={tab.label} />
                    {tab.badge && <div className="absolute top-2 right-4 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />}
                  </div>
                  <span className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'}`}>{tab.label}</span>
                </button>
