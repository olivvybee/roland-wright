import { GAMES } from './games';
import { Mastodon } from './mastodon';

import fs from 'fs';

interface Event {
  gameName: keyof typeof GAMES;
}

const handler = async (event: Event) => {
  const { gameName } = event;

  const game = GAMES[gameName];
  if (!game) {
    throw new Error(`Unrecognised game name "${gameName}"`);
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

  await mastodon.postStatus(gameName, [imageId]);
};

export default handler;
