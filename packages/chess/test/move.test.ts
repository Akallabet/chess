import t from 'tap';
import { goToMove, move, start } from '../src/index.js';
import { getBoard } from '../test-utils.js';

t.test('Move', t => {
  t.plan(12);
  t.test('Move white pawn from e2 to e3', t => {
    const expected = getBoard([
      { coord: { x: 4, y: 5 }, cell: 'P' },
      { coord: { x: 3, y: 0 }, cell: 'k' },
      { coord: { x: 4, y: 7 }, cell: 'K' },
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
    const init = start({ FEN, mode: 'standard' });
    const state = move('Qe8#', init);
    t.same(state.isGameOver, true);
    t.same(state.isCheckmate, true);
    t.same(state.isDraw, false);
    t.same(state.isStalemate, false);
    t.end();
  });

  t.test('Draw by Stale mate', t => {
    const FEN = 'k7/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
    const state = move('Rb7', start({ FEN, mode: 'standard' }));
    t.same(state.FEN, 'k7/1R3Q2/8/8/8/8/8/4K3 b - - 1 1');
    t.same(state.isGameOver, true);
    t.same(state.isDraw, true);
    t.same(state.isStalemate, true);
    t.same(state.isCheckmate, false);
    t.end();
  });

  t.test('Increase full moves', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const state = move('e4', start({ FEN, mode: 'standard' }));
    t.same(
      state.FEN,
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    );
    const state2 = move('e5', state);
    t.same(
      state2.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
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
    const firstMove = move('Nc6', state);
    t.same(
      firstMove.FEN,
      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 50 100'
    );
    t.same(firstMove.isGameOver, true);
    t.same(firstMove.isDraw, true);
    t.same(state.isCheckmate, false);

    t.end();
  });

  t.test('Pawn promotion', t => {
    const FEN = '8/P7/7k/8/8/8/8/4K3 w - - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const state = move('a8=Q', initial);
    t.same(state.FEN, 'Q7/8/7k/8/8/8/8/4K3 b - - 0 1');
    t.end();
  });

  t.test('Check by pinning piece', t => {
    const FEN = 'r2qkbnr/pp2pppp/2Pp4/1B2N3/4P1b1/8/PPP2PPP/RNB1K2R w - - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const state = move('cxb7+', initial);
    t.same(
      state.FEN,
      'r2qkbnr/pP2pppp/3p4/1B2N3/4P1b1/8/PPP2PPP/RNB1K2R b - - 0 1'
    );
    t.end();
  });
  t.test('En passant detection', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const firstMove = move('b4', initial);
    const secondMove = move('e5', firstMove);
    const thirdMove = move('Nc3', secondMove);
    t.same(
      firstMove.FEN,
      'rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1'
    );
    t.same(
      secondMove.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNR w KQkq e6 0 2'
    );
    t.same(
      thirdMove.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/1P6/2N5/P1PPPPPP/R1BQKBNR b KQkq - 1 2'
    );
    t.end();
  });

  t.test('En passant capture', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const firstMove = move('d5', initial);
    t.same(
      'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PPPPPPPP/RNBQKBNR w KQkq d6 0 2',
      firstMove.FEN
    );
    const secondMove = move('cxd6', firstMove);
    t.same(
      'rnbqkbnr/ppp1pppp/3P4/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2',
      secondMove.FEN
    );
    t.end();
  });

  t.test('Kingside Castling - white', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const kingsideCastlingMove = move('O-O', initial);
    t.same(
      'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQ1RK1 b kq - 1 1',
      kingsideCastlingMove.FEN
    );
    t.end();
  });
  t.test('Queenside Castling - white', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1';
    const initial = start({ FEN, mode: 'standard' });
    const kingsideCastlingMove = move('O-O-O', initial);
    t.same(
      'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/2KR1BNR b kq - 1 1',
      kingsideCastlingMove.FEN
    );
    t.end();
  });
});
t.test('Go To Move', t => {
  t.plan(1);

  t.test('Go to first move', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const state = move('e4', start({ FEN, mode: 'standard' }));
    t.same(
      state.FEN,
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    );
    const state2 = move('e5', state);
    t.same(
      state2.FEN,
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
    );
    const state3 = goToMove(0, state2);
    t.same(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      state3.FEN
    );
    t.end();
  });
});
