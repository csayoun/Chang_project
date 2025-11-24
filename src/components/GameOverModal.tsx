import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

export function GameOverModal() {
  const { score, highScore, resetGame, setState } = useGameStore();

  const handleRestart = () => {
    resetGame();
  };

  const handleMenu = () => {
    setState('menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-space-dark border-4 border-neon-blue p-8 rounded-lg text-center max-w-md w-full mx-4"
      >
        <h2 className="text-4xl font-pixel text-neon-pink mb-4 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
          GAME OVER
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="text-white font-pixel">
            <div className="text-neon-blue text-xl mb-2">YOUR SCORE</div>
            <div className="text-3xl text-neon-green">{score.toLocaleString()}</div>
          </div>
          
          <div className="text-white font-pixel">
            <div className="text-neon-pink text-xl mb-2">HIGH SCORE</div>
            <div className="text-3xl text-yellow-400">{highScore.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRestart}
            className="px-6 py-3 bg-neon-blue text-space-dark font-pixel text-sm font-bold rounded hover:bg-opacity-80 transition-colors"
          >
            RESTART
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleMenu}
            className="px-6 py-3 bg-neon-pink text-white font-pixel text-sm font-bold rounded hover:bg-opacity-80 transition-colors"
          >
            MENU
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


