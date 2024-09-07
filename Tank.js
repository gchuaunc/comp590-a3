const RAD_TO_DEG = 57.2958; // convert radians to degrees
const DEG_TO_RAD = 1 / RAD_TO_DEG;

class Tank {
  /**
   * @param {CanvasRenderingContext2D} context The canvas context to draw the Tank
   * @param {number} x The x position
   * @param {number} y The y position
   * @param {number} speed The movement speed of the Tank
   * @param {number} rotationSpeed The rotation speed of the Tank
   * @param {number} scale How large to draw the tank
   */
  constructor(context, x=250, y=250, speed=2, rotationSpeed=3, scale=3) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.direction = 0;
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
    this.scale = scale;
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
        moveX *= 1.5;
        moveY *= 1.5;
      }
      this.x += moveX;
      this.y += moveY;
    }
    if (keysPressed.back) {
      let moveX = Math.cos((this.direction + 180) * DEG_TO_RAD) * this.speed;
      let moveY = Math.sin((this.direction + 180) * DEG_TO_RAD) * this.speed;
      if (keysPressed.shift) {
        moveX *= 1.5;
        moveY *= 1.5;
      }
      this.x += moveX;
      this.y += moveY;
    }
    this.x = clamp(this.x, 0, 500);
    this.y = clamp(this.y, 0, 500);
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
    this.engine.update();
    this.engine.draw();
    
    // draw child: cannon
    this.cannon.update();
    this.cannon.draw();

    this.context.restore();
  }

  drawBody() {
    this.context.save();

    this.context.fillStyle = "#184016";
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

// helper functions

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// handling user input

let keysPressed = {
  forward: false,
  right: false,
  left: false,
  back: false,
  cannonRight: false,
  cannonLeft: false,
  shift: false
}

window.addEventListener("keydown", event => {
  //console.log(event.key + " down");
  switch (event.key) {
    case "W":
    case "w":
      keysPressed.forward = true;
      break;
    case "A":
    case "a":
      keysPressed.left = true;
      break;
    case "S":
    case "s":
      keysPressed.back = true;
      break;
    case "D":
    case "d":
      keysPressed.right = true;
      break;
    case "ArrowRight":
      keysPressed.cannonRight = true;
      break;
    case "ArrowLeft":
      keysPressed.cannonLeft = true;
      break;
    case "Shift":
      keysPressed.shift = true;
      break;
  }
});

window.addEventListener("keyup", event => {
  //console.log(event.key + " up");
  switch (event.key) {
    case "W":
    case "w":
      keysPressed.forward = false;
      break;
    case "A":
    case "a":
      keysPressed.left = false;
      break;
    case "S":
    case "s":
      keysPressed.back = false;
      break;
    case "D":
    case "d":
      keysPressed.right = false;
      break;
    case "ArrowRight":
      keysPressed.cannonRight = false;
      break;
    case "ArrowLeft":
      keysPressed.cannonLeft = false;
      break;
    case "Shift":
      keysPressed.shift = false;
      break;
  }
});