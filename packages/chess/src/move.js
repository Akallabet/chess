import { toFEN } from './fen/index.js';
import { colours } from './constants.js';
import { clearBoard } from './clear-board.js';
import { fromPositionToCoordinates } from './utils/index.js';
import { createMovesBoard } from './moves/index.js';

const changeActiveColor = activeColour =>
  activeColour === colours.white ? colours.black : colours.white;

const boardWithMove = (origin, target, board) => {
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

export const moveAndUpdateState = (origin, target, state) => {
  const board = boardWithMove(origin, target, state.board);
  const activeColor = changeActiveColor(state.activeColor);
  const FEN = toFEN({ ...state, board, activeColor });

  return {
    ...state,
    board,
    activeColor,
    FEN,
  };
};

export const move = (origin, target, initialState) => {
  const state = moveAndUpdateState(
    fromPositionToCoordinates(origin),
    fromPositionToCoordinates(target),
    clearBoard(initialState)
  );
  const movesBoard = createMovesBoard(state);
  return { ...state, movesBoard };
};
