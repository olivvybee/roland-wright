import chalk from 'chalk';
import { Canvas, createCanvas } from 'canvas';

import { NODES, START_NODES, TOURIST_SPOTS } from './boardSetup';
import { Colour, Shape } from './types';

const BOARD_SIZE = 10;

const OUTPUT_SIZE = 1000;
const GRID_SIZE = OUTPUT_SIZE / BOARD_SIZE;
const NODE_SIZE = GRID_SIZE / 2;
const SHAPE_SIZE = NODE_SIZE - 25;

const getHexColour = (colour: Colour | undefined) => {
  switch (colour) {
    case Colour.Green:
      return '#338538';
    case Colour.Pink:
      return '#f2296f';
    case Colour.Purple:
      return '#6f389c';
    case Colour.Blue:
      return '#006bc9';
    default:
      return '#211759';
  }
};

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

  get isStartingSpace() {
    return this.startingSpaceColour !== undefined;
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const centreX = (this.x + 0.5) * GRID_SIZE;
    const centreY = (this.y + 0.5) * GRID_SIZE;

    const colour = getHexColour(this.startingSpaceColour);

    if (this.isTouristSpot) {
      const innerSize = NODE_SIZE / 2 + 1;
      const outerSize = NODE_SIZE / 2 + 8;

      let rot = (Math.PI / 2) * 3;
      let x = centreX;
      let y = centreY;
      let step = Math.PI / 8;

      ctx.beginPath();
      ctx.moveTo(centreX, centreY - outerSize);
      for (let i = 0; i < 8; i++) {
        x = centreX + Math.cos(rot) * outerSize;
        y = centreY + Math.sin(rot) * outerSize;
        ctx.lineTo(x, y);
        rot += step;

        x = centreX + Math.cos(rot) * innerSize;
        y = centreY + Math.sin(rot) * innerSize;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(centreX, centreY - outerSize);
      ctx.closePath();

      ctx.fillStyle = getHexColour(this.startingSpaceColour);
      ctx.fill();
    }

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(centreX, centreY, NODE_SIZE / 2, NODE_SIZE / 2, 0, 0, 360);
    if (this.isStartingSpace) {
      ctx.fillStyle = colour;
      ctx.fill();
    } else {
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.strokeStyle = colour;
      ctx.stroke();
    }

    ctx.lineWidth = 3;

    if (this.shape === Shape.Wild) {
      ctx.fillStyle = getHexColour(undefined);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${SHAPE_SIZE * 1.5}px "Arial Rounded MT Bold"`;
      ctx.fillText('?', centreX, centreY);

      return;
    }

    if (this.shape === Shape.Circle) {
      ctx.beginPath();
      ctx.ellipse(
        centreX,
        centreY,
        SHAPE_SIZE / 2 + 3,
        SHAPE_SIZE / 2 + 3,
        0,
        0,
        360
      );
    } else if (this.shape === Shape.Square) {
      const x = centreX - SHAPE_SIZE / 2;
      const y = centreY - SHAPE_SIZE / 2;

      ctx.beginPath();
      ctx.rect(x, y, SHAPE_SIZE, SHAPE_SIZE);
    } else if (this.shape === Shape.Triangle) {
      ctx.beginPath();
      ctx.moveTo(centreX, centreY - SHAPE_SIZE / 2 - 3);
      ctx.lineTo(centreX - SHAPE_SIZE / 2 - 3, centreY + SHAPE_SIZE / 2);
      ctx.lineTo(centreX + SHAPE_SIZE / 2 + 3, centreY + SHAPE_SIZE / 2);
      ctx.closePath();
    } else if (this.shape === Shape.Pentagon) {
      ctx.beginPath();
      ctx.moveTo(
        centreX + (SHAPE_SIZE / 2 + 3) * Math.cos(-0.5 * Math.PI),
        centreY + (SHAPE_SIZE / 2 + 3) * Math.sin(-0.5 * Math.PI)
      );

      for (let i = 1; i <= 5; i += 1) {
        const angle = (i * 2 * Math.PI) / 5 - 0.5 * Math.PI;
        ctx.lineTo(
          centreX + (SHAPE_SIZE / 2 + 3) * Math.cos(angle),
          centreY + (SHAPE_SIZE / 2 + 3) * Math.sin(angle)
        );
      }
    }

    if (this.isStartingSpace) {
      ctx.strokeStyle = 'white';
    } else {
      ctx.strokeStyle = colour;
    }

    ctx.stroke();
  };

  toString = () => {
    const shapeString = shapeToString(this.shape);
    return colourise(this.startingSpaceColour)(shapeString);
  };
}

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

  draw = () => {
    const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    this.nodes.forEach((node) => {
      node.draw(ctx);
    });

    return canvas.toBuffer();
  };

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
