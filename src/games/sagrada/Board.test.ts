import '../../tests/toContainObject.js';
import { Board } from './Board.js';
import { Dice, DiceColour } from './Dice.js';

describe('Board', () => {
  const pattern = `
    123
    -RG
    6Y-
  `;

  it('sets rowCount based on the pattern', () => {
    const board = new Board(pattern);

    expect(board.rowCount).toBe(3);
  });

  it('sets columnCount based on the pattern', () => {
    const board = new Board(`
      1234
      -RGB
      PY5-
    `);

    expect(board.columnCount).toBe(4);
  });

  it('creates a grid containing no dice', () => {
    const board = new Board(pattern);

    expect(board.grid).toEqual([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ]);
  });

  describe('.placeDice()', () => {
    it('places the dice in the given space', () => {
      const board = new Board(pattern);
      const dice = new Dice(DiceColour.Green);
      board.placeDice(dice, 2, 2);

      expect(board.grid[2][2]).toBe(dice);
    });
  });

  describe('.getDice()', () => {
    it('gets the dice from the given space', () => {
      const board = new Board(pattern);
      const dice = new Dice(DiceColour.Green);
      board.placeDice(dice, 2, 2);

      const result = board.getDice(2, 2);
      expect(result).toBe(dice);
    });
  });

  describe('.getOrthogonalNeighbours()', () => {
    it('gets the neighbours', () => {
      const board = new Board(pattern);
      const dice = [
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
        new Dice(DiceColour.Yellow),
      ];
      board.placeDice(dice[0], 0, 1);
      board.placeDice(dice[1], 1, 0);
      board.placeDice(dice[2], 2, 1);
      board.placeDice(dice[3], 1, 2);

      const neighbours = board.getOrthogonalNeighbours(1, 1);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
      expect(neighbours).toContain(dice[2]);
      expect(neighbours).toContain(dice[3]);
    });

    it('gets the neighbours for an edge space', () => {
      const board = new Board(pattern);
      const dice = [
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
      ];
      board.placeDice(dice[0], 0, 0);
      board.placeDice(dice[1], 1, 1);
      board.placeDice(dice[2], 2, 0);

      const neighbours = board.getOrthogonalNeighbours(1, 0);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
      expect(neighbours).toContain(dice[2]);
    });

    it('gets the neighbours for a corner space', () => {
      const board = new Board(pattern);
      const dice = [new Dice(DiceColour.Red), new Dice(DiceColour.Green)];
      board.placeDice(dice[0], 0, 1);
      board.placeDice(dice[1], 1, 0);

      const neighbours = board.getOrthogonalNeighbours(0, 0);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
    });
  });

  describe('.getAllNeighbours()', () => {
    it('gets the neighbours', () => {
      const board = new Board(pattern);
      const dice = [
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
        new Dice(DiceColour.Yellow),
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
        new Dice(DiceColour.Yellow),
      ];
      board.placeDice(dice[0], 0, 0);
      board.placeDice(dice[1], 0, 1);
      board.placeDice(dice[2], 0, 2);
      board.placeDice(dice[3], 1, 0);
      board.placeDice(dice[4], 1, 2);
      board.placeDice(dice[5], 2, 0);
      board.placeDice(dice[6], 2, 1);
      board.placeDice(dice[7], 2, 2);

      const neighbours = board.getAllNeighbours(1, 1);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
      expect(neighbours).toContain(dice[2]);
      expect(neighbours).toContain(dice[3]);
      expect(neighbours).toContain(dice[4]);
      expect(neighbours).toContain(dice[5]);
      expect(neighbours).toContain(dice[6]);
      expect(neighbours).toContain(dice[7]);
    });

    it('gets the neighbours for an edge space', () => {
      const board = new Board(pattern);
      const dice = [
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
        new Dice(DiceColour.Yellow),
        new Dice(DiceColour.Purple),
      ];
      board.placeDice(dice[0], 0, 0);
      board.placeDice(dice[1], 0, 1);
      board.placeDice(dice[2], 1, 1);
      board.placeDice(dice[3], 2, 0);
      board.placeDice(dice[4], 2, 1);

      const neighbours = board.getAllNeighbours(1, 0);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
      expect(neighbours).toContain(dice[2]);
      expect(neighbours).toContain(dice[3]);
      expect(neighbours).toContain(dice[4]);
    });

    it('gets the neighbours for a corner space', () => {
      const board = new Board(pattern);
      const dice = [
        new Dice(DiceColour.Red),
        new Dice(DiceColour.Green),
        new Dice(DiceColour.Blue),
      ];
      board.placeDice(dice[0], 0, 1);
      board.placeDice(dice[1], 1, 0);
      board.placeDice(dice[2], 1, 1);

      const neighbours = board.getAllNeighbours(0, 0);
      expect(neighbours).toContain(dice[0]);
      expect(neighbours).toContain(dice[1]);
      expect(neighbours).toContain(dice[2]);
    });
  });

  describe('.getRestriction()', () => {
    it('gets the restriction at the given space', () => {
      const board = new Board(pattern);
      const restriction = board.getRestriction(1, 1);

      expect(restriction).toEqual({
        colour: DiceColour.Red,
      });
    });

    it('returns undefined if there is no restriction', () => {
      const board = new Board(pattern);
      const restriction = board.getRestriction(2, 2);

      expect(restriction).toBe(undefined);
    });
  });

  describe('.getAdjacentUnfulfilledRestrictions()', () => {
    const pattern = `
      123
      456
      RGB
    `;

    it('gets the restrictions', () => {
      const board = new Board(pattern);
      const restrictions = board.getAdjacentUnfulfilledRestrictions(1, 1);

      expect(restrictions).toHaveLength(4);
      expect(restrictions).toContainObject({ value: 2 });
      expect(restrictions).toContainObject({ value: 4 });
      expect(restrictions).toContainObject({ value: 6 });
      expect(restrictions).toContainObject({ colour: DiceColour.Green });
    });

    it('gets restrictions for an edge space', () => {
      const board = new Board(pattern);
      const restrictions = board.getAdjacentUnfulfilledRestrictions(0, 1);

      expect(restrictions).toHaveLength(3);
      expect(restrictions).toContainObject({ value: 1 });
      expect(restrictions).toContainObject({ value: 3 });
      expect(restrictions).toContainObject({ value: 5 });
    });

    it('gets restrictions for a corner space', () => {
      const board = new Board(pattern);
      const restrictions = board.getAdjacentUnfulfilledRestrictions(0, 0);

      expect(restrictions).toHaveLength(2);
      expect(restrictions).toContainObject({ value: 2 });
      expect(restrictions).toContainObject({ value: 4 });
    });

    it('ignores restrictions that have a dice placed on them', () => {
      it('gets restrictions for an edge space', () => {
        const board = new Board(pattern);
        const dice = new Dice(DiceColour.Red);
        dice.value = 2;
        board.placeDice(dice, 0, 1);
        const restrictions = board.getAdjacentUnfulfilledRestrictions(1, 1);

        expect(restrictions).toHaveLength(3);
        expect(restrictions).toContainObject({ value: 4 });
        expect(restrictions).toContainObject({ value: 6 });
        expect(restrictions).toContainObject({ colour: DiceColour.Green });
      });
    });
  });
});
