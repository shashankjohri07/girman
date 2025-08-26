// Board setup
let board = Array.from({ length: 4 }, () => Array(4).fill(0));
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;

// Utility: get random empty cell
function randomEmptyCell() {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) empty.push([r, c]);
    })
  );
  return empty[Math.floor(Math.random() * empty.length)];
}

// Add new tile (2 or 4)
function addTile() {
  const cell = randomEmptyCell();
  if (cell) board[cell[0]][cell[1]] = Math.random() < 0.9 ? 2 : 4;
}

// Reset game
function newGame() {
  board = Array.from({ length: 4 }, () => Array(4).fill(0));
  score = 0;
  addTile();
  addTile();
  render();
}

// Tile color classes
function getTileClass(value) {
  const colors = {
    2: "bg-yellow-100 text-gray-800",
    4: "bg-yellow-200 text-gray-800",
    8: "bg-orange-400 text-white",
    16: "bg-orange-500 text-white",
    32: "bg-orange-600 text-white",
    64: "bg-red-500 text-white",
    128: "bg-green-400 text-white text-lg",
    256: "bg-green-500 text-white text-lg",
    512: "bg-green-600 text-white text-lg",
    1024: "bg-blue-500 text-white text-xl",
    2048: "bg-purple-600 text-white text-xl font-bold",
  };
  return colors[value] || "bg-black text-white";
}

// Render board
function render() {
  const container = document.getElementById("game-board");
  container.innerHTML = "";

  board.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val !== 0) {
        const tile = document.createElement("div");
        tile.className =
          `absolute flex items-center justify-center w-[110px] h-[110px] rounded-lg font-bold transition-transform duration-200 ${getTileClass(val)}`;
        tile.style.transform = `translate(${c * 121}px, ${r * 121}px)`;
        tile.textContent = val;
        container.appendChild(tile);
      }
    })
  );

  document.getElementById("current-score").textContent = score;
  document.getElementById("best-score").textContent = bestScore;
}

// Move + Merge
function slide(row) {
  let arr = row.filter(v => v !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(v => v !== 0);
  while (arr.length < 4) arr.push(0);
  return arr;
}

function rotateClockwise() {
  board = board[0].map((_, i) => board.map(row => row[i]).reverse());
}

function rotateCounterClockwise() {
  board = board[0].map((_, i) => board.map(row => row[3 - i]));
}

// Move board in direction
function move(direction) {
  let oldBoard = JSON.stringify(board);

  for (let i = 0; i < direction; i++) rotateClockwise();
  board = board.map(row => slide(row));
  for (let i = 0; i < (4 - direction) % 4; i++) rotateClockwise();

  if (JSON.stringify(board) !== oldBoard) {
    addTile();
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }
  }
  render();
}

// Key Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move(0);
  if (e.key === "ArrowUp") move(1);
  if (e.key === "ArrowRight") move(2);
  if (e.key === "ArrowDown") move(3);
});

// New game button
document.getElementById("new-game").addEventListener("click", newGame);

// Init
newGame();
