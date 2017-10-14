const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

// #21252b - darken3Blue
// #282c34 - darken2Blue
// #c678dd - pink
// #e06c75 - red
// #61afef - blue
// #56b6c2 - teal
// #e5c07b - yellow
// #98c379 - green



const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

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
  const row = new Array(width).fill(0);
  while (height--) {
    matrix.push(row);
  }

  return matrix;
}

const arena = createMatrix(12, 20);
console.table(arena);

const player = {
  matrix,
  pos: {
    x: 5,
    y: 5,
  }
};

function draw() {
  context.fillStyle = '#282c34';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col !== 0) {
        context.fillStyle = '#e06c75';
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

  }
  dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
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


document.addEventListener('keydown', ActionKey);

function ActionKey(e) {
  switch (e.keyCode) {
    // left
    case 37:
    case 65:
      player.pos.x--;
      break;
    // up
    case 38:
    case 87:
      player.pos.y--;
      break;
    // right
    case 39:
    case 68:
      player.pos.x++;
      break;
    // down
    case 40:
    case 83:
      playerDrop();
      break;
    default:

  }
}

update();
