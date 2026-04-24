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
    if (step === 4) return true;
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
    setTimeout(() => {
      audio.pause();
    }, 5000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 50%, #e0f2fe 100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.9)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Progress */}
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-center gap-2 mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i < step
                    ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                    : i === step - 1
                    ? 'linear-gradient(90deg, #93c5fd, #dbeafe)'
                    : '#e2e8f0',
                  transform: i < step ? 'scaleY(1.2)' : 'scaleY(1)',
                }}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center font-semibold mt-1">Шаг {step} из {totalSteps}</p>
        </div>

        {/* Content with slide animation */}
        <div className="px-6 py-5 min-h-[400px] flex flex-col" key={step}>
          <div className="animate-slide-in-right">
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

        {/* Navigation */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-2xl font-bold text-slate-600 transition-all duration-300 hover:bg-slate-200 active:scale-95"
              style={{
                background: '#f1f5f9',
                border: '1.5px solid #e2e8f0',
              }}
            >
              ← Назад
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex-1 py-3 rounded-2xl font-black text-white transition-all duration-300 active:scale-95"
            style={{
              background: canNext()
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : '#cbd5e1',
              boxShadow: canNext()
                ? '0 6px 20px rgba(59,130,246,0.4)'
                : 'none',
              cursor: canNext() ? 'pointer' : 'not-allowed',
              transform: canNext() ? 'scale(1)' : 'scale(0.98)',
            }}
          >
            {step === totalSteps ? '🚀 Начать игру!' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1({ device, setDevice }: { device: DeviceType | null; setDevice: (d: DeviceType) => void }) {
  const options: { id: DeviceType; label: string; icon: string }[] = [
    { id: 'phone', label: 'Телефон', icon: DEVICE_ICONS.phone },
    { id: 'tablet', label: 'Планшет', icon: DEVICE_ICONS.tablet },
    { id: 'laptop', label: 'Компьютер', icon: DEVICE_ICONS.laptop },
  ];
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Выбери своё устройство</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Это поможет настроить удобный интерфейс</p>
      <div className="flex gap-4 justify-center flex-1 items-center flex-wrap">
        {options.map((opt, idx) => (
          <button
            key={opt.id}
            onClick={() => setDevice(opt.id)}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover-lift w-28 animate-scale-in"
            style={{
              background: device === opt.id
                ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,197,253,0.08))'
                : '#f8fafc',
              border: device === opt.id ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              boxShadow: device === opt.id
                ? '0 8px 24px rgba(59,130,246,0.2)'
                : '0 2px 8px rgba(0,0,0,0.04)',
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <img
              src={opt.icon}
              alt={opt.label}
              className="w-16 h-16 object-contain transition-transform duration-300"
              style={{ transform: device === opt.id ? 'scale(1.1)' : 'scale(1)' }}
            />
            <span className="text-sm font-bold text-slate-700">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({ background, setBackground }: { background: string | null; setBackground: (b: string) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Выбери фон для игры</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Фон будет отображаться за игровым полем</p>
      <div className="flex gap-4 justify-center flex-1 items-center flex-wrap">
        {BACKGROUNDS_LIST.map((bg, idx) => (
          <button
            key={bg.url}
            onClick={() => setBackground(bg.url)}
            className="flex flex-col items-center gap-2 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className="w-36 h-24 rounded-2xl overflow-hidden transition-all duration-300 hover-lift"
              style={{
                border: background === bg.url ? '3px solid #3b82f6' : '3px solid #e2e8f0',
                boxShadow: background === bg.url
                  ? '0 8px 28px rgba(59,130,246,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
                background: bg.url.startsWith('#') ? bg.url : undefined,
                transform: background === bg.url ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {!bg.url.startsWith('#') && (
                <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
              )}
            </div>
            <span className="text-sm font-bold text-slate-600">{bg.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ iconPack, setIconPack }: { iconPack: IconPack | null; setIconPack: (p: IconPack) => void }) {
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Выбери стиль иконок</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Монета и кнопка клика</p>
      <div className="flex gap-4 justify-center flex-1 items-start flex-wrap">
        {(['new', 'old'] as IconPack[]).map((pack, idx) => (
          <button
            key={pack}
            onClick={() => setIconPack(pack)}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover-lift w-40 animate-scale-in"
            style={{
              background: iconPack === pack
                ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,197,253,0.08))'
                : '#f8fafc',
              border: iconPack === pack ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              boxShadow: iconPack === pack
                ? '0 8px 24px rgba(59,130,246,0.2)'
                : '0 2px 8px rgba(0,0,0,0.04)',
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <span
              className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-300"
              style={{
                background: pack === 'new' ? '#dcfce7' : '#fef3c7',
                color: pack === 'new' ? '#16a34a' : '#d97706',
              }}
            >
              {pack === 'new' ? 'NEW' : 'OLD'}
            </span>
            <img
              src={ICON_URLS[pack].coin}
              alt="coin"
              className="w-12 h-12 object-contain transition-transform duration-500"
              style={{ transform: iconPack === pack ? 'rotateY(360deg)' : 'rotateY(0deg)' }}
            />
            <img
              src={ICON_URLS[pack].button}
              alt="button"
              className="w-16 h-16 object-contain rounded-xl transition-transform duration-300"
              style={{ transform: iconPack === pack ? 'scale(1.1)' : 'scale(1)' }}
            />
            <span className="text-sm font-bold text-slate-700">
              {pack === 'new' ? 'Новые иконки' : 'Старые иконки'}
            </span>
          </button>
        ))}
      </div>
      {iconPack === 'old' && (
        <div
          className="mt-4 p-3 rounded-xl text-xs text-amber-700 font-semibold animate-slide-in-up"
          style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}
        >
          ⚠️ Внимание! Эти иконки достались нам ещё с версии Spidi Кликер 1.0. Возможны мелкие баги отображения.
        </div>
      )}
    </div>
  );
}

function Step4({
  musicTrack, setMusicTrack, isMusicOn, setIsMusicOn, onPreview
}: {
  musicTrack: MusicTrack;
  setMusicTrack: (t: MusicTrack) => void;
  isMusicOn: boolean;
  setIsMusicOn: (v: boolean) => void;
  onPreview: (t: MusicTrack) => void;
}) {
  const trackNames = {
    1: 'Неофициальная мелодия',
    2: 'Мелодия Spidi',
  };
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Выбери фоновую музыку</h2>
      <p className="text-sm text-slate-500 text-center mb-6">Музыка будет играть во время игры</p>
      <div className="flex flex-col gap-3 flex-1">
        {([1, 2] as MusicTrack[]).map((track, idx) => (
          <div
            key={track}
            className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer hover-lift animate-slide-in-up"
            style={{
              background: musicTrack === track
                ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,197,253,0.08))'
                : '#f8fafc',
              border: musicTrack === track ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              animationDelay: `${idx * 100}ms`,
            }}
            onClick={() => setMusicTrack(track)}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: musicTrack === track
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : '#e2e8f0',
              }}
            >
              <span className="text-lg">🎵</span>
            </div>
            <span className="flex-1 font-bold text-slate-700">{trackNames[track]}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                onPreview(track);
              }}
              className="px-4 py-2 rounded-xl text-xs font-black text-white transition-all duration-300 active:scale-90 hover-lift"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              ▶ Слушать
            </button>
          </div>
        ))}
        <div
          className="flex items-center justify-between p-4 rounded-2xl mt-2 animate-slide-in-up delay-200"
          style={{ background: '#f8fafc', border: '2px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔈</span>
            <span className="font-bold text-slate-700">Музыка</span>
          </div>
          <button
            onClick={() => setIsMusicOn(!isMusicOn)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: isMusicOn ? '#3b82f6' : '#cbd5e1' }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300"
              style={{ left: isMusicOn ? '30px' : '4px' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step5() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-5">
      <div
        className="w-32 h-32 rounded-full overflow-hidden shadow-2xl animate-scale-in"
        style={{
          border: '4px solid #fbbf24',
          boxShadow: '0 0 40px rgba(251,191,36,0.5)',
        }}
      >
        <img src={GOLDEN_SPIDI} alt="Golden Spidi" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-4xl font-black text-slate-800 text-center animate-slide-in-up delay-100">
        Всё готово!
      </h2>
      <p className="text-base text-slate-500 text-center font-semibold animate-slide-in-up delay-200">
        Нажми «Начать игру» и кликай по Спиди
      </p>
      <div className="flex gap-3 mt-2 animate-slide-in-up delay-300">
        <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>🎮</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>⚡</span>
        <span className="text-3xl animate-bounce" style={{ animationDelay: '400ms' }}>🏅</span>
      </div>
    </div>
  );
}
