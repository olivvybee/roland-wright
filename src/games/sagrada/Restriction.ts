import { colourise, DiceColour } from './Dice.js';

export type ColourRestriction = {
  colour: DiceColour;
};

export type ValueRestriction = {
  value: number;
};

export type Restriction = ColourRestriction | ValueRestriction | undefined;

export const isColourRestriction = (r: Restriction): r is ColourRestriction => {
  return r !== undefined && (r as ColourRestriction).colour !== undefined;
};

export const isValueRestriction = (r: Restriction): r is ValueRestriction => {
  return r !== undefined && (r as ValueRestriction).value !== undefined;
};

export const parseRestriction = (str: string): Restriction => {
  if (str === '-') {
    return undefined;
  }

  const parsedNumber = parseInt(str);
  if (!isNaN(parsedNumber)) {
    return {
      value: parsedNumber,
    };
  }

  const colourMap = {
    R: DiceColour.Red,
    Y: DiceColour.Yellow,
    B: DiceColour.Blue,
    G: DiceColour.Green,
    P: DiceColour.Purple,
  };
  return {
    colour: colourMap[str],
  };
};

export const restrictionToString = (restriction: Restriction) => {
  if (!restriction) {
    return '-';
  }

  if (isValueRestriction(restriction)) {
    return restriction.value.toString();
  }

  if (isColourRestriction(restriction)) {
    return colourise(restriction.colour)(
      DiceColour[restriction.colour].charAt(0)
    );
  }
};
