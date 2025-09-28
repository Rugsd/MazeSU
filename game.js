// Egyszerű rács-alapú labirintus játék
// Nyilakkal irányítható, több pálya, célmezőre lépés -> következő pálya

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const levelLabel = document.getElementById('levelLabel');
const resetBtn = document.getElementById('resetBtn');

// GRID MÉRETE: NxN cella
const GRID_SIZE = 15; // cellák száma egy sorban
const TILE = Math.floor(canvas.width / GRID_SIZE);

// Pályák: 0 = üres, 1 = fal, S = start, G = goal
const LEVELS = [
  [
    "111111111111111",
    "1S0000000000001",
    "101110111011101",
    "100010001000001",
    "111011101110111",
    "100000000000001",
    "101111111011101",
    "100000000000001",
    "111011101110111",
    "100010001000001",
    "101110111011101",
    "100000000000000",
    "111111011111101",
    "10000000000000G",
    "111111111111111"
  ],
  [
    "111111111111111",
    "1S0001110000001",
    "101010101011101",
    "100010001000001",
    "111011101110111",
    "100000000000001",
    "101111111011101",
    "100001000100001",
    "111011101110111",
    "100010000010001",
    "101110111011101",
    "100000000000001",
    "101111111111101",
    "10000000000000G",
    "111111111111111"
  ],
  [
    "111111111111111",
    "1S0000000000001",
    "101111011111101",
    "100000000000001",
    "111011101110111",
    "100010001000001",
    "101010101010101",
    "100000100000001",
    "111111111011111",
    "100000000000001",
    "101111011111101",
    "100000000000001",
    "101111111111101",
    "10000000000000G",
    "111111111111111"
  ]
];

// játék állapota
let currentLevel = 0;
let map = [];
let player = { x: 1, y: 1 }; // kezdeti érték felülíródik initLevel-ben

function initLevel(index) {
  const raw = LEVELS[index];
  map = raw.map(r => r.split(''));
  // keresd meg S-t és állítsd be a játékost
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'S') {
        player.x = x;
        player.y = y;
        map[y][x] = '0';
      }
      if (map[y][x] === 'G') {
        // cél mezőt 'G' marad, de rajzoláskor kezeljük
      }
    }
  }
  levelLabel.textContent = Pálya: ${index + 1} / ${LEVELS.length};
  draw();
}

function isWalkable(x, y) {
  if (y < 0 || x < 0 || y >= map.length || x >= map[0].length) return false;
  const cell = map[y][x];
  return cell === '0' || cell === 'G';
}

function tryMove(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (isWalkable(nx, ny)) {
    player.x = nx;
    player.y = ny;
    checkGoal();
    draw();
  } else {
    // ütközés: kis vizuális rezgés lehet majd (opcionális)
  }
}

function checkGoal() {
  if (map[player.y][player.x] === 'G') {
    currentLevel++;
    if (currentLevel >= LEVELS.length) {
      // vége a játéknak — vissza az első pályára
      setTimeout(() => {
        alert('Gratulálok! Teljesítetted az összes pályát. Újra kezdjük az elejéről.');
        currentLevel = 0;
        initLevel(currentLevel);
      }, 100);
    } else {
      setTimeout(() => {
        alert(Átléptél a következő pályára! (${currentLevel + 1}));
        initLevel(currentLevel);
      }, 100);
    }
  }
}

function draw() {
  // tisztítás
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // minden cella lerajzolása
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = (map[y] && map[y][x]) ? map[y][x] : '1';
      const px = x * TILE;
      const py = y * TILE;
      if (cell === '1') {
        // fal
        ctx.fillStyle = '#0d1b2a';
        ctx.fillRect(px, py, TILE, TILE);
        // kicsi textúra
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.fillRect(px+2, py+2, TILE-4, TILE-4);
      } else if (cell === '0') {
        // padló
        ctx.fillStyle = '#071426';
        ctx.fillRect(px, py, TILE, TILE);
      } else if (cell === 'G') {
        // cél
        ctx.fillStyle = '#08360d';
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = '#1bd14a';
        ctx.fillRect(px + TILE*0.15, py + TILE*0.15, TILE*0.7, TILE*0.7);
      }
      // rácsvonal
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.strokeRect(px, py, TILE, TILE);
    }
  }

  // játékos
  const px = player.x * TILE;
  const py = player.y * TILE;
  ctx.fillStyle = '#074078';
  ctx.fillRect(px + TILE*0.12, py + TILE*0.12, TILE*0.76, TILE*0.76);
  // szemek
  ctx.fillStyle = '#fff';
  ctx.fillRect(px + TILE*0.28, py + TILE*0.32, TILE*0.08, TILE*0.08);
  ctx.fillRect(px + TILE*0.6, py + TILE*0.32, TILE*0.08, TILE*0.08);
}

function onKey(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'Up':
      tryMove(0, -1);
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 'Down':
      tryMove(0, 1);
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'Left':
      tryMove(-1, 0);
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'Right':
      tryMove(1, 0);
      e.preventDefault();
      break;
    case 'r':
    case 'R':
      initLevel(currentLevel);
      break;
  }
}

resetBtn.addEventListener('click', () => initLevel(currentLevel));
window.addEventListener('keydown', onKey);

// fókusz a canvasra, hogy nyilakkal lehessen irányítani kattintás nélkül
canvas.addEventListener('click', () => canvas.focus());
canvas.setAttribute('tabindex', '0');

// indítás
initLevel(currentLevel);
