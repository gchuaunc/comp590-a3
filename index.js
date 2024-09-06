let canvas, context;

function init() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");

    context.beginPath();
    context.rect(50, 50, 100, 100);
    context.fill();
}

requestAnimationFrame()