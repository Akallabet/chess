import t from 'tap';
import { move, start } from '../src/index.js';
import { getBoard } from '../test-utils.js';

t.test('Move', t => {
  t.plan(7);
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

  t.test('Draw by Stale mate', t => {
    const FEN = 'k7/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
    const state = move('Rb7', start({ FEN, mode: 'standard' }));
    t.same(state.FEN, 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 1 1');
    t.same(state.isGameOver, true);
    t.same(state.isDraw, true);
    t.end();
  });

  t.test('Increase full moves', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const state = move('e4', start({ FEN, mode: 'standard' }));
    t.same(
      state.FEN,
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
    );
    const state2 = move('e5', state);
    t.same(
      state2.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2'
    );
    t.end();
  });

  t.test('Half moves increase and reset', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const firstMove = move('e4', start({ FEN, mode: 'standard' }));
    const secondMove = move('e5', firstMove);
    const thirdMove = move('Nf3', secondMove);
    t.same(
      thirdMove.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'
    );
    const fourthMove = move('a6', thirdMove);
    t.same(
      fourthMove.FEN,
      'rnbqkbnr/1ppp1ppp/p7/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3'
    );

    t.end();
  });

  t.test('Draw by 50 moves rule', t => {
    const FEN =
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 49 99';
    const state = start({ FEN, mode: 'standard' });
    const firstMove = move('nc6', state);
    t.same(
      firstMove.FEN,
      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 50 100'
    );
    t.same(firstMove.isGameOver, true);
    t.same(firstMove.isDraw, true);

    t.end();
  });

  t.test('Pawn promotion', t => {
    const FEN = '8/P7/7k/8/8/8/8/4K3 w - - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const state = move('a8Q', initial);
    t.same(state.FEN, 'Q7/8/7k/8/8/8/8/4K3 b - - 0 1');
    t.end();
  });
  // Move can be check even if it does not directly attack the king
  // e.g. moving a piece that is pinned
  // r2qkbnr/pp2pppp/2Pp4/1B2N3/4P1b1/8/PPP2PPP/RNB1K2R w - - 0 1
  // 1. cxb7+
});
