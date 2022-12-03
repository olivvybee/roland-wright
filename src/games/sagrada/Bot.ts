import _orderBy from 'lodash/orderBy.js';
import _remove from 'lodash/remove.js';

import { Board } from './Board.js';
import { Dice } from './Dice.js';
import { DiceBag } from './DiceBag.js';
import { isColourRestriction, isValueRestriction } from './Restriction.js';

interface Position {
  dice: Dice;
  row: number;
  column: number;
  valid: boolean;
  blocksRestrictions: number;
  fulfillsRestriction: boolean;
}

export class Bot {
  board: Board;
  diceBag: DiceBag;

  constructor(board: Board) {
    this.board = board;
    this.diceBag = new DiceBag();
  }

  play = () => {
    for (let round = 0; round < 10; round++) {
      const dicePool = this.roll();

      for (let diceCount = 0; diceCount < 2; diceCount++) {
        const move = this.chooseNextMove(dicePool);
        if (!move) {
          break;
        }

        const { dice, row, column } = move;

        _remove(dicePool, (d) => d === dice);
        this.board.placeDice(dice, row, column);
      }
    }

    return this.board;
  };

  roll = () => {
    const dice = this.diceBag.draw(5);
    dice.forEach((d) => d.roll());
    return dice;
  };

  chooseNextMove = (dicePool: Dice[]) => {
    const validPositions = dicePool
      .flatMap((dice) => this.evaluatePositions(dice))
      .filter((position) => position.valid);

    if (!validPositions.length) {
      return undefined;
    }

    const rankedPositions = this.rankPositions(validPositions);
    return rankedPositions[0];
  };

  evaluatePositions = (dice: Dice) => {
    const positions: Position[] = [];

    for (let row = 0; row < this.board.rowCount; row++) {
      for (let column = 0; column < this.board.columnCount; column++) {
        const position: Position = {
          dice,
          row,
          column,
          valid: true,
          blocksRestrictions: 0,
          fulfillsRestriction: false,
        };

        if (this.board.hasPlacedDice) {
          const adjacentSpaces = this.board.getAllNeighbours(row, column);
          if (adjacentSpaces.every((space) => space === undefined)) {
            position.valid = false;
          }
        } else {
          if (
            row > 0 &&
            row < this.board.rowCount - 1 &&
            column > 0 &&
            column < this.board.columnCount - 1
          ) {
            position.valid = false;
          }
        }

        if (this.board.getDice(row, column) !== undefined) {
          position.valid = false;
        }

        const adjacentDice = this.board.getOrthogonalNeighbours(row, column);
        const adjacentDiceMatchesColour = adjacentDice.some(
          (d) => d?.colour === dice.colour
        );
        const adjacentDiceMatchesValue = adjacentDice.some(
          (d) => d?.value === dice.value
        );
        if (adjacentDiceMatchesColour || adjacentDiceMatchesValue) {
          position.valid = false;
        }

        const restriction = this.board.getRestriction(row, column);
        if (isValueRestriction(restriction)) {
          if (restriction.value === dice.value) {
            position.fulfillsRestriction = true;
          } else {
            position.valid = false;
          }
        }
        if (isColourRestriction(restriction)) {
          if (restriction.colour === dice.colour) {
            position.fulfillsRestriction = true;
          } else {
            position.valid = false;
          }
        }

        const adjacentRestrictions =
          this.board.getAdjacentUnfulfilledRestrictions(row, column);
        position.blocksRestrictions = adjacentRestrictions.filter(
          (restriction) => {
            if (isColourRestriction(restriction)) {
              return restriction.colour === dice.colour;
            }
            if (isValueRestriction(restriction)) {
              return restriction.value === dice.value;
            }
          }
        ).length;

        positions.push(position);
      }
    }

    return positions;
  };

  rankPositions = (positions: Position[]) => {
    return _orderBy(
      positions,
      ['blocksRestrictions', 'fulfillsRestriction'],
      ['asc', 'desc']
    );
  };
}
