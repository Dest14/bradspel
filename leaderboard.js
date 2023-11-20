
document.addEventListener('DOMContentLoaded', function () {
  const matchHistoryBody = document.getElementById('matchHistoryBody');
  displayMatchHistory();

  function displayMatchHistory() {
    const row = document.createElement('tr');
    row.innerHTML = ``;
    matchHistoryBody.appendChild(row);
  }
});





document.addEventListener('DOMContentLoaded', function () {
  const leaderboardBody = document.getElementById('leaderboardBody');
  displayLeaderboard();

  function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
    leaderboard.sort((a, b) => a.rounds - b.rounds);

    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.name}</td><td>${entry.rounds}</td><td>${playerNames[0].name}</td> <td>${playerNames[1].name}</td>`;
      leaderboardBody.appendChild(row);
    });
  }

  function updateLeaderboard(winnerName, rounds, p1, p2) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
    leaderboard.push({ name: winnerName, rounds: rounds, name: p1, name: p2 });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    localStorage.setItem("playerNames", JSON.stringify(playerNames));

    displayLeaderboard();
  }

  function resetLeaderboard() {
    localStorage.removeItem('leaderboard');
    displayLeaderboard();
  }
  document.getElementById('resetLeaderboardButton').addEventListener('click', resetLeaderboard);


  function endGame(draw) {
    if (draw) {
      winningMessageTextElement.innerText = 'Draw!';
    } else {
      const winnerName = circleTurn ? playerNames[1].name : playerNames[0].name;
      const winnerSymbol = circleTurn ? playerNames[1].symbol : playerNames[0].symbol;
      winningMessageTextElement.innerText = `${winnerName}'s (${winnerSymbol}) wins!`;


      updateLeaderboard(winnerName, round, p1, p2);
    }
    winningMessageElement.classList.add('show');
    updateRoundCount();
  }
});
