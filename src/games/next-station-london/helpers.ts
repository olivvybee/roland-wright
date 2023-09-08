import chalk from 'chalk';

import { Node } from './Node';
import { Colour, Shape } from './types';
import { GRID_SIZE } from './constants';

export const getHexColour = (colour: Colour | undefined) => {
  switch (colour) {
    case Colour.Green:
      return '#338538';
    case Colour.Pink:
      return '#f2296f';
    case Colour.Purple:
      return '#6f389c';
    case Colour.Blue:
      return '#014e91';
    default:
      return '#211759';
  }
};

export const colourise = (colour: Colour | undefined) => {
  if (colour === undefined) {
    return (s: string) => s;
  }

  switch (colour) {
    case Colour.Green:
      return chalk.green;
    case Colour.Pink:
      return chalk.magenta;
    case Colour.Purple:
      return chalk.hex('#DEADED');
    case Colour.Blue:
      return chalk.cyan;
  }
};

export const getCentre = (node: Node) => {
  const x = (node.x + 0.5) * GRID_SIZE;
  const y = (node.y + 0.5) * GRID_SIZE;

  return { x, y };
};

export const getLinePosition = ({
  x: gridX,
  y: gridY,
}: {
  x: number;
  y: number;
}) => {
  const x = (gridX + 0.5) * GRID_SIZE;
  const y = (gridY + 1) * GRID_SIZE;

  return { x, y };
};

export const parseShape = (marker: string) => {
  switch (marker) {
    case 'c':
      return Shape.Circle;
    case 's':
      return Shape.Square;
    case 't':
      return Shape.Triangle;
    case 'p':
      return Shape.Pentagon;
    case '?':
      return Shape.Wild;
    case '-':
      return undefined;
    default:
      throw new Error(`Unrecognised shape marker '${marker}'`);
  }
};

export const shapeToString = (shape: Shape) => {
  if (shape === Shape.Wild) {
    return '?';
  }

  return Shape[shape].charAt(0).toLowerCase();
};
