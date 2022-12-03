import _shuffle from 'lodash/shuffle.js';
import { popRandom } from '../../utils/random.js';
import { Dice, DiceColour } from './Dice.js';

export class DiceBag {
  contents: Dice[];

  constructor() {
    const dice: Dice[] = [];
    [
      DiceColour.Red,
      DiceColour.Yellow,
      DiceColour.Blue,
      DiceColour.Green,
      DiceColour.Purple,
    ].forEach((colour) => {
      for (let i = 0; i < 18; i++) {
        dice.push(new Dice(colour));
      }
    });
    this.contents = _shuffle(dice);
  }

  draw = (count: number) => {
    const drawnDice: Dice[] = [];
    for (let i = 0; i < count; i++) {
      drawnDice.push(popRandom(this.contents));
    }
    return drawnDice;
  };

  toString = () => {
    const colourCounts = [
      DiceColour.Red,
      DiceColour.Yellow,
      DiceColour.Blue,
      DiceColour.Green,
      DiceColour.Purple,
    ].reduce((counts, colour) => {
      const count = this.contents.filter(
        (dice) => dice.colour === colour
      ).length;
      return {
        ...counts,
        [DiceColour[colour].charAt(0)]: count,
      };
    }, {});

    const countList = Object.entries(colourCounts)
      .map(([colour, count]) => `${colour}: ${count}`)
      .join(', ');

    return `${this.contents.length} dice (${countList})`;
  };
}
