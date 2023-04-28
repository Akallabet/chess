import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from '../constants.js';
import { Address, ChessBoardType, Coordinates } from '../types.js';
export { rotate } from './rotate.js';

export const isWhitePiece = (piece: string): boolean =>
  new RegExp(/[PNBRQK]+/).test(piece);
export const isBlackPiece = (piece: string): boolean =>
  new RegExp(/[pnbrqk]+/).test(piece);
export const isActiveColorWhite = (color: string): boolean => color === 'w';
export const isActiveColorBlack = (color: string): boolean => color === 'b';
export const isOpponentPiece = (color: string, piece: string): boolean =>
  (isActiveColorWhite(color) && isBlackPiece(piece)) ||
  (isActiveColorBlack(color) && isWhitePiece(piece));
export const isActiveColorPiece = R.complement(isOpponentPiece);

export const areOpponents = (pa, pb) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

export const getPieceColor = piece => (isWhitePiece(piece) ? 'w' : 'b');
export const getKingPiece = ({ activeColor }) =>
  activeColor === 'w' ? 'K' : 'k';

export const getPieceCoord = (piece: string, board: ChessBoardType) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (R.pathEq([y, x, 'piece'], piece, board)) return { y, x };
    }
  }
};
// export const isAddress = addr =>
//   new RegExp(/([pnbrqkPNBRQK]+[a-h]+[1-9]+)/).test(addr);
export const isAddress = addr => new RegExp(/([a-h]+[1-9]+)/).test(addr);

export const fromPositionToCoordinates = (pos: Address | Coordinates) => {
  if (isAddress(pos)) {
    const [file, rank] = pos.split('');
    return {
      x: files.indexOf(file),
      y: ranks.indexOf(Number(rank)),
    };
  }
  const isCoord = R.has('x', pos) && R.has('y', pos);
  if (!isCoord) throw new Error(errorCodes.wrongFormat);
  return pos;
};

export const isCellEmpty = R.curry((state, { y, x }) =>
  R.isNil(R.path([y, x, 'piece'], state.board))
);

export const isCellOccupied = R.curry((state, { y, x }) =>
  R.hasPath([y, x, 'piece'], state.board)
);

export const areCellsEmpty = R.curry((state, cells) =>
  R.all(
    ({ y, x }) =>
      isCellEmpty(state, getPieceColor(R.path([y, x, 'piece'], state.board))),
    cells
  )
);

export const anyCellOccupied = R.curry((state, cells) =>
  R.any(isCellOccupied(state), cells)
);

export const overProp = R.curryN(3, (prop, fn, item) =>
  R.over(R.lensProp(prop), fn, item)
);
export const updateProp = R.curryN(3, (prop, fn, obj) =>
  R.assoc(prop, fn(obj), obj)
);
