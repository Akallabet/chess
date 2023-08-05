import { modes, files, ranks } from './constants.js';
import { fromFEN, toFEN } from './fen.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  Coordinates,
  FENState,
  InternalState,
  Move,
  MoveBase,
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  updateFENStateWithMove,
  translateSANToMove,
  calcIfKingUnderCheck,
} from './moves/index.js';

function calcMetaData(
  state: InternalState,
  moves: MoveBase[]
): {
  isGameOver: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
} {
  const isKingUnderCheck = calcIfKingUnderCheck(state);
  const isDraw =
    state.mode === 'standard' &&
    (state.halfMoves === 50 || (moves.length === 0 && !isKingUnderCheck));
  const isGameOver = moves.length === 0 || isDraw;
  const isCheckmate = isKingUnderCheck && isGameOver;

  return {
    isGameOver,
    isCheckmate,
    isDraw,
  };
}

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const state = {
    ...initialState,
    ...fromFEN(initialState.FEN),
    mode: initialState.mode || modes.standard,
  };

  const moves = generateLegalMovesForActiveSide(state);

  return {
    ...state,
    files,
    ranks,
    movesBoard: createMovesBoard(state, moves),
    ...calcMetaData(state, moves),
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
    const state = {
      mode: prevState.mode,
      ...FENState,
      FEN: toFEN(FENState),
    };
    const moves = generateLegalMovesForActiveSide(state);

    return {
      ...state,
      files,
      ranks,
      movesBoard: createMovesBoard(state, moves),
      ...calcMetaData(state, moves),
    };
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
