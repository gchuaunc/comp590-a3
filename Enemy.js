class Enemy {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the Tank
   * @param {number} x The starting x position
   * @param {number} y The starting y position
   * @param {string} color The color of the tank's body
   * @param {number} speed The movement speed of the Tank, between 0-1
   * @param {number} scale How large to draw the tank
   */
  constructor(context, x=250, y=250, color="#8f0000", speed=0.01, scale=3) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.direction = 0;
    this.speed = speed;
    this.scale = scale;
    this.color = color;
    this.cannon = new EnemyCannon(context, this);
    this.engine = new Engine(context, false);

    this.chooseNewTarget();
  }

  // choose a new random location to go to
  chooseNewTarget() {
    this.targetX = Math.random() * WIDTH;
    this.targetY = Math.random() * HEIGHT;
  }

  update() {
    // update direction and location
    const deltaX = this.targetX - this.x;
    const deltaY = this.targetY - this.y;

    this.direction = Math.atan2(deltaY, deltaX) * RAD_TO_DEG;
    this.x += deltaX * this.speed;
    this.y += deltaY * this.speed;

    this.x = clamp(this.x, 0, WIDTH);
    this.y = clamp(this.y, 0, HEIGHT);

    // if we are sufficiently close to the target, pick a new target
    if (Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) < 20) {
      this.chooseNewTarget();
    }

    // update all children
    this.engine.update();
    this.cannon.update();
  }

  draw() {
    this.context.save();

    // draw self
    this.context.translate(this.x, this.y);
    this.context.rotate(this.direction * DEG_TO_RAD);
    this.context.scale(this.scale, this.scale);
    this.drawBody();
    this.drawTreads();
    
    // draw child: engine
    this.engine.draw();
    
    // draw child: cannon
    this.cannon.draw();

    this.context.restore();
  }

  drawBody() {
    this.context.save();

    this.context.fillStyle = this.color;
    this.context.strokeStyle = "black";

    this.context.beginPath();
    this.context.moveTo(-2.5, -2.5)
    this.context.lineTo(7.5, -2.5);
    this.context.lineTo(10, 0);
    this.context.lineTo(7.5, 2.5);
    this.context.lineTo(-2.5, 2.5);
    this.context.lineTo(-2.5, -2.5);

    this.context.fill();
    this.context.stroke();

    this.context.restore();
  }

  drawTreads() {
    this.context.save();

    this.context.fillStyle = "gray";

    this.context.fillRect(-2, -4.5, 8, 2);
    this.context.fillRect(-2, 3, 8, 2);

    this.context.restore();
  }
}