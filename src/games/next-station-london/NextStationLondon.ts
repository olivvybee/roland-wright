import { createCanvas } from 'canvas';
import { Game } from '../../types/Game';
import { Board } from './Board';

export const NextStationLondon: Game = {
  name: 'next-station-london',
  play: () => {
    const board = new Board();

    const stringRepresentation = board.toString();
    const imageBuffer = renderResult(board);

    return {
      imageBuffer,
      altText: '',
      stringRepresentation,
    };
  },
};

const renderResult = (board: Board) => {
  return createCanvas(100, 100).toBuffer();
};
