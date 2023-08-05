import t from 'tap';
import { EmptySquare, start } from '../src/index.js';

const emptyCell = '' as EmptySquare;
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
  t.plan(3);
  t.test('Empty board', t => {
    const { board } = start({
      FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
      mode: 'demo',
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

  t.test('Draw by Stale mate', t => {
    const FEN = 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 0 1';
    const state = start({ FEN, mode: 'standard' });
    t.same(state.isGameOver, true);
    t.same(state.isDraw, true);
    t.end();
  });
});
