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

```javascript
draw(ctx) {
  const image = Sprite.createImage(this.path);
  const imgOffsetX = this.pos[0] - this.xDim / 2;
  const imgOffsetY = this.imgOffsetY || this.pos[1] - this.yDim / 2;

  ctx.drawImage(image, imgOffsetX, imgOffsetY, this.xDim, this.yDim);
}
```

#### Points
A global leaderboard is stored using Firebase. The main functionality of this database can be found in `./lib/util/database.js`. Only the top 10 scores are stored along with a name that is salted to allow for repeats without overwriting.

Both the points and high score (along with the modals, blaster cannon count, and sound icons) are manipulated using my own, light-weight DOM manipulation library, joQuery.

#### Audio
All audio playing is done using JavaScript's HTMLAudioElement API.

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
