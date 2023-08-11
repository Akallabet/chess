import t from 'tap';
import { fromFEN } from '../src/fen.js';
import { isActiveColorPiece } from '../src/utils.js';

t.test('Is active color piece', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(isActiveColorPiece(state.activeColor, 'P'), true);
  t.end();
});
