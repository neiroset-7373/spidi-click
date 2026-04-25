import { useState, useRef, useEffect } from 'react';
import { DeviceType, IconPack, MusicTrack, GameState, MUSIC_TRACKS, ICON_URLS, DEVICE_ICONS, GOLDEN_SPIDI } from './types';

interface OnboardingProps {
  onComplete: (settings: Partial<GameState>) => void;
}

const BACKGROUNDS_LIST = [
  { url: 'https://imgfy.ru/ib/BZbPPQFZNmv3qrd_1777051453.webp', label: 'Spidi Фон' },
  { url: '#ffffff', label: 'Белый' },
];

export default function OOBEspidiOS({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [background, setBackground] = useState<string | null>(null);
  const [iconPack, setIconPack] = useState<IconPack | null>(null);
  const [musicTrack, setMusicTrack] = useState<MusicTrack>(1);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const totalSteps = 5;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const canNext = () => {
    if (step === 1) return device !== null;
    if (step === 2) return background !== null;
    if (step === 3) return iconPack !== null;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else handleStart();
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleStart = () => {
    stopPreview();
    setIsVisible(false);
    setTimeout(() => {
      onComplete({
        device: device || 'phone',
        background: background || BACKGROUNDS_LIST[0].url,
        iconPack: iconPack || 'new',
        musicTrack,
        isMusicOn,
      });
    }, 300);
  };

  const stopPreview = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
  };

  const playPreview = (track: MusicTrack) => {
    stopPreview();
    const audio = new Audio(MUSIC_TRACKS[track]);
    audio.volume = 0.4;
    audio.play().catch(() => {});
    previewAudioRef.current = audio;
    setTimeout(() => audio.pause(), 5000);
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-white"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Progress Bar */}
      <div className="px-6 pt-10 pb-2 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i < step ? '#3b82f6' : '#e2e8f0',
              }}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">Шаг {step} из {totalSteps}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        <div className="animate-slide-in-right h-full">
          {step === 1 && <Step1 device={device} setDevice={setDevice} />}
          {step === 2 && <Step2 background={background} setBackground={setBackground} />}
          {step === 3 && <Step3 iconPack={iconPack} setIconPack={setIconPack} />}
          {step === 4 && (
            <Step4
              musicTrack={musicTrack}
              setMusicTrack={setMusicTrack}
              isMusicOn={isMusicOn}
              setIsMusicOn={setIsMusicOn}
              onPreview={playPreview}
            />
          )}
          {step === 5 && <Step5 />}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-10 pt-4 bg-gradient-to-t from-white via-white to-transparent shrink-0">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 active:scale-95 transition-all"
            >
              ← Назад
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex-[2] py-4 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            style={{
              background: canNext() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#cbd5e1',
              boxShadow: canNext() ? '0 8px 20px rgba(59,130,246,0.3)' : 'none',
            }}
          >
            {step === totalSteps ? '🚀 Начать!' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Компоненты шагов (улучшенная верстка) ---

function Step1({ device, setDevice }: { device: DeviceType | null; setDevice: (d: DeviceType) => void }) {
  const options: { id: DeviceType; label: string; icon: string }[] = [
    { id: 'phone', label: 'Телефон', icon: DEVICE_ICONS.phone },
    { id: 'tablet', label: 'Планшет', icon: DEVICE_ICONS.tablet },
    { id: 'laptop', label: 'Компьютер', icon: DEVICE_ICONS.laptop },
  ];
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-1">Устройство</h2>
      <p className="text-sm text-slate-500 text-center mb-8">Где ты будешь играть?</p>
      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setDevice(opt.id)}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              device === opt.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <img src={opt.icon} alt={opt.label} className="w-12 h-12 object-contain" />
            <span className="text-sm font-bold text-slate-700">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({ background, setBackground }: { background: string | null; setBackground: (b: string) => void }) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-1">Выбери фон</h2>
      <p className="text-sm text-slate-500 text-center mb
