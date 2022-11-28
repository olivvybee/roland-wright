import { selectRandom } from '../../utils/random.js';
import { Board } from './Board.js';
import { Dice, DiceBag, diceToString } from './DiceBag.js';
import { PATTERNS } from './patterns.js';

export const play = () => {
  const pattern = selectRandom(PATTERNS);
  const board = new Board(pattern);

  const diceBag = new DiceBag();

  for (let round = 0; round < 18; round++) {
    let dicePool = diceBag.roll();

    for (let diceIndex = 0; diceIndex < 2; diceIndex++) {
      dicePool = dicePool.filter(
        (dice) => board.validPositions(dice).length > 0
      );

      if (dicePool.length === 0) {
        break;
      }

      const blockingDice = dicePool.filter(
        (dice) => board.blockingPositions(dice).length > 0
      );

      let chosenDice: Dice;
      if (dicePool.length > blockingDice.length) {
        const nonBlockingDice = dicePool.filter(
          (dice) => board.blockingPositions(dice).length === 0
        );
        chosenDice = selectRandom(nonBlockingDice);
      } else {
        chosenDice = selectRandom(dicePool);
      }

      const diceIndex = dicePool.findIndex(
        (dice) =>
          dice.colour === chosenDice.colour && dice.value === chosenDice.value
      );
      dicePool.splice(diceIndex, 1);

      const validPositions = board.validPositions(chosenDice);
      let chosenPosition: number[];

      const optimalPositions = board.optimalPositions(chosenDice);
      const positionsFulfillingRestrictions = validPositions.filter(([r, c]) =>
        board.spaceHasRestriction(r, c)
      );
      const positionsNotBlockingRestrictions = validPositions.filter(
        ([r, c]) => !board.blocksAdjacentRestriction(chosenDice, r, c)
      );

      if (optimalPositions.length > 0) {
        chosenPosition = selectRandom(optimalPositions);
      } else if (positionsNotBlockingRestrictions.length > 0) {
        chosenPosition = selectRandom(positionsNotBlockingRestrictions);
      } else if (positionsFulfillingRestrictions.length > 0) {
        chosenPosition = selectRandom(positionsFulfillingRestrictions);
      } else {
        chosenPosition = selectRandom(validPositions);
      }

      board.placeDice(chosenDice, chosenPosition[0], chosenPosition[1]);
    }
  }

  board.printRestrictions();
  board.print();
};
