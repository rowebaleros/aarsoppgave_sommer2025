let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

function createBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => handleMove(index));
        boardElement.appendChild(cellElement);
    });
}

function handleMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        createBoard();
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.getElementById("winner").textContent = `${board[a]} wins!`;
            updateScore(board[a]);
            gameActive = false;
            return;
        }
    }

    if (!board.includes('')) {
        document.getElementById("winner").textContent = "It's a draw!";
        gameActive = false;
    }
}

function updateScore(winner) {
    fetch("/update_score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ winner })
    }).then(() => fetchScores());
}

function fetchScores() {
    fetch("/get_scores")
        .then(response => response.json())
        .then(data => {
            document.getElementById("scoreX").textContent = data.player_x_wins;
            document.getElementById("scoreO").textContent = data.player_o_wins;
        });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById("winner").textContent = '';
    createBoard();
}

createBoard();
fetchScores();