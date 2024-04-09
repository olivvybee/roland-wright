import { createCanvas } from "canvas";
import { OUTPUT_SIZE, ROW_COUNT, COLUMN_COUNT } from "./constants";
import { Tile } from "./Tile";
import { Connection } from "./types";

type GridSpace = Tile | undefined;

export class Board {
  grid: GridSpace[][];
  rowCount: number = ROW_COUNT;
  columnCount: number = COLUMN_COUNT;
  hasPlacedTile: boolean;
  boardEdges = {
    "0,1": {north: Connection.Road, east: Connection.None, south: Connection.None, west: Connection.None},
    "0,3": {north: Connection.Rail, east: Connection.None, south: Connection.None, west: Connection.None},
    "0,5": {north: Connection.Road, east: Connection.None, south: Connection.None, west: Connection.None},
    "1,0": {north: Connection.None, east: Connection.None, south: Connection.None, west: Connection.Rail},
    "1,6": {north: Connection.None, east: Connection.Rail, south: Connection.None, west: Connection.None},
    "3,0": {north: Connection.None, east: Connection.None, south: Connection.None, west: Connection.Road},
    "3,6": {north: Connection.None, east: Connection.Road, south: Connection.None, west: Connection.None},
    "5,0": {north: Connection.None, east: Connection.None, south: Connection.None, west: Connection.Rail},
    "5,6": {north: Connection.None, east: Connection.Rail, south: Connection.None, west: Connection.None},
    "6,1": {north: Connection.None, east: Connection.None, south: Connection.Road, west: Connection.None},
    "6,3": {north: Connection.None, east: Connection.None, south: Connection.Rail, west: Connection.None},
    "6,5": {north: Connection.None, east: Connection.None, south: Connection.Road, west: Connection.None},

  };

  constructor() {
    this.hasPlacedTile = false;

    this.grid = [];
    for (let r = 0; r < this.rowCount; r++) {
      const row: GridSpace[] = [];
      for (let c = 0; c < this.columnCount; c++) {
        if (`${r},${c}` in this.boardEdges) {
          row.push(new Tile({north: Connection.None, east: Connection.None, south: Connection.None, west: Connection.None}, this.boardEdges[`${r},${c}`]));
        } else {
          row.push(undefined);
        }
      }
      this.grid.push(row);
    }
    //console.log(this.grid);
  }

  draw = () => {
    const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);

    return canvas.toBuffer();
  };

  getDice = (row: number, column: number) => {
    return this.grid[row][column];
  };

  toString = () => {
    let str = '';
    for (let row = 0; row < this.rowCount; row++) {
      let rowStr = '';
      for (let column = 0; column < this.columnCount; column++) {
        const dice = this.getDice(row, column);
        if (dice) {
          //rowStr += dice.toString();
          console.log(dice);
          rowStr += 'acc\t';
        } else {
          rowStr += 'empty\t';
        }
        rowStr += ' ';
      }
      str += rowStr;
      str += '\n';
    }
    return str;
  };
}