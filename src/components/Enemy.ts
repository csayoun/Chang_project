export type EnemyType = 'crab' | 'butterfly' | 'bee' | 'boss';

export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  isBoss: boolean;
  enemyType: EnemyType;
  movePattern: 'normal' | 'dive' | 'zigzag';
  diveStartY: number;
  direction: number; // -1 or 1 for zigzag
  animationFrame: number;

  constructor(
    x: number,
    y: number,
    enemyType: EnemyType = 'butterfly',
    stage: number = 1
  ) {
    this.x = x;
    this.y = y;
    this.enemyType = enemyType;
    this.isBoss = enemyType === 'boss';
    
    // 타입별 크기 설정
    if (this.isBoss) {
      this.width = 80;
      this.height = 60;
    } else if (enemyType === 'crab') {
      this.width = 32;
      this.height = 24;
    } else if (enemyType === 'butterfly') {
      this.width = 28;
      this.height = 24;
    } else { // bee
      this.width = 30;
      this.height = 24;
    }
    
    this.speed = this.isBoss ? 1 + stage * 0.2 : 1 + stage * 0.1;
    this.maxHealth = this.isBoss ? 50 + stage * 10 : 1;
    this.health = this.maxHealth;
    this.movePattern = 'normal';
    this.diveStartY = y;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.animationFrame = 0;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.animationFrame++;
    
    if (this.isBoss) {
      // 보스는 좌우로 움직임
      this.x += this.speed * this.direction;
      if (this.x <= 0 || this.x + this.width >= canvasWidth) {
        this.direction *= -1;
      }
    } else {
      switch (this.movePattern) {
        case 'normal':
          // 갤러그 스타일: 좌우로 움직이면서 아래로 내려옴
          this.x += this.speed * 0.3 * this.direction;
          if (this.x <= 0 || this.x + this.width >= canvasWidth) {
            this.direction *= -1;
            this.y += 20; // 아래로 한 줄 내려옴
          }
          break;
        case 'dive':
          this.y += this.speed * 2;
          this.x += Math.sin(this.y * 0.1) * 2;
          break;
        case 'zigzag':
          this.y += this.speed * 0.5;
          this.x += this.speed * this.direction;
          if (this.x <= 0 || this.x + this.width >= canvasWidth) {
            this.direction *= -1;
          }
          break;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false; // 픽셀 아트 스타일
    
    if (this.isBoss) {
      // 보스 그리기
      ctx.fillStyle = '#ff00ff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      // 메인 몸체
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // 보스 HP 바
      const barWidth = this.width;
      const barHeight = 4;
      const healthPercent = this.health / this.maxHealth;

      ctx.fillStyle = '#ff0000';
      ctx.fillRect(this.x, this.y - 10, barWidth, barHeight);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(this.x, this.y - 10, barWidth * healthPercent, barHeight);
    } else {
      // 픽셀 아트 스타일로 적 그리기
      const wingFrame = Math.floor(this.animationFrame / 10) % 2; // 날개 애니메이션
      
      if (this.enemyType === 'crab') {
        // 게 모양 적 (연두색/노란색)
        ctx.fillStyle = '#90EE90'; // 연두색
        ctx.fillRect(this.x + 4, this.y + 8, 24, 8);
        
        ctx.fillStyle = '#FFFF00'; // 노란색
        ctx.fillRect(this.x + 8, this.y + 4, 16, 16);
        
        // 다리
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(this.x, this.y + 12, 4, 8);
        ctx.fillRect(this.x + 28, this.y + 12, 4, 8);
        ctx.fillRect(this.x + 2, this.y + 18, 6, 4);
        ctx.fillRect(this.x + 24, this.y + 18, 6, 4);
        
        // 눈
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y + 6, 2, 2);
        ctx.fillRect(this.x + 20, this.y + 6, 2, 2);
        
      } else if (this.enemyType === 'butterfly') {
        // 나비 모양 적 (주황색/흰색)
        const wingOffset = wingFrame * 2;
        
        // 몸체
        ctx.fillStyle = '#FFA500'; // 주황색
        ctx.fillRect(this.x + 12, this.y + 4, 4, 16);
        
        // 날개 (위)
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.x + 2, this.y + 2, 10, 8);
        ctx.fillRect(this.x + 16, this.y + 2, 10, 8);
        
        ctx.fillStyle = '#FFFFFF'; // 흰색
        ctx.fillRect(this.x + 4, this.y + 4, 6, 4);
        ctx.fillRect(this.x + 18, this.y + 4, 6, 4);
        
        // 날개 (아래)
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(this.x + 4, this.y + 12, 8, 8);
        ctx.fillRect(this.x + 16, this.y + 12, 8, 8);
        
        // 눈
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y + 6, 2, 2);
        ctx.fillRect(this.x + 16, this.y + 6, 2, 2);
        
      } else if (this.enemyType === 'bee') {
        // 벌 모양 적 (파란색/노란색)
        const wingOffset = wingFrame * 2;
        
        // 몸체 (노란색)
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(this.x + 8, this.y + 6, 14, 12);
        
        // 줄무늬 (파란색)
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.x + 10, this.y + 6, 2, 12);
        ctx.fillRect(this.x + 16, this.y + 6, 2, 12);
        ctx.fillRect(this.x + 22, this.y + 6, 2, 12);
        
        // 날개
        ctx.fillStyle = '#87CEEB'; // 하늘색
        ctx.fillRect(this.x + 2, this.y + 4, 8, 6);
        ctx.fillRect(this.x + 20, this.y + 4, 8, 6);
        ctx.fillRect(this.x + 4, this.y + 14, 6, 6);
        ctx.fillRect(this.x + 20, this.y + 14, 6, 6);
        
        // 눈
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 12, this.y + 8, 2, 2);
        ctx.fillRect(this.x + 18, this.y + 8, 2, 2);
      }
      
      // 외곽선
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    ctx.imageSmoothingEnabled = true;
  }

  takeDamage(damage: number) {
    this.health -= damage;
    return this.health <= 0;
  }

  isOffScreen(canvasHeight: number) {
    return this.y > canvasHeight;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  collidesWith(other: { x: number; y: number; width: number; height: number }) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  shouldShoot(canvasHeight: number): boolean {
    if (this.isBoss) {
      return Math.random() < 0.02;
    }
    return this.y > 50 && Math.random() < 0.001;
  }

  startDive() {
    if (!this.isBoss) {
      this.movePattern = 'dive';
    }
  }

  startZigzag() {
    if (!this.isBoss) {
      this.movePattern = 'zigzag';
    }
  }
}

