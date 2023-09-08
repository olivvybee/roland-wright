import { createCanvas } from 'canvas';

import { Node } from './Node';
import { Edge } from './Edge';
import {
  DISTRICT_LINES,
  NODES,
  RIVER,
  START_NODES,
  TOURIST_SPOTS,
} from './boardSetup';
import { Colour, Shape } from './types';
import { BOARD_SIZE, OUTPUT_SIZE, GRID_SIZE } from './constants';
import {
  getLinePosition,
  getCentre,
  colourise,
  parseShape,
  shapeToString,
} from './helpers';

export class Board {
  nodes: Node[];
  edges: Edge[];

  constructor() {
    this.nodes = [];
    this.edges = [];

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

  getNode = (x: number, y: number) => {
    return this.nodes.find((node) => node.x === x && node.y === y);
  };

  getStartNode = (colour: Colour): Node => {
    return this.nodes.find((node) => node.startingSpaceColour === colour)!;
  };

  getConnectedNodes = (node: Node) => {
    const connected: Node[] = [];

    for (let yDir = -1; yDir <= 1; yDir++) {
      for (let xDir = -1; xDir <= 1; xDir++) {
        let newX = node.x + xDir;
        let newY = node.y + yDir;

        while (
          newX >= 0 &&
          newX < BOARD_SIZE &&
          newY >= 0 &&
          newY < BOARD_SIZE
        ) {
          const otherNode = this.getNode(newX, newY);
          if (otherNode) {
            connected.push(otherNode);
            break;
          }

          newX += xDir;
          newY += yDir;
        }
      }
    }

    return connected;
  };

  getConnectedNodesWithShape = (node: Node, shape: Shape) => {
    return this.getConnectedNodes(node).filter(
      (otherNode) => otherNode.shape === shape
    );
  };

  getValidPotentialEdges = (node: Node, shape: Shape, colour: Colour) => {
    return this.getConnectedNodes(node)
      .filter(
        (otherNode) =>
          shape === Shape.Wild ||
          otherNode.shape === Shape.Wild ||
          otherNode.shape === shape
      )
      .map((otherNode) => new Edge(node, otherNode, colour))
      .filter((edge) => !this.edgeWouldIntersectExistingEdge(edge));
  };

  addEdge = (edge: Edge) => {
    this.edges.push(edge);
  };

  edgeWouldIntersectExistingEdge = (edge: Edge) => {
    return this.edges.some((otherEdge) => edge.intersects(otherEdge));
  };

  draw = () => {
    const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    ctx.strokeStyle = '#2b8dbe';
    ctx.lineJoin = 'round';
    ctx.lineWidth = GRID_SIZE / 3;
    ctx.beginPath();

    const { x: startX, y: startY } = getLinePosition(RIVER[0]);
    ctx.moveTo(startX, startY);
    RIVER.forEach((position) => {
      const { x: nextX, y: nextY } = getLinePosition(position);
      ctx.lineTo(nextX, nextY);
    });
    ctx.stroke();

    ctx.strokeStyle = '#eee600';
    ctx.lineWidth = 2;
    DISTRICT_LINES.forEach((line) => {
      const { x: fromX, y: fromY } = getLinePosition({
        x: line.fromX,
        y: line.fromY,
      });
      const { x: toX, y: toY } = getLinePosition({ x: line.toX, y: line.toY });

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    });

    this.nodes.forEach((node) => {
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'lightgrey';
      ctx.beginPath();

      const { x: startX, y: startY } = getCentre(node);

      const connectedNodes = this.getConnectedNodes(node).filter(
        (otherNode) =>
          otherNode.x > node.x ||
          (otherNode.x === node.x && otherNode.y > node.y)
      );
      connectedNodes.forEach((otherNode) => {
        const { x: endX, y: endY } = getCentre(otherNode);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });
    });

    ctx.setLineDash([]);

    this.edges.forEach((edge) => {
      edge.draw(ctx);
    });

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
        const node = this.getNode(x, y);
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
