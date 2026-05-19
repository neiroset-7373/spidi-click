import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, DEFAULT_STATE, MUSIC_TRACKS, MusicTrack } from './types';

const STORAGE_KEY = 'spidi_clicker_v2';

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

declare global {
  interface Window {
    gameAudio?: HTMLAudioElement;
  }
}

function getOrCreateAudio(): HTMLAudioElement {
  if (!window.gameAudio) {
    window.gameAudio = new Audio();
    window.gameAudio.loop = true;
    window.gameAudio.volume = 0.3;
  }
  return window.gameAudio;
}

export function useGameState() {
  const [state, setStateRaw] = useState<GameState>(() => {
    const loaded = loadState();
    // Проверяем, прошли ли сутки с последнего подарка
    if (loaded.lastGiftTimestamp && loaded.giftCollected) {
      const now = Date.now();
      const daysPassed = Math.floor((now - loaded.lastGiftTimestamp) / (24 * 60 * 60 * 1000));
      if (daysPassed >= 1) {
        // Прошли сутки - переходим на следующий день
        const nextDay = loaded.dailyGiftDay >= 5 ? 1 : loaded.dailyGiftDay + 1;
        const updated = { ...loaded, dailyGiftDay: nextDay, giftCollected: false };
        saveState(updated);
        return updated;
      }
    }
    return loaded;
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const setState = useCallback((updater: (prev: GameState) => GameState) => {
    setStateRaw(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Music management
  useEffect(() => {
    const audio = getOrCreateAudio();
    const src = MUSIC_TRACKS[state.musicTrack as MusicTrack];
    if (audio.src !== src) {
      audio.pause();
      audio.src = src;
    }
    if (state.isMusicOn && state.completedOnboarding) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [state.isMusicOn, state.musicTrack, state.completedOnboarding]);

  // Auto-clicker tick
  useEffect(() => {
    if (state.autoClickerLevel === 0) return;
    const interval = setInterval(() => {
      setStateRaw(prev => {
        if (prev.autoClickerLevel === 0) return prev;
        const mult = prev.activeMultiplier && prev.activeMultiplier.endTime > Date.now()
          ? prev.activeMultiplier.value : 1;
        const earned = prev.autoClickerLevel * prev.autoClickerPower * mult;
        const next = { ...prev, coins: prev.coins + earned };
        saveState(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.autoClickerLevel]);

  // Multiplier expiry check
  useEffect(() => {
    if (!state.activeMultiplier) return;
    const remaining = state.activeMultiplier.endTime - Date.now();
    if (remaining <= 0) {
      setState(prev => ({ ...prev, activeMultiplier: null }));
      return;
    }
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, activeMultiplier: null }));
    }, remaining);
    return () => clearTimeout(timeout);
  }, [state.activeMultiplier, setState]);

  // Medal check
  useEffect(() => {
    if (!state.medal100k && state.totalClicks >= 100000) {
      setState(prev => ({ ...prev, medal100k: true }));
    }
  }, [state.totalClicks, state.medal100k, setState]);

  // Timer lock check (5 minutes from first click)
  useEffect(() => {
    if (!state.gameStartTime || state.isGameLocked) return;
    
    const lockDuration = 5 * 60 * 1000; // 5 minutes
    const remaining = state.gameStartTime + lockDuration - Date.now();
    
    if (remaining <= 0) {
      // Время истекло - блокируем игру
      setState(prev => ({ ...prev, isGameLocked: true }));
      return;
    }
    
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, isGameLocked: true }));
    }, remaining);
    
    return () => clearTimeout(timeout);
  }, [state.gameStartTime, state.isGameLocked, setState]);

  const handleClick = useCallback(() => {
    setStateRaw(prev => {
      // Если игра заблокирована - не даем кликать
      if (prev.isGameLocked) return prev;
      
      // Запускаем таймер при первом клике
      const newStartTime = prev.gameStartTime ?? Date.now();
      
      const mult = prev.activeMultiplier && prev.activeMultiplier.endTime > Date.now()
        ? prev.activeMultiplier.value : 1;
      const power = (prev.clickPower + prev.permanentClickBonus) * mult;
      const next = {
        ...prev,
        coins: prev.coins + power,
        totalClicks: prev.totalClicks + 1,
        gameStartTime: newStartTime,
      };
      saveState(next);
      return next;
    });
  }, []);

  const buyMultiplier = useCallback((price: number, multiplier: number) => {
    setState(prev => {
      if (prev.coins < price) return prev;
      const endTime = Date.now() + 30 * 60 * 1000;
      return {
        ...prev,
        coins: prev.coins - price,
        activeMultiplier: { value: multiplier, endTime, duration: 30 * 60 * 1000 },
      };
    });
  }, [setState]);

  const buyAutoClicker = useCallback((price: number, level: number, power: number) => {
    setState(prev => {
      if (prev.coins < price || prev.autoClickerLevel >= level) return prev;
      return {
        ...prev,
        coins: prev.coins - price,
        autoClickerLevel: level,
        autoClickerPower: power,
      };
    });
  }, [setState]);

  const collectDailyGift = useCallback(() => {
    setState(prev => {
      if (prev.giftCollected) return prev;
      const day = prev.dailyGiftDay;
      let coinsAdd = 0;
      let permanentClickBonus = prev.permanentClickBonus;
      if (day === 1) coinsAdd = 100;
      else if (day === 2) coinsAdd = 1000;
      else if (day === 3) coinsAdd = 5000;
      else if (day === 4) coinsAdd = 10000;
      else if (day === 5) permanentClickBonus += 50;
      // НЕ увеличиваем день сразу, только помечаем как собранный
      return {
        ...prev,
        coins: prev.coins + coinsAdd,
        permanentClickBonus,
        giftCollected: true,
        lastGiftTimestamp: Date.now(),
        // dailyGiftDay остается тем же - увеличится только при следующем заходе
      };
    });
  }, [setState]);

  const updateSettings = useCallback((updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, [setState]);

  const completeOnboarding = useCallback((settings: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...settings, completedOnboarding: true }));
  }, [setState]);

  const resetProgress = useCallback(() => {
    // Сброс прогресса требует переконфигурации устройства
    const fresh: GameState = { ...DEFAULT_STATE, completedOnboarding: false };
    saveState(fresh);
    setStateRaw(fresh);
  }, []);

  const getRemainingTime = useCallback((): number | null => {
    if (!state.gameStartTime || state.isGameLocked) return null;
    const lockDuration = 5 * 60 * 1000; // 5 minutes
    const remaining = state.gameStartTime + lockDuration - Date.now();
    return remaining > 0 ? remaining : 0;
  }, [state.gameStartTime, state.isGameLocked]);

  return {
    state,
    setState,
    handleClick,
    buyMultiplier,
    buyAutoClicker,
    collectDailyGift,
    updateSettings,
    completeOnboarding,
    resetProgress,
    getRemainingTime,
  };
}
