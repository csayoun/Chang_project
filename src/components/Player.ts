export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.width = 40;
    this.height = 28;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - this.height - 30;
    this.speed = 6;
    this.color = '#FFFFFF';
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
    ctx.imageSmoothingEnabled = false; // 픽셀 아트 스타일
    
    // 갤러그 스타일 우주선 (흰색/회색)
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    // 메인 몸체 (흰색)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x + 16, this.y + 4, 8, 20);
    
    // 날개 (회색)
    ctx.fillStyle = '#C0C0C0';
    // 왼쪽 날개
    ctx.fillRect(this.x + 8, this.y + 12, 8, 4);
    ctx.fillRect(this.x + 4, this.y + 16, 4, 4);
    // 오른쪽 날개
    ctx.fillRect(this.x + 24, this.y + 12, 8, 4);
    ctx.fillRect(this.x + 32, this.y + 16, 4, 4);
    
    // 앞부분 (삼각형)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(centerX, this.y);
    ctx.lineTo(this.x + 12, this.y + 8);
    ctx.lineTo(this.x + 28, this.y + 8);
    ctx.closePath();
    ctx.fill();
    
    // 외곽선
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 16, this.y + 4, 8, 20);
    ctx.strokeRect(this.x + 8, this.y + 12, 8, 4);
    ctx.strokeRect(this.x + 24, this.y + 12, 8, 4);
    ctx.strokeRect(this.x + 4, this.y + 16, 4, 4);
    ctx.strokeRect(this.x + 32, this.y + 16, 4, 4);
    ctx.beginPath();
    ctx.moveTo(centerX, this.y);
    ctx.lineTo(this.x + 12, this.y + 8);
    ctx.lineTo(this.x + 28, this.y + 8);
    ctx.closePath();
    ctx.stroke();
    
    ctx.imageSmoothingEnabled = true;
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


