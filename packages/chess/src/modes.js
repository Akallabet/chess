import * as R from 'ramda';
import { modes } from './constants.js';
import { isCellUnderCheck } from './moves/index.js';
import { move } from './move.js';
import { getPieceCoord } from './utils/index.js';

const getKingPiece = ({ activeColor }) => (activeColor === 'w' ? 'K' : 'k');

const isKingUnderAttack = (origin, state) => {
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  return target => {
    return isCellUnderCheck(move(origin, target.coord, state), kingCoord);
  };
};

export const modesMap = {
  [modes.standard]: { rejectMoves: isKingUnderAttack },
  [modes.demo]: { rejectMoves: () => R.F },
  [modes.practice]: { rejectMoves: () => R.F },
};
