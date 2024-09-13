let canvas, context, playerTank, groundGradient, playerCannonballs, enemyCannonballs, lastFrameTimeMs, deltaTime, fps, framesThisSecond, ups, updatesThisSecond, enemies, isGameOver;
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

  playerTank = new Tank(context);

  enemies = [];
  for (let i = 0; i < 4; i++) {
    spawnEnemy();
  }

  // source for gradient: https://www.w3schools.com/tags/canvas_createradialgradient.asp
  groundGradient = context.createRadialGradient(WIDTH/2, HEIGHT/2, 50, WIDTH/2, HEIGHT/2, (WIDTH+HEIGHT)/4);
  groundGradient.addColorStop(0, "#09b800");
  groundGradient.addColorStop(1, "#067300");

  playerCannonballs = [];
  enemyCannonballs = [];
  lastFrameTimeMs = 0;
  deltaTime = 0;
  fps = 0;
  framesThisSecond = 0;
  ups = 0;
  updatesThisSecond = 0;
  isGameOver = false;

  // fps and fixedupdate counting and reset every second
  setInterval(() => {
    fps = framesThisSecond;
    framesThisSecond = 0;
    ups = updatesThisSecond;
    updatesThisSecond = 0;
  }, 1000);

  // first frame
  requestAnimationFrame(update);
}

function update(timestamp) {
  if (isGameOver) return; // do not continue the loop if the game has ended

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
  // update player
  playerTank.update();
  for (const cannonball of enemyCannonballs) {
    if (distance(playerTank.x, cannonball.x, playerTank.y, cannonball.y) < 20) {
      // player dies and game ends
      showLoseScreen();
    }
  }
  
  // update all cannonballs on screen
  for (const cannonball of playerCannonballs.concat(enemyCannonballs)) {
    if (cannonball.lifeLeft > 0) {
      cannonball.update();
    }
  }

  // update all enemies
  let enemiesLeft = 0;
  for (const enemy of enemies) {
    if (!enemy.isAlive) continue;
    enemy.update();
    // if an enemy is too close to a player's cannonball, both are destroyed
    for (const cannonball of playerCannonballs) {
      if (cannonball.lifeLeft > 0 && distance(enemy.x, cannonball.x, enemy.y, cannonball.y) < 20) {
        enemy.die();
        cannonball.lifeLeft = -1;
        break;
      }
    }
    enemiesLeft++;
  }

  // player wins condition
  if (enemiesLeft == 0) {
    showWinScreen();
  }

  updatesThisSecond++;
}

function draw() {
  if (isGameOver) return; // do not draw main scene again if game over

  // draw environment
  //context.clearRect(0, 0, 500, 500);
  context.save();

  context.fillStyle = groundGradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.restore();

  // draw tank
  context.save();

  playerTank.draw();

  context.restore();

  // draw any cannonballs on screen
  for (const cannonball of playerCannonballs.concat(enemyCannonballs)) {
    if (cannonball.lifeLeft > 0) {
      cannonball.draw();
    }
  }

  // draw all enemies
  for (const enemy of enemies) {
    if (enemy.isAlive) {
      enemy.draw();
    }
  }

  // count frames
  context.fillText(`${fps} FPS, ${ups} UPS`, 10, 10);
  framesThisSecond++;
}

function showWinScreen() {
  isGameOver = true;
  // half transparent background
  // source: https://stackoverflow.com/a/2675425
  context.fillStyle = "rgba(0, 255, 0, 0.5)";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  
  context.font = "30px Verdana";
  context.textAlign = "center";
  context.fillStyle = "black";
  context.fillText("You win!", WIDTH/2, HEIGHT/2);
  context.fillText("Click anywhere to play again.", WIDTH/2, HEIGHT/1.5);
}

function showLoseScreen() {
  isGameOver = true;
  // half transparent background
  // source: https://stackoverflow.com/a/2675425
  context.fillStyle = "rgba(255, 0, 0, 0.5)";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  
  context.font = "30px Verdana";
  context.textAlign = "center";
  context.fillStyle = "black";
  context.fillText("You lose...", WIDTH/2, HEIGHT/2);
  context.fillText("Click anywhere to play again.", WIDTH/2, HEIGHT/1.5);
}

function onClickCanvasHandler() {
  // refresh if canvas is clicked while game over
  if (isGameOver) {
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    window.location.reload();
  }
}

function spawnEnemy() {
  enemies.push(new Enemy(context, Math.random() * WIDTH, Math.random() * HEIGHT));
}

// helper functions

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function createCannonball(x=playerTank.x, y=playerTank.y, rotation=playerTank.direction + playerTank.cannon.rotation, isPlayerCannonball=true) {
  if (isPlayerCannonball) {
    const cannonball = new Cannonball(context, rotation, x, y, "green");
    playerCannonballs.push(cannonball);
  } else {
    const cannonball = new Cannonball(context, rotation, x, y, "red");
    enemyCannonballs.push(cannonball);
  }
}

function distance(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
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