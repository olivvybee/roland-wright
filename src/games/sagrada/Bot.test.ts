import '../../tests/toContainObject.js';
import { Bot } from './Bot.js';
import { Dice, DiceColour } from './Dice.js';
import { Board } from './Board.js';

describe('Bot', () => {
  describe('.roll()', () => {
    it('draws and rolls 5 dice', () => {
      const board = new Board(`-`);
      const bot = new Bot(board);
      const dice = bot.roll();

      expect(dice).toHaveLength(5);
      dice.forEach((d) => {
        expect(d.value).not.toBeUndefined();
      });
    });
  });

  describe('.evaluatePositions()', () => {
    const dice = new Dice(DiceColour.Red);
    dice.value = 4;

    it('can only be placed at the edge when no dice have been placed', () => {
      const board = new Board(`
      ---
      ---
      ---
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 1, column: 1, valid: false });
    });

    it('cannot be placed in a spot that already has a dice', () => {
      const board = new Board(`
        -
      `);
      const bot = new Bot(board);

      const otherDice = new Dice(DiceColour.Green);
      board.placeDice(otherDice, 0, 0);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 0, valid: false });
    });

    it('must be placed adjacent to an existing dice', () => {
      const board = new Board(`
        ---
        ---
        ---
      `);
      const bot = new Bot(board);

      const otherDice = new Dice(DiceColour.Green);
      board.placeDice(otherDice, 0, 0);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 1, valid: true });
      expect(positions).toContainObject({ row: 0, column: 2, valid: false });
      expect(positions).toContainObject({ row: 1, column: 0, valid: true });
      expect(positions).toContainObject({ row: 1, column: 1, valid: true });
      expect(positions).toContainObject({ row: 1, column: 2, valid: false });
      expect(positions).toContainObject({ row: 2, column: 0, valid: false });
      expect(positions).toContainObject({ row: 2, column: 1, valid: false });
      expect(positions).toContainObject({ row: 2, column: 2, valid: false });
    });

    it('cannot be placed adjacent to a dice of the same colour', () => {
      const board = new Board('--');
      const bot = new Bot(board);
      const otherDice = new Dice(DiceColour.Red);
      board.placeDice(otherDice, 0, 0);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 1, valid: false });
    });

    it('cannot be placed adjacent to a dice of the same value', () => {
      const board = new Board('--');
      const bot = new Bot(board);
      const otherDice = new Dice(DiceColour.Blue);
      otherDice.value = 4;
      board.placeDice(otherDice, 0, 0);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 1, valid: false });
    });

    it('cannot be placed on a spot with a mismatched colour restriction', () => {
      const board = new Board(`
        G
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 0, valid: false });
    });

    it('cannot be placed on a spot with a mismatched value restriction', () => {
      const board = new Board(`
        2
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 0, valid: false });
    });

    it('can be placed on a spot with a matching colour restriction', () => {
      const board = new Board(`
        R
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 0, valid: true });
    });

    it('can be placed on a spot with a matching value restriction', () => {
      const board = new Board(`
        4
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({ row: 0, column: 0, valid: true });
    });

    it('sets count if dice blocks a restriction', () => {
      const board = new Board(`
        R-
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 1,
        blocksRestrictions: 1,
      });
    });

    it('sets count if dice blocks multiple restrictions', () => {
      const board = new Board(`
        R-R
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 1,
        blocksRestrictions: 2,
      });
    });

    it('does not set count if dice blocks a restriction that is already fulfilled', () => {
      const board = new Board(`
        R-
      `);
      const bot = new Bot(board);
      const otherDice = new Dice(DiceColour.Red);
      board.placeDice(otherDice, 0, 0);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 1,
        blocksRestrictions: 0,
      });
    });

    it('sets flag if dice fulfills a colour restriction', () => {
      const board = new Board(`
        R-
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 0,
        fulfillsRestriction: true,
      });
    });

    it('sets flag if dice fulfills a value restriction', () => {
      const board = new Board(`
        4-
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 0,
        fulfillsRestriction: true,
      });
    });

    it('does not set flag if space does not have a restriction', () => {
      const board = new Board(`
        R-
      `);
      const bot = new Bot(board);

      const positions = bot.evaluatePositions(dice);
      expect(positions).toContainObject({
        row: 0,
        column: 1,
        fulfillsRestriction: false,
      });
    });
  });

  describe('.rankPositions()', () => {
    const board = new Board(`-`);
    const bot = new Bot(board);

    it('ranks fulfilled restrictions highest', () => {
      const positions = [
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 0,
          fulfillsRestriction: false,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 0,
          fulfillsRestriction: true,
        },
      ];

      const ranked = bot.rankPositions(positions);
      expect(ranked).toEqual([
        expect.objectContaining({
          fulfillsRestriction: true,
        }),
        expect.objectContaining({
          fulfillsRestriction: false,
        }),
      ]);
    });

    it('sorts by least blocked restrictions if all positions fulfill restrictions', () => {
      const positions = [
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 1,
          fulfillsRestriction: true,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 2,
          fulfillsRestriction: true,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 0,
          fulfillsRestriction: true,
        },
      ];

      const ranked = bot.rankPositions(positions);
      expect(ranked).toEqual([
        expect.objectContaining({
          blocksRestrictions: 0,
        }),
        expect.objectContaining({
          blocksRestrictions: 1,
        }),
        expect.objectContaining({
          blocksRestrictions: 2,
        }),
      ]);
    });

    it('sorts by least blocked restrictions if no positions fulfill restrictions', () => {
      const positions = [
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 1,
          fulfillsRestriction: false,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 2,
          fulfillsRestriction: false,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 0,
          fulfillsRestriction: false,
        },
      ];

      const ranked = bot.rankPositions(positions);
      expect(ranked).toEqual([
        expect.objectContaining({
          blocksRestrictions: 0,
        }),
        expect.objectContaining({
          blocksRestrictions: 1,
        }),
        expect.objectContaining({
          blocksRestrictions: 2,
        }),
      ]);
    });

    it('sorts by least blocked restrictions, then by fulfilled restriction', () => {
      const positions = [
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 1,
          fulfillsRestriction: true,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 2,
          fulfillsRestriction: false,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 2,
          fulfillsRestriction: true,
        },
        {
          dice: new Dice(DiceColour.Blue),
          row: 0,
          column: 0,
          valid: true,
          blocksRestrictions: 1,
          fulfillsRestriction: false,
        },
      ];

      const ranked = bot.rankPositions(positions);
      expect(ranked).toEqual([
        expect.objectContaining({
          blocksRestrictions: 1,
          fulfillsRestriction: true,
        }),
        expect.objectContaining({
          blocksRestrictions: 1,
          fulfillsRestriction: false,
        }),
        expect.objectContaining({
          blocksRestrictions: 2,
          fulfillsRestriction: true,
        }),
        expect.objectContaining({
          blocksRestrictions: 2,
          fulfillsRestriction: false,
        }),
      ]);
    });
  });
});
