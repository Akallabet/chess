import { ChessBoardType, Coordinates, Square } from './src/types.js';

const cell = {};
const row = [cell, cell, cell, cell, cell, cell, cell, cell];
const defaultBoard = [row, row, row, row, row, row, row, row];

interface Item {
  coord: Coordinates;
  cell: Square;
}
export function getBoard(
  items: Array<Item> = [],
  board: ChessBoardType = defaultBoard
): ChessBoardType {
  return board.map((row, y) =>
    row.map((cell, x) => {
      const item = items.find(({ coord }) => coord.y === y && coord.x === x);
      return item ? item.cell : { ...cell };
    })
  );
}
