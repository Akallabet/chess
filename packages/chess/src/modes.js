import * as R from 'ramda';
import { flags, modes } from './constants.js';
import { isCellUnderCheck } from './moves/index.js';
import { move } from './move.js';
import { getKingPiece, getPieceColor, getPieceCoord } from './utils/index.js';
import { canPieceMoveToTarget } from './moves/is-cell-under-check.js';

const isKingUnderAttack = (origin, state, target) => {
  console.log(origin, target);
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  const moveState = move(origin, target, state);
  const pieceColor = getPieceColor(
    R.path([kingCoord.y, kingCoord.x, 'piece'], moveState.board)
  );
  const isUnderCheck = isCellUnderCheck(moveState, pieceColor, kingCoord);
  return isUnderCheck;
};

const addCheckFlag = (origin, state) => moveData => {
  const { coord, flag } = moveData;
  const moveState = move(origin, coord, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  const isUnderCheck = canPieceMoveToTarget(coord, kingCoord, moveState);

  return isUnderCheck
    ? { coord, flag: { ...flag, [flags.check]: isUnderCheck } }
    : moveData;
};

export const modesMap = {
  [modes.standard]: { rejectMove: isKingUnderAttack, addCheckFlag },
  [modes.demo]: { rejectMove: R.F, addCheckFlag: () => R.identity },
  [modes.practice]: { rejectMove: R.F, addCheckFlag: () => R.identity },
};
