import { Colour } from './types';

export const NODES = `
pts-tc-t-c
-p-s--p-sp
c--t--s--t
s-p-t?cc-s
-ts-ps--p-
p-s-c--c--
---pt-st-t
c-sc-p--cp
-c----p-t-
ts-pct-c-s
`;

export const TOURIST_SPOTS = [
  { x: 6, y: 1 },
  { x: 0, y: 3 },
  { x: 5, y: 3 },
  { x: 9, y: 6 },
  { x: 4, y: 9 },
];

export const START_NODES = [
  { x: 3, y: 2, colour: Colour.Green },
  { x: 7, y: 3, colour: Colour.Pink },
  { x: 2, y: 5, colour: Colour.Purple },
  { x: 5, y: 7, colour: Colour.Blue },
];

export const RIVER = [
  { x: -1, y: 3 },
  { x: 2.1, y: 3 },
  { x: 3.5, y: 4.4 },
  { x: 3.8, y: 4.95 },
  { x: 5, y: 4.95 },
  { x: 6, y: 4 },
  { x: 10, y: 4 },
];
