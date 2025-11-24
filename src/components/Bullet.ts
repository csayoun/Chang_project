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
    this.width = 4;
    this.height = 10;
    this.speed = isPlayerBullet ? -8 : 5;
    this.isPlayerBullet = isPlayerBullet;
    this.color = isPlayerBullet ? '#00ff00' : '#ff0000';
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
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


