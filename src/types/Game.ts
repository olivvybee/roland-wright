export interface GameResult {
  imageBuffer: Buffer;
  altText: string;
  stringRepresentation?: string;
}

export interface Game {
  name: string;
  play: () => GameResult;
}
