import { modes } from './constants.js';
import { fromFEN } from './fen.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  InternalState,
  Address,
  Coordinates,
  Move,
} from './types.js';
import { fromPositionToCoordinates } from './utils.js';
import {
  generateMovesForAllPieces,
  isKingUnderCheck,
  moveAndUpdateState,
  translateSANToMove,
} from './moves/index.js';
import { errorCodes } from './error-codes.js';

export function start(
  initialState: ChessInitialState | ChessState
): ChessState {
  const state: InternalState = {
    ...initialState,
    ...fromFEN(initialState.FEN),
    mode: initialState.mode || modes.standard,
  };

  const moves = generateMovesForAllPieces(state);
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
    const moves = generateMovesForAllPieces(state);
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

export function highlightMoves(addr: Address, state: ChessState): ChessState {
  const coord = fromPositionToCoordinates(addr);

  if (!state.board[coord.y][coord.x].piece)
    throw new Error(errorCodes.no_piece_selected);

  const { board, movesBoard } = state;

  for (let y = 0; y < movesBoard.length; y++) {
    for (let x = 0; x < movesBoard[y].length; x++) {
      const move = movesBoard[y][x].find(
        ({ origin }) => origin.x === coord.x && origin.y === coord.y
      );
      if (move) {
        board[y][x] = { ...board[y][x], ...move.flags };
      }
      if (x === coord.x && y === coord.y) {
        board[y][x] = { ...board[y][x], selected: true };
      }
    }
  }

  return {
    ...state,
    board,
  };
}

export function clearBoard(state: ChessState): ChessState {
  const board = new Array(state.board.length)
    .fill([])
    .map(() => new Array(state.board[0].length).fill({}));

  for (let y = 0; y < state.board.length; y++) {
    for (let x = 0; x < state.board[y].length; x++) {
      if (state.board[y][x].piece)
        board[y][x] = { piece: state.board[y][x].piece };
      else board[y][x] = {};
    }
  }
  return {
    ...state,
    board,
  };
}

export { files, ranks } from './constants.js';

export * from './types.js';
