const { next } = require("cheerio/lib/api/traversing");

function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return (x == j && y == k) ? true : false;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  if (!cell) return false;

  for (let arr of this) {
    if ((arr[0] === cell[0]) && (arr[1] === cell[1])) return true;
  }

  return false;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return '\u25A3';
  } else {
    return '\u25A2';
  }
};

const corners = (state = []) => {

  if (state.length === 0) return { bottomLeft: [0, 0], topRight: [0, 0] };

  let minX = state[0][0];
  let maxX = state[0][0];
  let minY = state[0][1];
  let maxY = state[0][1];

  for (let arr of state) {
    // X
    if (arr[0] > maxX) maxX = arr[0];
    if (arr[0] < minX) minX = arr[0];

    // Y
    if (arr[1] > maxY) maxY = arr[1];
    if (arr[1] < minY) minY = arr[1];
  }

  return { bottomLeft: [minX, minY], topRight: [maxX, maxY] };
};

const printCells = (state) => {
  let print = "";
  for (let y = corners(state).topRight[1]; y >= corners(state).bottomLeft[1]; y--) {
    for (let x = corners(state).bottomLeft[0]; x <= corners(state).topRight[0]; x++) {
      print = print + printCell([x, y], state) + " ";
    }
    print = print + "\n";
  }

  return print;
};

const getNeighborsOf = ([x, y]) => {
  return [[x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
};

const getLivingNeighbors = (cell, state) => {
  let neighbours = getNeighborsOf(cell);
  let livingNeighbors = []
  let containsBind = contains.bind(state);

  for (let neighbour of neighbours) {
    if (containsBind(neighbour)) {
      livingNeighbors.push(neighbour)
    }
  }

  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  if (getLivingNeighbors(cell, state).length === 3) {
    return true;
  }

  if (contains.call(state, cell) && getLivingNeighbors(cell, state).length === 2) {
    return true;
  }

  return false
};

const calculateNext = (state) => {
  let nextState = [];
  let nextBottomLeft = [corners(state).bottomLeft[0] - 1, [corners(state).bottomLeft[1] - 1]]
  let nextTopRight = [corners(state).topRight[0] + 1, [corners(state).topRight[1] + 1]]

  for (let i = nextBottomLeft[1]; i <= nextTopRight[1]; i++) {
    for (let j = nextBottomLeft[0]; j <= nextTopRight[0]; j++) {
      if (willBeAlive([j, i], state)) nextState.push([j, i]);
    }
  }

  return nextState;
};

const iterate = (state, iterations) => {
  let gameStates = []
  gameStates.push(state);

  for (let i = 0; i < iterations; i++) {
    gameStates.push(calculateNext(gameStates[i]));
  }

  return gameStates;
};

const main = (pattern, iterations) => {
  if (pattern === 'rpentomino') {
    doStuff(startPatterns.rpentomino, iterations);
  }
  if (pattern === 'glider') {
    doStuff(startPatterns.glider, iterations);
  }
  if (pattern === 'square') {
    doStuff(startPatterns.square, iterations);
  }
};

function doStuff(state, iterations) {
  let states = iterate(state, iterations);
  let output = '';

  for (state of states) {
    output = output + printCells(state) + '\n';
  }

  console.log(output);
}

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;