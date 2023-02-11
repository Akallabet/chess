import * as R from 'ramda';
import { fromFEN, toFEN } from './fen/index.js';
import { overProp, updateProp } from './utils/index.js';

const mapI = R.addIndex(R.map);

const movePiece = (origin, target, state) => {
  const originCell = R.path([origin.y, origin.x], state.board);
  // const targetCell = R.path([target.y, target.x], state.board);

  return R.pipe(
    overProp(
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
      )
    ),
    updateProp('FEN', toFEN)
  )(state);
};

export const move = R.curry((origin, target, state) => {
  return movePiece(origin, target, fromFEN(state.FEN));
});
