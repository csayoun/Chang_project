import { useGameStore } from './store/useGameStore';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { UIOverlay } from './components/UIOverlay';
import { GameOverModal } from './components/GameOverModal';

function App() {
  const { state } = useGameStore();

  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center p-4">
      {state === 'menu' && <StartScreen />}
      
      {state === 'playing' && (
        <div className="relative">
          <GameCanvas />
          <UIOverlay />
        </div>
      )}

      {state === 'gameOver' && (
        <>
          <div className="relative">
            <GameCanvas />
            <UIOverlay />
          </div>
          <GameOverModal />
        </>
      )}
    </div>
  );
}

export default App;


