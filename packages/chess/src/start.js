import { fromFEN } from './fen/index.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/index.js';

export const start = initialState => {
  const state = { ...initialState, ...fromFEN(initialState.FEN) };
  const movesBoard = createMovesBoard(state);
  const metadata = getMetadata();
  return {
    ...state,
    ...metadata,
    movesBoard,
  };
};
