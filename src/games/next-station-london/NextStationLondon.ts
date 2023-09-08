import { createCanvas } from 'canvas';
import { Game } from '../../types/Game';
import { Board } from './Board';
import { Bot } from './Bot';
import { Colour } from './types';
import { Edge } from './Edge';

export const NextStationLondon: Game = {
  name: 'next-station-london',
  play: () => {
    const bot = new Bot();
    bot.play();

    const stringRepresentation = bot.board.toString();
    const imageBuffer = bot.board.draw();

    return {
      imageBuffer,
      altText:
        "An abstract map of london with a randomly generated tube network. There are four lines - green, blue, purple, and pink - and they're connecting stations with squares, triangles, circles, and pentagons inside. Each line connects no more than 11 stations. All the unused potential connections between stations are shown as grey dotted lines.",
      stringRepresentation,
    };
  },
};
