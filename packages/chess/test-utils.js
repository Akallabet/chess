import * as R from 'ramda';

const mapI = R.addIndex(R.map);

const cell = {};
const row = [cell, cell, cell, cell, cell, cell, cell, cell];
const defaultBoard = [row, row, row, row, row, row, row, row];

export const getBoard = (items = [], board = defaultBoard) =>
  mapI(
    (row, y) =>
      mapI(
        (cell, x) => {
          const item = R.find(
            ({ coord }) => coord.y === y && coord.x === x,
            items
          );
          return item ? item.cell : { ...cell };
        },
        [...row]
      ),
    board
  );
