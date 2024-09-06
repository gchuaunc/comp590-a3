const RAD_TO_DEG = 57.2958; // convert radians to degrees
const DEG_TO_RAD = 1 / RAD_TO_DEG;

class Tank {
  constructor(context, x=250, y=250, speed=2, rotationSpeed=3, scale=3) {
    this.x = x;
    this.y = y;
    this.context = context;
    this.direction = 0;
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;
    this.scale = scale;
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
      this.x += moveX;
      this.y += moveY;
    }
    if (keysPressed.back) {
      let moveX = Math.cos((this.direction + 180) * DEG_TO_RAD) * this.speed;
      let moveY = Math.sin((this.direction + 180) * DEG_TO_RAD) * this.speed;
      this.x += moveX;
      this.y += moveY;
    }
    this.x = clamp(this.x, 0, 500);
    this.y = clamp(this.y, 0, 500);
  }

  draw() {
    //console.log("drawing tank " + this.x + ", " + this.y + " dir=" + this.direction)
    this.context.save();

    this.context.translate(this.x, this.y);
    this.context.rotate(this.direction * DEG_TO_RAD);
    this.context.scale(this.scale, this.scale);
    this.drawBody();

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
  shooterRight: false,
  shooterLeft: false
}

window.addEventListener("keydown", event => {
  //console.log(event.key + " down");
  switch (event.key) {
    case "w":
      keysPressed.forward = true;
      break;
    case "a":
      keysPressed.left = true;
      break;
    case "s":
      keysPressed.back = true;
      break;
    case "d":
      keysPressed.right = true;
      break;
    case "ArrowRight":
      keysPressed.shooterRight = true;
      break;
    case "ArrowLeft":
      keysPressed.shooterLeft = true;
      break;
  }
});

window.addEventListener("keyup", event => {
  //console.log(event.key + " up");
  switch (event.key) {
    case "w":
      keysPressed.forward = false;
      break;
    case "a":
      keysPressed.left = false;
      break;
    case "s":
      keysPressed.back = false;
      break;
    case "d":
      keysPressed.right = false;
      break;
    case "ArrowRight":
      keysPressed.shooterRight = false;
      break;
    case "ArrowLeft":
      keysPressed.shooterLeft = false;
      break;
  }
});