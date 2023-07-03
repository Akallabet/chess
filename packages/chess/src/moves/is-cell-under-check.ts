import { Coordinates, InternalState } from '../types.js';
import { isActiveColorPiece } from '../utils.js';
import { generateMoves } from './generate-moves.js';
import { patterns } from './patterns.js';

export const canPieceMoveToTarget = (
  origin: Coordinates,
  target: Coordinates,
  state: InternalState
): boolean => {
  const moves = generateMoves(
    origin,
    state,
    patterns[state.board[origin.y][origin.x].piece as string].filter(
      ({ recursive }) => !recursive
    )
  );
  const targetMove = moves.find(
    move => move.target.x === target.x && move.target.y === target.y
  );
  return !!targetMove;
};

export const isCellUnderCheck = (
  state: InternalState,
  target: Coordinates,
  colorOverride?: string
) => {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const square = board[y][x];
      if (
        square.piece &&
        isActiveColorPiece(
          colorOverride || state.activeColor,
          square.piece as string
        ) && // bad bad bad, please remove coercion :(
        canPieceMoveToTarget({ x, y }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const anyCellUnderCheck = (
  state: InternalState,
  coords: Array<Coordinates>
) => coords.some(coord => isCellUnderCheck(state, coord));
