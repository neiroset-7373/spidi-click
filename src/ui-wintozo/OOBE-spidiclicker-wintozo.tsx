import { useState, useEffect } from 'react';
import { DeviceType, GameState, DEVICE_ICONS } from './types';

interface ResetOOBEProps {
  onComplete: (settings: Partial<GameState>) => void;
}

export default function ResetOOBE({ onComplete }: ResetOOBEProps) {
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const canNext = device !== null;

  const handleStart = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete({
        device: device || 'phone',
      });
    }, 300);
  };

  const options: { id: DeviceType; label: string; icon: string }[] = [
    { id: 'phone', label: 'Телефон', icon: DEVICE_ICONS.phone },
    { id: 'tablet', label: 'Планшет', icon: DEVICE_ICONS.tablet },
    { id: 'laptop', label: 'Компьютер', icon: DEVICE_ICONS.laptop },
  ];

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
        className="w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.9)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-2 text-center">
          <div className="text-3xl font-black text-slate-800 mb-2">⚙️ Сброс настроек</div>
          <p className="text-sm text-slate-500 font-medium">Выбери своё устройство заново</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 min-h-[320px] flex flex-col">
          <div className="animate-slide-in-right">
            <h3 className="text-lg font-black text-slate-800 text-center mb-6">
              Какое устройство ты используешь?
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
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
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleStart}
            disabled={!canNext}
            className="w-full py-3 rounded-2xl font-black text-white transition-all duration-300 active:scale-95"
            style={{
              background: canNext
                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                : '#cbd5e1',
              boxShadow: canNext
                ? '0 6px 20px rgba(59,130,246,0.4)'
                : 'none',
              cursor: canNext ? 'pointer' : 'not-allowed',
              transform: canNext ? 'scale(1)' : 'scale(0.98)',
            }}
          >
            ✓ Готово
          </button>
        </div>
      </div>
    </div>
  );
}
