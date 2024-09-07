class Cannonball {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the cannonball
   * @param {number} speed Initial speed of cannonball
   * @param {number} rotation Rotation in degrees for the cannonball to shoot
   * @param {number} x The initial X position of the cannonball
   * @param {number} y The initial Y position of the cannonball
   * @param {number} life How long (frames) for the cannonball to live before being deleted
   * @param {number} scale Scale of the cannonball
   */
  constructor(context, rotation, x, y, speed=3, life=600, scale=1) {
    this.context = context;
    this.rotation = rotation;
    this.scale = scale;
    this.speed = speed;
    this.life = life;
    this.x = x;
    this.y = y;

    this.velocity = speed;
    this.lifeLeft = life;
  }

  update() {
    this.lifeLeft--;

    this.velocity = this.speed * (this.lifeLeft / this.life);

    this.x += Math.cos(this.rotation * DEG_TO_RAD) * this.velocity;
    this.y += Math.sin(this.rotation * DEG_TO_RAD) * this.velocity;

    // bounce off walls
    if (this.x <= 0 || this.x >= 500) {
      this.rotation = 180 - this.rotation;
    }
    if (this.y <= 0 || this.y >= 500) {
      this.rotation = -this.rotation;
    }
  }

  draw() {
    this.context.save();

    this.context.fillStyle = "red";
    this.context.strokeStyle = "black";

    this.context.beginPath();
    this.context.arc(this.x, this.y, 8 * this.scale, 0, 2 * Math.PI);
    this.context.fill();
    this.context.stroke();

    this.context.restore();
  }
}