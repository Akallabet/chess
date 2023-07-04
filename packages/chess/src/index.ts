import { modes } from './constants.js';
import { fromFEN } from './fen.js';
import { getMetadata } from './metadata.js';
import { createMovesBoard } from './moves/create-moves-board.js';
import {
  ChessInitialState,
  ChessState,
  InternalState,
  Address,
} from './types.js';
import { fromPositionToCoordinates } from './utils.js';
import {
  generateMovesForAllPieces,
  moveAndUpdateState,
  translateSANToCoordinates,
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
  const isGameOver = moves.length === 0;
  const movesBoard = createMovesBoard(state, moves);
  const metadata = getMetadata();

  return {
    ...state,
    isGameOver,
    ...metadata,
    movesBoard,
  };
}

export function move(san: string, initialState: ChessState): ChessState {
  try {
    const { origin, target } = translateSANToCoordinates(san, initialState);
    const state = moveAndUpdateState(
      fromPositionToCoordinates(origin),
      fromPositionToCoordinates(target),
      clearBoard(initialState)
    );
    const moves = generateMovesForAllPieces(state);
    const movesBoard = createMovesBoard(state, moves);
    const isGameOver = moves.length === 0;
    const metadata = getMetadata();

    return { ...state, ...metadata, movesBoard, isGameOver };
  } catch (e) {
    return initialState;
  }
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
