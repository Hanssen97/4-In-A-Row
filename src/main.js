"use strict";

// Globals
var canvas, ctx;
var gamestate = {
  turn: 0,
  tiles: [],
  score: [0,0],
};


// Constants
const SEARCHDEPTH =   6;
const COLORS = {
  grey:   "#DADFE1",
  orange: "#F39C12",
  purple: "#BF55EC",
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
        ctx.fillStyle = COLORS.orange;
        break;
      case 1:
        ctx.fillStyle = COLORS.purple;
        break;
    }
    ctx.rect(this.x, this.y, TILESIZE, TILESIZE);
    ctx.fillRect(x, this.y, TILESIZE, TILESIZE);
    ctx.stroke();
  };
}

// play ------------------------------------------------------------------------
function play(e) {
  //if (gamestate.turn % 2 !== 0) return;

  let tile = move(gamestate, getIndex(e));
  if (tile === -1) return; // Illegal move

  checkWin(tile);

  render();
  ++gamestate.turn;
}

// move ------------------------------------------------------------------------
function move(state, index) {
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
  let player = gamestate.turn % 2;

  if      (validateRow(state, tile, 0)          === 4) return player;
  else if (validateColumn(state, tile, 0)       === 4) return player;
  else if (validateDiagonalUp(state, tile, 0)   === 4) return player;
  else if (validateDiagonalDown(state, tile, 0) === 4) return player;

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
  setTimeout(() => {constructGrid(); render();}, 100);
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
  document.getElementById("s2").innerHTML = gamestate.score[1];
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
