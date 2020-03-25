## Breakout

[Play here](https://javiermortiz.github.io/breakout/)

![breakout_screenshot](breakout_screenshot.png)

### Background

Breakout is an arcade game developed by Atari, Inc. on the 70's. My spin-off was written in JavaScript and uses Canvas for 2D rendering.

### How to Play

Use the left arrow and right arrow keys to move the paddle and prevent the ball from falling off the screen. Break the bricks and catch the power ups to get a bigger paddle, a second ball or when your paddle turns orange, bullets that you can fire by pressing the space bar.

### Features

#### 2D Rendering
All 2D rendering is done using HTML 5 Canvas. By tracking the coordinates of the diferent elements on Canvas I was able to detect all collisions and trigger different outcomes such as changing the direction of the ball, destroying a brick and releasing particles.

```JavaScript
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
```

#### Power-ups
Every brick is made from a JavaScript object that has all the required info to create that brick. I placed power-ups in some bricks. When the ball collides with a brick I check to see if the power-up condition is true to release the power-up element. Checking the coordinates of this element against the bar, I can check if the bar caught the power up and as a result set certain variables that will enable the power-ups methods.

```JavaScript
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
```

#### Audio
All audio playing is done using a sound function that creates an audio element on the document.

I implemented an event listener using joQuery to toggle muting for all Audio elements in the document.

```javascript
renderSound(isMuted) {
  if (isMuted) {
    $jo('.sound').addClass('muted');
  } else {
    $jo('.sound').removeClass('muted');
  }
}
```
