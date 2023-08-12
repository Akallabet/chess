import { modes, files, ranks } from './constants.js';
import { fromFEN, toFEN, updateFENStateWithMove } from './fen.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  Coordinates,
  FENState,
  Move,
  GameMode,
  FENString,
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  calcIfKingUnderCheck,
} from './moves/index.js';
import { translateSANToMove } from './san.js';

function deriveStateFromFEN(FENState: FENState, mode: GameMode): ChessState {
  const moves = generateLegalMovesForActiveSide(FENState);

  const isKingUnderCheck = calcIfKingUnderCheck(FENState);
  const isStalemate = moves.length === 0 && !isKingUnderCheck;
  const isDraw =
    mode === 'standard' && (FENState.halfMoves === 50 || isStalemate);
  const isCheckmate = isKingUnderCheck && moves.length === 0;
  const isGameOver = isDraw || isCheckmate;

  return {
    ...FENState,
    FEN: toFEN(FENState),
    mode: mode || modes.standard,
    files,
    ranks,
    movesBoard: createMovesBoard(FENState.board, moves),
    isGameOver,
    isCheckmate,
    isCheck: isKingUnderCheck && !isCheckmate,
    isDraw,
    isStalemate,
  };
}

export function start(initialState: {
  FEN: FENString;
  mode: GameMode;
}): ChessState {
  return deriveStateFromFEN(
    fromFEN(initialState.FEN),
    initialState.mode || modes.standard
  );
}

export function move(
  san: string,
  inputState: ChessInitialState | ChessState
): ChessState {
  const state = deriveStateFromFEN(fromFEN(inputState.FEN), inputState.mode);
  try {
    const FENStateWithMove = updateFENStateWithMove(
      translateSANToMove(san, state.movesBoard),
      state.board,
      state.activeColor,
      state.castlingRights,
      state.halfMoves,
      state.fullMoves
    );
    return deriveStateFromFEN(FENStateWithMove, inputState.mode);
  } catch (e) {
    return state;
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
