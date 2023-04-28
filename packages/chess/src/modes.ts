import * as R from 'ramda';
import { modes } from './constants.js';
import { isCellUnderCheck } from './moves/index.js';
import { moveAndUpdateState } from './move.js';
import { getKingPiece, getPieceColor, getPieceCoord } from './utils/index.js';
import { canPieceMoveToTarget } from './moves/is-cell-under-check.js';
import { Coordinates, InternalState, Move, MoveState } from './types.js';
import { errorCodes } from './error-codes.js';

const isKingUnderAttack = ({
  origin,
  state,
  current: target,
}: MoveState): boolean => {
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  const moveState = moveAndUpdateState(origin, target, state);
  const pieceColor = getPieceColor(
    moveState.board[kingCoord.y][kingCoord.x].piece
  );
  const isUnderCheck = isCellUnderCheck(moveState, pieceColor, kingCoord);
  return isUnderCheck;
};

const addCheckFlag =
  (origin: Coordinates, state: InternalState) => (moveData: Move) => {
    const moveState = moveAndUpdateState(origin, moveData.coord, state);
    const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
    if (!kingCoord) throw new Error(errorCodes.king_not_found);

    const isUnderCheck = canPieceMoveToTarget(
      moveData.coord,
      kingCoord,
      moveState
    );

    if (isUnderCheck) moveData.flags.check = true;
    return moveData;
  };

export const modesMap = {
  [modes.standard]: { rejectMove: isKingUnderAttack, addCheckFlag },
  [modes.demo]: {
    rejectMove: () => false,
    addCheckFlag: () => R.identity,
  },
  [modes.practice]: { rejectMove: () => false, addCheckFlag: () => R.identity },
};
