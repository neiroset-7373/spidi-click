import { useEffect, useState } from 'react';
import { useGameState } from './ui-wintozo/useGameState';
import OOBEspidiOS from './ui-wintozo/OOBEspidiOS-qwerty';
import ResetOOBE from './ui-wintozo/OOBE-spidiclicker-wintozo';
import Game from './ui-wintozo/Game';
import { ToastContainer, showToast } from './ui-wintozo/Toast';

export default function App() {
  const {
    state,
    handleClick,
    buyMultiplier,
    buyAutoClicker,
    collectDailyGift,
    updateSettings,
    completeOnboarding,
    resetProgress,
    getRemainingTime,
  } = useGameState();

  const [isFirstTime, setIsFirstTime] = useState(() => {
    // Проверяем, первый ли это запуск (полная OOBE) или сброс настроек
    try {
      const stored = localStorage.getItem('spidi_clicker_v2');
      return !stored; // Первый раз, если нет сохраненных данных
    } catch {
      return true;
    }
  });

  // Show welcome toast after onboarding
  useEffect(() => {
    if (state.completedOnboarding) {
      const timer = setTimeout(() => {
        showToast({ text: 'Добро пожаловать в Spidi Clicker!', emoji: '⚡', type: 'info' });
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.completedOnboarding]);

  const handleBuyMultiplier = (price: number, mult: number) => {
    if (state.coins >= price) {
      buyMultiplier(price, mult);
      showToast({ text: `Множитель x${mult} активирован на 30 мин!`, emoji: '⚡', type: 'success' });
    }
  };

  const handleCollectGift = () => {
    if (!state.giftCollected) {
      collectDailyGift();
      const day = state.dailyGiftDay;
      if (day === 5) {
        showToast({ text: 'Получен Золотой Спиди! +50 к силе клика!', emoji: '⭐', type: 'warning' });
      } else {
        const amounts = [100, 1000, 5000, 10000];
        showToast({ text: `+${amounts[day - 1]?.toLocaleString() ?? '?'} монет!`, emoji: '🎁', type: 'success' });
      }
    }
  };

  const handleReset = () => {
    setIsFirstTime(false); // После сброса используем ResetOOBE
    resetProgress();
  };

  if (!state.completedOnboarding) {
    return (
      <>
        <ToastContainer />
        {isFirstTime ? (
          <OOBEspidiOS
            onComplete={(settings) => {
              completeOnboarding(settings);
              setIsFirstTime(false);
            }}
          />
        ) : (
          <ResetOOBE onComplete={completeOnboarding} />
        )}
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Game
        state={state}
        onClickButton={handleClick}
        onBuyMultiplier={handleBuyMultiplier}
        onBuyAutoClicker={buyAutoClicker}
        onCollectGift={handleCollectGift}
        onUpdateSettings={updateSettings}
        onReset={handleReset}
        getRemainingTime={getRemainingTime}
        isGameLocked={state.isGameLocked}
      />
    </>
  );
}
