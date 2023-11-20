
document.addEventListener('DOMContentLoaded', function () {
  const matchHistoryBody = document.getElementById('matchHistoryBody');
  displayMatchHistory();

  function displayMatchHistory() {
    const playerNames = JSON.parse(localStorage.getItem("playerNames")) || [{ name: 'Player 1' }, { name: 'Player 2' }];

    const row = document.createElement('tr');
    row.innerHTML = `<td>${playerNames[0].name}</td> <td>${playerNames[1].name}</td>`;
    matchHistoryBody.appendChild(row);
  }
});

//js file






