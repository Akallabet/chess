import * as R from 'ramda';
import { fromFEN } from './fen/index.js';
import { overProp } from './utils/index.js';

const mapI = R.addIndex(R.map);

const movePiece = (origin, target, state) => {
  const originCell = R.path([origin.y, origin.x], state.board);
  return overProp(
    'board',
    mapI((row, y) =>
      mapI(
        (cell, x) => {
          if (y === origin.y && x === origin.x) return {};
          if (y === target.y && x === target.x) return originCell;
          return cell;
        },
        [...row]
      )
    ),
    state
  );
};

export const move = R.curry((origin, target, state) => {
  return movePiece(origin, target, fromFEN(state.FEN));
});
