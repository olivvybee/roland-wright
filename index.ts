import path from 'path';
import fs from 'fs';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config as loadEnv } from 'dotenv';

import { GAMES } from './src/games';
import { Game } from './src/types/Game';
import { Sagrada } from './src/games/sagrada';
import { Mastodon } from './src/mastodon';
import { NextStationLondon } from './src/games/next-station-london';

const schedule: { [hour: number]: Game } = {
  9: Sagrada,
  13: NextStationLondon,
  17: Sagrada,
  21: NextStationLondon,
};

interface MainArgs {
  gameName?: string;
  dryRun?: boolean;
}

const main = async ({ gameName, dryRun = false }: MainArgs) => {
  const hour = new Date().getHours();

  const game = gameName
    ? GAMES.find((game) => game.name.toLowerCase() === gameName.toLowerCase())
    : schedule[hour];

  if (!game) {
    if (gameName) {
      console.log(`Unrecognised game name "${gameName}"`);
    } else {
      console.log(`No game scheduled for ${hour}:00.`);
    }
    return;
  }

  const output = game.play();

  if (dryRun) {
    if (output.stringRepresentation) {
      console.log(output.stringRepresentation);
    }
    const outputFile = path.relative('.', './output.png');
    fs.writeFileSync(outputFile, output.imageBuffer, 'binary');
  } else {
    const mastodon = new Mastodon(
      process.env.INSTANCE_URL || '',
      process.env.ACCESS_TOKEN || ''
    );

    const { id: imageId } = await mastodon.uploadImage(
      output.imageBuffer,
      output.altText
    );

    await mastodon.postStatus(game.name, [imageId]);
  }
};

const argv = yargs(hideBin(process.argv))
  .option('game', {
    alias: 'g',
    type: 'string',
    description: 'The name of the game to run',
  })
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: "Play the game, but don't post to mastodon",
  })
  .parseSync();

loadEnv();
main({ gameName: argv.game, dryRun: argv.dryRun });
