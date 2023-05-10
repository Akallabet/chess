import { modes } from './constants.js';
import { fromFEN } from './fen/index.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import { ChessInitialState, ChessState } from './types.js';

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const { mode = modes.standard } = initialState;
  const state = { mode, ...initialState, ...fromFEN(initialState.FEN) };
  const movesBoard = createMovesBoard(state);
  const metadata = getMetadata();

  return {
    ...state,
    ...metadata,
    movesBoard,
  };
}
