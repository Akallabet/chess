import { modes } from './constants.js';
import { fromFEN } from './fen.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  InternalState,
  Coordinates,
  Move,
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  isKingUnderCheck,
  moveAndUpdateState,
  translateSANToMove,
} from './moves/index.js';

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const state: InternalState = {
    ...initialState,
    ...fromFEN(initialState.FEN),
    mode: initialState.mode || modes.standard,
  };

  const moves = generateLegalMovesForActiveSide(state);
  const movesBoard = createMovesBoard(state, moves);
  const isDraw =
    state.mode === 'standard' &&
    (state.halfMoves === 50 ||
      (moves.length === 0 && !isKingUnderCheck(state)));
  const isGameOver = moves.length === 0 || isDraw;
  const metadata = getMetadata();

  return {
    ...state,
    ...metadata,
    movesBoard,
    isGameOver,
    isDraw,
  };
}

export function move(san: string, initialState: ChessState): ChessState {
  try {
    const move = translateSANToMove(san, initialState);
    const state = moveAndUpdateState(move, initialState);
    const moves = generateLegalMovesForActiveSide(state);
    const movesBoard = createMovesBoard(state, moves);
    const isDraw =
      state.mode === 'standard' &&
      (state.halfMoves === 50 ||
        (moves.length === 0 && !isKingUnderCheck(state)));
    const isGameOver = moves.length === 0 || isDraw;
    const metadata = getMetadata();

    return { ...state, ...metadata, movesBoard, isGameOver, isDraw };
  } catch (e) {
    return initialState;
  }
}

export function moves(coord: Coordinates, state: ChessState): Array<Move> {
  const moves = [];
  for (const row of state.movesBoard) {
    for (const cell of row) {
      for (const move of cell) {
        if (move.origin.x === coord.x && move.origin.y === coord.y) {
          moves.push(move);
        }
      }
    }
  }
  return moves;
}

export { files, ranks } from './constants.js';

export * from './types.js';
