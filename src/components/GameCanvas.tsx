import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store/useGameStore';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ENEMIES_PER_ROW = 10;
const ENEMY_ROWS = 4;
const ENEMY_SPACING = 60;
const ENEMY_START_Y = 50;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeyboard();
  const [player, setPlayer] = useState<Player | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [playerBullets, setPlayerBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [stars, setStars] = useState<Array<{ x: number; y: number; speed: number }>>([]);
  const lastShotTimeRef = useRef<number>(0);
  const shotCooldown = 150; // ms

  const { state, stage, score, lives, isBossActive, addScore, loseLife, nextStage, setBossActive, resetGame } = useGameStore();

  // 초기화
  useEffect(() => {
    if (state === 'playing') {
      const newPlayer = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
      setPlayer(newPlayer);
      setPlayerBullets([]);
      setEnemyBullets([]);
      lastShotTimeRef.current = 0;

      // 별 생성
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        speed: 0.5 + Math.random() * 1.5,
      }));
      setStars(newStars);

      // 적 생성
      generateEnemies();
    }
  }, [state, stage]);

  const generateEnemies = useCallback(() => {
    const newEnemies: Enemy[] = [];
    const isBossStage = stage % 5 === 0;

    if (isBossStage) {
      // 보스 등장
      const boss = new Enemy(
        CANVAS_WIDTH / 2 - 40,
        100,
        true,
        stage
      );
      newEnemies.push(boss);
      setBossActive(true);
    } else {
      // 일반 적 웨이브
      for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMIES_PER_ROW; col++) {
          const x = (CANVAS_WIDTH - (ENEMIES_PER_ROW * ENEMY_SPACING)) / 2 + col * ENEMY_SPACING;
          const y = ENEMY_START_Y + row * 40;
          const enemy = new Enemy(x, y, false, stage);
          
          // 일부 적에게 특수 패턴 부여
          if (Math.random() < 0.1) {
            enemy.startZigzag();
          }
          
          newEnemies.push(enemy);
        }
      }
      setBossActive(false);
    }

    setEnemies(newEnemies);
  }, [stage, setBossActive]);

  // 플레이어 발사
  const shootPlayerBullet = useCallback(() => {
    if (!player || state !== 'playing') return;

    const now = Date.now();
    if (now - lastShotTimeRef.current < shotCooldown) return;

    const bullet = new Bullet(
      player.x + player.width / 2 - 2,
      player.y,
      true
    );
    setPlayerBullets((prev) => [...prev, bullet]);
    lastShotTimeRef.current = now;
  }, [player, state]);

  // 스페이스바 또는 클릭으로 발사
  useEffect(() => {
    if (keys.has(' ') && state === 'playing') {
      shootPlayerBullet();
    }
  }, [keys, shootPlayerBullet, state]);

  const handleCanvasClick = useCallback(() => {
    if (state === 'playing') {
      shootPlayerBullet();
    }
  }, [state, shootPlayerBullet]);

  // 게임 루프
  useGameLoop(
    useCallback(
      (deltaTime: number) => {
        if (state !== 'playing' || !player) return;

        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // 배경 그리기
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 별 그리기
        ctx.fillStyle = '#ffffff';
        stars.forEach((star) => {
          star.y += star.speed * (deltaTime / 16);
          if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
          }
          ctx.fillRect(star.x, star.y, 2, 2);
        });

        // 플레이어 업데이트
        player.update(keys, CANVAS_WIDTH);
        player.draw(ctx);

        // 플레이어 탄환 업데이트
        setPlayerBullets((prev) => {
          return prev
            .map((bullet) => {
              bullet.update();
              return bullet;
            })
            .filter((bullet) => !bullet.isOffScreen(CANVAS_HEIGHT));
        });

        // 적 업데이트
        setEnemies((prevEnemies) => {
          const updated = prevEnemies
            .map((enemy) => {
              enemy.update(CANVAS_WIDTH, CANVAS_HEIGHT);
              
              // 적 발사
              if (enemy.shouldShoot(CANVAS_HEIGHT)) {
                const bullet = new Bullet(
                  enemy.x + enemy.width / 2 - 2,
                  enemy.y + enemy.height,
                  false
                );
                setEnemyBullets((prev) => [...prev, bullet]);
              }

              // 일부 적 돌진 시작
              if (!enemy.isBoss && Math.random() < 0.0005) {
                enemy.startDive();
              }

              return enemy;
            })
            .filter((enemy) => !enemy.isOffScreen(CANVAS_HEIGHT));

          return updated;
        });

        // 적 탄환 업데이트
        setEnemyBullets((prev) => {
          return prev
            .map((bullet) => {
              bullet.update();
              return bullet;
            })
            .filter((bullet) => !bullet.isOffScreen(CANVAS_HEIGHT));
        });

        // 충돌 검사: 플레이어 탄환 vs 적
        setPlayerBullets((prevBullets) => {
          const remainingBullets: Bullet[] = [];
          const hitEnemies = new Set<number>();

          prevBullets.forEach((bullet) => {
            let hit = false;
            enemies.forEach((enemy, index) => {
              if (!hit && bullet.collidesWith(enemy.getBounds())) {
                hit = true;
                hitEnemies.add(index);
                if (enemy.takeDamage(1)) {
                  addScore(enemy.isBoss ? 1000 : 100);
                }
              }
            });
            if (!hit) {
              remainingBullets.push(bullet);
            }
          });

          setEnemies((prevEnemies) => {
            const updated = prevEnemies.filter((_, index) => !hitEnemies.has(index));
            
            // 모든 적 제거 시 다음 스테이지
            if (updated.length === 0 && prevEnemies.length > 0 && state === 'playing') {
              setTimeout(() => {
                nextStage();
                generateEnemies();
              }, 1000);
            }
            
            return updated;
          });

          return remainingBullets;
        });

        // 충돌 검사: 적 탄환 vs 플레이어
        setEnemyBullets((prevBullets) => {
          const remainingBullets = prevBullets.filter((bullet) => {
            if (bullet.collidesWith(player.getBounds())) {
              loseLife();
              if (lives <= 1) {
                // 게임 오버는 loseLife에서 처리됨
              }
              return false;
            }
            return true;
          });
          return remainingBullets;
        });

        // 충돌 검사: 적 vs 플레이어
        const playerBounds = player.getBounds();
        const collidingEnemy = enemies.find((enemy) => {
          return enemy.collidesWith(playerBounds);
        });
        
        if (collidingEnemy) {
          loseLife();
          if (lives > 1) {
            setEnemies((prev) => prev.filter((e) => e !== collidingEnemy));
          }
        }

        // 탄환 그리기
        playerBullets.forEach((bullet) => bullet.draw(ctx));
        enemyBullets.forEach((bullet) => bullet.draw(ctx));

        // 적 그리기
        enemies.forEach((enemy) => enemy.draw(ctx));
      },
      [
        state,
        player,
        keys,
        stars,
        enemies,
        playerBullets,
        enemyBullets,
        addScore,
        loseLife,
        lives,
        nextStage,
        generateEnemies,
      ]
    ),
    state === 'playing'
  );

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleCanvasClick}
      className="border-2 border-neon-blue cursor-crosshair"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

