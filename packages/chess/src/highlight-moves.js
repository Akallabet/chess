import * as R from 'ramda';
import { errorCodes } from './error-codes.js';
import { flags, modesList } from './constants.js';
import { generateMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';
import { modesMap } from './modes.js';
import {
  fromPositionToCoordinates,
  getKingPiece,
  getPieceCoord,
} from './utils/index.js';
import { move } from './move.js';
import { canPieceMoveToTarget } from './moves/is-cell-under-check.js';

const addCheckFlag = (origin, state) => moveData => {
  const { coord, flag } = moveData;
  const moveState = move(origin, coord, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  const isUnderCheck = canPieceMoveToTarget(coord, kingCoord, moveState);

  return isUnderCheck
    ? { coord, flag: { ...flag, [flags.check]: isUnderCheck } }
    : moveData;
};
export const highlightMoves = R.curry((addr, { FEN, ...initialState }) => {
  const coord = fromPositionToCoordinates(addr);
  const state = R.mergeRight(initialState, fromFEN(FEN));
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  if (hasNoPiece) throw new Error(errorCodes.no_piece_selected);

  const rejectMoves = R.path(
    [state.mode || modesList[0], 'rejectMoves'],
    modesMap
  );

  const moves = generateMoves(coord, state, rejectMoves, addCheckFlag);
  const boardWithHighlights = mapMovesToBoard(state.board, moves);
  return R.assoc('board', boardWithHighlights, state);
});
