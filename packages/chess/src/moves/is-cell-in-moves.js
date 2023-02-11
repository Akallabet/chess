import * as R from 'ramda';
import { flags } from '../constants.js';
import { areOpponents } from '../utils/index.js';
import { highlightMoves } from './moves.js';
//Loop through each row
//Loop through each cell
//If there is a piece and it's opponent
//  then get all the moves for that piece
//    for each move
//      if at least one matches coord
//        then return true
//return false otherwise

export const canPieceMoveToTarget = (cell, target, state) => {
  return R.pipe(
    R.path([target.y, target.x]),
    R.either(R.has(flags.capture), R.has(flags.move))
  )(highlightMoves(cell, state));
};

export const isCellInMoves = R.curry((target, state) => {
  const { board } = state;
  for (let y = 0; y < board.length - 1; y++) {
    for (let x = 0; x < board[y].length - 1; x++) {
      if (
        R.hasPath([y, x, 'piece'], board) &&
        areOpponents(
          R.path([target.y, target.x, 'piece'], board),
          R.path([y, x, 'piece'], board)
        ) &&
        canPieceMoveToTarget({ y, x }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
});
