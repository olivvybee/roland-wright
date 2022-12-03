import chalk from 'chalk';

export enum DiceColour {
  Red,
  Yellow,
  Blue,
  Green,
  Purple,
}

export const colourise = (colour: DiceColour) => {
  switch (colour) {
    case DiceColour.Red:
      return chalk.red;
    case DiceColour.Yellow:
      return chalk.yellow;
    case DiceColour.Blue:
      return chalk.cyan;
    case DiceColour.Green:
      return chalk.green;
    case DiceColour.Purple:
      return chalk.magenta;
  }
};

export class Dice {
  colour: DiceColour;
  value: number | undefined;

  constructor(colour: DiceColour) {
    this.colour = colour;
    this.value = undefined;
  }

  roll = () => {
    this.value = Math.ceil(Math.random() * 6);
  };

  toString = () => {
    const colourString = DiceColour[this.colour].charAt(0);
    const valueString = this.value?.toString() || '?';
    const str = `${colourString}${valueString}`;

    return colourise(this.colour)(str);
  };
}
