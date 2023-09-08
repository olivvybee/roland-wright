import { Card, CardColour } from './Card';
import { Shape } from './types';

export const CARDS: Card[] = [
  { colour: CardColour.Blue, shape: Shape.Square },
  { colour: CardColour.Blue, shape: Shape.Circle },
  { colour: CardColour.Blue, shape: Shape.Triangle },
  { colour: CardColour.Blue, shape: Shape.Pentagon },
  { colour: CardColour.Blue, shape: Shape.Wild },
  { colour: CardColour.Blue, isSwitchCard: true },
  { colour: CardColour.Pink, shape: Shape.Square },
  { colour: CardColour.Pink, shape: Shape.Circle },
  { colour: CardColour.Pink, shape: Shape.Triangle },
  { colour: CardColour.Pink, shape: Shape.Pentagon },
  { colour: CardColour.Pink, shape: Shape.Wild },
];
