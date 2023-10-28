import test from 'node:test';
import { strict as assert } from 'node:assert';
import { start, resign } from '../src/index.js';

test('White resignes', () => {
  const state = start({
    FEN: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w KQkq - 0 1',
    mode: 'standard',
  });
  assert.strictEqual(state.result, '*');
  const newState = resign(state);
  assert.strictEqual(newState.result, '0-1');
});
