import {collisionDetection} from "/utils/utils.js";


let hole = document.getElementById("hole");
let pipe = document.getElementById("pipe");
let bird = document.getElementById("bird");
let score = document.getElementById("score");
let button = document.getElementById("button");
button.addEventListener("click", restartGame);
let gameOverScreen = document.getElementById("game-over")
let scoreValue = 0;
let round = 0;
let roundController = 0;
let jumping = 0;
let gravityStopped = false;
let gameStopped = false;

function soundHole() {
    (new Audio('/sounds/hole.wav')).play();
}
function sound() {
    (new Audio('/sounds/fly.wav')).play();
}
function soundGameOver() {
    (new Audio('/sounds/gameover.wav')).play()
}

function positionHoleRandomly() {
    hole.addEventListener("animationiteration", () => {
        const max = 57 * window.innerHeight / 100;
        const min = 97 * window.innerHeight / 100;
        const randomTop = Math.floor(Math.random() * (max-min) + min);
        hole.style.top = `-${randomTop}px`;
    })
}

function handleCollisions() {
    setInterval(() => {
        const holeCoordinates = hole.getBoundingClientRect();
        const pipeCoordinates = pipe.getBoundingClientRect();
        const birdCoordinates = bird.getBoundingClientRect();
        const collisionHole = collisionDetection(birdCoordinates, holeCoordinates, {y1: -55, y2: 58});
        const collisionPipe = collisionDetection(birdCoordinates, pipeCoordinates);

        if (collisionPipe && !collisionHole) {
            return gameOver();
        } else if (collisionHole) {
            if (round > roundController) {
                soundHole();
                scoreValue++;
                roundController++
            }
            score.innerText = `Score: ${scoreValue}`;
        }
    }, 10)
}

function resetCounter() {
    round = 1
}

function roundCounter() {
    hole.addEventListener( 'animationiteration', _ => {
        round++
    })
}

function gameOver() {
    hole.style.animationPlayState = "paused";
    pipe.style.animationPlayState = "paused";
    bird.style.animation = "paused";
    gravityStopped = true;
    gameStopped = true;
    gameOverScreen.style.display = "block";
}

function restartGame() {
    location.reload();
}

function gravity() {
   setInterval (function() {
       let birdTop = parseInt(getComputedStyle(bird).getPropertyValue('top'));
       if (birdTop + 3 < 0) {
           return gameOver();
        }
       if (birdTop + 3 > window.innerHeight) {
           return gameOver();
        }
       if (jumping === 0 && !gravityStopped && !gameStopped) {
           bird.style.top = (birdTop + 3) + 'px';
           bird.style.animation = 'rotateDown 2.2s infinite ease';
       }
   }, 15)
}

function jump() {
    sound()
    jumping = 1;
    let jumpCount = 0;
    let jumpInterval = setInterval(function() {
        let birdTop = parseInt(getComputedStyle(bird).getPropertyValue('top'));
        bird.style.top = (birdTop-5)+'px';
        bird.style.animation = 'rotateUp 0.5s';
        if (jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = 0;
            jumpCount = 0;
        }
        jumpCount++;
    }
    , 15);
}

function keyboardJump() {
    document.addEventListener("keydown", jump)
}

function initGame() {
    positionHoleRandomly();
    roundCounter();
    resetCounter();
    handleCollisions();
    gravity();
    jump();
    keyboardJump();
}

initGame();
