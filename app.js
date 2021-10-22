"use strict";
const elements = {
    rulesBtn: document.getElementById('rules-btn'),
    closeBtn: document.getElementById('close-btn'),
    rules: document.getElementById('rules'),
    canvas: document.getElementById('canvas'),
};
const ctx = elements.canvas.getContext('2d');
ctx.font = '20px Arial';
let score = 0;
class Ball {
    x;
    y;
    radius;
    speed;
    dx;
    dy;
    visible;
    constructor(x, y, radius, speed, dx, dy, visible) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = dx;
        this.dy = dy;
        this.visible = visible;
    }
    move() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        if (this.x + this.radius > elements.canvas.width ||
            this.x - this.radius < 0) {
            this.dx *= -1;
        }
        if (this.y + this.radius > elements.canvas.height ||
            this.y - this.radius < 0) {
            this.dy *= -1;
        }
        if (this.x - this.radius > bar.x &&
            this.x + this.radius < bar.x + bar.width &&
            this.y + this.radius > bar.y) {
            this.dy = -this.speed;
        }
        bricks.forEach(brick => {
            if (brick.visible) {
                if (this.x - this.radius > brick.offsetX &&
                    this.x + this.radius < brick.offsetX + brick.width &&
                    this.y + this.radius > brick.offsetY &&
                    this.y - this.radius < brick.offsetY + brick.height) {
                    this.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
        if (this.y + this.radius > elements.canvas.height) {
            score = 0;
            drawAllBricks();
        }
    }
}
class Bar {
    x;
    y;
    width;
    height;
    speed;
    dx;
    visible;
    constructor(x, y, width, height, speed, dx, visible) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = dx;
        this.visible = visible;
    }
    move(direction) {
        if (direction === 'left')
            this.x -= this.dx;
        else
            this.x += this.dx;
    }
}
class Brick {
    width;
    height;
    padding;
    offsetX;
    offsetY;
    visible;
    constructor(width, height, padding, offsetX, offsetY, visible) {
        this.width = width;
        this.height = height;
        this.padding = padding;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.visible = visible;
    }
}
const ball = new Ball(elements.canvas.width / 2, elements.canvas.height / 2, 10, 4, 4, -4, true);
const bar = new Bar(elements.canvas.width / 2 - 40, elements.canvas.height - 20, 80, 10, 8, 0, true);
const brick = new Brick(70, 20, 10, 45, 60, true);
const createBricks = (numberOfRows, numberOfColumns) => {
    const bricks = [];
    let { offsetX, offsetY } = brick;
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            bricks.push(new Brick(70, 20, 10, offsetX, offsetY, true));
            offsetX += brick.width + brick.padding;
        }
        offsetX = brick.offsetX;
        offsetY += brick.height + brick.padding;
    }
    return bricks;
};
const bricks = createBricks(5, 9);
const drawBricks = () => {
    bricks.forEach(brick => {
        ctx.beginPath();
        ctx.rect(brick.offsetX, brick.offsetY, brick.width, brick.height);
        ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
    });
};
const drawAllBricks = () => bricks.forEach(brick => (brick.visible = true));
const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
};
const drawBar = () => {
    ctx.beginPath();
    ctx.rect(bar.x, bar.y, bar.width, bar.height);
    ctx.fillStyle = bar.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
};
const drawScore = () => {
    ctx.fillText(`Score: ${score}`, elements.canvas.width - 140, 35);
};
const increaseScore = () => {
    score++;
};
const moveBar = () => {
    bar.x += bar.dx;
    if (bar.x + bar.width > elements.canvas.width) {
        bar.x = elements.canvas.width - bar.width;
    }
    if (bar.x < 0) {
        bar.x = 0;
    }
};
const drawAll = () => {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    drawBricks();
    drawBall();
    drawBar();
    drawScore();
};
const updateCanvas = () => {
    ball.move();
    moveBar();
    drawAll();
    requestAnimationFrame(updateCanvas);
};
updateCanvas();
document.addEventListener('keydown', e => {
    const key = e.keyCode;
    if (key !== 37 && key !== 39 && key !== 65 && key !== 68)
        return;
    if (key === 37 || key === 65) {
        bar.dx = -bar.speed;
    }
    else if (key === 39 || key === 68) {
        bar.dx = bar.speed;
    }
});
document.addEventListener('keyup', () => {
    bar.dx = 0;
});
elements.rulesBtn.addEventListener('click', () => elements.rules.classList.add('show'));
elements.closeBtn.addEventListener('click', () => elements.rules.classList.remove('show'));
