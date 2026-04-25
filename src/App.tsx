import { useEffect, useState } from 'react';
import { useGameState } from './ui-wintozo/useGameState';
import OOBEspidiOS from './ui-wintozo/OOBEspidiOS-qwerty';
import ResetOOBE from './ui-wintozo/OOBE-spidiclicker-wintozo';
import Game from './ui-wintozo/Game';
import { ToastContainer, showToast } from './ui-wintozo/Toast';
import PhoneLayout from './ui-wintozo/PhoneLayout'; // Импортируем обертку телефона

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
  } = useGameState();

  const [isFirstTime, setIsFirstTime] = useState(() => {
    // Проверяем наличие данных в localStorage для определения типа OOBE
    try {
      const stored = localStorage.getItem('spidi_clicker_v2');
      return !stored;
    } catch {
      return true;
    }
  });

  // Уведомление после завершения настройки
  useEffect(() => {
    if (state.completedOnboarding) {
      const timer = setTimeout(() => {
        showToast({ text: 'Добро пожаловать в Spidi Clicker!', emoji: '⚡', type: 'info' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.completedOnboarding]);

  const handleBuyMultiplier = (price: number, mult: number) => {
    if (state.coins >= price) {
      buyMultiplier(price, mult);
      showToast({ text: `Множитель x${mult} активирован на 30 мин!`, emoji: '⚡', type: 'success' });
    }
  };

  const handleCollectGift = () =>
