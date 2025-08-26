const size = 4;
let board = [];
let score = 0;
let best = localStorage.getItem("best") || 0;

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const boardEl = document.getElementById("board");
const newGameBtn = document.getElementById("new-game");

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  addTile();
  addTile();
  render();
}

function addTile() {
  let empty = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (!cell) empty.push([i, j]);
    })
  );
  if (empty.length) {
    let [x, y] = empty[Math.floor(Math.random() * empty.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function render() {
  boardEl.innerHTML = "";
  board.forEach(row =>
    row.forEach(val => {
      const tile = document.createElement("div");
      tile.className = "tile" + (val ? " value-" + val : "");
      tile.textContent = val || "";
      boardEl.appendChild(tile);
    })
  );
  scoreEl.textContent = score;
  best = Math.max(best, score);
  bestEl.textContent = best;
  localStorage.setItem("best", best);
}

function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(v => v).concat(Array(size).fill(0)).slice(0, size);
}

function moveLeft() {
  let changed = false;
  for (let i = 0; i < size; i++) {
    const newRow = slide(board[i]);
    if (newRow.toString() !== board[i].toString()) {
      board[i] = newRow;
      changed = true;
    }
  }
  if (changed) afterMove();
}

function moveRight() {
  rotateBoard(180);
  moveLeft();
  rotateBoard(180);
}

function moveUp() {
  rotateBoard(270);
  moveLeft();
  rotateBoard(90);
}

function moveDown() {
  rotateBoard(90);
  moveLeft();
  rotateBoard(270);
}

function rotateBoard(deg) {
  for (let r = 0; r < deg / 90; r++) {
    board = board[0].map((_, i) => board.map(row => row[i]).reverse());
  }
}

function afterMove() {
  addTile();
  render();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "ArrowUp") moveUp();
  if (e.key === "ArrowDown") moveDown();
});

newGameBtn.addEventListener("click", init);

init();
