const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.height = innerHeight;
canvas.width = innerWidth;

const gravity = 0.2;

let score = 0;

let pillars = [];

const scoreboard = document.querySelector("span > p");
const gameOverUI = document.querySelector("#gameOverUI");
const birdy = document.getElementById("bird");

let player = {
  position: innerHeight / 2,
  velocity: 0,
  acceleration: gravity,
  radius: 20,
  draw() {
    context.drawImage(birdy, 100 - 40, this.position - 50);
  },
  update() {
    this.position += this.velocity;
    this.velocity += this.acceleration;
  },
};

class Pillar {
  x;
  length;
  width;
  velocity;
  gapY;
  gapHeight;
  constructor() {
    this.x = innerWidth;
    this.length = innerHeight;
    this.width = 75;
    this.velocity = 5;
    this.gapY = Math.floor(Math.random() * innerHeight);
    this.gapHeight = 150;
  }
  draw() {
    context.beginPath();
    context.rect(this.x, 0, this.width, this.gapY - this.gapHeight / 2);
    context.rect(
      this.x,
      this.gapY + this.gapHeight / 2,
      this.width,
      innerHeight - this.gapY - this.gapHeight / 2
    );
    context.fillStyle = "green";
    context.fill();
    context.stroke();
  }
  update() {
    this.x -= this.velocity;
  }
}
let pillarSpawner;

player.draw();

function clearCanvas() {
  context.beginPath();
  context.rect(0, 0, innerWidth, innerHeight);
  context.fillStyle = "lightblue";
  context.fill();
}
let gameOver = true;

main = function () {
  let frameID = requestAnimationFrame(main);

  clearCanvas();
  player.draw();
  player.update();

  scoreboard.textContent = score.toString();

  for (let i = 0; i < pillars.length; i++) {
    pillars[i].draw();
    pillars[i].update();
  }
  if (pillars.length > 1) {
    if (pillars[0].x + pillars[0].width < 0) {
      pillars.shift();
      score++;
    } else if (
      pillars[0].x < 100 + player.radius &&
      pillars[0].x + pillars[0].width > 100 - player.radius
    ) {
      if (
        !(
          player.position - player.radius >
            pillars[0].gapY - pillars[0].gapHeight / 2 &&
          player.position + player.radius <
            pillars[0].gapY + pillars[0].gapHeight / 2
        )
      ) {
        gameOver = true;
      }
    }
  }
  if (
    player.position + player.radius < 0 ||
    player.position - player.radius > innerHeight
  )
    gameOver = true;

  if (gameOver) {
    clearInterval(pillarSpawner);
    cancelAnimationFrame(frameID);
    gameOverUI.style.display = "block";
    gameOverUI.querySelector("p").innerHTML =
      "birdy is kil.<br>birdy cross " +
      score +
      " pillar.<br>press enter for play agen.";
  }
};

addEventListener("keydown", (event) => {
  if (event.code != "Space") return;
  player.velocity = -5;
});

addEventListener("keydown", (event) => {
  if (event.code != "Enter" || !gameOver) return;
  player.position = innerHeight / 2;
  score = 0;
  pillars = [];
  pillarSpawner = setInterval(() => {
    pillars.push(new Pillar());
  }, 2000);
  gameOver = false;
  player.velocity = -5;
  gameOverUI.style.display = "none";
  main();
});
