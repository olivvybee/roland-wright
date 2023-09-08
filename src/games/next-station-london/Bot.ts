import { Board } from './Board';
import { Card, CardColour } from './Card';
import { Node } from './Node';
import { CARDS } from './cards';
import _shuffle from 'lodash/shuffle';
import { Colour, Shape } from './types';
import { Edge } from './Edge';

export class Bot {
  board: Board;
  colourOrder: Colour[];

  deck: Card[];
  seenPinkCards: number;
  routeNodes: Node[];

  constructor() {
    this.board = new Board();
    this.colourOrder = _shuffle([
      Colour.Green,
      Colour.Blue,
      Colour.Pink,
      Colour.Purple,
    ]);

    this.deck = _shuffle([...CARDS]);
    this.seenPinkCards = 0;
    this.routeNodes = [];
  }

  drawCard = () => {
    const card = this.deck.pop()!;
    if (card.isSwitchCard) {
      const nextCard = this.deck.pop()!;
      card.colour = nextCard.colour;
      card.shape = nextCard.shape;
    }

    if (card.colour === CardColour.Pink) {
      this.seenPinkCards++;
    }

    return card;
  };

  play = () => {
    this.colourOrder.forEach((colour) => {
      this.deck = _shuffle([...CARDS]);
      this.seenPinkCards = 0;
      this.routeNodes = [];

      const startNode = this.board.getStartNode(colour);
      this.routeNodes.push(startNode);

      let cardsPlayed = 0;

      while (this.seenPinkCards < 5) {
        cardsPlayed++;
        const { shape = Shape.Wild, isSwitchCard } = this.drawCard();

        const fromNodes = isSwitchCard
          ? [...this.routeNodes]
          : [this.routeNodes.at(0)!, this.routeNodes.at(-1)!];

        const potentialEdges = fromNodes.flatMap((node) =>
          this.board
            .getValidPotentialEdges(node, shape, colour)
            .filter(
              (potentialEdge) => !this.routeNodes.includes(potentialEdge.toNode)
            )
        );

        if (potentialEdges.length === 0) {
          continue;
        }

        let chosenEdge: Edge;

        // Give priority to tourist sites
        const touristSiteEdges = potentialEdges.filter(
          (edge) => edge.toNode.isTouristSpot
        );
        if (touristSiteEdges.length > 0) {
          const chosenPosition = Math.floor(
            Math.random() * touristSiteEdges.length
          );
          chosenEdge = touristSiteEdges.at(chosenPosition)!;
        } else {
          const chosenPosition = Math.floor(
            Math.random() * potentialEdges.length
          );
          chosenEdge = potentialEdges.at(chosenPosition)!;
        }

        this.board.addEdge(chosenEdge);

        if (chosenEdge.fromNode === this.routeNodes[0]) {
          this.routeNodes.splice(0, 0, chosenEdge.toNode);
        } else {
          this.routeNodes.push(chosenEdge.toNode);
        }
      }

      console.log(`${Colour[colour]}: played ${cardsPlayed} cards`);
    });
  };
}
