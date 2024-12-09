const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart');

// Game variables
let bird, pipes, score, highScore, gameOver;
let snowflakes = [];
let pipeSpeed = 2.5;  // Increased pipe speed to make game faster
let pipeGenerationTimer = 0;
let pipeGenerationInterval = 80;  // Increased pipe generation rate (faster spawn)
const pipeMinDistance = 300; // Minimum horizontal distance between pipes

// Canvas dimensions
canvas.width = 500;
canvas.height = 600;

// Bird properties (Reindeer)
const birdWidth = 50, birdHeight = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.20;   // Keeping the original gravity for smooth fall
const lift = -5;         // Keeping the original lift for a more natural flap

// Pipe properties (Candy Cane)
const pipeWidth = 50, pipeGap = 200;

// Load assets
const birdImage = new Image();
birdImage.src = 'https://media.tenor.com/KRUkZiw41mAAAAAj/deer-christmas.gif';  // Placeholder image

const pipeImage = new Image();
pipeImage.src = 'https://media.istockphoto.com/id/1339161630/vector/candy-cane-stripe-pattern-seamless-christmas-print-vector-illustration.jpg?s=612x612&w=0&k=20&c=6Qe8E5Mun9E34rNTsKWMigg9JiKeUJt4Lk178wzpm1s=';  // Placeholder image

// Initialize game state
function startGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    snowflakes = [];
    pipeSpeed = 2.5;  // Start pipe speed a bit faster
    gameOverScreen.classList.add('hidden');
    generateSnowflakes();
    
    // Play background music (if not already playing)
    const music = document.getElementById('background-music');
    music.play();  // Start the music
    
    // Optionally, set volume (0 to 1)
    music.volume = 0.1;  // Lower volume for background music
    
    loop();
}

// Snowflake Effect
function generateSnowflakes() {
    for (let i = 0; i < 100; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 1.5 + 0.5  // Increased snowflake speed for faster effect
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

// Bird movement
function flapBird() {
    if (birdY > 0) { // Prevent bird from flapping when it's off-screen
        birdVelocity = lift;
    }
}

function moveBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY < 0) birdY = 0;
    if (birdY > canvas.height - birdHeight) birdY = canvas.height - birdHeight;
}

// Pipes movement
function generatePipe() {
    const gapPosition = Math.random() * (canvas.height - pipeGap - 50) + 50; // Ensure the gap stays within the screen bounds

    // Ensure pipes are not too close to each other horizontally
    if (pipes.length > 0 && pipes[pipes.length - 1].x > canvas.width - pipeMinDistance) {
        return; // Don't generate a pipe if the previous one is too close
    }

    pipes.push({ x: canvas.width, gap: gapPosition });
}

function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;  // Move pipes faster
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

function drawPipes() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeImage, pipes[i].x, 0, pipeWidth, pipes[i].gap); // Top part
        ctx.drawImage(pipeImage, pipes[i].x, pipes[i].gap + pipeGap, pipeWidth, canvas.height - pipes[i].gap - pipeGap); // Bottom part
    }
}

// Collision detection fix
function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        // Check if bird hits the top or bottom of the pipe
        if (
            birdY < pipe.gap || // Bird is too high, collision with the top
            birdY + birdHeight > pipe.gap + pipeGap // Bird is too low, collision with the bottom
        ) {
            // Check if the bird is within the pipe's horizontal bounds
            if (pipe.x < 50 + birdWidth && pipe.x + pipeWidth > 50) {
                gameOver = true;
            }
        }
    }
}

// Score and game-over handling
function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function gameOverHandler() {
    const music = document.getElementById('background-music');
    music.pause(); // Pause the background music

    gameOverScreen.classList.remove('hidden');
    gameOverScreen.querySelector('h1').textContent = `Game Over! Your score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

restartButton.addEventListener('click', startGame);

// Difficulty increase based on score
function increaseDifficulty() {
    if (score % 10 === 0 && score > 0) {
        pipeSpeed += 0.02; // Increase pipe speed every 10 points
        if (Math.random() < 0.05) {
            // Increase the frequency of pipe generation
            pipeSpeed += 0.1;
        }
    }
}

// Main game loop
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

    // Use timer-based pipe generation to control the frequency
    pipeGenerationTimer++;
    if (pipeGenerationTimer >= pipeGenerationInterval) {
        generatePipe();
        pipeGenerationTimer = 0;

        // Gradually increase the frequency of pipe generation as the score grows
        if (score > 0 && score % 10 === 0) {
            pipeGenerationInterval = Math.max(60, pipeGenerationInterval - 1); // Min interval of 60 frames
        }
    }

    increaseDifficulty(); // Increase the difficulty as the game progresses

    requestAnimationFrame(loop);
}

// Event listeners for both keyboard (desktop) and touch (mobile) input
document.addEventListener('keydown', flapBird);

// Touch event listener for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    flapBird();
});

startGame();
