import { useState, useEffect, useCallback } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
  emoji?: string;
  type?: 'success' | 'info' | 'warning';
}

let toastCounter = 0;
let globalAddToast: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

export function showToast(msg: Omit<ToastMessage, 'id'>) {
  if (globalAddToast) globalAddToast(msg);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = ++toastCounter;
    setToasts(prev => [...prev.slice(-3), { ...msg, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  const colors = {
    success: { bg: 'rgba(34,197,94,0.95)', border: 'rgba(34,197,94,0.3)' },
    info: { bg: 'rgba(59,130,246,0.95)', border: 'rgba(59,130,246,0.3)' },
    warning: { bg: 'rgba(251,191,36,0.95)', border: 'rgba(251,191,36,0.3)' },
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none" style={{ minWidth: 240, maxWidth: 320 }}>
      {toasts.map(toast => {
        const c = colors[toast.type || 'info'];
        return (
          <div
            key={toast.id}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-bold text-sm shadow-lg"
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              backdropFilter: 'blur(12px)',
              animation: 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            {toast.emoji && <span className="text-lg">{toast.emoji}</span>}
            <span>{toast.text}</span>
          </div>
        );
      })}
      <style>{`
        @keyframes toastIn {
          from { transform: translateY(-16px) scale(0.92); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
