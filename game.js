const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);
document.addEventListener('keydown', ActionKey);

const colors = [
  null,
  '#e06c75',
  '#c678dd',
  '#56b6c2',
  '#e5c07b',
  '#61afef',
  '#98c379',
  '#e67e22'
];

const arena = createMatrix(12, 20);

const player = {
  score: 0,
  matrix: null,
  pos: {
    x: 5,
    y: 5,
  },
};

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    player.score += rowCount * 10;
    rowCount *= 2;
  }
}

function collide(arena, player) {
  const [ matrix, pos] = [ player.matrix, player.pos ];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0 &&
          (arena[y + pos.y] && arena[y + pos.y][x + pos.x]) !== 0) {
        return true;
      }
    }
  }
}

function createMatrix(width, height) {
  const matrix = [];
  while (height--) {
    matrix.push(new Array(width).fill(0));
  }

  return matrix;
}

function createPiece(type) {
  switch (type) {
    case 'T':
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ];
      break;
    case 'O':
      return [
        [2, 2],
        [2, 2]
      ];
      break;
    case 'L':
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3]
      ];
      break;
    case 'J':
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0]
      ];
      break;
    case 'I':
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0]
      ];
      break;
    case 'S':
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]
      ];
      break;
    case 'Z':
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
      ];
      break;
    default:
      console.error('No Type');
  }
}

function draw() {
  context.fillStyle = '#282c34';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col !== 0) {
        context.fillStyle = colors[col];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = col;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0],length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function update(time = 5) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.getElementById('score').innerText = player.score;
}

function ActionKey(e) {
  switch (e.keyCode) {
    // left
    case 37:
    case 65:
      playerMove(-1);
      break;
    // up
    case 38:
    case 87:
      playerRotate(-1)
      break;
    // right
    case 39:
    case 68:
      playerMove(1);
      break;
    // down
    case 40:
    case 83:
      playerDrop();
      break;
    default:

  }
}

playerReset();
updateScore();
update();
