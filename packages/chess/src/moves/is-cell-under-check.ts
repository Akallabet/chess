import { ChessColor, Coordinates, FENState } from '../types.js';
import { isActiveColorPiece } from '../utils.js';
import { generateMoves } from './generate-moves.js';
import { patterns } from './patterns.js';

export const canPieceMoveToTarget = (
  origin: Coordinates,
  target: Coordinates,
  state: FENState
): boolean => {
  const moves = generateMoves(
    origin,
    state,
    patterns[state.board[origin.y][origin.x]].filter(
      ({ recursive }) => !recursive
    )
  );
  const targetMove = moves.find(
    move => move.target.x === target.x && move.target.y === target.y
  );
  return !!targetMove;
};

export const isCellUnderCheck = (
  state: FENState,
  target: Coordinates,
  colorOverride?: ChessColor
) => {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const square = board[y][x];
      if (
        square &&
        isActiveColorPiece(colorOverride || state.activeColor, square) &&
        canPieceMoveToTarget({ x, y }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const anyCellUnderCheck = (
  state: FENState,
  coords: Array<Coordinates>
) => coords.some(coord => isCellUnderCheck(state, coord));
