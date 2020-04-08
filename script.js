document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");
    // canvas.width = window.innerWidth * .60;
    // canvas.height = window.innerHeight * .53;
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = (Math.random() * 4) - 2;
    let dy = -2;
    let x2 = canvas.width / 2;
    let y2= canvas.height - 30;
    let dx2 = (Math.random() * 4) - 2;
    let dy2 = -2;
    let paddleColor = "#66FCF1";
    const paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    const brickRowCount = 5;
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
    let alive = brickRowCount * brickColumnCount;
    let endGame = false;
    let endGameMessage;
    let backgroundParticles = [];
    let spacePressed;
    let bulletActive = false;
    let bulletArray = [];
    let powerUpBlock = [];
    let showPowerup = true;
    let divideBlock = [];
    let showDivide = true;
    let ball2Active = false;
    let ball1Active = true;
    let deactivateBullets = false;
    let expandBlock = [];
    let expandActive = false;
    let showExpand = true;
    let extraPaddleWidth = 0;
    let coinsArray = [];
    let level = 1;
    let nextLevelOrPlayAgain;

    hit = new sound('explosion.mp3');
    cheer = new sound('cheer.mp3');
    music = new sound('Platformer2.mp3');
    coinFX = new sound('coins.mp3');

    let bricks;
    function bricksInit2() {
        bricks = [];
        alive = brickColumnCount * brickRowCount;
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                if (c === 4 && r === 4) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: true, divide: false, expand: false };
                } else if (c === 2 && r === 4) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerup: false, divide: true, expand: false};
                } else if (c === 0 && r === 4) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerup: false, divide: false, expand: true};
                } else {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: false, divide: false };
                }
            }
        }
    }

    function bricksInit() {
        bricks = [];
        alive = brickColumnCount * brickRowCount - 12;
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                if ((c === 0 && r === 0) || (c===1 && r === 0) || (c === 3 && r === 0) || (c === 4 && r === 0) ||
                    (c === 0 && r === 1) || (c === 4 && r === 1) || (c === 0 && r === 3) || (c === 4 && r === 3) ||
                    (c === 0 && r === 4) || (c === 1 && r === 4) || (c === 3 && r === 4) || (c === 4 && r === 4)) {
                    bricks[c][r] = { x: 0, y: 0, status: 0, powerUp: false, divide: false };
                } else if (c === 3 && r === 3) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: true, divide: false, expand: false };
                } else if (c === 2 && r === 3) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerup: false, divide: true, expand: false };
                } else if (c === 1 && r === 3) {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerup: false, divide: false, expand: true };
                } else {
                    bricks[c][r] = { x: 0, y: 0, status: 1, powerUp: false, divide: false };
                }
            }
        }
    }

    if (level === 1) {
        bricksInit();
    } else if (level === 2) {
        bricksInit2();
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
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        } else if (e.which === 32) {
            spacePressed = true;
        }
    }

    function keyUpHandle(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        } else if (e.which === 32) {
            spacePressed = false;
        }
    }

    function PowerUp(x, y) {
        this.x = x + brickWidth/2;
        this.y = y + brickHeight/2;
        this.size = 10;
    }

    PowerUp.prototype.draw = function() {
        // ctx.beginPath();
        // ctx.rect(this.x, this.y, this.size, this.size);
        // ctx.fillStyle = "green";
        // ctx.fill();
        // ctx.closePath();
        ctx.font = "10px Arial";
        ctx.fillStyle = textColor;
        ctx.fillText("PowerUp", this.x, this.y);
    }

    PowerUp.prototype.update = function() {
        this.y += 1;
        this.draw();
    }

    function powerUpInit(powerUpX, powerUpY) {
        powerUpBlock.push(new PowerUp(powerUpX, powerUpY));
    }

    function divideInit(powerUpX, powerUpY) {
        divideBlock.push(new PowerUp(powerUpX, powerUpY));
    }

    function expandInit(powerUpX, powerUpY) {
        expandBlock.push(new PowerUp(powerUpX, powerUpY));
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
                        coinsInit(5, x, y);
                        if (b.powerUp) {
                            powerUpInit(b.x, b.y);
                        } else if (b.divide) {
                            divideInit(b.x, b.y);
                        } else if (b.expand) {
                            expandInit(b.x, b.y);
                        }
                        score++;
                        alive--;
                    } 
                    if (x2 > b.x && x2< b.x + brickWidth && y2 > b.y && y2 < b.y + brickHeight) {
                        dy2 = -dy2;
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
                        particlesInit(10, x2, y2);
                        coinsInit(5, x2, y2);
                        if (b.powerUp) {
                            powerUpInit(b.x, b.y);
                        } else if (b.divide) {
                            divideInit(b.x, b.y);
                        } else if (b.expand) {
                            expandInit(b.x, b.y);
                        }
                        score++;
                        alive--;
                    } 
                    for(let i = 0; i < bulletArray.length; i++) {
                        let bullet = bulletArray[i];
                        if (bullet.bulletX>b.x && bullet.bulletX<b.x+brickWidth && 
                            bullet.bulletY > b.y && bullet.bulletY < b.y+brickHeight) {
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
                            particlesInit(10, bullet.bulletX, bullet.bulletY);
                            coinsInit(5, bullet.bulletX, bullet.bulletY);
                            if (b.powerUp) {
                                powerUpInit(b.x, b.y);
                            } else if (b.divide) {
                                divideInit(b.x, b.y);
                            } else if (b.expand) {
                                expandInit(b.x, b.y);
                            }
                            score++;
                            alive--;
                            bullet.status = 0;
                        }
                    }
                }
            }
        }
    }

    function gameOver() {
        ctx.font = "30px Arial";
        ctx.fillStyle = textColor;
        ctx.fillText("Game Over", (canvas.width / 2) - 75, canvas.height / 2);
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 0;
        dy = 0;
        endGame = true;
        endGameMessage = "Game Over";
        nextLevelOrPlayAgain = "Play Again";
        level = 1;
    }

    function win() {
        ctx.font = "30px Arial";
        ctx.fillStyle = textColor;
        ctx.fillText("You Won!", (canvas.width / 2) - 75, canvas.height / 2);
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 0;
        dy = 0;
        endGame = true;
        endGameMessage = "You Won!"
        if (level === 1) {
            level = 2;
            nextLevelOrPlayAgain = "Next Level";
        } else if (level === 2) {
            level = 1;
            nextLevelOrPlayAgain = "Play Again"
        }
    }

    function playAgain() {
        let playAgainContainer = document.createElement('div');
        playAgainContainer.classList.add("play-again-container");
        let messageContainer = document.createElement('h1');
        let gameMessage = document.createTextNode(endGameMessage);
        messageContainer.appendChild(gameMessage);
        let scoreContainer = document.createElement('h2');
        let scoreMessage = document.createTextNode(`Score: ${score}`);
        scoreContainer.appendChild(scoreMessage);
        playAgainContainer.appendChild(messageContainer);
        playAgainContainer.appendChild(scoreContainer);
        let playAgainButton = document.createElement('button');
        playAgainButton.setAttribute("id", "play-again-button");
        let buttonMessage = document.createTextNode(nextLevelOrPlayAgain);
        playAgainButton.appendChild(buttonMessage);
        playAgainContainer.appendChild(playAgainButton)
        document.body.appendChild(playAgainContainer);
        music.stop();
        music.sound.currentTime = 0;
        addEventToButton();
    }

    function Bullet(bulletX, bulletY, bulletDY, size, color) {
        this.bulletX = bulletX;
        this.bulletY = bulletY;
        this.bulletDY = bulletDY;
        this.size = size;
        this.color = color;
        this.status = 1;
    }

    Bullet.prototype.draw = function () {
        ctx.beginPath();
        ctx.rect(this.bulletX, this.bulletY, this.size, this.size*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    Bullet.prototype.update = function () {
        this.bulletY += this.bulletDY;
        this.draw();
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

    function drawBall2() {
        ctx.beginPath();
        ctx.arc(x2, y2, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = textColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle(expand) {
        ctx.beginPath();
        if (expandActive) extraPaddleWidth = 25;
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth + extraPaddleWidth, paddleHeight);
        ctx.fillStyle = paddleColor;
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
                        ctx.fillStyle = "#590000";
                    } else if (r === 1) {
                        ctx.fillStyle = "#A10027";
                    } else if (r === 2) {
                        ctx.fillStyle = "#FF8597";
                    } else if (r === 3) {
                        ctx.fillStyle = "#C3073F";
                    } else if (r === 4) {
                        ctx.fillStyle = "rgb(160, 82, 45)"
                    }
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function shoot() {
        bulletArray.push(new Bullet(paddleX+(paddleWidth+extraPaddleWidth)/2, canvas.height-paddleHeight, -2, 4, "#FFCB00"));

    }

    function draw() {
        if (mute) {
            music.stop();
        } else if (!mute) {
            music.play();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.closePath();
        for (let i = 0; i < backgroundParticles.length; i++) {
            backgroundParticles[i].update2();
        }
        connectParticles();
        drawBricks();
        if (ball1Active) drawBall();
        drawPaddle(expandActive);
        drawScore();
        drawLives();
        collisionDetection();
        for(let i=0; i<particlesArray.length; i++) {
            particlesArray[i].update();
        }

        for(let i=0; i<coinsArray.length; i++) {
            let coin = coinsArray[i];
            if (coin.particleX - coin.size < 0 || coin.particleX + coin.size > canvas.width) {
                coin.directionX = -coin.directionX;
                coin.update();
            } else if (coin.particleX > paddleX && coin.particleX < paddleX + paddleWidth + extraPaddleWidth && 
                coin.particleY + coin.size > canvas.height - paddleHeight && coin.particleY + coin.size < canvas.height) {
                if (coin.status === 1) {
                    coin.status = 0;
                    score++;
                    if (!mute) {
                        coinFX.sound.currentTime = 0;
                        coinFX.play()
                    }
                }
            } else if (coin.status === 1) {
                coin.update();
            }
                
        }

        if(powerUpBlock.length && showPowerup) {
            for (let i = 0; i<powerUpBlock.length; i ++) {
                let pw = powerUpBlock[i];
                pw.update();
                if (pw.x > paddleX && pw.x < paddleX + paddleWidth + extraPaddleWidth && 
                    pw.y + pw.size > canvas.height - paddleHeight && pw.y + pw.size < canvas.height) {
                    bulletActive = true;
                    showPowerup = false;
                    paddleColor = "#FF9200";
                    deactivateBullets = false;
                }
            }
        }

        if (divideBlock.length && showDivide) {
            for (let i = 0; i < divideBlock.length; i++) {
                let db = divideBlock[i];
                db.update();
                if (db.x > paddleX && db.x < paddleX + paddleWidth + extraPaddleWidth && 
                    db.y + db.size > canvas.height - paddleHeight && db.y + db.size < canvas.height) {
                    ball2Active = true;
                    showDivide = false;
                }
            }
        }

        if (expandBlock.length && showExpand) {
            for (let i = 0; i < expandBlock.length; i++) {
                let eb = expandBlock[i];
                eb.update();
                if (eb.x > paddleX && eb.x < paddleX + paddleWidth + extraPaddleWidth &&
                    eb.y + eb.size > canvas.height - paddleHeight && eb.y + eb.size < canvas.height) {
                    expandActive = true;
                    showExpand = false;
                }
            }
        }

        if (lives > 0) {
            if (alive > 0) {
                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                }
                if (x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
                    dx2 = -dx2;
                }
                if (y + dy < ballRadius) {
                    dy = -dy;
                } else if (y + dy > canvas.height - ballRadius) {
                    if (x > paddleX && x < paddleX + paddleWidth + extraPaddleWidth) {
                        dy = -dy;
                        dx = -1 * 0.15 * ((paddleX + (paddleWidth + extraPaddleWidth)/ 2) - x);
                        if (!mute) {
                            cheer.play();
                        }
                        particlesInit(20, x, y, true);
                    } else {
                        if (ball2Active) {
                            ball1Active = false;
                        } else {
                            lives--;
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 2;
                            dy = -2;
                            paddleX = (canvas.width - paddleWidth) / 2;
                            deactivateBullets = true;
                            paddleColor = "#66FCF1";
                            extraPaddleWidth = 0;
                            expandActive = false;
                        }
                    }
                }

                if (y2 + dy2 < ballRadius) {
                    dy2= -dy2;
                } else if (y2 + dy2 > canvas.height - ballRadius) {
                    if (x2 > paddleX && x2 < paddleX + paddleWidth + extraPaddleWidth) {
                        dy2 = -dy2;
                        dx2 = -1 * 0.15 * ((paddleX + paddleWidth / 2) - x2);
                        if (!mute) {
                            cheer.play();
                        }
                        particlesInit(20, x2, y2, true);
                    } else {
                        if (ball1Active) {
                            ball2Active = false;
                        } else {
                            lives--;
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 2;
                            dy = -2;
                            paddleX = (canvas.width - paddleWidth) / 2;
                            ball1Active = true;
                            deactivateBullets = true;
                            paddleColor = "#66FCF1";
                            ball2Active = false;
                            extraPaddleWidth = 0;
                            expandActive = false;
                        }
                    }
                }
            } else {
                win();
            }
        } else {
            gameOver();
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

        if (spacePressed && bulletActive) {
            bulletActive = false;
            shoot();
        }

        for(let i=0; i<bulletArray.length; i++) {
            if(bulletArray[i].status === 1) {
                bulletArray[i].update();
            }
           
        }

        if (bulletArray.length && !deactivateBullets) {
            if (bulletArray[bulletArray.length-1].bulletY < canvas.height - paddleHeight * 5) {
                bulletActive = true;
            }
        }

        if (ball2Active) {
            drawBall2();
            x2 += dx2;
            y2 += dy2;
        }

        if (ball1Active) {
            x += dx;
            y += dy;
        }

        // if (score === brickColumnCount * brickRowCount) {
        //     win();
        // }

        if (endGame) {
            cancelAnimationFrame(myReq);
            playAgain();
        } else {
            myReq = requestAnimationFrame(draw);
        }
    }

    function Particle(particleX, particleY, directionX, directionY, size, color) {
        this.particleX = particleX;
        this.particleY = particleY;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.status = 1;
    }

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.particleX, this.particleY, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    Particle.prototype.draw2 = function () {
        ctx.beginPath();
        ctx.rect(this.particleX, this.particleY, this.size, this.size);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    Particle.prototype.update = function() {
        this.particleX += this.directionX;
        this.particleY += this.directionY;
        this.draw();
    }

    Particle.prototype.update2 = function() {
        if (this.particleX > canvas.width || this.particleX < 0) {
            this.directionX = -this.directionX;
        }
        if (this.particleY > canvas.height || this.particleY < 0) {
            this.directionY = -this.directionY;
        }

        this.particleX += this.directionX;
        this.particleY += this.directionY;
        this.draw2();
    }

    function particlesInit(number, ballX, ballY, confetti=false) {
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

    function coinsInit(number, x, y) {
        for(i=0; i<number; i++) {
            let size = 4;
            let coinX = x;
            let coinY = y;
            let directionX = Math.random()-.2;
            let directionY = Math.random()*3+.5;
            let color = "#D9A760";
            coinsArray.push(new Particle(coinX, coinY, directionX, directionY, size, color));
        }
    }

    function backgroundInit() {
        backgroundParticles = [];
        let numberOfParticles = canvas.width * canvas.height / 5000;
        for(let i=0; i<numberOfParticles;i++) {
            let particleX = Math.random() * canvas.width;
            let particleY = Math.random() * canvas.height;
            let directionX = Math.random() * 5 - 2;
            let directionY = Math.random() * 5 - 2;
            let size = Math.random() * 2 + 5;
            let color = `rgba(69, 162, 158, 0.15)`;

            backgroundParticles.push(new Particle(particleX, particleY, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        for(let a=0; a<backgroundParticles.length; a++) {
            for(let b=a; b<backgroundParticles.length; b++) {
                let distance = ((backgroundParticles[a].particleX - backgroundParticles[b].particleX) * (backgroundParticles[a].particleX - backgroundParticles[b].particleX) )
                    + ((backgroundParticles[a].particleY - backgroundParticles[b].particleY) * (backgroundParticles[a].particleY - backgroundParticles[b].particleY));
                if (distance < canvas.width/3 * canvas.height/3) {
                    ctx.strokeStyle = `rgba(69, 162, 158, 0.15)`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(backgroundParticles[a].particleX, backgroundParticles[a].particleY);
                    ctx.lineTo(backgroundParticles[b].particleX, backgroundParticles[b].particleY);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
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
        if (!showInstructions) {
            document.body.removeChild(instructionsDiv);
            showInstructions = !showInstructions;
        }
        document.getElementsByClassName("modal-background")[0].style.display = "none";
        if (!mute) {
            music.sound.currentTime = 0;
            music.play();
        }
        backgroundInit();
        draw();
    }

    function startAnotherGame(e) {
        lives = 3;
        dx = 2;
        dy = -2;
        endGame = false;
        document.getElementsByClassName("play-again-container")[0].remove();
        bulletArray = [];
        powerUpBlock = [];
        bulletActive = false;
        showPowerup = true;
        ball2Active = false;
        divideBlock = [];
        showDivide = true;
        ball1Active = true;
        x2 = canvas.width / 2;
        y2 = canvas.height - 30;
        dx2 = (Math.random() * 4) - 2;
        dy2 = -2;
        deactivateBullets = false;
        paddleColor = "#66FCF1";
        extraPaddleWidth = 0;
        expandBlock = [];
        expandActive = false;
        showExpand = true;
        particlesArray = [];
        coinsArray = [];
        endGame = false;
        if (level === 1) {
            console.log("in")
            bricksInit();
            score = 0;
            document.getElementsByClassName("modal-background")[0].style.display = "flex";
        } else if (level === 2) {
            bricksInit2();
            if (!mute) {
                music.play();
            }
            backgroundInit();
            draw();
        }
    }

    function addEventToButton() {
        let againButton = document.getElementById("play-again-button")
        againButton.addEventListener("click", startAnotherGame);
    }

    let instructionsDiv = document.createElement("div");
    let instructionsP = document.createElement("p");
    let instructionsText = document.createTextNode("Use the left arrow and right arrow keys to move the paddle and prevent the ball from falling off the screen." +
        " Break the bricks, collect the coins and catch the power ups to get a bigger paddle, a second ball or when your paddle turns orange," +
        " bullets that you can fire by pressing the space bar.");
    instructionsDiv.classList.add("instructions");
    instructionsP.appendChild(instructionsText);
    instructionsDiv.appendChild(instructionsP);
    let showInstructions = true;

    function toggleInstructions(e) {
        if (showInstructions) {
            document.body.appendChild(instructionsDiv);
            showInstructions = !showInstructions;
        } else {
            document.body.removeChild(instructionsDiv);
            showInstructions = !showInstructions;
        }
        
    }

    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", startGame);
    const soundOnButton = document.getElementById("sound-on");
    soundOnButton.addEventListener("click", soundOn);
    const soundOffButton = document.getElementById("sound-off");
    soundOffButton.addEventListener("click", soundOff);
    const instructionsButton = document.getElementById("instructions");
    instructionsButton.addEventListener("click", toggleInstructions);
})