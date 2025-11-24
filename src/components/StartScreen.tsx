import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';

export function StartScreen() {
  const { highScore, setState } = useGameStore();

  const handleStart = () => {
    setState('playing');
  };

  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center relative overflow-hidden">
      {/* 별 배경 효과 */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-6xl md:text-8xl font-pixel text-neon-blue mb-4 drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
        >
          GALAGA
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl md:text-3xl font-pixel text-neon-pink mb-8 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]"
        >
          Re:Web
        </motion.div>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-8 text-white font-pixel"
          >
            <div className="text-neon-green text-xl mb-2">HIGH SCORE</div>
            <div className="text-4xl text-yellow-400">{highScore.toLocaleString()}</div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStart}
          className="px-12 py-4 bg-neon-blue text-space-dark font-pixel text-xl font-bold rounded-lg hover:bg-opacity-80 transition-colors shadow-[0_0_30px_rgba(0,240,255,0.6)]"
        >
          START GAME
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-white font-pixel text-sm space-y-2"
        >
          <div>← → 이동 | SPACE 발사</div>
          <div className="text-neon-green">클릭으로도 발사 가능</div>
        </motion.div>
      </motion.div>
    </div>
  );
}


