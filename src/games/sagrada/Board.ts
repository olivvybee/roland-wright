import { Dice } from './Dice.js';
import { Pattern } from './Pattern.js';
import { restrictionToString } from './Restriction.js';

type GridSpace = Dice | undefined;

export class Board {
  pattern: Pattern;
  grid: GridSpace[][];
  rowCount: number;
  columnCount: number;
  hasPlacedDice: boolean;

  constructor(pattern: string) {
    this.pattern = new Pattern(pattern);
    this.rowCount = this.pattern.restrictions.length;
    this.columnCount = this.pattern.restrictions[0].length;
    this.hasPlacedDice = false;

    this.grid = [];
    for (let r = 0; r < this.rowCount; r++) {
      const row: GridSpace[] = [];
      for (let c = 0; c < this.columnCount; c++) {
        row.push(undefined);
      }
      this.grid.push(row);
    }
  }

  placeDice = (dice: Dice, row: number, column: number) => {
    this.grid[row][column] = dice;
    this.hasPlacedDice = true;
  };

  getDice = (row: number, column: number) => {
    return this.grid[row][column];
  };

  getOrthogonalNeighbours = (row: number, column: number) => {
    const offsets = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];

    return offsets.map(({ r, c }) => {
      const newRow = row + r;
      const newColumn = column + c;
      if (
        newRow >= 0 &&
        newRow < this.rowCount &&
        newColumn >= 0 &&
        newColumn < this.columnCount
      ) {
        return this.getDice(newRow, newColumn);
      } else {
        return undefined;
      }
    });
  };

  getAllNeighbours = (row: number, column: number) => {
    const neighbours: GridSpace[] = [];
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r;
        const newColumn = column + c;
        if (
          newRow >= 0 &&
          newRow < this.rowCount &&
          newColumn >= 0 &&
          newColumn < this.columnCount
        ) {
          neighbours.push(this.getDice(newRow, newColumn));
        } else {
          neighbours.push(undefined);
        }
      }
    }
    return neighbours;
  };

  getRestriction = (row: number, column: number) => {
    return this.pattern.get(row, column);
  };

  getAdjacentUnfulfilledRestrictions = (row: number, column: number) => {
    const offsets = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 },
    ];

    return offsets
      .map(({ r, c }) => {
        const newRow = row + r;
        const newColumn = column + c;
        if (
          newRow >= 0 &&
          newRow < this.rowCount &&
          newColumn >= 0 &&
          newColumn < this.columnCount
        ) {
          const dice = this.getDice(newRow, newColumn);
          const restriction = this.getRestriction(newRow, newColumn);
          return !!dice ? undefined : restriction;
        } else {
          return undefined;
        }
      })
      .filter(Boolean);
  };

  toString = () => {
    let str = '';
    for (let row = 0; row < this.rowCount; row++) {
      let rowStr = '';
      for (let column = 0; column < this.columnCount; column++) {
        const dice = this.getDice(row, column);
        if (dice) {
          rowStr += dice.toString();
        } else {
          rowStr += '--';
        }
        rowStr += ' ';
      }
      str += rowStr;
      str += '\n';
    }
    return str;
  };

  restrictionsAsString = () => {
    let str = '';
    for (let row = 0; row < this.rowCount; row++) {
      let rowStr = '';
      for (let column = 0; column < this.columnCount; column++) {
        const restriction = this.getRestriction(row, column);
        if (restriction) {
          rowStr += restrictionToString(restriction);
        } else {
          rowStr += '-';
        }
        rowStr += ' ';
      }
      str += rowStr;
      str += '\n';
    }
    return str;
  };
}
