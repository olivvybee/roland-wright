import { MockInstance } from 'vitest';
import _shuffle from 'lodash/shuffle.js';

import { Dice, DiceColour } from './Dice.js';
import { DiceBag } from './DiceBag.js';

vi.mock('lodash/shuffle');

describe('DiceBag', () => {
  let mockRandom: MockInstance;

  beforeAll(() => {
    mockRandom = vi.spyOn(Math, 'random').mockImplementation(() => 0.666);
  });

  afterAll(() => {
    mockRandom.mockRestore();
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(_shuffle).mockImplementation((list) => list);
  });

  it('starts with 90 dice', () => {
    const diceBag = new DiceBag();

    expect(diceBag.contents.length).toBe(90);
  });

  it.each(['Red', 'Yellow', 'Blue', 'Green', 'Purple'])(
    'starts with 18 %s dice',
    (colour) => {
      const diceBag = new DiceBag();

      expect(
        diceBag.contents.filter((dice) => dice.colour === DiceColour[colour])
          .length
      ).toBe(18);
    }
  );

  it('randomises the order of the dice', () => {
    new DiceBag();

    expect(vi.mocked(_shuffle)).toHaveBeenCalledTimes(1);
  });

  describe('.draw()', () => {
    it('removes the dice from the bag', () => {
      const diceBag = new DiceBag();
      diceBag.draw(5);

      expect(diceBag.contents.length).toBe(85);
    });

    it('returns the dice', () => {
      const diceBag = new DiceBag();
      const dice = diceBag.draw(5);

      expect(dice.length).toBe(5);
      expect(dice).toEqual(
        expect.arrayContaining([
          expect.any(Dice),
          expect.any(Dice),
          expect.any(Dice),
          expect.any(Dice),
          expect.any(Dice),
        ])
      );
    });
  });

  describe('.toString()', () => {
    it('lists the total count', () => {
      const diceBag = new DiceBag();
      const str = diceBag.toString();

      expect(str).toContain('90 dice');
    });

    it('lists the count of each colour', () => {
      const diceBag = new DiceBag();
      const str = diceBag.toString();

      expect(str).toContain('(R: 18, Y: 18, B: 18, G: 18, P: 18)');
    });
  });
});
