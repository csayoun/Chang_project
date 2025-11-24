export class Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  isPlayerBullet: boolean;
  color: string;

  constructor(x: number, y: number, isPlayerBullet: boolean = true) {
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = 8;
    this.speed = isPlayerBullet ? -10 : 6;
    this.isPlayerBullet = isPlayerBullet;
    this.color = isPlayerBullet ? '#FFFFFF' : '#FF0000'; // 플레이어: 흰색, 적: 빨간색
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false; // 픽셀 아트 스타일
    
    ctx.fillStyle = this.color;
    
    if (this.isPlayerBullet) {
      // 플레이어 총알: 흰색 세로 막대
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // 중앙 밝은 부분
      ctx.fillStyle = '#FFFFAA';
      ctx.fillRect(this.x + 1, this.y + 2, 1, 4);
    } else {
      // 적 총알: 빨간색 세로 막대
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // 중앙 밝은 부분
      ctx.fillStyle = '#FF6666';
      ctx.fillRect(this.x + 1, this.y + 2, 1, 4);
    }
    
    ctx.imageSmoothingEnabled = true;
  }

  isOffScreen(canvasHeight: number) {
    return this.y < 0 || this.y > canvasHeight;
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
}


