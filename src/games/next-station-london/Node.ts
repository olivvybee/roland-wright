import { NODE_SIZE, SHAPE_SIZE } from './constants';
import { getCentre, getHexColour, colourise, shapeToString } from './helpers';
import { Shape, Colour } from './types';

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
    const { x: centreX, y: centreY } = getCentre(this);

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
