import * as R from 'ramda';
import { errorCodes } from './error-codes.js';
import { generateLegalMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';
import { fromPositionToCoordinates } from './utils/index.js';

export const highlightMoves = R.curry((addr, { FEN, ...initialState }) => {
  const coord = fromPositionToCoordinates(addr);
  const state = R.mergeRight(initialState, fromFEN(FEN));
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  if (hasNoPiece) throw new Error(errorCodes.no_piece_selected);

  const { board } = state;
  const moves = generateLegalMoves(coord, state);
  const boardWithHighlights = mapMovesToBoard(board, moves);

  return R.assoc('board', boardWithHighlights, state);
});
