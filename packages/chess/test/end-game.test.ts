import test from 'node:test';
import { strict as assert } from 'node:assert';

import { move, start } from '../src/index.js';

test('Check mate', () => {
  const FEN = '1k6/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
  const init = start({ FEN, mode: 'standard' });
  const state = move('Qe8#', init);
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isCheckmate, true);
  assert.strictEqual(state.isDraw, false);
  assert.strictEqual(state.isStalemate, false);
});

test('Draw by Stale mate', () => {
  const FEN = 'k7/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
  const state = move('Rb7', start({ FEN, mode: 'standard' }));
  assert.strictEqual(state.FEN, 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 1 1');
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isStalemate, true);
  assert.strictEqual(state.isCheckmate, false);
});

test('Draw by 50 moves rule', () => {
  const FEN =
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 49 99';
  const state = start({ FEN, mode: 'standard' });
  const firstMove = move('Nc6', state);
  assert.strictEqual(
    firstMove.FEN,
    'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 50 100'
  );
  assert.strictEqual(firstMove.isGameOver, true);
  assert.strictEqual(firstMove.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
});

test('Draw by insufficient material - K v k', () => {
  const FEN = '8/8/3k4/8/8/8/8/4K3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by insufficient material - KN v k', () => {
  const FEN = '8/8/3k4/8/8/8/8/1N2K3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by insufficient material - KB v k', () => {
  const FEN = '8/8/3k4/8/8/8/8/1B2K3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by insufficient material - K v kn', () => {
  const FEN = '8/1n6/3k4/8/8/8/8/4K3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by insufficient material - K v kb', () => {
  const FEN = '8/1b6/3k4/8/8/8/8/4K3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by insufficient material - KB v kb - bishops on same color', () => {
  const FEN = '8/1b6/3k4/8/8/8/8/3BK3 w - - 0 1';
  const state = start({ FEN, mode: 'standard' });
  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isInsufficientMaterial, true);
});

test('Draw by threefold repetition', () => {
  const FEN = '1r4k1/p2n3p/5np1/4p3/4P3/5PP1/2R2BB1/Kr4NR w - - 2 33';
  const moves = ['Ka2', 'R1b4', 'Ka1', 'Rb1+', 'Ka2', 'R1b4', 'Ka1', 'Rb1+'];
  const state = moves.reduce(
    (state, san) => move(san, state),
    start({ FEN, mode: 'standard' })
  );

  assert.strictEqual(state.isGameOver, true);
  assert.strictEqual(state.isDraw, true);
  assert.strictEqual(state.isCheckmate, false);
  assert.strictEqual(state.isThreefoldRepetition, true);
});
