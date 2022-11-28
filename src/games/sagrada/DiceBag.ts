import chalk from 'chalk';
import { randomEnum } from '../../utils/random.js';

export enum DiceColour {
  Red = 'R',
  Yellow = 'Y',
  Blue = 'B',
  Green = 'G',
  Purple = 'P',
}

export const colourise =
  (diceColour: DiceColour) =>
  (...data: any[]) => {
    switch (diceColour) {
      case DiceColour.Red:
        return chalk.red(data);
      case DiceColour.Yellow:
        return chalk.yellow(data);
      case DiceColour.Blue:
        return chalk.blue(data);
      case DiceColour.Green:
        return chalk.green(data);
      case DiceColour.Purple:
        return chalk.magenta(data);
      default:
        return data;
    }
  };

export interface Dice {
  value: number;
  colour: DiceColour;
}

export const diceToString = (dice: Dice) => colourise(dice.colour)(dice.value);

export class DiceBag {
  private remainingDice: { [key in DiceColour]: number };

  constructor() {
    this.remainingDice = {
      [DiceColour.Red]: 18,
      [DiceColour.Yellow]: 18,
      [DiceColour.Blue]: 18,
      [DiceColour.Green]: 18,
      [DiceColour.Purple]: 18,
    };
  }

  public roll() {
    const results: Dice[] = [];

    for (let i = 0; i < 5; i++) {
      let colour: DiceColour;
      do {
        colour = randomEnum(DiceColour);
      } while (this.remainingDice[colour] === 0);
      this.remainingDice[colour] -= 1;

      const value = Math.ceil(Math.random() * 6);

      results.push({
        value,
        colour,
      });
    }

    return results;
  }

  public getContents() {
    return this.remainingDice;
  }
}
