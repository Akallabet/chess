import { clearBoard } from './clear-board.js';
import { fromPositionToCoordinates } from './utils/index.js';
import { createMovesBoard, moveAndUpdateState } from './moves/index.js';
import { Address, ChessState, Coordinates } from './types.js';
import { getMetadata } from './metadata.js';

export const move = (
  origin: Coordinates | Address,
  target: Coordinates | Address,
  initialState: ChessState
): ChessState => {
  const state = moveAndUpdateState(
    fromPositionToCoordinates(origin),
    fromPositionToCoordinates(target),
    clearBoard(initialState)
  );
  const movesBoard = createMovesBoard(state);
  const metadata = getMetadata();

  return { ...state, ...metadata, movesBoard };
};
