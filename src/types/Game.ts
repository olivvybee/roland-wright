export interface GameResult {
  imageBuffer: Buffer;
  altText: string;
}

export interface Game {
  name: string;
  play: () => GameResult;
}
