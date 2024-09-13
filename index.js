let canvas, context, tank, groundGradient, cannonballs, lastFrameTimeMs, deltaTime, fps, framesThisSecond;
const FIXED_DELTA_TIME = 1000 / 60; // how long a fixedupdate (physics/game) cycle is
const RAD_TO_DEG = 57.2958; // convert radians to degrees
const DEG_TO_RAD = 1 / RAD_TO_DEG;
const HEIGHT = 500;
const WIDTH = 500;

function init() {
  canvas = document.getElementById("main-canvas");
  context = canvas.getContext("2d");
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  tank = new Tank(context);

  // source for gradient: https://www.w3schools.com/tags/canvas_createradialgradient.asp
  groundGradient = context.createRadialGradient(WIDTH/2, HEIGHT/2, 50, WIDTH/2, HEIGHT/2, (WIDTH+HEIGHT)/4);
  groundGradient.addColorStop(0, "#09b800");
  groundGradient.addColorStop(1, "#067300");

  cannonballs = [];
  lastFrameTimeMs = 0;
  deltaTime = 0;
  fps = 0;
  framesThisSecond = 0;

  // fps counting and reset every second
  setInterval(() => {
    fps = framesThisSecond;
    framesThisSecond = 0;
  }, 1000);

  // first frame
  requestAnimationFrame(update);
}

function update(timestamp) {
  // draw every frame, but update on a constant 60 updates/sec rate
  // source: https://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
  deltaTime += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;

  while (deltaTime >= FIXED_DELTA_TIME) {
    fixedUpdate();
    deltaTime -= FIXED_DELTA_TIME;
  }

  draw();

  requestAnimationFrame(update);
}

// separate drawing from updating (physics and game)
function fixedUpdate() {
  tank.update();
  // update all cannonballs on screen
  for (const cannonball of cannonballs) {
    if (cannonball.lifeLeft > 0) {
      cannonball.update();
    }
  }
}

function draw() {
  // draw environment
  //context.clearRect(0, 0, 500, 500);
  context.save();

  context.fillStyle = groundGradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.restore();

  // draw tank
  context.save();

  tank.update();
  tank.draw();

  context.restore();

  // draw any cannonballs on screen
  for (const cannonball of cannonballs) {
    if (cannonball.lifeLeft > 0) {
      cannonball.draw();
    }
  }

  // count frames
  context.fillText(`${fps} FPS`, 10, 10);
  framesThisSecond++;

}

// helper functions

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function createCannonball() {
  const rotation = tank.direction + tank.cannon.rotation;
  const cannonball = new Cannonball(context, rotation, tank.x, tank.y);
  cannonballs.push(cannonball);
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
  if (event.key === " ") {
    event.preventDefault();
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