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
let round = 0;
let movesX = 0;
let movesO = 0;
let playerNames;
let allowMove = true; // Added variable to control moves
let allowMoveExisting = true; // Added variable to control moving existing marks
const MAX_MOVES = 3;

startGame();

function startGame() {
  playerNames = JSON.parse(localStorage.getItem("playerNames")) || [{ name: 'Player 1' }, { name: 'Player 2' }];
  round = 0;
  circleTurn = false;
  resetMoves();
  clearBoard();
  setBoardHoverClass();
  hideWinningMessage();
  updateRoundCount();
  addCellEventListeners();
  allowMove = true; // Reset allowMove to true
  allowMoveExisting = true; // Reset allowMoveExisting to true
}

function resetMoves() {
  movesX = 0;
  movesO = 0;
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

function addCellEventListeners() {
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  if (allowMove) {
    if ((currentClass === X_CLASS && movesX < MAX_MOVES) || (currentClass === CIRCLE_CLASS && movesO < MAX_MOVES)) {
      placeMark(cell, currentClass);

      if (checkWin(currentClass)) {
        endGame();
        round += 1;
      } else if (isDraw()) {
        endGame(true);
      } else {
        swapTurns();
        setBoardHoverClass();
      }
    } else if (allowMoveExisting && (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS))) {
      moveExistingMark(cell, currentClass);
      roundUp();
      updateRoundCount();
      allowMove = true; // Reset allowMove to true after placing or moving a mark
    }

    roundUp();
    updateRoundCount();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);

  if (currentClass === X_CLASS) {
    movesX += 1;
  } else {
    movesO += 1;
  }
}

function moveExistingMark(cell, currentClass) {
  const existingClass = cell.classList.contains(X_CLASS) ? X_CLASS : CIRCLE_CLASS;
  if (existingClass === currentClass) {
    cell.classList.remove(existingClass);
    cell.classList.add(currentClass);
  }
  allowMove = false;
}

function endGame(draw) {
  const winnerName = circleTurn ? playerNames[1].name : playerNames[0].name;
  displayWinningMessage(draw ? 'Draw!' : `${winnerName} Wins!`);
  updateLeaderboard(winnerName, round);

  // Remove previous event listener for the restart button
  restartButton.removeEventListener('click', startGame);

  // Add event listener for the restart button after the game ends
  restartButton.addEventListener('click', function () {
    winningMessageElement.classList.remove('show');
    allowMove = true; // Reset allowMove to true
    allowMoveExisting = true; // Reset allowMoveExisting to true
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

function roundUp() {
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
