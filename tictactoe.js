const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
let circleTurn;
let cellArray = [];
let round = 0;
let playerNames;

startGame();

function startGame() {
  playerNames = JSON.parse(localStorage.getItem("playerNames")) || [{ name: 'Player 1' }, { name: 'Player 2' }];
  round = 0;
  circleTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
    hideWinningMessage();
    updateRoundCount();
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  if (cellEmpty(cell)) {
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
      endGame();
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
    incrementRound();
    updateRoundCount();
  }
}

function cellEmpty(cell) {
  return !(cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS));
}

function clearBoard() {
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
  });
}

function hideWinningMessage() {
  winningMessageElement.classList.remove('show');
}

function placeMark(cell, currentClass) {
  cellArray.push(cell);
  cell.classList.add(currentClass);
  if (cellArray.length > 6) {
    const firstCell = cellArray.shift();
    firstCell.classList.remove(currentClass);
  }
}

function endGame(draw) {
  const winnerName = draw ? 'Draw' : (circleTurn ? playerNames[1].name : playerNames[0].name);
  displayWinningMessage(`${winnerName} Wins!`);
  updateLeaderboard(winnerName, round);
  restartButton.removeEventListener('click', startGame);

  restartButton.addEventListener('click', function () {
    winningMessageElement.classList.remove('show');
    startGame();
    updateLeaderboard(winnerName, round);
  });
}

function displayWinningMessage(message) {
  winningMessageTextElement.innerText = message;
  winningMessageElement.classList.add('show');
  updateRoundCount();
}

function isDraw() {
  return [...cellElements].every(cell => cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS));
}

function incrementRound() {
  round += 1;
}

function updateRoundCount() {
  document.getElementById("round").innerHTML = round;
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => combination.every(index => cellElements[index].classList.contains(currentClass)));
}

function updateLeaderboard(winnerName, rounds) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: winnerName, rounds: rounds });
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardBody = document.getElementById('leaderboardBody');
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.sort((a, b) => a.rounds - b.rounds);
  leaderboard.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${entry.name}</td><td>${entry.rounds}</td>`;
    leaderboardBody.appendChild(row);
  });
}

restartButton.addEventListener('click', startGame);

//tictac toe.js