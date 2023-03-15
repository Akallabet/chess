import * as R from 'ramda';
import { errorCodes } from './error-codes.js';
import { modesList } from './constants.js';
import { generateMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';
import { modesMap } from './modes.js';
import { fromPositionToCoordinates } from './utils/index.js';

export const highlightMoves = R.curry((addr, { FEN, ...initialState }) => {
  const coord = fromPositionToCoordinates(addr);
  const state = R.mergeRight(initialState, fromFEN(FEN));
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  if (hasNoPiece) throw new Error(errorCodes.no_piece_selected);

  const { rejectMoves, addCheckFlag } = modesMap[state.mode || modesList[0]];

  const moves = generateMoves(coord, state, rejectMoves, addCheckFlag);
  const boardWithHighlights = mapMovesToBoard(state.board, moves);

  return R.assoc('board', boardWithHighlights, state);
});
