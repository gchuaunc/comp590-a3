class Tank {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the Tank
   * @param {number} x The starting x position
   * @param {number} y The starting y position
   * @param {string} color The color of the tank's body
   * @param {number} speed The movement speed of the Tank
   * @param {number} rotationSpeed The rotation speed of the Tank
   * @param {number} scale How large to draw the tank
   * @param {number} boostMultiplier How much faster to move the tank when boosting using Shift
   */
  constructor(context, x=250, y=250, color="#184016", speed=2, rotationSpeed=3, scale=3, boostMultiplier=2) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.direction = 0;
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
    this.scale = scale;
    this.boostMultiplier = boostMultiplier;
    this.color = color;
    this.cannon = new Cannon(context);
    this.engine = new Engine(context);
  }

  update() {
    if (keysPressed.left) {
      this.direction -= this.rotationSpeed;
    }
    if (keysPressed.right) {
      this.direction += this.rotationSpeed;
    }
    if (keysPressed.forward) {
      let moveX = Math.cos(this.direction * DEG_TO_RAD) * this.speed;
      let moveY = Math.sin(this.direction * DEG_TO_RAD) * this.speed;
      if (keysPressed.shift) {
        moveX *= this.boostMultiplier;
        moveY *= this.boostMultiplier;
      }
      this.x += moveX;
      this.y += moveY;
    }
    if (keysPressed.back) {
      let moveX = Math.cos((this.direction + 180) * DEG_TO_RAD) * this.speed;
      let moveY = Math.sin((this.direction + 180) * DEG_TO_RAD) * this.speed;
      if (keysPressed.shift) {
        moveX *= this.boostMultiplier;
        moveY *= this.boostMultiplier;
      }
      this.x += moveX;
      this.y += moveY;
    }
    this.x = clamp(this.x, 0, WIDTH);
    this.y = clamp(this.y, 0, HEIGHT);

    // update all children
    this.engine.update();
    this.cannon.update();
  }

  draw() {
    //console.log("drawing tank " + this.x + ", " + this.y + " dir=" + this.direction)
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