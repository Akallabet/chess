import t from 'tap';
import { start, resign } from '../src';

t.test('Resign', t => {
  t.plan(1);
  t.test('White resignes', t => {
    const state = start({
      FEN: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w KQkq - 0 1',
      mode: 'standard',
    });
    t.equal(state.result, '*');
    const newState = resign(state);
    t.equal(newState.result, '0-1');
    t.end();
  });
});
