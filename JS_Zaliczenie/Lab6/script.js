const ball = document.querySelector(".ball");
const gameContainer = document.querySelector(".gameContainer");
const timerElement = document.querySelector(".timer");
const scoreElement = document.querySelector(".score");

const holes = [];
const numHoles = 5; // Liczba dziurek
let blackHoleIndex = 2; // Indeks dziurki, która jest czarną dziurą
let currentHole = 0; // Indeks obecnej dziurki do zaliczenia

// Funkcja do generowania losowej pozycji
const generateRandomPosition = (element) => {
  const x = Math.floor(Math.random() * (gameContainer.clientWidth - element.clientWidth));
  const y = Math.floor(Math.random() * (gameContainer.clientHeight - element.clientHeight));
  return { x, y };
};

let ballPosition = generateRandomPosition(ball);
let score = 0;
let timeLeft = 60;
let timerInterval;
let timerStarted = false;
let lastTime = Date.now();

// Generowanie dziurek
for (let i = 0; i < numHoles; i++) {
  const hole = document.createElement("div");
  hole.classList.add("hole");
  gameContainer.appendChild(hole);
  holes.push({
    element: hole,
    position: generateRandomPosition(hole),
    isBlackHole: i === blackHoleIndex,
    isMovable: i === blackHoleIndex + 1, // Ruchoma dziurka
  });
}

const updatePositions = () => {
  ball.style.left = `${ballPosition.x}px`;
  ball.style.top = `${ballPosition.y}px`;

  holes.forEach((hole, index) => {
    hole.element.style.left = `${hole.position.x}px`;
    hole.element.style.top = `${hole.position.y}px`;

    if (hole.isMovable && index !== currentHole) {
      if (Math.random() > 0.5) {
        hole.position = generateRandomPosition(hole.element);
      }
    }
  });
};

const checkCollision = () => {
  const currentHoleObject = holes[currentHole];
  const distance = Math.sqrt(
    Math.pow(ballPosition.x - currentHoleObject.position.x, 2) +
    Math.pow(ballPosition.y - currentHoleObject.position.y, 2)
  );

  if (ball.clientWidth > distance) {
    if (currentHoleObject.isBlackHole) {
      ballPosition = generateRandomPosition(ball);
    } else {
      score++;
      scoreElement.textContent = score;
      currentHole++;
      if (currentHole >= numHoles) {
        currentHole = 0;
      }
    }

    updatePositions();
  }
};

const moveBallWithKeys = (event) => {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  switch (event.key) {
    case "ArrowUp":
      if (ballPosition.y > 0) ballPosition.y -= 10;
      break;
    case "ArrowDown":
      if (ballPosition.y < gameContainer.clientHeight - ball.clientHeight)
        ballPosition.y += 10;
      break;
    case "ArrowLeft":
      if (ballPosition.x > 0) ballPosition.x -= 10;
      break;
    case "ArrowRight":
      if (ballPosition.x < gameContainer.clientWidth - ball.clientWidth)
        ballPosition.x += 10;
      break;
  }

  updatePositions();
  checkCollision();
};

const handleOrientation = (event) => {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  const gamma = event.gamma; // Oś X (lewo/prawo)
  const beta = event.beta; // Oś Y (góra/dół)

  ballPosition.x += gamma * 0.2; // Dopasowanie czułości
  ballPosition.y += beta * 0.2;  // Dopasowanie czułości

  ballPosition.x = Math.max(
    0,
    Math.min(ballPosition.x, gameContainer.clientWidth - ball.clientWidth)
  );
  ballPosition.y = Math.max(
    0,
    Math.min(ballPosition.y, gameContainer.clientHeight - ball.clientHeight)
  );
  
  checkCollision();
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerElement.textContent = timeLeft;
    } else {
      clearInterval(timerInterval);
      alert(`Czas się skończył! Twój wynik: ${score}`);
      resetGame();
    }
  }, 1000);
};

const resetGame = () => {
  score = 0;
  timeLeft = 60;
  currentHole = 0;
  timerStarted = false;
  scoreElement.textContent = score;
  timerElement.textContent = timeLeft;
  ballPosition = generateRandomPosition(ball);
  holes.forEach((hole) => {
    hole.position = generateRandomPosition(hole.element);
  });
  updatePositions();
};

const animate = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastTime;
  
  // Animacja ruchu
  ballPosition.x += (ballPosition.x > 0 ? -0.5 : 0.5) * deltaTime * 0.01;
  ballPosition.y += (ballPosition.y > 0 ? -0.5 : 0.5) * deltaTime * 0.01;

  updatePositions();
  lastTime = currentTime;
  
  requestAnimationFrame(animate);
};

document.addEventListener("keydown", moveBallWithKeys);
window.addEventListener("deviceorientation", handleOrientation);

requestAnimationFrame(animate); // Uruchomienie animacji
updatePositions();
