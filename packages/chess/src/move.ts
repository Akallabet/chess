import { toFEN } from './fen/index.js';
import { colours } from './constants.js';
import { clearBoard } from './clear-board.js';
import { fromPositionToCoordinates } from './utils/index.js';
import { createMovesBoard } from './moves/index.js';
import {
  Address,
  ChessBoardType,
  ChessState,
  Coordinates,
  FENState,
  InternalState,
} from './types.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.white ? colours.black : colours.white;

const boardWithMove = (
  origin: Coordinates,
  target: Coordinates,
  board: ChessBoardType
) => {
  return board.map((row, y) =>
    row.map(
      (cell, x) => {
        if (y === origin.y && x === origin.x) return {};
        if (y === target.y && x === target.x) return board[origin.y][origin.x];
        return cell;
      },
      [...row]
    )
  );
};

export const moveAndUpdateState = (
  origin: Coordinates,
  target: Coordinates,
  state: InternalState
) => {
  const board = boardWithMove(origin, target, state.board);
  const activeColor = changeActiveColor(state);
  const FEN = toFEN({ ...state, board, activeColor });

  return {
    ...state,
    board,
    activeColor,
    FEN,
  };
};

export const move = (
  origin: Coordinates | Address,
  target: Coordinates | Address,
  initialState: ChessState
) => {
  const state = moveAndUpdateState(
    fromPositionToCoordinates(origin),
    fromPositionToCoordinates(target),
    clearBoard(initialState)
  );
  const movesBoard = createMovesBoard(state);
  return { ...state, movesBoard };
};
