import { MockInstance } from 'vitest';

import { Dice, DiceColour } from './Dice.js';

describe('Dice', () => {
  let mockRandom: MockInstance;

  beforeAll(() => {
    mockRandom = vi.spyOn(Math, 'random').mockImplementation(() => 0.666);
  });

  afterAll(() => {
    mockRandom.mockRestore();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with an undefined value', () => {
    const dice = new Dice(DiceColour.Purple);

    expect(dice.value).toBe(undefined);
  });

  describe('.roll()', () => {
    it('randomises the value', () => {
      const dice = new Dice(DiceColour.Purple);
      dice.roll();

      expect(mockRandom).toHaveBeenCalledTimes(1);
      expect(dice.value).toBe(4);
    });
  });

  describe('.toString()', () => {
    it('uses ? when the value is not set', () => {
      const dice = new Dice(DiceColour.Purple);

      const str = dice.toString();
      expect(str).toContain('P?');
    });

    it('returns the colour and value', () => {
      const dice = new Dice(DiceColour.Purple);
      dice.roll();

      const str = dice.toString();
      expect(str).toContain('P4');
    });
  });
});
