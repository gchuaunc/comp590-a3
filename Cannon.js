class Cannon {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the cannon
   * @param {*} rotationSpeed Speed to rotate the cannon when pressing left or right arrow keys
   * @param {*} rotation Current rotation in degrees relative to the Tank
   * @param {*} scale How large to draw the cannon
   */
  constructor(context, rotationSpeed=3, rotation=0, scale=1) {
    this.rotation = rotation;
    this.scale = scale;
    this.context = context;
    this.rotationSpeed = rotationSpeed;

    // shoot with spacebar
    window.addEventListener("keydown", event => {
      if (event.key === " ") {
        createCannonball();
      }
    });
  }

  update() {
    if (keysPressed.cannonLeft) {
      this.rotation -= this.rotationSpeed;
    }
    if (keysPressed.cannonRight) {
      this.rotation += this.rotationSpeed;
    }
  }

  draw() {
    this.context.save();

    this.context.rotate(this.rotation * DEG_TO_RAD);
    this.context.scale(this.scale, this.scale);

    this.drawCannon();

    this.context.restore();
  }

  drawCannon() {
    this.context.save();

    const gradient = context.createLinearGradient(0, 0, 10, 0);
    gradient.addColorStop(0, "#b5b5b5");
    gradient.addColorStop(1, "#e0e0e0");

    this.context.fillStyle = gradient;
    this.context.strokeStyle = "black";

    // circle

    this.context.beginPath();
    this.context.arc(1, 0, 2, 0, 2 * Math.PI);
    this.context.fill();
    this.context.stroke();

    // cannon shaft

    this.context.fillRect(1, -0.75, 7.5, 1.5);

    this.context.restore();
  }
}