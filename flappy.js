// Getting canvas & context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 256;
canvas.height = 512;

// Getting text fields
let score_text = $("#score")[0];
let best_score_text = $("#best_score")[0];

// Image
const bird = loadImage("img/bird.png");
const bg = loadImage("img/back.png");
const pipeTop = loadImage("img/pipeUp.png");
const pipeBot = loadImage("img/pipeBottom.png");
const road = loadImage("img/road.png");

// Sound
const soundFly = new Audio("audio/fly.mp3");
const soundScore = new Audio("audio/score.mp3");

// Game variables
let posX = 10;
let posY = 150;
const gravity = .2;
let velY = 0;
let pause = false;
let score = 0;
let best_score = 0;

// Vars for pipes
const gap = 125;
const pipes = [{
    x: canvas.width,
    y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
}];

// Using jquery
$(document).ready(function () {
    // Pause func
    $(".btn").click(function () {
        pause = !pause;
    });

    // Move
    $(document).keydown(function (event) {
        if (event.code == "KeyW" && !pause) {
            moveUp();
        }
    });

    // Every 20 milliseconds
    setInterval(draw, 20);
});

// Main func
function draw() {
    if (!pause) {
        // GAME

        ctx.drawImage(bg, 0, 0);
        ctx.drawImage(bird, posX, posY);

        // Checking game over
        if (posY + bird.height >= canvas.height - road.height) {
            reload();
        }

        velY += gravity;
        posY += velY;

        // Draw pipes
        pipes.forEach((pipe, i) => {
            if (pipe.x < -pipeTop.width) {
                pipes.shift();
            } else {
                ctx.drawImage(pipeTop, pipe.x, pipe.y);
                ctx.drawImage(pipeBot, pipe.x, pipe.y + gap + pipeTop.height);

                pipe.x -= 2;

                if (pipe.x == 80) {
                    pipes.push({
                        x: canvas.width,
                        y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height,
                    });
                }
            }

            // Checking game over
            if (posX + bird.width >= pipe.x &&
                posX < pipeTop.width + pipe.x &&
                (posY <= pipe.y + pipeTop.height ||
                    posY + bird.height >= pipe.y + pipeTop.height + gap)) {
                reload();
            }

            // Score
            if (pipe.x == 0) {
                score++;
                soundScore.play();
            }
        });

        // Changing scores
        score_text.textContent = `SCORE: ${score}`;
        best_score_text.textContent = `BEST SCORE: ${best_score}`;

        ctx.drawImage(road, 0, canvas.height - road.height);
    } else {
        // PAUSE

        ctx.drawImage(bg, 0, 0);
        ctx.drawImage(bird, posX, posY);

        pipes.forEach((pipe) => {
            ctx.drawImage(pipeTop, pipe.x, pipe.y);
            ctx.drawImage(pipeBot, pipe.x, pipe.y + gap + pipeTop.height);
        });

        ctx.drawImage(road, 0, canvas.height - road.height);

        ctx.fillStyle = "rgba(0, 0, 0, .3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Reloading game func
function reload() {

    // Checking best score
    if (score > best_score) {
        best_score = score;
    }

    score = 0;
    posX = 10;
    posY = 150;
    velY = 0;

    pipes.length = 0;
    pipes.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
    });
}

// Flying func
function moveUp() {
    velY = -4;
    soundFly.play();
}

// Function to load image
function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

