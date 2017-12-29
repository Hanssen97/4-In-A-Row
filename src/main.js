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

// main
window.onload = function () {
  setup();
  render();
};

// setup
function setup() {
  canvas = document.getElementById("board");
  ctx    = canvas.getContext("2d");

  constructGrid();

  canvas.addEventListener("click", (e) => play(e), false);
}

// Tile
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

// play
function play(e) {

}

// constructGrid
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

// render
function render() {
  renderHTML();
  renderTiles();
}
// renderHTML
function renderHTML() {
  document.getElementById("s1").innerHTML = gamestate.score[0];
  document.getElementById("s2").innerHTML = gamestate.score[1];
}
// renderTiles
function renderTiles() {
  gamestate.tiles.map(tiles => tiles.map(tile => tile.render()));
}
