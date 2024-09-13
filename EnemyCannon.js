class EnemyCannon {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the cannon
   * @param {number} rotation Current rotation in degrees relative to the Tank
   * @param {number} scale How large to draw the cannon
   * @param {Enemy} parent The parent Enemy object
   * @param {number} shootInterval How often (in ms) to shoot a cannon at the player
   */
  constructor(context, parent, shootInterval=2000, rotation=0, scale=1) {
    this.rotation = rotation;
    this.scale = scale;
    this.context = context;
    this.parent = parent;
    this.shootInterval = shootInterval + (Math.random() * 500); // add a little randomness

    // create cannonballs every so often
    this.shootInterval = setInterval(() => {
      createCannonball(parent.x, parent.y, parent.direction + this.rotation, false);
    }, this.shootInterval);
  }

  update() {
    // update rotation to always face the player, subtracting parent's direction to get back to global rotation
    this.rotation = (Math.atan2(playerTank.y - this.parent.y, playerTank.x - this.parent.x) * RAD_TO_DEG) - this.parent.direction;
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