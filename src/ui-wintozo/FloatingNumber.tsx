import { useState, useEffect } from 'react';

interface FloatItem {
  id: number;
  value: number;
  x: number;
  y: number;
}

let floatCounter = 0;

interface Props {
  trigger: number;
  value: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function FloatingNumbers({ trigger, value, containerRef }: Props) {
  const [items, setItems] = useState<FloatItem[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 + (Math.random() - 0.5) * 80 : 100;
    const y = rect ? rect.height / 2 + (Math.random() - 0.5) * 50 : 100;
    const id = ++floatCounter;
    setItems(prev => [...prev.slice(-5), { id, value, x, y }]);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
    }, 1200);
  }, [trigger, value, containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {items.map(item => (
        <div
          key={item.id}
          className="absolute font-black text-xl select-none"
          style={{
            left: item.x,
            top: item.y,
            color: '#3b82f6',
            textShadow: '0 2px 12px rgba(59,130,246,0.6), 0 0 8px rgba(255,255,255,0.8)',
            animation: 'floatUp 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.5))',
          }}
        >
          +{item.value}
        </div>
      ))}
    </div>
  );
}
