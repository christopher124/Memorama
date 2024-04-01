let mode = "normal"; // Modo por defecto
let level = "easy";
let cards = [];
let shuffledCards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let startTime = null;
let timerInterval = null;
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

function startGame() {
  let pairs = 4; // Pares por defecto para el nivel fácil
  let cardSet = [];

  if (level === "medium") {
    pairs = 8;
  } else if (level === "hard") {
    pairs = 12;
  }

  if (mode === "normal") {
    cardSet = [
      "🐶",
      "🐱",
      "🦊",
      "🐻",
      "🐘",
      "🐼",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐧",
      "🐤",
      "🦆",
      "🦉",
    ];
  } else if (mode === "memes") {
    cardSet = [
      "😂",
      "🤣",
      "😊",
      "😍",
      "🤩",
      "😎",
      "😜",
      "🤪",
      "😘",
      "😇",
      "🤓",
      "🤠",
      "🥳",
      "🥺",
      "😱",
      "🤯",
    ];
  }

  cards = cardSet.slice(0, pairs);
  cards = cards.concat(cards); // Duplicar cartas para hacer pares
  shuffledCards = shuffle(cards);
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  startTime = null;
  updateBoard();
  clearInterval(timerInterval);
  document.getElementById("time").textContent = "Tiempo: 0 segundos";
}

function setMode(newMode) {
  mode = newMode;
  startGame();
}

function setDifficulty(difficulty) {
  level = difficulty;
  startGame();
}

function restartGame() {
  startGame();
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function flipCard(index) {
  if (
    flippedCards.length < 2 &&
    !flippedCards.includes(index) &&
    !matchedCards.includes(index)
  ) {
    flippedCards.push(index);
    if (flippedCards.length === 2) {
      moves++;
      if (moves === 1) {
        startTime = Date.now();
        timerInterval = setInterval(updateTime, 1000);
      }
      setTimeout(checkMatch, 1000);
    }
  }
  updateBoard();
}

function checkMatch() {
  let [card1, card2] = flippedCards;
  if (shuffledCards[card1] === shuffledCards[card2]) {
    matchedCards.push(card1, card2);
  }
  flippedCards = [];
  updateBoard();

  if (matchedCards.length === shuffledCards.length) {
    clearInterval(timerInterval);
    let endTime = Date.now();
    let elapsedTime = Math.floor((endTime - startTime) / 1000);
    let playerName = prompt(
      "¡Felicidades! Has completado el juego. Ingresa tu nombre para guardar tu tiempo:"
    );
    if (playerName) {
      leaderboard.push({ name: playerName, time: elapsedTime });
      leaderboard.sort((a, b) => a.time - b.time);
      updateLeaderboard();
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
  }
}

function updateBoard() {
  let board = document.getElementById("board");
  board.innerHTML = "";
  shuffledCards.forEach((card, index) => {
    let cardElement = document.createElement("div");
    cardElement.textContent =
      flippedCards.includes(index) || matchedCards.includes(index)
        ? card
        : "🎴";
    cardElement.addEventListener("click", () => flipCard(index));
    board.appendChild(cardElement);
  });

  document.getElementById("moves").textContent = moves;
}

function updateTime() {
  let currentTime = Date.now();
  let elapsedTime = Math.floor((currentTime - startTime) / 1000);
  document.getElementById(
    "time"
  ).textContent = `Tiempo: ${elapsedTime} segundos`;
}

function updateLeaderboard() {
  let leaderboardElement = document
    .getElementById("leaderboard")
    .querySelector("tbody");
  leaderboardElement.innerHTML = "";
  leaderboard.forEach((player, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}. ${player.name}</td><td>${
      player.time
    }</td>`;
    leaderboardElement.appendChild(row);
  });
}

startGame();
