const gridSize = 4;
let board = [];
let score = 0;

const tilesLayer = document.querySelector(".tiles");
const scoreEl = document.getElementById("score");
const newGameBtn = document.getElementById("newGame");

function init() {
  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  score = 0;
  scoreEl.textContent = score;
  tilesLayer.innerHTML = "";
  addRandomTile();
  addRandomTile();
  render();
}

function addRandomTile() {
  let empty = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (!empty.length) return;
  let { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  tilesLayer.innerHTML = "";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let value = board[r][c];
      if (value) {
        const tile = document.createElement("div");
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        tile.style.top = `${r * 120}px`;
        tile.style.left = `${c * 120}px`;
        tilesLayer.appendChild(tile);
      }
    }
  }
  scoreEl.textContent = score;
}

function move(direction) {
  let rotated = false, flipped = false;

  if (direction === "up") { board = rotateLeft(board); }
  if (direction === "down") { board = rotateRight(board); }
  if (direction === "right") { board = board.map(row => row.reverse()); flipped = true; }

  let moved = false;
  let newBoard = board.map(row => {
    let arr = row.filter(v => v);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(v => v);
    while (arr.length < gridSize) arr.push(0);
    if (arr.toString() !== row.toString()) moved = true;
    return arr;
  });

  if (flipped) newBoard = newBoard.map(row => row.reverse());
  if (direction === "up") newBoard = rotateRight(newBoard);
  if (direction === "down") newBoard = rotateLeft(newBoard);

  if (moved) {
    board = newBoard;
    addRandomTile();
    render();
  }
}

function rotateLeft(m) {
  return m[0].map((_, i) => m.map(row => row[gridSize - 1 - i]));
}

function rotateRight(m) {
  return m[0].map((_, i) => m.map(row => row[i]).reverse());
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
});

newGameBtn.addEventListener("click", init);

init();
