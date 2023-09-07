import { createCanvas } from 'canvas';
import { Game } from '../../types/Game';
import { Board } from './Board';

export const NextStationLondon: Game = {
  name: 'next-station-london',
  play: () => {
    const board = new Board();

    const stringRepresentation = board.toString();
    const imageBuffer = board.draw();

    return {
      imageBuffer,
      altText: '',
      stringRepresentation,
    };
  },
};
