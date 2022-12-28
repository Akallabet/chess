import t from 'tap';
import { isFEN } from '../../src/fen/is-fen.js';

t.test('Check FEN format', t => {
  t.plan(3);
  t.test('Empty board', t => {
    t.same(isFEN('8/8/8/8/8/8/8/8 w KQkq - 0 1'), true);
    t.end();
  });
  t.test('Too many empty cells', t => {
    t.same(isFEN('9/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
    t.end();
  });
  t.test('Too few empty cells', t => {
    t.same(isFEN('1/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
    t.end();
  });
  t.end();
});
