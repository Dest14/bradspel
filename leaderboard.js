document.addEventListener('DOMContentLoaded', function () {
  const leaderboardBody = document.getElementById('leaderboardBody');
  displayLeaderboard();

  function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.sort((a, b) => a.rounds - b.rounds); // Sort by rounds ascending

    leaderboardBody.innerHTML = '';
    leaderboard.forEach((entry) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.name}</td><td>${entry.rounds}</td>`;
      leaderboardBody.appendChild(row);
    });
  }

  // Add this function to update the leaderboard
  function updateLeaderboard(winnerName, rounds) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: winnerName, rounds: rounds });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard(); // Update the leaderboard display after adding a new entry
  }

  function resetLeaderboard() {
    localStorage.removeItem('leaderboard');
    displayLeaderboard(); // Refresh the displayed leaderboard
  }
  document.getElementById('resetLeaderboardButton').addEventListener('click', resetLeaderboard);

  // Update the endGame function to call updateLeaderboard
  function endGame(draw) {
    if (draw) {
      winningMessageTextElement.innerText = 'Draw!';
    } else {
      const winnerName = circleTurn ? playerNames[1].name : playerNames[0].name;
      const winnerSymbol = circleTurn ? playerNames[1].symbol : playerNames[0].symbol;
      winningMessageTextElement.innerText = `${winnerName}'s (${winnerSymbol}) Wins!`;

      // Update the leaderboard
      updateLeaderboard(winnerName, round);
    }
    winningMessageElement.classList.add('show');
    updateRoundCount();
  }
});
