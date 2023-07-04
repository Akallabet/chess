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
  t.plan(2);
  t.test('Empty board', t => {
    const { board } = start({
      FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
      mode: 'standard',
    });
    t.same(board, emptyBoard);
    t.end();
  });

  t.test('Game over detection', t => {
    const game = start({
      FEN: '1k2Q3/3R4/8/8/8/8/8/4K3 b - - 0 1',
      mode: 'standard',
    });
    t.same(game.isGameOver, true);
    t.end();
  });
});
