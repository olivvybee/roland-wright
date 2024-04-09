import _shuffle from 'lodash/shuffle.js';
import { popRandom } from '../../utils/random.js';
import { Tile } from './Tile.js';
import { Connection } from './types.js';

export class TileDice {
  validTiles: Tile[] = [];

  constructor(validTiles: Tile[]) {
    this.validTiles = _shuffle(validTiles);
  }

  draw = (count: number) => {
    const drawnTiles: Tile[] = [];
    for (let i = 0; i < count; i++) {
      drawnTiles.push(popRandom(this.validTiles));
    }
    return drawnTiles;
  };

  /* toString = () => {
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
  }; */
}
