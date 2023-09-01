//board
let board;
let boardWidth = window.innerWidth * 0.6;
let boardHeight = window.innerHeight * 0.4;
let context;

//mario
let marioWidth = 88;
let marioHeight = 94;
let marioX = 50;
let marioY = boardHeight - marioHeight;
let marioImg;

let mario = {
  x: marioX,
  y: marioY,
  width: marioWidth,
  height: marioHeight,
};

//obstacle
let obstacleArray = [];

let pipeWidth = 130;
let goombaWidth = 70;
let booWidth = 70;

let obstacleHeight = 70;
let obstacleX = boardWidth;
let obstacleY = boardHeight - obstacleHeight;

let pipeImg;
let goombaImg;
let booImg;

//physics
let velocityX = -8;
let velocityY = 0;
let gravity = (boardHeight * 0.26) / 100;
let jumpStrength = (boardHeight * 0.05) * -1;

//speedup
let speedIncreaseInterval = 200;
let speedIncreaseAmount = 1;

//startgame
let gameStarted = false;

//gameover
let gameOver = false;
let score = 0;

let gameOverJump = false;
let gameOverJumpStartY;
let gameOverAnimationPlayed = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  mario.y = marioY;

  context = board.getContext("2d");
  marioImg = new Image();
  marioImg.src = "./images/mario.png";
  marioImg.onload = function () {
    context.drawImage(marioImg, mario.x, mario.y, mario.width, mario.height);
  };

  pipeImg = new Image();
  pipeImg.src = "./images/pipe.png";

  goombaImg = new Image();
  goombaImg.src = "./images/goomba.png";

  booImg = new Image();
  booImg.src = "./images/boo.png";

  document.addEventListener("keydown", movemario); // Add the game controls listener
  document.addEventListener("keydown", startGame); // Remove the space button listener

};

function startGame(e) {
  if (e.code == "Space" && !gameStarted) {
    gameStarted = true;
    document.removeEventListener("keydown", startGame);
    document.addEventListener("keydown", movemario);
    requestAnimationFrame(update); // Start the game loop
    setInterval(placeobstacle, 1000); // Start placing obstacles
  }
}

function update() {
  if (!gameStarted) {
    requestAnimationFrame(update);
    return;
  }

  if (gameOverAnimationPlayed) {
    return;
  }

  requestAnimationFrame(update);

  // Handle game over animation
  if (gameOver) {
    if (!gameOverJump) {
      velocityY = -10;
      marioImg.src = "./images/mario-lose.png";
      gameOverJump = true;
      gameOverJumpStartY = mario.y;
    }

    // Apply gravity to the jump
    velocityY += gravity;
    mario.y = Math.min(mario.y + velocityY, marioY);

    if (mario.y <= gameOverJumpStartY - marioHeight) {
      velocityY = 10;
    }

    // Stop the animation once Mario hits the ground
    if (mario.y === marioY) {
      marioImg.src = "./images/mario-lose.png";
      gameOverJump = false;
      gameOverAnimationPlayed = true;
      return;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(marioImg, mario.x, mario.y, mario.width, mario.height);
    document.addEventListener("keydown", restartGame);
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  if (score > 0 && score % speedIncreaseInterval === 0) {
    velocityX -= speedIncreaseAmount; // Increase speed by reducing velocityX
  }

  //mario
  velocityY += gravity;
  mario.y = Math.min(mario.y + velocityY, marioY); //apply gravity to current mario.y, making sure it doesn't exceed the ground

  // Check if Mario has landed
  if (mario.y === marioY) {
    marioImg.src = "./images/mario.png";
  }

  context.drawImage(marioImg, mario.x, mario.y, mario.width, mario.height);

  //obstacle
  for (let i = 0; i < obstacleArray.length; i++) {
    let obstacle = obstacleArray[i];
    obstacle.x += velocityX;
    context.drawImage(
      obstacle.img,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );

    if (detectCollision(mario, obstacle)) {
      gameOver = true;
      marioImg.src = "./images/mario-lose.png";
      marioImg.onload = function () {
        context.clearRect(0, 0, board.width, board.height);
        context.drawImage(
          marioImg,
          mario.x,
          mario.y,
          mario.width,
          mario.height
        );
      };
    }
  }

  //score
  context.fillStyle = "black";
  context.font = `${window.innerWidth * 0.02}px courier`;
  score++;
  context.fillText(score, window.innerWidth * 0.01, window.innerHeight * 0.05);
}

function restartGame(e) {
    if (e.code === "Space") {
      // Reload the page
      location.reload();
    }
  }
  
function movemario(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && mario.y == marioY) {
    velocityY = jumpStrength;
    marioImg.src = "./images/mario-jump.png";
  }
}

function placeobstacle() {
  if (gameOver) {
    return;
  }

  //place obstacle
  let obstacle = {
    img: null,
    x: obstacleX,
    y: obstacleY,
    width: null,
    height: obstacleHeight,
  };

  let placeobstacleChance = Math.random(); //0 - 0.9999...

  if (placeobstacleChance > 0.8) {
    //20% you get boo
    obstacle.img = booImg;
    obstacle.width = booWidth;
    obstacle.y = obstacleY - 100;
    obstacleArray.push(obstacle);
  } else if (placeobstacleChance > 0.7) {
    //30% you get goomba
    obstacle.img = goombaImg;
    obstacle.width = goombaWidth;
    obstacleArray.push(obstacle);
  } else if (placeobstacleChance > 0.5) {
    //50% you get pipe
    obstacle.img = pipeImg;
    obstacle.width = pipeWidth;
    obstacle.y = obstacleY + 13;
    obstacleArray.push(obstacle);
  }

  if (obstacleArray.length > 5) {
    //remove the first element from the array so that the array doesn't grow constantly
    obstacleArray.shift();
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
