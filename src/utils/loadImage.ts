import fs from 'fs';
import { loadImage as loadImageFromBuffer } from 'canvas';

export const loadImage = async (path: string) => {
  const buffer = fs.readFileSync(path);
  return loadImageFromBuffer(buffer);
};
