class Engine {
  /**
   * @param {*} context Canvas context to draw the engine
   * @param {number} motorPeriod The period of the motor movement. Larger number = slower
   */
  constructor(context, motorPeriod=20, scale=1) {
    this.context = context;
    this.motorPeriod = motorPeriod;
    this.scale = scale;

    this.position = 0; // 0 --> 1 --> 0 and loop, 0 = small and 1 = large fire.
    this.velocity = 1 / motorPeriod;
  }

  update() {
    this.position += this.velocity;
    if (this.velocity > 0 && this.position > 1) {
      this.position = 1;
      this.velocity = -this.velocity;
    } else if (this.velocity < 0 && this.position < 0) {
      this.position = 0;
      this.velocity = -this.velocity;
    }
  }

  draw() {
    this.context.save();

    this.context.scale(this.scale, this.scale);

    this.context.fillStyle = "#cc5f00";
    
    this.context.beginPath();
    if (keysPressed.shift) {
      this.context.ellipse(-7, 0, 4, 2, 0, 0, 2 * Math.PI);
    } else {
      this.context.ellipse(-5, 0, 2, 1, 0, 0, 2 * Math.PI);
    }
    this.context.fill();

    this.context.beginPath();
    this.context.ellipse(-5, 0, 2 * this.position + 1, 2, 0.5 * Math.PI, 0, 2 * Math.PI);
    this.context.fill();

    this.context.restore();
  }
}