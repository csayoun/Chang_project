import { useGameStore } from '../store/useGameStore';

export function UIOverlay() {
  const { score, highScore, lives, stage, isBossActive } = useGameStore();

  return (
    <div className="absolute top-0 right-0 p-4 pointer-events-none">
      <div className="flex flex-col gap-3 text-white font-pixel text-xs" style={{ fontFamily: 'Press Start 2P, monospace' }}>
        {/* HIGH SCORE */}
        <div className="text-white">
          <div className="text-[10px] leading-tight">HIGH SCORE</div>
          <div className="text-sm leading-tight">{highScore.toLocaleString().padStart(5, '0')}</div>
        </div>
        
        {/* 1UP (현재 점수) */}
        <div className="text-white">
          <div className="text-[10px] leading-tight">1UP</div>
          <div className="text-sm leading-tight">{score.toLocaleString().padStart(5, '0')}</div>
        </div>
        
        {/* STAGE */}
        <div className="text-white">
          <div className="text-[10px] leading-tight">STAGE</div>
          <div className="text-sm leading-tight">{stage.toString().padStart(2, '0')}</div>
        </div>
        
        {/* 생명 (작은 우주선 아이콘) */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-[8px] leading-tight">LIVES</div>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 ${
                  i < lives
                    ? 'opacity-100'
                    : 'opacity-20'
                }`}
                style={{
                  background: i < lives ? '#FFFFFF' : '#666666',
                  clipPath: 'polygon(50% 0%, 0% 100%, 25% 70%, 75% 70%, 100% 100%)',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* 보스 배틀 표시 */}
        {isBossActive && (
          <div className="text-yellow-400 animate-pulse mt-2">
            <div className="text-[10px]">BOSS!</div>
          </div>
        )}
      </div>
    </div>
  );
}


