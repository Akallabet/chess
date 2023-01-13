import * as R from 'ramda';
const mapI = R.addIndex(R.map);

const addMoveFlag = R.assoc('move', true);

export const moves = {
  p: (coords = { x: 0, y: 0 }, { board }) => {
    return mapI(
      (row, y) =>
        mapI((cell, x) => {
          if (coords.y === 1 && y === coords.y + 1 && x === coords.x)
            return addMoveFlag(cell);
          if (coords.y === 1 && y === coords.y + 2 && x === coords.x)
            return addMoveFlag(cell);
          if (coords.y > 1 && y === coords.y + 1 && x === coords.x)
            return addMoveFlag(cell);
          return cell;
        }, row),
      board
    );
  },
  n: ({ x, y }, { board }) => {
    console.log(y, x);
    return board;
  },
  P: ({ x, y }, { board }) => {
    console.log(y, x);
    return board;
  },
};
