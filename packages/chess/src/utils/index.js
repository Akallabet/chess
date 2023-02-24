import * as R from 'ramda';
export { rotate } from './rotate.js';

export const isWhitePiece = piece => new RegExp(/[PNBRQK]+/).test(piece);
export const isBlackPiece = piece => new RegExp(/[pnbrqk]+/).test(piece);
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
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (R.pathEq([y, x, 'piece'], piece, board)) return { y, x };
    }
  }
};
export const isChessboardPos = pos =>
  new RegExp(/([pnbrqkPNBRQK]+[a-h]+[1-9]+)/).test(pos);

export const isCellEmpty = R.curry((state, { y, x }) =>
  R.isNil(R.path([y, x, 'piece'], state.board))
);

export const isCellOccupied = R.curry((state, { y, x }) =>
  R.hasPath([y, x, 'piece'], state.board)
);

export const areCellsEmpty = R.curry((state, cells) =>
  R.all(isCellEmpty(state), cells)
);

export const anyCellOccupied = R.curry((state, cells) =>
  R.any(isCellOccupied(state), cells)
);
