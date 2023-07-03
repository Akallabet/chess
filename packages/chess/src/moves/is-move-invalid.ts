import { Coordinates, InternalState } from '../types.js';
import { getKingPiece, getPieceCoord } from '../utils.js';
import { isCellUnderCheck } from './is-cell-under-check.js';
import { moveAndUpdateState } from './move-and-update-state.js';

export function isInvalidMove({
  origin,
  target,
  state,
}: {
  origin: Coordinates;
  target: Coordinates;
  state: InternalState;
}): boolean {
  const moveState = moveAndUpdateState(origin, target, state);
  const kingCoord = getPieceCoord(
    getKingPiece(state.activeColor),
    moveState.board
  );
  if (!kingCoord) return false;

  return isCellUnderCheck(moveState, kingCoord);
}
