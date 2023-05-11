import { modes } from './constants.js';
import { fromFEN } from './fen/index.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import { ChessInitialState, ChessState, InternalState } from './types.js';

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const state: InternalState = {
    ...initialState,
    ...fromFEN(initialState.FEN),
    mode: initialState.mode || modes.standard,
  };

  const movesBoard = createMovesBoard(state);
  const metadata = getMetadata();

  return {
    ...state,
    ...metadata,
    movesBoard,
  };
}
