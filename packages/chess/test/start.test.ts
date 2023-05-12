import t from 'tap';
import { start } from '../src/index.js';

const emptyCell = {};
const emptyRow = () => [
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
];

const emptyBoard = [
  emptyRow(),
  emptyRow(),
  emptyRow(),
  emptyRow(),
  emptyRow(),
  emptyRow(),
  emptyRow(),
  emptyRow(),
];

t.test('Start', t => {
  const { board } = start({
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
    mode: 'standard',
  });
  t.same(board, emptyBoard);
  t.end();
});
