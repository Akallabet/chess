import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from './constants.js';
import { highlightMoves } from './moves/index.js';
import { fromFEN } from './fen/index.js';

const isPiece = piece => new RegExp(/^[pnbrqkPNBRQK]$/).test(piece);
const isChessboardPos = pos =>
  new RegExp(/([pnbrqkPNBRQK]+[a-h]+[1-9]+)/).test(pos);

export const fromChessBoardToCoordinates = pos => {
  const [file, rank] = R.split('', pos);
  return {
    x: files.indexOf(file),
    y: ranks.indexOf(Number(rank)),
  };
};

export const hasPiece = R.curry(
  ({ x, y }, { board }) => board[y] && board[y][x] && isPiece(board[y][x].piece)
);

const calcMoves = R.curry(({ x, y }, { FEN }) =>
  R.pipe(
    fromFEN,
    R.ifElse(
      hasPiece({ x, y }),
      state => ({
        ...state,
        board: highlightMoves({ x, y }, state),
      }),
      R.assoc('error', errorCodes.no_piece_selected)
    )
  )(FEN)
);

export const getMoves = R.curry((pos, state) => {
  if (isChessboardPos(pos)) {
    return getMoves(fromChessBoardToCoordinates(pos), state);
  }
  if (R.has('x', pos) && R.has('y', pos)) return calcMoves(pos, state);
  return {
    error: errorCodes.wrongFormat,
    ...state,
  };
});
