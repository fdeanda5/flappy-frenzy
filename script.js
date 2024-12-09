const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart');

let bird, pipes, score, highScore, gameOver;
let snowflakes = [];
let pipeSpeed = 2.5;  
let pipeGenerationTimer = 0;
let pipeGenerationInterval = 80;  
const pipeMinDistance = 300;

canvas.width = 500;
canvas.height = 600;

const birdWidth = 50, birdHeight = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.20;   
const lift = -5;         

const pipeWidth = 50, pipeGap = 200;

const birdImage = new Image();
birdImage.src = 'https://media.tenor.com/KRUkZiw41mAAAAAj/deer-christmas.gif';  

const pipeImage = new Image();
pipeImage.src = 'https://media.istockphoto.com/id/1339161630/vector/candy-cane-stripe-pattern-seamless-christmas-print-vector-illustration.jpg?s=612x612&w=0&k=20&c=6Qe8E5Mun9E34rNTsKWMigg9JiKeUJt4Lk178wzpm1s='; 

function startGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    snowflakes = [];
    pipeSpeed = 2.5;  
    gameOverScreen.classList.add('hidden');
    generateSnowflakes();
    loop();
}

function generateSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 1.5 + 0.5  
        });
    }
}

function updateSnowflakes() {
    for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].y += snowflakes[i].speed;
        if (snowflakes[i].y > canvas.height) {
            snowflakes[i].y = 0;
            snowflakes[i].x = Math.random() * canvas.width;
        }
    }
}

function drawSnowflakes() {
    ctx.fillStyle = 'white';
    for (let i = 0; i < snowflakes.length; i++) {
        ctx.beginPath();
        ctx.arc(snowflakes[i].x, snowflakes[i].y, snowflakes[i].size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function flapBird() {
    if (birdY > 0) { 
        birdVelocity = lift;
    }
}

function moveBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY < 0) birdY = 0;
    if (birdY > canvas.height - birdHeight) birdY = canvas.height - birdHeight;
}

function generatePipe() {
    const gapPosition = Math.random() * (canvas.height - pipeGap - 50) + 50;
   
    if (pipes.length > 0 && pipes[pipes.length - 1].x > canvas.width - pipeMinDistance) {
        return; 
    }

    pipes.push({ x: canvas.width, gap: gapPosition });
}

function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;  
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

function drawPipes() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeImage, pipes[i].x, 0, pipeWidth, pipes[i].gap); 
        ctx.drawImage(pipeImage, pipes[i].x, pipes[i].gap + pipeGap, pipeWidth, canvas.height - pipes[i].gap - pipeGap); 
    }
}


function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        
        if (
            birdY < pipe.gap || 
            birdY + birdHeight > pipe.gap + pipeGap 
        ) {
            
            if (pipe.x < 50 + birdWidth && pipe.x + pipeWidth > 50) {
                gameOver = true;
            }
        }
    }
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function gameOverHandler() {
    gameOverScreen.classList.remove('hidden');
    gameOverScreen.querySelector('h1').textContent = `Game Over! Your score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

restartButton.addEventListener('click', startGame);

function increaseDifficulty() {
    if (score % 10 === 0 && score > 0) {
        pipeSpeed += 0.02; 
        if (Math.random() < 0.05) {
           
            pipeSpeed += 0.1;
        }
    }
}

function startGame() {
 
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  snowflakes = [];
  pipeSpeed = 2.5;
  gameOverScreen.classList.add('hidden');
  generateSnowflakes();
  
 
  const music = document.getElementById('background-music');
  music.play();  // Start the music
  

  music.volume = 0.1;  
  
  loop();
}


function gameOverHandler() {
  const music = document.getElementById('background-music');
  music.pause(); 

  gameOverScreen.classList.remove('hidden');
  gameOverScreen.querySelector('h1').textContent = `Game Over! Your score: ${score}`;
  if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
  }
}


function loop() {
    if (gameOver) return gameOverHandler();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateSnowflakes();
    drawSnowflakes();

    moveBird();
    movePipes();

    drawPipes();
    ctx.drawImage(birdImage, 50, birdY, birdWidth, birdHeight);

    checkCollision();
    updateScore();

    
    pipeGenerationTimer++;
    if (pipeGenerationTimer >= pipeGenerationInterval) {
        generatePipe();
        pipeGenerationTimer = 0;

        
        if (score > 0 && score % 10 === 0) {
            pipeGenerationInterval = Math.max(60, pipeGenerationInterval - 1); 
        }
    }

    increaseDifficulty();

    requestAnimationFrame(loop);
}

document.addEventListener('keydown', flapBird);
startGame();
