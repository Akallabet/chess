import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from './constants.js';
import { generateMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';

const isPiece = piece => new RegExp(/^[pnbrqkPNBRQK]$/).test(piece);

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

const calcMoves = R.curry(({ x, y }, state) =>
  R.pipe(
    R.ifElse(
      hasPiece({ x, y }),
      state => ({
        ...state,
        board: mapMovesToBoard(
          state.board,
          // R.reject(isKingUnderAttack(king, state, coord), moves)
          generateMoves({ x, y }, state)
        ),
      }),
      R.assoc('error', errorCodes.no_piece_selected)
    )
  )(state)
);

export const highlightMoves = R.curry((pos, state) => {
  if (R.has('x', pos) && R.has('y', pos))
    return calcMoves(pos, fromFEN(state.FEN));
  return {
    error: errorCodes.wrongFormat,
    ...state,
  };
});
