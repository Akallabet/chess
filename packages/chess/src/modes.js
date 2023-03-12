import * as R from 'ramda';
import { modes } from './constants.js';
import { isCellUnderCheck } from './moves/index.js';
import { move } from './move.js';
import { getKingPiece, getPieceColor, getPieceCoord } from './utils/index.js';

const isKingUnderAttack = (origin, state) => {
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  return target => {
    const moveState = move(origin, target.coord, state);
    const pieceColor = getPieceColor(
      R.path([kingCoord.y, kingCoord.x, 'piece'], moveState.board)
    );
    const isUnderCheck = isCellUnderCheck(moveState, pieceColor, kingCoord);
    return isUnderCheck;
  };
};

export const modesMap = {
  [modes.standard]: { rejectMoves: isKingUnderAttack },
  [modes.demo]: { rejectMoves: () => R.F },
  [modes.practice]: { rejectMoves: () => R.F },
};
