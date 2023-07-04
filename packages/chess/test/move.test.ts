import t from 'tap';
import { move, start } from '../src/index.js';
import { getBoard } from '../test-utils.js';

t.test('Move', t => {
  t.plan(3);
  t.test('Move white pawn from e2 to e3', t => {
    const expected = getBoard([
      { coord: { x: 4, y: 5 }, cell: { piece: 'P' } },
      { coord: { x: 3, y: 0 }, cell: { piece: 'k' } },
      { coord: { x: 4, y: 7 }, cell: { piece: 'K' } },
    ]);
    const state = move(
      'e3',
      start({ FEN: '3k4/8/8/8/8/8/4P3/4K3 w KQkq - 0 1', mode: 'standard' })
    );
    t.same(state.board, expected);
    t.same(state.FEN, '3k4/8/8/8/8/4P3/8/4K3 b KQkq - 0 1');
    t.end();
  });

  t.test('Check mate', t => {
    const FEN = '1k6/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
    const state = move('Qe8#', start({ FEN, mode: 'standard' }));
    t.same(state.isGameOver, true);
    t.end();
  });

  t.test('Draw ', t => {
    const FEN = 'k7/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
    const state = move('Rb7', start({ FEN, mode: 'standard' }));
    t.same(state.FEN, 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 0 1');
    t.same(state.isGameOver, true);
    t.same(state.isDraw, true);
    t.end();
  });

  // t.test('Pawn promotion ', t => {
  //   const FEN = '1k6/3R1QP1/8/8/8/8/8/4K3 w - - 0 1';
  //   const state = move('f8Q', start({ FEN, mode: 'standard' }));
  //   t.same(state.FEN,  '1k6/3R1QP1/8/8/8/8/8/4K3 w - - 0 1');
  //   t.end();
  // });
});
