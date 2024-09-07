let canvas, context, tank, groundGradient, cannonballs, lastFrameTimeMs;
const TARGET_FPS = 60;

function init() {
  canvas = document.getElementById("main-canvas");
  context = canvas.getContext("2d");

  tank = new Tank(context);

  groundGradient = context.createRadialGradient(250, 250, 50, 250, 250, 250);
  groundGradient.addColorStop(0, "#09b800");
  groundGradient.addColorStop(1, "#067300");

  cannonballs = [];
  lastFrameTimeMs = 0;

  // first frame
  requestAnimationFrame(update);
}

function createCannonball() {
  const rotation = tank.direction + tank.cannon.rotation;
  const cannonball = new Cannonball(context, rotation, tank.x, tank.y);
  cannonballs.push(cannonball);
}

function update(timestamp) {
  // cap frame rate at 60 for consistency for HFR devices
  if (timestamp < lastFrameTimeMs + (1000 / TARGET_FPS)) {
    requestAnimationFrame(update);
    return;
  }

  // update and draw if we got here
  lastFrameTimeMs = timestamp;

  draw();

  requestAnimationFrame(update);
}

function draw() {
  // draw environment
  //context.clearRect(0, 0, 500, 500);
  context.save();

  context.fillStyle = groundGradient;
  context.fillRect(0, 0, 500, 500);

  context.restore();

  // draw tank
  context.save();

  tank.update();
  tank.draw();

  context.restore();

  // draw any cannonballs on screen
  for (const cannonball of cannonballs) {
    if (cannonball.lifeLeft > 0) {
      cannonball.update();
      cannonball.draw();
    }
  }
}