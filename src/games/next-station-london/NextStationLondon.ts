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
      altText: '',
      stringRepresentation,
    };
  },
};
