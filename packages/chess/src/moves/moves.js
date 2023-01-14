import * as R from 'ramda';
const mapI = R.addIndex(R.map);

const addMoveFlag = R.assoc('move', true);

export const movesMap = {
  p: (coord = { x: 0, y: 0 }, { board }) => {
    const moves = [];
    let isValid = true;
    while (isValid) {
      const lastMove = R.last(moves) || coord;
      const currentMove = { x: lastMove.x, y: lastMove.y + 1 };
      const row = board[currentMove.y];
      if (!row) {
        isValid = false;
        break;
      }
      const cell = board[currentMove.y][currentMove.x];

      if (!cell) {
        isValid = false;
        break;
      }
      if (cell.piece) {
        isValid = false;
        break;
      }
      if (coord.y > 1 && currentMove.y > coord.y + 1) {
        isValid = false;
        break;
      }
      if (coord.y === 1 && currentMove.y > coord.y + 2) {
        isValid = false;
        break;
      }
      moves.push(currentMove);
    }
    return mapI(
      (row, y) =>
        mapI((cell, x) => {
          const move = R.find(m => m.y === y && m.x === x, moves);
          return move ? addMoveFlag(cell) : cell;
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
