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
    move => move.target.x === target.x && move.target.y === target.y
  );
  return !!targetMove;
};

export const isCellUnderCheck = (
  state: InternalState,
  activeColor: string,
  target: Coordinates
) => {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (
        board[y][x].piece &&
        isOpponentPiece(activeColor, board[y][x].piece || '') &&
        canPieceMoveToTarget({ y, x }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const anyCellUnderCheck = (
  state: InternalState,
  activeColor: string,
  coords: Array<Coordinates>
) => coords.some(coord => isCellUnderCheck(state, activeColor, coord));
