import test from 'node:test';
import { strict as assert } from 'node:assert';
import { start } from '../../src/index.js';
import {
  canPieceMoveToTarget,
  isCellUnderCheck,
} from '../../src/moves/is-cell-under-check.js';

test('e8 Black king not under check by e2 white bishop', () => {
  const FEN = '4k3/8/8/8/8/8/4B3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: 'demo' });
  assert.deepEqual(
    canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game),
    false
  );
});

test('e8 Black king under check by e2 white rook', () => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: 'standard' });
  assert.ok(canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game));
});

test('e8 Black king not under check from d1 white king', () => {
  const FEN = '4k3/3p4/8/8/8/3P4/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: 'standard' });
  assert.deepEqual(isCellUnderCheck(game, { x: 4, y: 0 }), false);
});

test('e8 Black king under check from e2 white rook', () => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 w KQkq - 0 1';
  const game = start({ FEN, mode: 'standard' });
  assert.ok(isCellUnderCheck(game, { x: 4, y: 0 }));
});
