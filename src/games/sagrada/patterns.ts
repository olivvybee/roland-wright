import { Restriction } from './Board.js';
import { DiceColour } from './DiceBag.js';

export const PATTERNS: Restriction[][][] = [
  [
    [3, 4, 1, 5, undefined],
    [undefined, 6, 2, undefined, DiceColour.Yellow],
    [undefined, undefined, undefined, DiceColour.Yellow, DiceColour.Red],
    [5, undefined, DiceColour.Yellow, DiceColour.Red, 6],
  ],
  [
    [1, DiceColour.Purple, DiceColour.Yellow, undefined, 4],
    [DiceColour.Purple, DiceColour.Yellow, undefined, undefined, 6],
    [DiceColour.Yellow, undefined, undefined, 5, 3],
    [undefined, 5, 4, 2, 1],
  ],
  [
    [undefined, undefined, undefined, DiceColour.Red, 5],
    [undefined, undefined, DiceColour.Purple, 4, DiceColour.Blue],
    [undefined, DiceColour.Blue, 3, DiceColour.Yellow, 6],
    [DiceColour.Yellow, 2, DiceColour.Green, 1, DiceColour.Red],
  ],
  [
    [undefined, DiceColour.Blue, 2, undefined, DiceColour.Yellow],
    [undefined, 4, undefined, DiceColour.Red, undefined],
    [undefined, undefined, 5, DiceColour.Yellow, undefined],
    [DiceColour.Green, 3, undefined, undefined, DiceColour.Purple],
  ],
  [
    [undefined, undefined, 6, undefined, undefined],
    [undefined, 5, DiceColour.Blue, 4, undefined],
    [3, DiceColour.Green, DiceColour.Yellow, DiceColour.Purple, 2],
    [1, 4, DiceColour.Red, 5, 3],
  ],
  [
    [DiceColour.Yellow, DiceColour.Blue, undefined, undefined, 1],
    [DiceColour.Green, undefined, 5, undefined, 4],
    [3, undefined, DiceColour.Red, undefined, DiceColour.Green],
    [2, undefined, undefined, DiceColour.Blue, DiceColour.Yellow],
  ],
  [
    [4, undefined, 2, 5, DiceColour.Green],
    [undefined, undefined, 6, DiceColour.Green, 2],
    [undefined, 3, DiceColour.Green, 4, undefined],
    [5, DiceColour.Green, 1, undefined, undefined],
  ],
  [
    [DiceColour.Yellow, undefined, 6, undefined, undefined],
    [undefined, 1, 5, undefined, 2],
    [3, DiceColour.Yellow, DiceColour.Red, DiceColour.Purple, undefined],
    [undefined, undefined, 4, 3, DiceColour.Red],
  ],
  [
    [1, undefined, 3, DiceColour.Blue, undefined],
    [undefined, 2, DiceColour.Blue, undefined, undefined],
    [6, DiceColour.Blue, undefined, 4, undefined],
    [DiceColour.Blue, 5, 2, undefined, 1],
  ],
  [
    [DiceColour.Red, undefined, DiceColour.Blue, undefined, DiceColour.Yellow],
    [4, DiceColour.Purple, 3, DiceColour.Green, 2],
    [undefined, 1, undefined, 5, undefined],
    [undefined, undefined, 6, undefined, undefined],
  ],
  [
    [undefined, 1, DiceColour.Green, DiceColour.Purple, 4],
    [6, DiceColour.Purple, 2, 5, DiceColour.Green],
    [1, DiceColour.Green, 5, 3, DiceColour.Purple],
    [undefined, undefined, undefined, undefined, undefined],
  ],
  [
    [undefined, undefined, DiceColour.Green, undefined, undefined],
    [2, DiceColour.Yellow, 5, DiceColour.Blue, 1],
    [undefined, DiceColour.Red, 3, DiceColour.Purple, undefined],
    [1, undefined, 6, undefined, 4],
  ],
  [
    [undefined, undefined, DiceColour.Red, 5, undefined],
    [DiceColour.Purple, 4, undefined, DiceColour.Green, 3],
    [6, undefined, undefined, DiceColour.Blue, undefined],
    [undefined, DiceColour.Yellow, 2, undefined, undefined],
  ],
  [
    [undefined, DiceColour.Blue, DiceColour.Red, undefined, undefined],
    [undefined, 4, 5, undefined, DiceColour.Blue],
    [DiceColour.Blue, 2, undefined, DiceColour.Red, 5],
    [6, DiceColour.Red, 3, 1, undefined],
  ],
  [
    [DiceColour.Yellow, undefined, 2, undefined, 6],
    [undefined, 4, undefined, 5, DiceColour.Yellow],
    [undefined, undefined, undefined, DiceColour.Yellow, 5],
    [1, 2, DiceColour.Yellow, 3, undefined],
  ],
  [
    [undefined, undefined, 1, undefined, undefined],
    [1, DiceColour.Green, 3, DiceColour.Blue, 2],
    [DiceColour.Blue, 5, 4, 6, DiceColour.Green],
    [undefined, DiceColour.Blue, 5, DiceColour.Green, undefined],
  ],
  [
    [5, DiceColour.Green, DiceColour.Blue, DiceColour.Purple, 2],
    [DiceColour.Purple, undefined, undefined, undefined, DiceColour.Yellow],
    [DiceColour.Yellow, undefined, 6, undefined, DiceColour.Purple],
    [1, undefined, undefined, DiceColour.Green, 4],
  ],
  [
    [6, DiceColour.Blue, undefined, undefined, 1],
    [undefined, 5, DiceColour.Blue, undefined, undefined],
    [4, DiceColour.Red, 2, DiceColour.Blue, undefined],
    [DiceColour.Green, 6, DiceColour.Yellow, 3, DiceColour.Purple],
  ],
  [
    [1, DiceColour.Red, 3, undefined, 6],
    [5, 4, DiceColour.Red, 2, undefined],
    [undefined, undefined, 5, DiceColour.Red, 1],
    [undefined, undefined, undefined, 3, DiceColour.Red],
  ],
  [
    [2, undefined, 5, undefined, 1],
    [DiceColour.Yellow, 6, DiceColour.Purple, 2, DiceColour.Red],
    [undefined, DiceColour.Blue, 4, DiceColour.Green, undefined],
    [undefined, 3, undefined, 5, undefined],
  ],
  [
    [DiceColour.Purple, 6, undefined, undefined, 3],
    [5, DiceColour.Purple, 3, undefined, undefined],
    [undefined, 2, DiceColour.Purple, 1, undefined],
    [undefined, 1, 5, DiceColour.Purple, 4],
  ],
  [
    [DiceColour.Blue, 6, undefined, undefined, DiceColour.Yellow],
    [undefined, 3, DiceColour.Blue, undefined, undefined],
    [undefined, 5, 6, 2, undefined],
    [undefined, 4, undefined, 1, DiceColour.Green],
  ],
  [
    [6, DiceColour.Purple, undefined, undefined, 5],
    [5, undefined, DiceColour.Purple, undefined, undefined],
    [DiceColour.Red, 6, undefined, DiceColour.Purple, undefined],
    [DiceColour.Yellow, DiceColour.Red, 5, 4, 3],
  ],
  [
    [undefined, 4, undefined, DiceColour.Yellow, 6],
    [DiceColour.Red, undefined, 2, undefined, undefined],
    [undefined, undefined, DiceColour.Red, DiceColour.Purple, 1],
    [DiceColour.Blue, DiceColour.Yellow, undefined, undefined, undefined],
  ],
];
