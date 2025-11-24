export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  health: number;
  maxHealth: number;
  isBoss: boolean;
  movePattern: 'normal' | 'dive' | 'zigzag';
  diveStartY: number;
  direction: number; // -1 or 1 for zigzag

  constructor(
    x: number,
    y: number,
    isBoss: boolean = false,
    stage: number = 1
  ) {
    this.x = x;
    this.y = y;
    this.isBoss = isBoss;
    this.width = isBoss ? 80 : 30;
    this.height = isBoss ? 60 : 25;
    this.speed = isBoss ? 1 + stage * 0.2 : 1 + stage * 0.1;
    this.color = isBoss ? '#ff00ff' : '#ff6600';
    this.maxHealth = isBoss ? 50 + stage * 10 : 1;
    this.health = this.maxHealth;
    this.movePattern = 'normal';
    this.diveStartY = y;
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (this.isBoss) {
      // 보스는 좌우로 움직임
      this.x += this.speed * this.direction;
      if (this.x <= 0 || this.x + this.width >= canvasWidth) {
        this.direction *= -1;
      }
    } else {
      switch (this.movePattern) {
        case 'normal':
          this.y += this.speed * 0.3;
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
    if (this.isBoss) {
      // 보스 그리기
      ctx.fillStyle = this.color;
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
      // 일반 적 그리기 (벌레 형태)
      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;

      // 타원형 몸체
      ctx.beginPath();
      ctx.ellipse(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width / 2,
        this.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      // 눈
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.4, 3, 0, Math.PI * 2);
      ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
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

