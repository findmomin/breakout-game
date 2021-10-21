// dom elements
var elements = {
    rulesBtn: document.getElementById('rules-btn'),
    closeBtn: document.getElementById('close-btn'),
    rules: document.getElementById('rules'),
    canvas: document.getElementById('canvas')
};
// global variables
var ctx = elements.canvas.getContext('2d');
ctx.font = '20px Arial';
// score
var score = 0;
var Ball = /** @class */ (function () {
    function Ball(x, y, radius, speed, dx, dy, visible) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.dx = dx;
        this.dy = dy;
        this.visible = visible;
        //
    }
    Ball.prototype.move = function () {
        var _this = this;
        ball.x += ball.dx;
        ball.y += ball.dy;
        // Wall collision (right/left)
        if (this.x + this.radius > elements.canvas.width ||
            this.x - this.radius < 0) {
            this.dx *= -1; // this.dx = this.dx * -1
        }
        // Wall collision (top/bottom)
        if (this.y + this.radius > elements.canvas.height ||
            this.y - this.radius < 0) {
            this.dy *= -1;
        }
        // Paddle collision
        if (this.x - this.radius > bar.x &&
            this.x + this.radius < bar.x + bar.width &&
            this.y + this.radius > bar.y) {
            this.dy = -this.speed;
        }
        // Brick collision
        bricks.forEach(function (brick) {
            if (brick.visible) {
                if (_this.x - _this.radius > brick.offsetX && // left brick side check
                    _this.x + _this.radius < brick.offsetX + brick.width && // right brick side check
                    _this.y + _this.radius > brick.offsetY && // top brick side check
                    _this.y - _this.radius < brick.offsetY + brick.height // bottom brick side check
                ) {
                    _this.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
        // Hit bottom wall - Lose
        if (this.y + this.radius > elements.canvas.height) {
            score = 0;
            drawAllBricks();
        }
    };
    return Ball;
}());
var Bar = /** @class */ (function () {
    function Bar(x, y, width, height, speed, dx, visible) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = dx;
        this.visible = visible;
        //
    }
    Bar.prototype.move = function (direction) {
        if (direction === 'left')
            this.x -= this.dx;
        else
            this.x += this.dx;
    };
    return Bar;
}());
var Brick = /** @class */ (function () {
    function Brick(width, height, padding, offsetX, offsetY, visible) {
        this.width = width;
        this.height = height;
        this.padding = padding;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.visible = visible;
        //
    }
    return Brick;
}());
// Instanciating all the classes
// the ball
var ball = new Ball(elements.canvas.width / 2, elements.canvas.height / 2, 10, 4, 4, -4, true);
// the bar
var bar = new Bar(elements.canvas.width / 2 - 40, elements.canvas.height - 20, 80, 10, 8, 0, true);
// a single brick
var brick = new Brick(70, 20, 10, 45, 60, true);
// creating the bricks block
var createBricks = function (numberOfRows, numberOfColumns) {
    var bricks = [];
    var offsetX = brick.offsetX, offsetY = brick.offsetY;
    for (var i = 0; i < numberOfRows; i++) {
        for (var j = 0; j < numberOfColumns; j++) {
            bricks.push(new Brick(70, 20, 10, offsetX, offsetY, true));
            offsetX += brick.width + brick.padding;
        }
        offsetX = brick.offsetX;
        offsetY += brick.height + brick.padding;
    }
    return bricks;
};
// All bricks
var bricks = createBricks(5, 9);
// // functions
var drawBricks = function () {
    bricks.forEach(function (brick) {
        ctx.beginPath();
        ctx.rect(brick.offsetX, brick.offsetY, brick.width, brick.height);
        ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
        ctx.fill();
        ctx.closePath();
    });
};
var drawAllBricks = function () { return bricks.forEach(function (brick) { return (brick.visible = true); }); };
var drawBall = function () {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
};
var drawBar = function () {
    ctx.beginPath();
    ctx.rect(bar.x, bar.y, bar.width, bar.height);
    ctx.fillStyle = bar.visible ? '#0095dd' : 'transparent';
    ctx.fill();
    ctx.closePath();
};
var drawScore = function () {
    ctx.fillText("Score: " + score, elements.canvas.width - 140, 35);
};
var increaseScore = function () {
    score++;
};
var moveBar = function () {
    bar.x += bar.dx;
    // Wall detection
    if (bar.x + bar.width > elements.canvas.width) {
        bar.x = elements.canvas.width - bar.width;
    }
    if (bar.x < 0) {
        bar.x = 0;
    }
};
var drawAll = function () {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    drawBricks();
    drawBall();
    drawBar();
    drawScore();
};
var updateCanvas = function () {
    // move the ball & bar
    ball.move();
    moveBar();
    // draw everything
    drawAll();
    // do it again
    requestAnimationFrame(updateCanvas);
};
updateCanvas();
// event listeners
// move the bar left or right
document.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key !== 37 && key !== 39 && key !== 65 && key !== 68)
        return;
    if (key === 37 || key === 65) {
        bar.dx = -bar.speed;
    }
    else if (key === 39 || key === 68) {
        bar.dx = bar.speed;
    }
});
// reset the movedirection
document.addEventListener('keyup', function () {
    bar.dx = 0;
});
// Rules and close event handlers
elements.rulesBtn.addEventListener('click', function () {
    return elements.rules.classList.add('show');
});
elements.closeBtn.addEventListener('click', function () {
    return elements.rules.classList.remove('show');
});
