// script.js

const size = 4;
let board = [];
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let prevState = null;

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const boardEl = document.getElementById("board");
const newGameBtn = document.getElementById("new-game");

// ---------------- Core Game Logic ---------------- //
function initBoard() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  addRandomTile();
  addRandomTile();
  render();
}

function addRandomTile() {
  const empty = [];
  board.forEach((row, r) => row.forEach((val, c) => val === 0 && empty.push([r, c])));
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  row = row.filter(v => v); // remove 0s
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(v => v);
  while (row.length < size) row.push(0);
  return row;
}

function rotate(times = 1) {
  for (let t = 0; t < times; t++) {
    board = board.map((_, r) => board.map(row => row[r]).reverse());
  }
}

function move(dir) {
  prevState = JSON.stringify(board);
  if (dir === "left") {
    board = board.map(slide);
  } else if (dir === "right") {
    board = board.map(row => slide(row.reverse()).reverse());
  } else if (dir === "up") {
    rotate(3);
    board = board.map(slide);
    rotate(1);
  } else if (dir === "down") {
    rotate(1);
    board = board.map(slide);
    rotate(3);
  }
  if (prevState !== JSON.stringify(board)) {
    addRandomTile();
    render();
    checkGameOver();
  }
}

function undo() {
  if (prevState) {
    board = JSON.parse(prevState);
    render();
  }
}

function checkGameOver() {
  if (board.flat().includes(0)) return;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        (c < size - 1 && board[r][c] === board[r][c + 1]) ||
        (r < size - 1 && board[r][c] === board[r + 1][c])
      ) {
        return;
      }
    }
  }
  alert("Game Over!");
  initBoard();
}

// ---------------- UI Rendering ---------------- //
function render() {
  boardEl.innerHTML = "";
  board.forEach(row => {
    row.forEach(val => {
      const tile = document.createElement("div");
      tile.className = `tile value-${val}`;
      tile.textContent = val > 0 ? val : "";
      boardEl.appendChild(tile);
    });
  });
  scoreEl.textContent = score;
  bestScore = Math.max(bestScore, score);
  bestEl.textContent = bestScore;
  localStorage.setItem("bestScore", bestScore);
}

// ---------------- Controls ---------------- //
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "u") undo(); // press 'u' to undo
});

newGameBtn.addEventListener("click", initBoard);

// ---------------- Start ---------------- //
initBoard();
