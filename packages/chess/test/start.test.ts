import test from 'node:test';
import { strict as assert } from 'node:assert';
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

test('Start - Empty board', t => {
  const { board } = start({
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
    mode: 'demo',
  });
  assert.deepStrictEqual(board, emptyBoard);
});

test('Start - Game over detection', t => {
  const game = start({
    FEN: '1k2Q3/3R4/8/8/8/8/8/4K3 b - - 0 1',
    mode: 'standard',
  });
  assert.strictEqual(game.isGameOver, true);
});

test('Start - Draw by Stale mate', t => {
  const FEN = 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
});
