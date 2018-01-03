"use strict";

// Globals
var canvas, ctx;
var gamestate = {
  turn:           0,
  tiles:         [],
  score:      [0,0],
  perception: [0,0],
};


// Constants
const SEARCHDEPTH =   4;
const COLORS = {
  grey:   "#E4F1FE",
  player: "#19B5FE",
  ai:     "#00E640",
};
const DIMENTIONS = {
  grid: {
    height: 6,
    width:  7,
  }
}
const TILESIZE = 100;


// main ------------------------------------------------------------------------
window.onload = function () {
  setup();
  render();
};

// setup -----------------------------------------------------------------------
function setup() {
  canvas = document.getElementById("board");
  ctx    = canvas.getContext("2d");

  constructGrid();

  canvas.addEventListener("click", (e) => play(e), false);
}

// Tile ------------------------------------------------------------------------
function Tile(x, y) {
  this.x      =   x;
  this.y      =   y;
  this.player = -10;

  this.render = () => {
    switch (this.player) {
      case -10:
        ctx.fillStyle = COLORS.grey;
        break;
      case 0:
        ctx.fillStyle = COLORS.player;
        break;
      case 1:
        ctx.fillStyle = COLORS.ai;
        break;
    }
    ctx.rect(this.x, this.y, TILESIZE, TILESIZE);
    ctx.fillRect(x, this.y, TILESIZE, TILESIZE);
    ctx.stroke();
  };
}

// play ------------------------------------------------------------------------
function play(e) {
  if (gamestate.turn % 2 !== 0) return;

  let tile = doMove(gamestate, getIndex(e));
  if (tile === -1) return; // Illegal move

  checkWin(tile);
  ++gamestate.turn;

  // Check move consequence and render.
  render();

  // Run AI, check move consequence, and render.
    setTimeout(() => ai(), 300);

}

// move ------------------------------------------------------------------------
function doMove(state, index) {
  let i = 0, column = state.tiles[index];
  if (column[i++].player !== -10) return -1;

  for (; i < column.length; ++i) {
    if (column[i].player !== -10) break;
  }

  column[--i].player = state.turn % 2;

  return column[i];
}

// checkWin --------------------------------------------------------------------
function checkWin(tile) {
  let winner = validate(gamestate, tile);
  if (winner !== -10) win(winner);
}

// validate --------------------------------------------------------------------
function validate(state, tile) {
  if      (validateRow(state, tile)          > 3) return state.turn % 2;
  else if (validateColumn(state, tile)       > 3) return state.turn % 2;
  else if (validateDiagonalUp(state, tile)   > 3) return state.turn % 2;
  else if (validateDiagonalDown(state, tile) > 3) return state.turn % 2;

  // No winner.
  return -10;
}

// validateRow ----------------------------------------------------------------
function validateRow(state, tile) {
  let x = tile.x/TILESIZE,   y = tile.y/TILESIZE,   sum = 0;

  do { ++x }
  while ((x < state.tiles.length) && (state.tiles[x][y].player === tile.player))
  --x;

  while ((x >= 0) && (state.tiles[x][y].player === tile.player)) {
    ++sum; x--;
  }

  return sum;
}

// validateCol -----------------------------------------------------------------
function validateColumn(state, tile) {
  let x = tile.x/TILESIZE,   y = tile.y/TILESIZE,   sum = 0;

  do { ++y }
  while ((y < state.tiles[0].length) && (state.tiles[x][y].player === tile.player))
  --y;

  while ((y >= 0) && (state.tiles[x][y].player === tile.player)) {
    ++sum; y--;
  }

  return sum;
}

// validateDiagonalUp ----------------------------------------------------------
function validateDiagonalUp(state, tile) {
  let x = tile.x/TILESIZE,   y = tile.y/TILESIZE,   sum = 0;

  do { ++y; --x; }
  while (
            (y < state.tiles[0].length) &&
            (x >= 0) &&
            (state.tiles[x][y].player === tile.player)
        )
  --y; ++x;

  while (
            (y >= 0) &&
            (x < state.tiles.length) &&
            (state.tiles[x][y].player === tile.player)) {
    ++sum; --y; ++x;
  }

  return sum;
}

// validateDiagonalUp ----------------------------------------------------------
function validateDiagonalDown(state, tile) {
  let x = tile.x/TILESIZE,   y = tile.y/TILESIZE,   sum = 0;

  do { --y; --x; }
  while (
            (y >= 0) &&
            (x >= 0) &&
            (state.tiles[x][y].player === tile.player)
        )
  ++y; ++x;

  while (
            (y < state.tiles[0].length) &&
            (x < state.tiles.length) &&
            (state.tiles[x][y].player === tile.player)) {
    ++sum; ++y; ++x;
  }

  return sum;
}

// win -------------------------------------------------------------------------
function win(player) {
  ++gamestate.score[player];
  gamestate.perception = [0,0];
  setTimeout(() => {constructGrid(); render();}, 3000);
}


// constructGrid ---------------------------------------------------------------
function constructGrid() {
  gamestate.tiles = [];
  for (let i = 0; i < DIMENTIONS.grid.width; ++i) {
    let column = [];
    for (let k = 0; k < DIMENTIONS.grid.height; ++k) {
      let tile = new Tile(i*TILESIZE, k*TILESIZE);
      column.push(tile);
    }
    gamestate.tiles.push(column);
  }
}

// render ----------------------------------------------------------------------
function render() {
  renderHTML();
  renderTiles();
}
// renderHTML ------------------------------------------------------------------
function renderHTML() {
  document.getElementById("s1").innerHTML = gamestate.score[0];
  document.getElementById("s2").innerHTML = gamestate.score[1] + "   ( " + gamestate.perception[1] + " )";
}
// renderTiles -----------------------------------------------------------------
function renderTiles() {
  gamestate.tiles.map(tiles => tiles.map(tile => tile.render()));
}

// getIndex --------------------------------------------------------------------
function getIndex(e){
    let totalOffsetX   = 0;
    let currentElement = canvas;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    } while (currentElement = currentElement.offsetParent);

    return Math.floor( (event.pageX - totalOffsetX) / TILESIZE );
}

// ai --------------------------------------------------------------------------
function ai() {
  let bestMoves = getBestMoves(gamestate);
  let nextMove  = bestMoves[Math.floor(Math.random()*bestMoves.length)];

  // Move is initiated.
  let tile = doMove(gamestate, nextMove.x);

  gamestate.perception[gamestate.turn % 2] = Math.round(nextMove.score);

  // // Check move consequence and render.
  checkWin(tile);
  render();

  ++gamestate.turn;

  // UNCOMMENT TO LET THE AI PLAY AGAINST ITSELF AFTER FIRST HUMAN MOVE.
     //setTimeout(() => ai(), 220);
}

// getBestMoves -----------------------------------------------------------------
function getBestMoves(s, depth = 0) {
  let bestMoves = [{score:0, x:-1}];
  if (depth > SEARCHDEPTH) return bestMoves; // Deepest point in the path.

  let gPlayer = gamestate.turn % 2; // Global current player.

  if (depth === 0 ) {
    // This is the root node, so we minimize the score and init the ret array.
    bestMoves[0].score = -1000000000;
  } else {
    ++s.turn;
  }

  for (let x = 0; x < DIMENTIONS.grid.width; ++x) {
    let state = JSON.parse(JSON.stringify(s));  // Immutable copy the state.

    let tile = doMove(state, x);
    if (tile === -1) continue; // Illegal move

    let winner = validate(state, tile);

    // If there is a winner, return the move with a score based on the formula.
    if      ( winner == gPlayer )     return [{score:(Math.pow(2,(SEARCHDEPTH-depth)/2)), x}];
    else if ( winner == +(!gPlayer) ) return [{score:(Math.pow(3,(SEARCHDEPTH-depth))*-1), x}];


    let move = getBestMoves(state, depth+1); // Validate best path for this node.


    if (depth === 0) {
      //console.log("current move: ", {score:move.score, x}, " vs bestMove: ", bestMove);
      // This is the root node, so we compare this move with the best one soo far.
      if (move[0].score > bestMoves[0].score) {
        // This move is better than the current best, so we clear the previous
        //   entries and insert this move as the best one.
        bestMoves = [{score:move[0].score, x}];
      } else if (move[0].score === bestMoves[0].score) {
        // This move is equally as good as our current best, so we insert this move.
        bestMoves.push({score:move[0].score, x});
      }
    } else {
      // This is a possible play, so we score the play based on this move.
      bestMoves[0].score += move[0].score;
    }
  }
  //if (depth === 0) return bestMoves; // This is the root node so we return the list.

  return bestMoves; // This is a path so we return the best move for this path.
}
