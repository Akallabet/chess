import * as R from 'ramda';
import { fromFEN, toFEN } from './fen/index.js';
import { colours } from './constants.js';
import {
  fromPositionToCoordinates,
  overProp,
  updateProp,
} from './utils/index.js';

const mapI = R.addIndex(R.map);

const changeActiveColor = activeColour =>
  activeColour === colours.white ? colours.black : colours.white;

export const movePiece = R.curryN(3, (origin, target, board) => {
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

const moveAndUpdate = (origin, target, state) => {
  // const targetCell = R.path([target.y, target.x], state.board);

  return R.pipe(
    overProp('board', movePiece(origin, target)),
    overProp('activeColor', changeActiveColor),
    updateProp('FEN', toFEN)
  )(state);
};

export const move = R.curryN(3, (origin, target, state) => {
  return moveAndUpdate(
    fromPositionToCoordinates(origin),
    fromPositionToCoordinates(target),
    R.mergeRight(state, fromFEN(state.FEN))
  );
});
