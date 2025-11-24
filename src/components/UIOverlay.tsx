import { useGameStore } from '../store/useGameStore';

export function UIOverlay() {
  const { score, lives, stage, isBossActive } = useGameStore();

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-start text-white font-pixel text-sm">
        <div className="flex flex-col gap-2">
          <div className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            SCORE: {score.toLocaleString()}
          </div>
          <div className="text-neon-green drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">
            STAGE: {stage}
          </div>
          {isBossActive && (
            <div className="text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] animate-pulse">
              BOSS BATTLE!
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 ${
                i < lives
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]'
                  : 'text-gray-500 opacity-30'
              }`}
            >
              ❤️
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


