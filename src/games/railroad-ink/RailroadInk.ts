import { Game } from '../../types/Game';
import { Bot } from './Bot';
import { Board } from './Board';

export const RailroadInk: Game = {
  name: 'Railroad Ink',
  play: async () => {
    const board = new Board();
    // console.log(JSON.stringify(board.grid, null, 2));
    const bot = new Bot(board);
    bot.play();

    const stringRepresentation = bot.board.toString();
    const imageBuffer = await bot.board.draw();

    return {
      imageBuffer,
      altText: 'awawa',
      stringRepresentation,
    };
  },
};
