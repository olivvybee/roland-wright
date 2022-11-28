import { colourise, Dice, DiceColour } from './DiceBag.js';

export interface Position {
  row: number;
  column: number;
}

export type Restriction = DiceColour | number | undefined;

const isValueRestriction = (restriction: Restriction) =>
  typeof restriction === 'number';
const isColourRestriction = (restriction: Restriction) =>
  typeof restriction === 'string';

type GridSpace = Dice | undefined;
type Pattern = Restriction[][];

export class Board {
  private restrictions: Pattern;
  private grid: GridSpace[][];
  private hasPlacedDice: boolean;

  constructor(restrictions: Restriction[][]) {
    this.restrictions = restrictions;
    this.hasPlacedDice = false;

    const rows = restrictions.length;
    const cols = restrictions[0].length;

    this.grid = [];
    for (let i = 0; i < rows; i++) {
      const row: GridSpace[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(undefined);
      }
      this.grid.push(row);
    }
  }

  private get rows() {
    return this.grid.length;
  }

  private get columns() {
    return this.grid[0].length;
  }

  private isAtEdge(row: number, column: number) {
    if (
      row === 0 ||
      row === this.rows - 1 ||
      column === 0 ||
      column === this.columns - 1
    ) {
      return true;
    }
  }

  private isAdjacentToPlacedDice(row: number, column: number) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i;
        const c = column + j;

        if (
          r >= 0 &&
          r < this.rows &&
          c >= 0 &&
          c < this.columns &&
          this.grid[r][c] !== undefined
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private isAdjacentToMatchingDice(dice: Dice, row: number, column: number) {
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const offset of offsets) {
      const r = row + offset[0];
      const c = column + offset[1];

      if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
        const existingDice = this.grid[r][c];
        if (existingDice !== undefined) {
          if (
            existingDice.colour === dice.colour ||
            existingDice.value === dice.value
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  public validPositions(dice: Dice) {
    const positions: number[][] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.grid[r][c] !== undefined) {
          continue;
        }

        if (this.isAdjacentToMatchingDice(dice, r, c)) {
          continue;
        }

        const restriction = this.restrictions[r][c];
        if (isColourRestriction(restriction) && dice.colour !== restriction) {
          continue;
        }
        if (isValueRestriction(restriction) && dice.value !== restriction) {
          continue;
        }

        if (!this.hasPlacedDice && !this.isAtEdge(r, c)) {
          continue;
        }

        if (this.hasPlacedDice && !this.isAdjacentToPlacedDice(r, c)) {
          continue;
        }

        positions.push([r, c]);
      }
    }

    return positions;
  }

  public spaceHasRestriction(row: number, column: number) {
    return this.restrictions[row][column] !== undefined;
  }

  public blocksAdjacentRestriction(dice: Dice, row: number, column: number) {
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const offset of offsets) {
      const r = row + offset[0];
      const c = column + offset[1];

      if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
        const restriction = this.restrictions[r][c];
        if (isValueRestriction(restriction) && restriction === dice.value) {
          return true;
        }
        if (isColourRestriction(restriction) && restriction === dice.colour) {
          return true;
        }
      }
    }

    return false;
  }

  public optimalPositions(dice: Dice) {
    const validPositions = this.validPositions(dice);

    const positionsFulfillingRestrictions = validPositions.filter(([r, c]) =>
      this.spaceHasRestriction(r, c)
    );
    const positionsNotBlockingRestrictions = validPositions.filter(
      ([r, c]) => !this.blocksAdjacentRestriction(dice, r, c)
    );

    return validPositions.filter(
      (position) =>
        positionsFulfillingRestrictions.includes(position) &&
        positionsNotBlockingRestrictions.includes(position)
    );
  }

  public blockingPositions(dice: Dice) {
    const validPositions = this.validPositions(dice);

    return validPositions.filter(([r, c]) =>
      this.blocksAdjacentRestriction(dice, r, c)
    );
  }

  public placeDice(dice: Dice, row: number, column: number) {
    this.grid[row][column] = dice;
    this.hasPlacedDice = true;
  }

  public print() {
    for (let r = 0; r < this.rows; r++) {
      let row = '';
      for (let c = 0; c < this.columns; c++) {
        const space = this.grid[r][c];
        if (space === undefined) {
          row += '-';
        } else {
          const { value, colour } = space;
          row += colourise(colour)(value);
        }
        row += ' ';
      }
      console.log(row);
    }
    console.log();
  }

  public printRestrictions() {
    for (let r = 0; r < this.restrictions.length; r++) {
      let row = '';
      for (let c = 0; c < this.restrictions[r].length; c++) {
        const restriction = this.restrictions[r][c];
        if (restriction === undefined) {
          row += '-';
        } else {
          if (isColourRestriction(restriction)) {
            row += colourise(restriction as DiceColour)(restriction);
          } else {
            row += restriction;
          }
        }
        row += ' ';
      }
      console.log(row);
    }
    console.log();
  }
}
