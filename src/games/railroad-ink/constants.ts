import path from 'path';

export const OUTPUT_SIZE = 1000;
export const ROW_COLUMN_COUNT = 7;
export const TILE_SIZE = 128;
export const BOARD_SIZE = 128 * ROW_COLUMN_COUNT;
export const BOARD_OFFSET = (OUTPUT_SIZE - BOARD_SIZE) / 2;

export const ASSETS_DIR = path.resolve(
  'src',
  'games',
  'railroad-ink',
  'assets'
);
