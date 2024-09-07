let canvas, context, tank, groundGradient;

function init() {
  canvas = document.getElementById("main-canvas");
  context = canvas.getContext("2d");

  tank = new Tank(context);

  groundGradient = context.createRadialGradient(250, 250, 50, 250, 250, 250);
  groundGradient.addColorStop(0, "#09b800");
  groundGradient.addColorStop(1, "#067300");

  // first frame
  requestAnimationFrame(update);
}

function update() {
  //context.clearRect(0, 0, 500, 500);

  // draw environment
  context.save();

  context.fillStyle = groundGradient;
  context.fillRect(0, 0, 500, 500);

  context.restore();

  // draw tank
  context.save();

  tank.update();
  tank.draw();

  context.restore();

  // TODO: cap fps to 60 for consistency for HFR devices
  requestAnimationFrame(update);
}