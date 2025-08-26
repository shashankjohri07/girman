// basic board + scores
let gameGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
let currentPoints = 0;
let topPoints = parseInt(localStorage.getItem("topPoints")) || 0;

// pick a random khali cell
function pickEmptySpot() {
  const spaces = [];
  gameGrid.forEach((row, rowIdx) =>
    row.forEach((val, colIdx) => {
      if (val === 0) spaces.push([rowIdx, colIdx]);
    })
  );
  return spaces[Math.floor(Math.random() * spaces.length)];
}

// add new number (2 or kabhi kabhi 4)
function dropNewNumber() {
  const pos = pickEmptySpot();
  if (pos) gameGrid[pos[0]][pos[1]] = Math.random() < 0.9 ? 2 : 4;
}

// start/reset game
function startGame() {
  gameGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
  currentPoints = 0;
  dropNewNumber();
  dropNewNumber();
  drawGrid();
}

// tile colors
function tileColor(val) {
  const shades = {
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
  return shades[val] || "bg-black text-white";
}

// render full board
function drawGrid() {
  const wrap = document.getElementById("game-board");
  wrap.innerHTML = "";

  gameGrid.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val !== 0) {
        const box = document.createElement("div");
        box.className =
          `absolute flex items-center justify-center w-[110px] h-[110px] rounded-lg font-bold transition-transform duration-200 ${tileColor(val)}`;
        box.style.transform = `translate(${c * 121}px, ${r * 121}px)`;
        box.textContent = val;
        wrap.appendChild(box);
      }
    })
  );

  document.getElementById("current-score").textContent = currentPoints;
  document.getElementById("best-score").textContent = topPoints;
}

// merge row logic
function squishRow(row) {
  let arr = row.filter(v => v !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      currentPoints += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(v => v !== 0);
  while (arr.length < 4) arr.push(0);
  return arr;
}

// rotate helpers
function turnRight() {
  gameGrid = gameGrid[0].map((_, i) => gameGrid.map(row => row[i]).reverse());
}

function turnLeft() {
  gameGrid = gameGrid[0].map((_, i) => gameGrid.map(row => row[3 - i]));
}

// move grid
function makeMove(dir) {
  let prev = JSON.stringify(gameGrid);

  for (let i = 0; i < dir; i++) turnRight();
  gameGrid = gameGrid.map(r => squishRow(r));
  for (let i = 0; i < (4 - dir) % 4; i++) turnRight();

  if (JSON.stringify(gameGrid) !== prev) {
    dropNewNumber();
    if (currentPoints > topPoints) {
      topPoints = currentPoints;
      localStorage.setItem("topPoints", topPoints);
    }
  }
  drawGrid();
}

// keys
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") makeMove(0);
  if (e.key === "ArrowUp") makeMove(3);   // 🔄 was 1
  if (e.key === "ArrowRight") makeMove(2);
  if (e.key === "ArrowDown") makeMove(1); // 🔄 was 3
});

// reset btn
document.getElementById("new-game").addEventListener("click", startGame);

// init
startGame();
