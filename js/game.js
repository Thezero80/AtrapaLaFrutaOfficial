const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Ajustar tamaño del canvas
function resizeCanvas() {
  canvas.width = Math.min(600, window.innerWidth - 20);
  canvas.height = Math.min(400, window.innerHeight - 200);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Objetos del juego
let score = 0;
let gameIsOver = false;
const basket = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 30,
  speed: 10
};
const fruits = [];
const fruitImages = [
  'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/apple.png?raw=true',
  'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/banana.png?raw=true',
  'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/orange.png?raw=true'
];

// Cargar imágenes
const basketImg = new Image();
basketImg.src = 'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/basket.png?raw=true';

// Asocia cada imagen con su puntaje
const fruitData = [
  { src: 'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/apple.png?raw=true', points: 10 },
  { src: 'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/banana.png?raw=true', points: 20 },
  { src: 'https://github.com/Thezero80/AtrapaLaFrutaOfficial/blob/main/assets/orange.png?raw=true', points: 30 }
];

// Cargar imágenes y asociar puntaje
const loadedFruitImages = fruitData.map(data => {
  const img = new Image();
  img.src = data.src;
  return { img, points: data.points };
});

// Clase Fruta
class Fruit {
  constructor() {
    this.width = 30;
    this.height = 30;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0;
    this.speed = 2 + Math.random() * 2;
    // Selecciona aleatoriamente una fruta y su puntaje
    const fruit = loadedFruitImages[Math.floor(Math.random() * loadedFruitImages.length)];
    this.image = fruit.img;
    this.points = fruit.points;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

// Controles
function moveBasket(event) {
  if (gameIsOver) return;
  let clientX;
  if (event.type === 'touchmove') {
    clientX = event.touches[0].clientX - canvas.offsetLeft;
  } else {
    clientX = event.clientX - canvas.offsetLeft;
  }
  basket.x = Math.max(0, Math.min(clientX - basket.width / 2, canvas.width - basket.width));
}

canvas.addEventListener('mousemove', moveBasket);
canvas.addEventListener('touchmove', moveBasket);

// Generar frutas
function spawnFruit() {
  if (!gameIsOver) {
    fruits.push(new Fruit());
    setTimeout(spawnFruit, 1000 + Math.random() * 1000);
  }
}

// Colisiones
function checkCollisions() {
  fruits.forEach((fruit, index) => {
    if (
      fruit.x < basket.x + basket.width &&
      fruit.x + fruit.width > basket.x &&
      fruit.y < basket.y + basket.height &&
      fruit.y + fruit.height > basket.y
    ) {
      score += fruit.points;
      scoreElement.textContent = score;
      soundCatch.currentTime = 0; // Reinicia el sonido si se reproduce rápido
      soundCatch.play();
      fruits.splice(index, 1);
    } else if (fruit.y > canvas.height) {
      gameOver();
      fruits.splice(index, 1);
    }
  });
};

// Fin del juego
function gameOver() {
  gameIsOver = true;
  gameOverElement.classList.remove('d-none');
  finalScoreElement.textContent = score;
  soundGameOver.currentTime = 0;
  soundGameOver.play();
}

// Reiniciar juego
function restart() {
  score = 0;
  fruits.length = 0;
  gameIsOver = false;
  basket.x = canvas.width / 2 - basket.width / 2;
  scoreElement.textContent = score;
  gameOverElement.classList.add('d-none');
  spawnFruit();
}

// Listener para reiniciar
document.addEventListener('DOMContentLoaded', () => {
  restartBtn.addEventListener('click', function() {
    soundClick.currentTime = 0;
    soundClick.play();
    restart();
  });
});

// Sonidos
const soundCatch = new Audio('assets/sounds/catch.wav');
const soundGameOver = new Audio('assets/sounds/gameover.wav');
const soundClick = new Audio('assets/sounds/click.wav');

// Bucle del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameIsOver) {
    // Dibujar canasta
    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);

    // Actualizar y dibujar frutas
    fruits.forEach(fruit => {
      fruit.update();
      fruit.draw();
    });

    checkCollisions();
  }

  requestAnimationFrame(gameLoop);
}

// Iniciar el juego cuando la imagen de la canasta se cargue
/* basketImg.onload = () => {
  spawnFruit();
  gameLoop();
}; */