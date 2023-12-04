var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var score = 0;
var appleEatenTime = Date.now();
var difficulty = document.getElementById('difficulty');
var speed = 15;
var maxScore = 9;
var gameRunning = false;
var animationId = null;
var redAppleCount = 0;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

var specialApple = {
  x: 320,
  y: 320,
  visible: false,
  appearanceTime: null,
  scoreValue: 25
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  if (!gameRunning) return;
  animationId = requestAnimationFrame(loop);
  if (++count < speed) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  if (specialApple.visible) {
    context.fillStyle = 'yellow';
    context.fillRect(specialApple.x, specialApple.y, grid-1, grid-1);
  }

  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      redAppleCount++;
      if (redAppleCount >= 7) {
        specialApple.visible = true;
        specialApple.x = getRandomInt(0, 25) * grid;
        specialApple.y = getRandomInt(0, 25) * grid;
        specialApple.appearanceTime = Date.now();
        specialApple.scoreValue = 25;
        redAppleCount = 0;
      }
      var timeTaken = (Date.now() - appleEatenTime) / 1000;
      var points = timeTaken <= 5 ? maxScore : timeTaken > 15 ? 1 : Math.round((maxScore + 1) - (timeTaken - 5));
      score += points;
      document.getElementById('score').innerHTML = 'Score: ' + score;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      appleEatenTime = Date.now();
    }

    if (specialApple.visible && cell.x === specialApple.x && cell.y === specialApple.y) {
      specialApple.visible = false;
      var timeTaken = (Date.now() - specialApple.appearanceTime) / 1000;
      var points = timeTaken <= 3 ? 25 : timeTaken > 10 ? 15 : Math.round((25 + 1) - (timeTaken - 3));
      score += points;
      snake.maxCells += 2;
      document.getElementById('score').innerHTML = 'Score: ' + score;
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        document.getElementById('last_score').innerHTML = 'Ultimo punteggio: ' + score;
        score = 0;
        document.getElementById('score').innerHTML = 'Score: ' + score;
        gameRunning = false;
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      }
    }
  });

  if (specialApple.visible) {
    var elapsedSeconds = (Date.now() - specialApple.appearanceTime) / 1000;
    if (elapsedSeconds >= 3) {
      specialApple.scoreValue = Math.max(15, 25 - (elapsedSeconds - 3));
    }
    if (elapsedSeconds >= 10) {
      specialApple.visible = false;
    }
  }
}

document.getElementById('start').addEventListener('click', function() {
  gameRunning = true;
  loop();
});

document.getElementById('stop').addEventListener('click', function() {
  gameRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

difficulty.addEventListener('change', function(e) {
  speed = 15 - e.target.value;
  maxScore = parseInt(e.target.value);
});

