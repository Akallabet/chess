import * as R from 'ramda';
import { Coordinates, InternalState } from '../types.js';
import { isActiveColorPiece, isOpponentPiece } from '../utils.js';
import { generateMoves } from './generate-moves.js';
//Loop through each row
//Loop through each cell
//If there is a piece and it's opponent
//  then get all the moves for that piece
//    for each move
//      if at least one matches coord
//        then return true
//return false otherwise

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

export const getOriginsForTargetCell = (
  target: Coordinates,
  activeColor: string,
  state: InternalState
) => {
  const { board } = state;
  const origins = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (
        board[y][x].piece &&
        isActiveColorPiece(activeColor, board[y][x].piece || '') &&
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
