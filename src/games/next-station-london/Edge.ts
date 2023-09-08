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
    // Divide xDir and yDir by 2 to account for edges that would intersect between
    // grid points, by treating the spaces halfway between grid points as points
    // e.g. an edge from (1, 1) to (2, 2) intersects an edge from (1, 2) to (2, 1)
    // but they do not cross at a grid point, they cross halfway between
    const xDir = Math.sign(this.toNode.x - this.fromNode.x) / 2;
    const yDir = Math.sign(this.toNode.y - this.fromNode.y) / 2;

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
    ctx.lineWidth = 10;
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
