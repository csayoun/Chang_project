export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 40;
    this.height = 30;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 20;
    this.speed = 5;
    this.color = '#00f0ff';
  }

  update(keys: Set<string>, canvasWidth: number) {
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
      this.x = Math.max(0, this.x - this.speed);
    }
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
      this.x = Math.min(canvasWidth - this.width, this.x + this.speed);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 우주선 그리기 (삼각형 형태)
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width / 4, this.y + this.height * 0.7);
    ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.7);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 엔진 불꽃 효과
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}


