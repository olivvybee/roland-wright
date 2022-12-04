import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config as loadEnv } from 'dotenv';

import { GAMES } from './src/games';
import { Game } from './src/types/Game';
import { Sagrada } from './src/games/sagrada';
import { Mastodon } from './src/mastodon';

const schedule: { [hour: number]: Game } = {
  9: Sagrada,
  21: Sagrada,
};

const main = async (gameName?: string) => {
  const hour = new Date().getHours();

  const game = gameName
    ? GAMES.find((game) => game.name.toLowerCase() === gameName.toLowerCase())
    : schedule[hour];

  if (!game) {
    return;
  }

  const output = game.play();

  const mastodon = new Mastodon(
    process.env.INSTANCE_URL || '',
    process.env.ACCESS_TOKEN || ''
  );

  const { id: imageId } = await mastodon.uploadImage(
    output.imageBuffer,
    output.altText
  );

  await mastodon.postStatus(game.name, [imageId]);
};

const argv = yargs(hideBin(process.argv))
  .option('game', {
    alias: 'g',
    type: 'string',
    description: 'THe name of the game to run',
  })
  .parseSync();

loadEnv();
main(argv.game);
