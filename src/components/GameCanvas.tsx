import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameStore } from '../store/useGameStore';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ENEMY_START_Y = 50;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useKeyboard();
  const [player, setPlayer] = useState<Player | null>(null);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [playerBullets, setPlayerBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [stars, setStars] = useState<Array<{ x: number; y: number; speed: number; color: string; size: number }>>([]);
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

      // 별 생성 (다양한 색상)
      const starColors = ['#FFFFFF', '#FFA500', '#9370DB', '#FFD700', '#87CEEB'];
      const newStars = Array.from({ length: 150 }, () => ({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        speed: 0.3 + Math.random() * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        size: Math.random() < 0.7 ? 1 : 2, // 대부분 작은 별, 일부 큰 별
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
        'boss',
        stage
      );
      newEnemies.push(boss);
      setBossActive(true);
    } else {
      // 갤러그 스타일: 5줄 배치
      // 1줄: 게 4마리
      const crabCount = 4;
      const crabSpacing = 120;
      const crabStartX = (CANVAS_WIDTH - (crabCount - 1) * crabSpacing) / 2;
      for (let i = 0; i < crabCount; i++) {
        const enemy = new Enemy(
          crabStartX + i * crabSpacing,
          ENEMY_START_Y,
          'crab',
          stage
        );
        enemy.direction = i % 2 === 0 ? 1 : -1; // 좌우 교차 이동
        newEnemies.push(enemy);
      }
      
      // 2-3줄: 나비 각 10마리
      const butterflyCount = 10;
      const butterflySpacing = 70;
      const butterflyStartX = (CANVAS_WIDTH - (butterflyCount - 1) * butterflySpacing) / 2;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < butterflyCount; col++) {
          const enemy = new Enemy(
            butterflyStartX + col * butterflySpacing,
            ENEMY_START_Y + 50 + row * 40,
            'butterfly',
            stage
          );
          enemy.direction = (row + col) % 2 === 0 ? 1 : -1;
          newEnemies.push(enemy);
        }
      }
      
      // 4-5줄: 벌 각 10마리
      const beeCount = 10;
      const beeSpacing = 70;
      const beeStartX = (CANVAS_WIDTH - (beeCount - 1) * beeSpacing) / 2;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < beeCount; col++) {
          const enemy = new Enemy(
            beeStartX + col * beeSpacing,
            ENEMY_START_Y + 130 + row * 40,
            'bee',
            stage
          );
          enemy.direction = (row + col) % 2 === 0 ? 1 : -1;
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

        // 픽셀 아트 렌더링 설정
        ctx.imageSmoothingEnabled = false;
        
        // 배경 그리기
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 별 그리기 (픽셀 아트 스타일)
        ctx.imageSmoothingEnabled = false;
        stars.forEach((star) => {
          star.y += star.speed * (deltaTime / 16);
          if (star.y > CANVAS_HEIGHT) {
            star.y = 0;
            star.x = Math.random() * CANVAS_WIDTH;
          }
          ctx.fillStyle = star.color;
          ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
        });
        ctx.imageSmoothingEnabled = true;

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
                  // 타입별 점수 (갤러그 스타일)
                  let points = 100;
                  if (enemy.isBoss) {
                    points = 1000;
                  } else if (enemy.enemyType === 'crab') {
                    points = 400; // 게는 가장 높은 점수
                  } else if (enemy.enemyType === 'butterfly') {
                    points = 200; // 나비는 중간 점수
                  } else if (enemy.enemyType === 'bee') {
                    points = 100; // 벌은 기본 점수
                  }
                  addScore(points);
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

