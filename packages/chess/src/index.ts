import { modes } from './constants.js';
import { fromFEN, toFEN } from './fen.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  Coordinates,
  FENState,
  Move,
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  isKingUnderCheck,
  updateFENStateWithMove,
  translateSANToMove,
} from './moves/index.js';

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const state = {
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

export function move(san: string, prevState: ChessState): ChessState {
  try {
    const move = translateSANToMove(san, prevState);
    const FENState: FENState = updateFENStateWithMove(
      move,
      prevState.board,
      prevState.activeColor,
      prevState.castlingRights,
      prevState.halfMoves,
      prevState.fullMoves
    );
    const FEN = toFEN(FENState);
    const internalState = {
      mode: prevState.mode,
      ...FENState,
      FEN,
    };
    const moves = generateLegalMovesForActiveSide(internalState);
    const movesBoard = createMovesBoard(internalState, moves);
    const isDraw =
      internalState.mode === 'standard' &&
      (internalState.halfMoves === 50 ||
        (moves.length === 0 && !isKingUnderCheck(internalState)));
    const isGameOver = moves.length === 0 || isDraw;
    const metadata = getMetadata();

    return { ...internalState, ...metadata, movesBoard, isGameOver, isDraw };
  } catch (e) {
    return prevState;
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

export { files, ranks, modes } from './constants.js';

export * from './types.js';
