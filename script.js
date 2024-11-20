const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    lift: -10,
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let pipeFrequency = 90; // lower value means pipes come more frequently
let frame = 0;
let score = 0;

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

function drawBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function generatePipes() {
    if (frame % pipeFrequency === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            bottomHeight: canvas.height - pipeHeight - pipeGap,
        });
    }
}

function drawPipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }

        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            resetGame();
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
}

function updateGame() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    generatePipes();
    drawPipes();
    drawScore();
    requestAnimationFrame(updateGame);
}

updateGame();

