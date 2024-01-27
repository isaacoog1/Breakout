var grid = document.querySelector('.grid');
var scoreDisplay = document.querySelector('.score');
var startGame = document.getElementById('start');

var blockWidth = 100;
var blockHeight = 20;
var boardWidth = 560;
var boardHeight = 300;
var ballDiameter = 20;
var xDirection = -2;
var yDirection = 2;

let score = 0;
let position = 0;
var countDownTimerId = null;

var timerId;

const userStart = [230, 15];
let currentPosition = userStart;

const ballStart = [270, 45];
let ballCurrentPosition = ballStart;

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210)
]

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        var block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.appendChild(block);
        // animateBlock(block);
    }
}

// function addBlocksRandomly() {
//     let index = 0;
//     function addBlock() {
//         if (index < blocks.length) {
//             var block = document.createElement('div');
//             block.classList.add('block');
//             block.style.left = blocks[index].bottomLeft[0] + 'px';
//             block.style.bottom = blocks[index].bottomLeft[1] + 'px';
//             grid.appendChild(block);
//             animateBlock(block);
//             index++;
//             setTimeout(addBlock, 1000);
//         }
//     }

//     addBlock();
// }

//animate the blocks
// function animateBlock(block) {
//     let bottomPosition = parseInt(block.style.bottom) || 0;

//     const moveInterval = setInterval(function () {
//         let currentBottomPosition = bottomPosition;
//         let newPosition = currentBottomPosition - 10;
//         block.style.bottom = newPosition + 'px';
//         if (currentBottomPosition == 130) {
//             clearInterval(moveInterval);
//             block.remove();
//         }
//         bottomPosition = newPosition;
//     }, 2000);
// }
// addBlocksRandomly();
addBlocks();


//Creat user pad
var user = document.createElement('div');
user.classList.add('user');
userPosition();
grid.appendChild(user);


//Create user positon
function userPosition() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

//move user 
function moveUser() {
    document.onkeydown = (event) => {
        switch(event.key) {
            case 'ArrowRight':
                if (currentPosition[0] < boardWidth - blockWidth) {
                    currentPosition[0] += 10;
                    userPosition();
                }
                break;
            case 'ArrowLeft':
                if (currentPosition[0] > 0) {
                    currentPosition[0] -= 10;
                    userPosition();
                }
                break;
        }
    }
}
moveUser();

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

//add ball
var ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.append(ball);

//move ball 
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

startGame.onclick = () => {
    timerId = setInterval(moveBall, 30);
}

//check for collisions
function checkForCollisions() {
    //check for block collisions
    for (let i = 0; i < blocks.length; i++){
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'));
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'YOU WIN!';
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    }

    //check for wall collisions
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
    ) {
        changeDirection();
    }

    //check for user collision 
    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
        ) {
            changeDirection();
    }

    //check for game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'Game Over';
        document.removeEventListener('keydown', moveUser);
    }
}

//change Direction 
function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
};