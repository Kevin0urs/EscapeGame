import { useGameStore } from './store/gameStore';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { CardInputScreen } from './screens/CardInputScreen';
import { MJScreen } from './screens/MJScreen';

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="app-layout">
      {screen === 'home' && <HomeScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'cardInput' && <CardInputScreen />}
      {screen === 'mj' && <MJScreen />}
    </div>
  );
}