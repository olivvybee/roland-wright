import { createCanvas } from 'canvas';

import { selectRandom } from '../../utils/random.js';

import { Bot } from './Bot.js';
import { Board } from './Board.js';
import { PATTERNS } from './patterns.js';
import { isColourRestriction, isValueRestriction } from './Restriction.js';
import { DiceColour } from './Dice.js';
import { Game } from '../../types/Game.js';

export const Sagrada: Game = {
  play: () => {
    const pattern = selectRandom(PATTERNS);
    const board = new Board(pattern);
    const bot = new Bot(board);

    const result = bot.play();
    const imageBuffer = renderResult(result);

    return {
      imageBuffer,
      altText:
        "An illustration of completed Sagrada board. It's a grid with 4 rows and 5 columns, filled with randomly chosen dice coloured red, green, blue, yellow, and purple.",
    };
  },
};

const WIDTH = 1600;
const HEIGHT = 900;

const PADDING_V = 25;

const BOARD_HEIGHT = HEIGHT - 2 * PADDING_V;

const DIVIDER_SIZE = BOARD_HEIGHT / 18;
const DICE_SIZE = (BOARD_HEIGHT - 5 * DIVIDER_SIZE) / 4;

const PADDING_H = (WIDTH - 6 * DIVIDER_SIZE - 5 * DICE_SIZE) / 2;

const PIP_SIZE = 20;
const PIP_PADDING = 5;

const renderResult = (board: Board) => {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(200,200,190)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = 'pink';
  ctx.strokeRect(
    PADDING_H,
    PADDING_V,
    6 * DIVIDER_SIZE + 5 * DICE_SIZE,
    5 * DIVIDER_SIZE + 4 * DICE_SIZE
  );

  ctx.fillStyle = 'black';
  for (let x = 0; x < 6; x++) {
    ctx.fillRect(
      x * (DICE_SIZE + DIVIDER_SIZE) + PADDING_H,
      PADDING_V,
      DIVIDER_SIZE,
      BOARD_HEIGHT
    );
  }
  for (let y = 0; y < 5; y++) {
    ctx.fillRect(
      PADDING_H,
      y * (DICE_SIZE + DIVIDER_SIZE) + PADDING_V,
      WIDTH - 2 * PADDING_H,
      DIVIDER_SIZE
    );
  }

  for (let row = 0; row < board.rowCount; row++) {
    for (let column = 0; column < board.columnCount; column++) {
      const [x, y] = getCoordinates(row, column);

      const dice = board.getDice(row, column);
      if (dice) {
        ctx.fillStyle = `rgb(${diceColourToRgb(dice.colour)})`;
        ctx.fillRect(x, y, DICE_SIZE, DICE_SIZE);
        ctx.fillStyle = 'rgb(255, 255, 255)';
        drawPips(ctx, dice.value || 0, row, column);
      } else {
        const restriction = board.getRestriction(row, column);

        if (isColourRestriction(restriction)) {
          ctx.fillStyle = `rgba(${diceColourToRgb(restriction.colour)}, 0.4)`;
          ctx.fillRect(x, y, DICE_SIZE, DICE_SIZE);
        }

        if (isValueRestriction(restriction)) {
          ctx.fillStyle = 'rgb(140,140,140)';
          drawPips(ctx, restriction.value, row, column);
        }
      }
    }
  }

  return canvas.toBuffer();
};

const getCoordinates = (row: number, column: number) => {
  const x = column * (DICE_SIZE + DIVIDER_SIZE) + DIVIDER_SIZE + PADDING_H;
  const y = row * (DICE_SIZE + DIVIDER_SIZE) + DIVIDER_SIZE + PADDING_V;
  return [x, y];
};

const drawPips = (
  ctx: CanvasRenderingContext2D,
  value: number,
  row: number,
  column: number
) => {
  const [x, y] = getCoordinates(row, column);
  const centreX = x + DICE_SIZE / 2;
  const centreY = y + DICE_SIZE / 2;

  if (value % 2 === 1) {
    ctx.beginPath();
    ctx.arc(centreX, centreY, PIP_SIZE, 0, 2 * Math.PI);
    ctx.fill();
  }

  if (value > 1) {
    ctx.beginPath();
    ctx.arc(
      centreX - 2 * PIP_SIZE - PIP_PADDING,
      centreY + 2 * PIP_SIZE + PIP_PADDING,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      centreX + 2 * PIP_SIZE + PIP_PADDING,
      centreY - 2 * PIP_SIZE - PIP_PADDING,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  if (value > 3) {
    ctx.beginPath();
    ctx.arc(
      centreX + 2 * PIP_SIZE + PIP_PADDING,
      centreY + 2 * PIP_SIZE + PIP_PADDING,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      centreX - 2 * PIP_SIZE - PIP_PADDING,
      centreY - 2 * PIP_SIZE - PIP_PADDING,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  if (value === 6) {
    ctx.beginPath();
    ctx.arc(
      centreX + 2 * PIP_SIZE + PIP_PADDING,
      centreY,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      centreX - 2 * PIP_SIZE - PIP_PADDING,
      centreY,
      PIP_SIZE,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
};

const diceColourToRgb = (colour: DiceColour) => {
  switch (colour) {
    case DiceColour.Red:
      return '189,33,37';
    case DiceColour.Green:
      return '41,146,89';
    case DiceColour.Blue:
      return '53,112,175';
    case DiceColour.Yellow:
      return '216,197,38';
    case DiceColour.Purple:
      return '125,53,117';
  }
};
