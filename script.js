document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    // canvas.width = window.innerWidth * .60;
    // canvas.height = window.innerHeight * .53;
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let score = 0;
    let lives = 3;
    let hit;
    let cheer;
    let music;
    let mute;
    let backgroundColor = "#000";
    let textColor = "#fff";
    let particlesArray = [];
    let confettiColors = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];

    hit = new sound('explosion.mp3');
    cheer = new sound('cheer.mp3');
    music = new sound('Platformer2.mp3');

    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandle, false);
    document.addEventListener("keyup", keyUpHandle, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function keyDownHandle(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandle(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        if (!mute) {
                            hit.sound.currentTime = 0;
                            hit.play();
                        }
                        if (backgroundColor === "#000") {
                            backgroundColor = "#fff";
                            textColor = "#000";
                        } else {
                            backgroundColor = "#000";
                            textColor = "#fff";
                        }
                        b.status = 0;
                        particlesInit(10, x, y);
                        score++;
                        if (score === brickColumnCount * brickRowCount) {
                            alert("You Won!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function gameOver() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Game Over", (canvas.width / 2) - 75, canvas.height / 2);
        x = -10;
        y = canvas.height;
        dx = 0;
        dy = 0;
    }

    function win() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("You Won!", (canvas.width / 2) - 65, canvas.height / 2);
        x = -10;
        y = -10;
        dx = 0;
        dy = 0;
    }

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = textColor;
        ctx.fillText("Score: " + score, 8, 20)
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = textColor;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = textColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#66FCF1";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    if (r === 0) {
                        ctx.fillStyle = "#6F2232";
                    } else if (r === 1) {
                        ctx.fillStyle = "#950740";
                    } else if (r === 2) {
                        ctx.fillStyle = "#C3073F";
                    }
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.closePath();
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        for(let i=0; i<particlesArray.length; i++) {
            particlesArray[i].update();
        }

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                dx = -1 * 0.15 * ((paddleX + paddleWidth / 2) - x);
                if (!mute) {
                    cheer.play();
                }
                particlesInit(20, x, y, true);
            } else {
                lives--;
                if (!lives) {
                    alert("Game Over");
                    document.location.reload();
                    // gameOver();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }

            }
        }

        if (rightPressed) {
            paddleX += 7;
            if (paddleX + paddleWidth > canvas.width) {
                paddleX = canvas.width - paddleWidth;
            }
        } else if (leftPressed) {
            paddleX -= 7;
            if (paddleX < 0) {
                paddleX = 0;
            }
        }

        x += dx;
        y += dy;

        // if (score === brickColumnCount * brickRowCount) {
        //     win();
        // }

        requestAnimationFrame(draw);
    }

    function Particle(particleX, particleY, directionX, directionY, size, color) {
        this.particleX = particleX;
        this.particleY = particleY;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.particleX, this.particleY, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    Particle.prototype.update = function() {
        this.particleX += this.directionX;
        this.particleY += this.directionY;
        this.draw();
    }

    function particlesInit(number, ballX, ballY, confetti=false) {
        particlesArray = [];
        for(i=0; i<number; i++) {
            let size = Math.random()*3;
            let particleX = ballX;
            let particleY = ballY;
            let directionX = Math.random()*11-5;
            let directionY = Math.random()*11-5;
            let color;
            if(!confetti) {
                color = "#C3073F";
            } else {
                color = confettiColors[Math.floor(Math.random() * 5)];
                directionY = Math.random()-6;

            }
            
            particlesArray.push(new Particle(particleX, particleY, directionX, directionY, size, color));
        }
    }

    function soundOn(e) {
        mute = false;
        select(e);
    }

    function soundOff(e) {
        mute = true;
        select(e);
    }

    function select(e) {
        e.target.classList.add("selected");
        if (e.target.id === "sound-on") {
            document.getElementById("sound-off").classList.remove("selected");
        } else {
            document.getElementById("sound-on").classList.remove("selected");
        }
    }

    function startGame(e) {
        document.getElementsByClassName("modal-background")[0].style.display = "none";
        if (!mute) {
            music.play();
        }
        draw();
    }
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", startGame);
    const soundOnButton = document.getElementById("sound-on");
    soundOnButton.addEventListener("click", soundOn)
    const soundOffButton = document.getElementById("sound-off");
    soundOffButton.addEventListener("click", soundOff)
})