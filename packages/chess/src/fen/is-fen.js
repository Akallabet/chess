import * as R from 'ramda';
import { rowFromFEN } from './from-fen.js';

const checkPiecePlacement = R.pipe(
  R.split(' '),
  R.head,
  R.split('/'),
  R.all(row => rowFromFEN(row).length === 8)
);
const FENRegExp = new RegExp(
  /^((([pnbrqkPNBRQK1-8]{1,8})\/?){8})\s+(b|w)\s+(-|K?Q?k?q)\s+(-|[a-h][3-6])\s+(\d+)\s+(\d+)\s*$/
);
export const isFEN = R.both(FEN => FENRegExp.test(FEN), checkPiecePlacement);
