import { DiceColour } from './Dice.js';
import { Pattern } from './Pattern.js';

describe('Pattern', () => {
  it('parses a multiline string into a set of restrictions', () => {
    const restrictions = `
      12345
      -RGB-
      -6PY-
    `;

    const pattern = new Pattern(restrictions);

    expect(pattern.restrictions).toEqual([
      [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
      [
        undefined,
        { colour: DiceColour.Red },
        { colour: DiceColour.Green },
        { colour: DiceColour.Blue },
        undefined,
      ],
      [
        undefined,
        { value: 6 },
        { colour: DiceColour.Purple },
        { colour: DiceColour.Yellow },
        undefined,
      ],
    ]);
  });

  describe('.get()', () => {
    it('returns the restriction from the requested space', () => {
      const restrictions = `
        12345
        -RGB-
        -6PY-
      `;
      const pattern = new Pattern(restrictions);
      const restriction = pattern.get(1, 1);

      expect(restriction).toEqual({ colour: DiceColour.Red });
    });
  });
});
