import { Coordinates, InternalState } from '../types.js';
import { isActiveColorPiece } from '../utils.js';
import { generateMoves } from './generate-moves.js';

export const canPieceMoveToTarget = (
  origin: Coordinates,
  target: Coordinates,
  state: InternalState
): boolean => {
  // console.log(
  //   'check whether canPieceMoveToTarget',
  //   origin,
  //   target,
  //   state.board[origin.y][origin.x].piece,
  //   state.FEN
  // );
  const moves = generateMoves(origin, state);
  const targetMove = moves.find(
    move => move.target.x === target.x && move.target.y === target.y
  );
  // console.log('canPieceMoveToTarget', !!targetMove);
  return !!targetMove;
};

export const isCellUnderCheck = (state: InternalState, target: Coordinates) => {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const square = board[y][x];
      if (
        square.piece &&
        isActiveColorPiece(state.activeColor, square.piece as string) && // bad bad bad, please remove coercion :(
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
  coords: Array<Coordinates>
) => coords.some(coord => isCellUnderCheck(state, coord));
