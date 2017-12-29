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
