let canvas, context, tank;

function init() {
  canvas = document.getElementById("main-canvas");
  context = canvas.getContext("2d");

  tank = new Tank(context);

  // first frame
  requestAnimationFrame(update);
}

function update() {
  context.clearRect(0, 0, 500, 500);

  // draw tank
  context.save();

  tank.update();
  tank.draw();

  context.restore();

  requestAnimationFrame(update);
}