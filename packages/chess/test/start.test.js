import t from 'tap';
import { start } from '../src/start.js';

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
  const { board } = start('8/8/8/8/8/8/8/8 w KQkq - 0 1');
  t.same(board, emptyBoard);
  t.end();
});
