import * as R from 'ramda';

const mapI = R.addIndex(R.map);
const isSamePos =
  ({ x, y }) =>
  m =>
    m.y === y && m.x === x;

export const mapMovesToBoard = R.curry((board, moves) =>
  mapI(
    (row, y) =>
      mapI((cell, x) => {
        const move = R.find(
          R.pipe(R.prop('coord'), isSamePos({ x, y })),
          moves
        );
        return move ? { ...cell, ...move.flag } : cell;
      }, row),
    board
  )
);
