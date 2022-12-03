import { DiceColour } from './Dice.js';
import { parseRestriction } from './Restriction.js';

describe('Restriction', () => {
  describe('parseRestriction()', () => {
    it('parses dashes as no restriction', () => {
      const result = parseRestriction('-');

      expect(result).toBe(undefined);
    });

    it('parses numbers as a value restriction', () => {
      const result = parseRestriction('6');

      expect(result).toEqual({
        value: 6,
      });
    });

    it.each`
      letter | colour
      ${'R'} | ${DiceColour.Red}
      ${'Y'} | ${DiceColour.Yellow}
      ${'B'} | ${DiceColour.Blue}
      ${'G'} | ${DiceColour.Green}
      ${'P'} | ${DiceColour.Purple}
    `('parses "$letter" as a colour restriction', ({ letter, colour }) => {
      const result = parseRestriction(letter);

      expect(result).toEqual({
        colour,
      });
    });
  });
});
