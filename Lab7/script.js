const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector(".startButton");
const resetButton = document.querySelector(".resetButton");
const ballsInput = document.querySelector(".ballsNumInput");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balls = [];
let numBalls = parseInt(ballsInput.value);
const maxDistance = 100;
const attractionForce = 0.05; // Siła przyciągania/odpychania
let animationId;

// Siła kulki to X * Prędkość + Y * Masa
const forceMultiplierX = 1; // Może być konfigurowalny przez użytkownika
const forceMultiplierY = 1; // Może być konfigurowalny przez użytkownika

// Ball class to represent each ball on the canvas
class Ball {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.mass = this.radius; // Masa zależna od promienia
    this.energy = this.calculateEnergy();
  }

  calculateEnergy() {
    return forceMultiplierX * Math.sqrt(this.dx ** 2 + this.dy ** 2) + forceMultiplierY * this.mass;
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  moveBall() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  isClicked(mouseX, mouseY) {
    const dist = Math.hypot(this.x - mouseX, this.y - mouseY);
    return dist < this.radius;
  }

  applyForce(mx, my) {
    const dist = Math.hypot(mx - this.x, my - this.y);
    if (dist < maxDistance) {
      const forceX = (mx - this.x) * attractionForce;
      const forceY = (my - this.y) * attractionForce;

      this.dx += forceX;
      this.dy += forceY;
    }
  }

  // Funkcja łączenia kulek
  mergeWith(otherBall) {
    if (this.radius > otherBall.radius) {
      this.radius += otherBall.radius * 0.1;
      this.mass = this.radius; // Masa zależna od nowego promienia
      this.energy = this.calculateEnergy();
      otherBall.radius -= otherBall.radius * 0.1;
    } else {
      otherBall.radius += this.radius * 0.1;
      otherBall.mass = otherBall.radius;
      otherBall.energy = otherBall.calculateEnergy();
      this.radius -= this.radius * 0.1;
    }

    if (this.radius < 1) this.radius = 0;
    if (otherBall.radius < 1) otherBall.radius = 0;
  }
}

const init = () => {
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    const radius = Math.random() * 20 + 10; // Losowy rozmiar kulki
    let x = Math.random() * (canvas.width - 2 * radius) + radius;
    let y = Math.random() * (canvas.height - 2 * radius) + radius;
    let dx = (Math.random() - 0.5) * 3;
    let dy = (Math.random() - 0.5) * 3;
    balls.push(new Ball(x, y, dx, dy, radius));
  }
};

const drawLines = () => {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dist = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);
      if (dist < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.stroke();
        ctx.closePath();
        balls[i].mergeWith(balls[j]); // Połącz kulki
      }
    }
  }
};

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball, index) => {
    ball.moveBall();
    ball.drawBall();

    // Jeśli kulka jest martwa, usuń ją z tablicy
    if (ball.radius <= 0) {
      balls.splice(index, 1);
    }
  });
  drawLines();
  animationId = requestAnimationFrame(animate);
};

const start = () => {
  numBalls = parseInt(ballsInput.value);
  init();
  if (!animationId) animate();
};

const stop = () => {
  cancelAnimationFrame(animationId);
  animationId = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls.forEach((ball) => {
    ball.applyForce(mouseX, mouseY);
  });
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balls.forEach((ball, index) => {
    if (ball.isClicked(mouseX, mouseY)) {
      balls.splice(index, 1); // Usuwamy klikniętą kulkę
      const radius = 10;
      let x1 = Math.random() * (canvas.width - 2 * radius) + radius;
      let y1 = Math.random() * (canvas.height - 2 * radius) + radius;
      let x2 = Math.random() * (canvas.width - 2 * radius) + radius;
      let y2 = Math.random() * (canvas.height - 2 * radius) + radius;
      let dx1 = (Math.random() - 0.5) * 3;
      let dy1 = (Math.random() - 0.5) * 3;
      let dx2 = (Math.random() - 0.5) * 3;
      let dy2 = (Math.random() - 0.5) * 3;
      balls.push(new Ball(x1, y1, dx1, dy1, radius));
      balls.push(new Ball(x2, y2, dx2, dy2, radius));
    }
  });
});

resetButton.addEventListener("click", stop);
startButton.addEventListener("click", start);
