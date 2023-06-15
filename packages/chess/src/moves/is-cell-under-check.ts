import * as R from 'ramda';
import { Coordinates, InternalState } from '../types.js';
import { isOpponentPiece } from '../utils.js';
import { generateMoves } from './generate-moves.js';

export const canPieceMoveToTarget = (
  origin: Coordinates,
  target: Coordinates,
  state: InternalState
): boolean => {
  const moves = generateMoves(origin, state);
  const targetMove = moves.find(
    ({ coord }) => coord.x === target.x && coord.y === target.y
  );
  return !!targetMove;
};

export const isCellUnderCheck = R.curry((state, activeColor, target) => {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (
        board[y][x].piece &&
        isOpponentPiece(activeColor, board[y][x].piece) &&
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
