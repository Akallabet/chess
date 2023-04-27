import { fromFEN } from './fen/index.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/index.js';
import { ChessState, ChessStateOutput } from './types.js';

export function start(initialState: ChessState): ChessStateOutput {
  const state = { ...initialState, ...fromFEN(initialState.FEN) };
  const movesBoard = createMovesBoard(state);
  const metadata = getMetadata();

  return {
    ...state,
    ...metadata,
    movesBoard,
  };
}
