import * as R from 'ramda';
import { toFEN } from './fen/index.js';
import { colours } from './constants.js';
import { fromPositionToCoordinates } from './utils/index.js';
import { createMovesBoard } from './moves/index.js';

const mapI = R.addIndex(R.map);

const changeActiveColor = activeColour =>
  activeColour === colours.white ? colours.black : colours.white;

export const boardWithMove = R.curryN(3, (origin, target, board) => {
  const originCell = R.path([origin.y, origin.x], board);
  return mapI(
    (row, y) =>
      mapI(
        (cell, x) => {
          if (y === origin.y && x === origin.x) return {};
          if (y === target.y && x === target.x) return originCell;
          return cell;
        },
        [...row]
      ),
    board
  );
});

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

export const move = R.curryN(3, (origin, target, initialState) => {
  const state = moveAndUpdateState(
    fromPositionToCoordinates(origin),
    fromPositionToCoordinates(target),
    initialState
  );
  const movesBoard = createMovesBoard(state);
  return { ...state, movesBoard };
});
