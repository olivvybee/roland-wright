import { Node } from './Node';
import { getCentre, getHexColour } from './helpers';
import { Colour } from './types';

export class Edge {
  fromNode: Node;
  toNode: Node;
  colour: Colour;

  constructor(fromNode: Node, toNode: Node, colour: Colour) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.colour = colour;
  }

  isEqualTo = (otherEdge: Edge) => {
    return (
      (this.fromNode === otherEdge.fromNode &&
        this.toNode === otherEdge.toNode) ||
      (this.fromNode === otherEdge.toNode && this.toNode === otherEdge.fromNode)
    );
  };

  get intermediatePoints() {
    const xDir = Math.sign(this.toNode.x - this.fromNode.x);
    const yDir = Math.sign(this.toNode.y - this.fromNode.y);

    const points: Array<{ x: number; y: number }> = [];

    let x = this.fromNode.x + xDir;
    let y = this.fromNode.y + yDir;

    while (x !== this.toNode.x || y !== this.toNode.y) {
      points.push({ x, y });

      x += xDir;
      y += yDir;
    }

    return points;
  }

  intersects = (otherEdge: Edge) => {
    const isSameEdge = this.isEqualTo(otherEdge);
    if (isSameEdge) {
      return true;
    }

    const thisIntermediatePoints = this.intermediatePoints;
    const otherIntermediatePoints = otherEdge.intermediatePoints;

    return thisIntermediatePoints.some((point) =>
      otherIntermediatePoints.some(
        (otherPoint) => point.x === otherPoint.x && point.y === otherPoint.y
      )
    );
  };

  draw = (ctx: CanvasRenderingContext2D) => {
    const { x: fromX, y: fromY } = getCentre(this.fromNode);
    const { x: toX, y: toY } = getCentre(this.toNode);

    ctx.strokeStyle = getHexColour(this.colour);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  };

  toString = () => {
    return `Edge[from=(${this.fromNode.x},${this.fromNode.y}) to=(${
      this.toNode.x
    }, ${this.toNode.y}) colour=${Colour[this.colour]}]`;
  };
}
