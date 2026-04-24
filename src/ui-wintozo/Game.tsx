import { GameState } from './types';
import PhoneLayout from './PhoneLayout';
import LaptopLayout from './LaptopLayout';

interface Props {
  state: GameState;
  onClickButton: () => void;
  onBuyMultiplier: (price: number, mult: number) => void;
  onBuyAutoClicker: (price: number, level: number, power: number) => void;
  onCollectGift: () => void;
  onUpdateSettings: (updates: Partial<GameState>) => void;
  onReset: () => void;
}

export default function Game(props: Props) {
  const { state } = props;

  // phone and tablet both use PhoneLayout
  if (state.device === 'laptop') {
    return <LaptopLayout {...props} />;
  }
  return <PhoneLayout {...props} />;
}
