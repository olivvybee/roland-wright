export interface GameResult {
  imageBuffer: Buffer;
  altText: string;
}

export interface Game {
  play: () => GameResult;
}
