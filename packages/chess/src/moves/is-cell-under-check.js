import * as R from 'ramda';
import { flags } from '../constants.js';
import { isActiveColorPiece, isOpponentPiece } from '../utils/index.js';
import { mapMovesToBoard } from './map-moves-to-board.js';
import { generateMoves } from './generate-moves.js';
//Loop through each row
//Loop through each cell
//If there is a piece and it's opponent
//  then get all the moves for that piece
//    for each move
//      if at least one matches coord
//        then return true
//return false otherwise

export const canPieceMoveToTarget = (origin, target, state) => {
  return R.pipe(
    mapMovesToBoard(state.board),
    R.path([target.y, target.x]),
    R.either(R.has(flags.capture), R.has(flags.move))
  )(generateMoves(origin, state, () => R.F));
};

export const getOriginsForTargetCell = (target, activeColor, state) => {
  const { board } = state;
  const origins = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (
        R.hasPath([y, x, 'piece'], board) &&
        isActiveColorPiece(activeColor, R.path([y, x, 'piece'], board)) &&
        canPieceMoveToTarget({ y, x }, target, state)
      ) {
        origins.push({ y, x });
      }
    }
  }
  return origins;
};

export const isCellUnderCheck = R.curry((state, activeColor, target) => {
  const { board } = state;

  for (let y = 0; y < board.length - 1; y++) {
    for (let x = 0; x < board[y].length - 1; x++) {
      if (
        R.hasPath([y, x, 'piece'], board) &&
        isOpponentPiece(activeColor, R.path([y, x, 'piece'], board)) &&
        canPieceMoveToTarget({ y, x }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
});

export const anyCellUnderCheck = R.curry((state, activeColor, coords) =>
  R.any(coord => isCellUnderCheck(state, activeColor, coord), coords)
);
