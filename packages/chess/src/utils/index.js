import * as R from 'ramda';
export { rotate } from './rotate.js';
export { withRotatedBoard } from './with-rotated-board.js';

const isWhitePiece = piece => new RegExp(/[PNBRQK]+/).test(piece);
const isBlackPiece = piece => new RegExp(/[pnbrqk]+/).test(piece);
export const areOpponents = (pa, pb) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

export const overProp = R.curryN(3, (prop, fn, item) =>
  R.over(R.lensProp(prop), fn, item)
);
