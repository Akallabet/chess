import test from 'node:test';
import { strict as assert } from 'node:assert';
import { fromFEN } from '../src/fen.js';
import { isActiveColorPiece } from '../src/utils.js';

test('Is active color piece', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const state = fromFEN(FEN);
  assert.strictEqual(isActiveColorPiece(state.activeColor, 'P'), true);
});
