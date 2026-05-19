export type DeviceType = 'phone' | 'tablet' | 'laptop';
export type IconPack = 'new' | 'old';
export type MusicTrack = 1 | 2;

export interface Multiplier {
  value: number;
  endTime: number; // timestamp ms
  duration: number; // ms
}

export interface GameState {
  coins: number;
  totalClicks: number;
  clickPower: number;
  autoClickerLevel: number;
  autoClickerPower: number;
  activeMultiplier: Multiplier | null;
  gameStartTime: number | null;
  isGameLocked: boolean;
  medal100k: boolean;
  dailyGiftDay: number; // 1-5
  lastGiftTimestamp: number | null;
  giftCollected: boolean; // collected today
  // Settings
  device: DeviceType;
  background: string;
  iconPack: IconPack;
  isMusicOn: boolean;
  musicTrack: MusicTrack;
  completedOnboarding: boolean;
  // Permanent bonuses
  permanentClickBonus: number;
}

export const DEFAULT_STATE: GameState = {
  coins: 0,
  totalClicks: 0,
  clickPower: 1,
  autoClickerLevel: 0,
  autoClickerPower: 1,
  activeMultiplier: null,
  gameStartTime: null,
  isGameLocked: false,
  medal100k: false,
  dailyGiftDay: 1,
  lastGiftTimestamp: null,
  giftCollected: false,
  device: 'phone',
  background: 'https://imgfy.ru/ib/BZbPPQFZNmv3qrd_1777051453.webp',
  iconPack: 'new',
  isMusicOn: true,
  musicTrack: 1,
  completedOnboarding: false,
  permanentClickBonus: 0,
};

export const MULTIPLIER_UPGRADES = [
  { price: 250, multiplier: 2 },
  { price: 450, multiplier: 3 },
  { price: 760, multiplier: 4 },
  { price: 1000, multiplier: 5 },
  { price: 10500, multiplier: 10 },
  { price: 11500, multiplier: 100 },
  { price: 13000, multiplier: 1000 },
];

export const DAILY_GIFTS = [
  { day: 1, coins: 100, bonus: null },
  { day: 2, coins: 1000, bonus: null },
  { day: 3, coins: 5000, bonus: null },
  { day: 4, coins: 10000, bonus: null },
  { day: 5, coins: 0, bonus: 'golden_spidi' },
];

export const MUSIC_TRACKS: Record<MusicTrack, string> = {
  1: 'https://cdn.jsdelivr.net/gh/neiroset-7373/music/spidi_music.mp3',
  2: 'https://cdn.jsdelivr.net/gh/neiroset-7373/music/click.mp3',
};

export const BACKGROUNDS = [
  'https://imgfy.ru/ib/BZbPPQFZNmv3qrd_1777051453.webp',
  '#ffffff',
];

export const ICON_URLS = {
  new: {
    button: 'https://imgfy.ru/ib/cFgAkQjlmXFzaGI_1776967380.webp',
    coin: 'https://imgfy.ru/ib/Vm9n8qKCjSoXfQ7_1775834388.webp',
  },
  old: {
    button: 'https://imgfy.ru/ib/OvNpN1sallskUOq_1775727715.webp',
    coin: 'https://imgfy.ru/ib/y9h8F4yOPMZmZIq_1775727687.webp',
  },
};

export const NAV_ICONS = {
  game: 'https://imgfy.ru/ib/T4OFpSB3pas5OvI_1776415599.webp',
  upgrades: 'https://imgfy.ru/ib/8oDebZgUc1j5TuA_1776415600.webp',
  gifts: 'https://imgfy.ru/ib/WqGTQErBrSV3lF8_1776970865.webp',
  settings: 'https://imgfy.ru/ib/e8UA077eHGqRZ7u_1776415599.webp',
};

export const CLICKER_POWER_ICON = 'https://imgfy.ru/ib/HJcZg8qbls7EbTV_1776351304.webp';
export const UPGRADES_ICON = 'https://imgfy.ru/ib/rc2NGfsgt97BWyb_1776351596.webp';
export const SETTINGS_ICON = 'https://imgfy.ru/ib/1dLMmuECgT7T0r9_1776351304.webp';
export const MEDAL_ICON = 'https://imgfy.ru/ib/kI4AgyRv8KaPZAo_1775835017.webp';
export const GOLDEN_SPIDI = 'https://i.ibb.co/gppjW5R/1775898076670.jpg';
export const AUTOCLICKER_ICON = 'https://imgfy.ru/ib/kTYWzhqIhMduTlz_1777054672.webp';

export const DEVICE_ICONS = {
  phone: 'https://imgfy.ru/ib/475Jq1LdI26eKyi_1776415547.webp',
  tablet: 'https://imgfy.ru/ib/sXHaQUDSGc305IG_1776415547.webp',
  laptop: 'https://imgfy.ru/ib/UsrM5vinHW04SdC_1776415548.webp',
};

export const AUTOCLIK_UPGRADES = [
  { level: 1, price: 50, power: 1, label: 'Авто-кликер I' },
  { level: 2, price: 200, power: 2, label: 'Авто-кликер II' },
  { level: 3, price: 500, power: 5, label: 'Авто-кликер III' },
  { level: 4, price: 1500, power: 10, label: 'Авто-кликер IV' },
  { level: 5, price: 5000, power: 25, label: 'Авто-кликер V' },
];
