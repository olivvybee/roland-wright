import fs from 'fs';
import path from 'path';
import { createCanvas, Image } from 'canvas';
import {
  OUTPUT_SIZE,
  ROW_COLUMN_COUNT,
  ASSETS_DIR,
  TILE_SIZE,
  BOARD_OFFSET,
  BOARD_SIZE,
} from './constants';
import { Tile } from './Tile';
import { Connection } from './types';
import { connectionToString } from './utils';
import { loadImage } from '../../utils/loadImage';

type GridSpace = Tile | undefined;

export class Board {
  grid: GridSpace[][];
  rowCount: number = ROW_COLUMN_COUNT;
  columnCount: number = ROW_COLUMN_COUNT;
  hasPlacedTile: boolean;
  boardEdges = {
    '0,1': {
      north: Connection.Road,
      east: Connection.None,
      south: Connection.None,
      west: Connection.None,
    },
    '0,3': {
      north: Connection.Rail,
      east: Connection.None,
      south: Connection.None,
      west: Connection.None,
    },
    '0,5': {
      north: Connection.Road,
      east: Connection.None,
      south: Connection.None,
      west: Connection.None,
    },
    '1,0': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.None,
      west: Connection.Rail,
    },
    '1,6': {
      north: Connection.None,
      east: Connection.Rail,
      south: Connection.None,
      west: Connection.None,
    },
    '3,0': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.None,
      west: Connection.Road,
    },
    '3,6': {
      north: Connection.None,
      east: Connection.Road,
      south: Connection.None,
      west: Connection.None,
    },
    '5,0': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.None,
      west: Connection.Rail,
    },
    '5,6': {
      north: Connection.None,
      east: Connection.Rail,
      south: Connection.None,
      west: Connection.None,
    },
    '6,1': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.Road,
      west: Connection.None,
    },
    '6,3': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.Rail,
      west: Connection.None,
    },
    '6,5': {
      north: Connection.None,
      east: Connection.None,
      south: Connection.Road,
      west: Connection.None,
    },
  };

  constructor() {
    this.hasPlacedTile = false;

    this.grid = [];
    for (let r = 0; r < this.rowCount; r++) {
      const row: GridSpace[] = [];
      for (let c = 0; c < this.columnCount; c++) {
        if (`${r},${c}` in this.boardEdges) {
          row.push(
            new Tile(
              {
                north: Connection.None,
                east: Connection.None,
                south: Connection.None,
                west: Connection.None,
              },
              this.boardEdges[`${r},${c}`]
            )
          );
        } else {
          row.push(undefined);
        }
      }
      this.grid.push(row);
    }
    //console.log(this.grid);
  }

  private preloadImages = async () => {
    const filenames = fs
      .readdirSync(ASSETS_DIR)
      .filter((filename) => filename.endsWith('.png'));

    return await filenames.reduce(async (processedPromise, filename) => {
      const processed = await processedPromise;

      const config = filename.replace('.png', '');
      const imagePath = path.resolve(ASSETS_DIR, filename);

      const image = await loadImage(imagePath);

      return {
        ...processed,
        [config]: image,
      };
    }, Promise.resolve({} as { [config: string]: Image }));
  };

  draw = async () => {
    const canvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(204, 225, 240)';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeRect(
      BOARD_OFFSET - 2,
      BOARD_OFFSET - 2,
      BOARD_SIZE + 4,
      BOARD_SIZE + 4
    );
    ctx.lineWidth = 1;

    const images = await this.preloadImages();

    for (let row = 0; row < this.rowCount; row++) {
      const y = row * TILE_SIZE + BOARD_OFFSET;

      ctx.beginPath();
      ctx.moveTo(BOARD_OFFSET, y);
      ctx.lineTo(BOARD_OFFSET + BOARD_SIZE, y);
      ctx.stroke();

      for (let column = 0; column < this.columnCount; column++) {
        const x = column * TILE_SIZE + BOARD_OFFSET;

        ctx.beginPath();
        ctx.moveTo(x, BOARD_OFFSET);
        ctx.lineTo(x, BOARD_OFFSET + BOARD_SIZE);
        ctx.stroke();

        const tile = this.getGridSpace(row, column) || Tile.emptyTile();
        const tileConfiguration = tile.configuration;
        const image = images[tileConfiguration];

        if (!image) {
          console.log(
            `No image found for tile config ${tileConfiguration} at (${row}, ${column})`
          );
        } else {
          ctx.drawImage(image, x, y);
        }
      }
    }

    return canvas.toBuffer();
  };

  placeTile = (tile: Tile, row: number, column: number) => {
    this.grid[row][column] = tile;
  };

  getGridSpace = (row: number, column: number) => {
    return this.grid[row][column];
  };

  toString = () => {
    let str = '';

    for (let i = 0; i <= ROW_COLUMN_COUNT * 6; i++) {
      str += '-';
    }
    str += '\n';

    for (let row = 0; row < this.rowCount; row++) {
      let rowStrs = ['|', '|', '|'];

      for (let column = 0; column < this.columnCount; column++) {
        const tile = this.getGridSpace(row, column) || Tile.emptyTile();
        const tileStrs = tile.toString().split('\n');
        rowStrs[0] += tileStrs[0] + '|';
        rowStrs[1] += tileStrs[1] + '|';
        rowStrs[2] += tileStrs[2] + '|';
      }

      str += `${rowStrs[0]}\n${rowStrs[1]}\n${rowStrs[2]}\n`;

      for (let i = 0; i < rowStrs[0].length; i++) {
        str += '-';
      }
      str += '\n';
    }

    return str;
  };
}
