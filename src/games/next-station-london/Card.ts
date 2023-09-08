import { Colour, Shape } from './types';

export enum CardColour {
  Blue,
  Pink,
}

export type Card =
  | {
      colour: CardColour;
      shape: Shape;
      isSwitchCard?: boolean;
    }
  | {
      colour: CardColour;
      shape?: Shape;
      isSwitchCard: true;
    };
