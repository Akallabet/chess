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
export const updateProp = R.curryN(3, (prop, fn, obj) =>
  R.assoc(prop, fn(obj), obj)
);
export const getPieceCoord = (piece, board) => {
  for (let y = 0; y < board.length - 1; y++) {
    for (let x = 0; x < board[y].length - 1; x++) {
      if (R.pathEq([y, x, 'piece'], piece, board)) return { y, x };
    }
  }
};
