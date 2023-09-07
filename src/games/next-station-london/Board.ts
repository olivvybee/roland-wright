import chalk from 'chalk';
import { NODES, START_NODES, TOURIST_SPOTS } from './boardSetup';
import { Colour, Shape } from './types';

const colourise = (colour: Colour | undefined) => {
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

export class Node {
  shape: Shape;
  x: number;
  y: number;
  isTouristSpot: boolean;
  startingSpaceColour: Colour | undefined;

  constructor(
    x: number,
    y: number,
    shape: Shape,
    isTouristSpot: boolean,
    startingSpaceColour: Colour | undefined
  ) {
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.isTouristSpot = isTouristSpot;
    this.startingSpaceColour = startingSpaceColour;
  }

  toString = () => {
    const shapeString = shapeToString(this.shape);
    return colourise(this.startingSpaceColour)(shapeString);
  };
}

const BOARD_SIZE = 10;

export class Board {
  nodes: Node[];

  constructor() {
    this.nodes = [];

    const nodeRows = NODES.split('\n')
      .map((row) => row.trim())
      .filter(Boolean);
    nodeRows.forEach((row, y) => {
      const nodes = row.split('').filter(Boolean);
      nodes.forEach((marker, x) => {
        const shape = parseShape(marker);
        if (shape !== undefined) {
          const isTouristSpot = TOURIST_SPOTS.some(
            (spot) => spot.x === x && spot.y === y
          );
          const startingSpaceColour = START_NODES.find(
            (startNode) => startNode.x === x && startNode.y === y
          )?.colour;
          const node = new Node(
            x,
            y,
            shape,
            isTouristSpot,
            startingSpaceColour
          );
          this.nodes.push(node);
        }
      });
    });
  }

  toString = () => {
    let output = '';
    for (let y = 0; y < BOARD_SIZE; y++) {
      let rowStr = '';
      for (let x = 0; x < BOARD_SIZE; x++) {
        const node = this.nodes.find((node) => node.x === x && node.y === y);
        if (node) {
          rowStr += colourise(node.startingSpaceColour)(
            shapeToString(node.shape)
          );
        } else {
          rowStr += '-';
        }
      }
      output += rowStr;
      output += '\n';
    }
    return output;
  };
}

const parseShape = (marker: string) => {
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

const shapeToString = (shape: Shape) => {
  if (shape === Shape.Wild) {
    return '?';
  }

  return Shape[shape].charAt(0).toLowerCase();
};
