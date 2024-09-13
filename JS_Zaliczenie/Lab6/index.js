const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const numberOfBallsInput = document.querySelector("#numberOfBalls");
const thresholdInput = document.querySelector("#threshold");
const repelForceInput = document.querySelector("#repelForce");
const splitForceInput = document.querySelector("#splitForce");
const startBtn = document.querySelector("#startButton");
const resetBtn = document.querySelector("#resetButton");
const fps = document.querySelector("#fps");
const numberOfBallsOutput = document.querySelector("#numberOfBallsOutput");
const thresholdOutput = document.querySelector("#thresholdOutput");
const repelForceOutput = document.querySelector("#repelForceOutput");
const splitForceOutput = document.querySelector("#splitForceOutput");

let balls = [];
let running = false;
let frameCount = 0;
let fpsCount = 0;
let lastTimestamp = 0;

class Ball {
  constructor(x, y, vx, vy, radius, color, mass) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.color = color;
    this.mass = mass;
  }

  draw = () => {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  update = () => {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.vx = -this.vx;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.vy = -this.vy;
    }

    this.vx *= 0.99;
    this.vy *= 0.99;
  };

  repel = (targetX, targetY) => {
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const forceX = Math.cos(angle) * repelForceInput.value;
    const forceY = Math.sin(angle) * repelForceInput.value;

    this.vx -= forceX / this.mass;
    this.vy -= forceY / this.mass;
  };

  split = () => {
    if (this.radius > 1) {
      this.radius /= 2;
      const newBall = new Ball(
        this.x,
        this.y,
        this.vx,
        this.vy,
        this.radius,
        this.color,
        this.mass
      );

      balls.push(newBall);
      return newBall;
    }
    return null;
  };
}

const connectBalls = (b1, b2) => {
  const distance = Math.hypot(b1.x - b2.x, b1.y - b2.y);
  const threshold = (canvas.width * thresholdInput.value) / 100;
  if (distance < threshold) {
    ctx.beginPath();
    ctx.moveTo(b1.x, b1.y);
    ctx.lineTo(b2.x, b2.y);
    ctx.stroke();
  }
};

numberOfBallsInput.addEventListener("input", () => {
  numberOfBallsOutput.value = numberOfBallsInput.value;
});

thresholdInput.addEventListener("input", () => {
  thresholdOutput.value = thresholdInput.value;
});

repelForceInput.addEventListener("input", () => {
  repelForceOutput.value = repelForceInput.value;
});

splitForceInput.addEventListener("input", () => {
  splitForceOutput.value = splitForceInput.value;
});

const start = () => {
  if (!running) {
    for (let i = 0; i < numberOfBallsInput.value; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 5;
      const vy = (Math.random() - 0.5) * 5;
      const radius = Math.random() * 20 + 10;
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      const mass = Math.PI * Math.pow(radius, 2);

      balls.push(new Ball(x, y, vx, vy, radius, color, mass));
    }
    running = true;
    requestAnimationFrame(draw);
  }
};

const reset = () => {
  balls = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  running = false;
};

const draw = (timestamp) => {
  if (running) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      for (let j = i + 1; j < balls.length; j++) {
        connectBalls(balls[i], balls[j]);
      }
    }

    fpsCount++;
    frameCount++;

    const elapsed = timestamp - lastTimestamp;
    if (elapsed >= 1000) {
      fps.textContent = `FPS: ${fpsCount}`;
      fpsCount = 0;
      lastTimestamp = timestamp;
    }

    requestAnimationFrame(draw);
  }
};

startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", reset);

canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  for (const ball of balls) {
    ball.repel(mouseX, mouseY);
  }
});

canvas.addEventListener("click", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    const distance = Math.hypot(ball.x - mouseX, ball.y - mouseY);

    if (distance <= ball.radius) {
      const newBall = ball.split();

      if (newBall) {
        newBall.vx = (Math.random() - 0.5) * 5;
        newBall.vy = (Math.random() - 0.5) * 5;
      }

      balls.splice(i, 1);
    }
  }
});
