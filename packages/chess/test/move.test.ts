import test from 'node:test';
import { strict as assert } from 'node:assert';

import { goToMove, move, start } from '../src/index.js';
import { getBoard } from '../test-utils.js';

test('Move white pawn from e2 to e3', () => {
  const expected = getBoard([
    { coord: { x: 4, y: 5 }, cell: 'P' },
    { coord: { x: 3, y: 0 }, cell: 'k' },
    { coord: { x: 4, y: 7 }, cell: 'K' },
  ]);
  const state = start({
    FEN: '3k4/8/8/8/8/8/4P3/4K3 w KQkq - 0 1',
    mode: 'standard',
  });
  const result = move({ san: 'e3', state });
  assert.deepEqual(result.board, expected);
  assert.strictEqual(result.FEN, '3k4/8/8/8/8/4P3/8/4K3 b KQkq - 0 1');
});

test('Increase full moves', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const state = move({ san: 'e4', state: start({ FEN, mode: 'standard' }) });
  assert.strictEqual(
    state.FEN,
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
  );
  const state2 = move({ san: 'e5', state });
  assert.strictEqual(
    state2.FEN,
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
  );
});

test('Half moves increase and reset', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const firstMove = move({
    san: 'e4',
    state: start({ FEN, mode: 'standard' }),
  });
  const secondMove = move({ san: 'e5', state: firstMove });
  const thirdMove = move({ san: 'Nf3', state: secondMove });
  assert.strictEqual(
    thirdMove.FEN,
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2'
  );
  const fourthMove = move({ san: 'a6', state: thirdMove });
  assert.strictEqual(
    fourthMove.FEN,
    'rnbqkbnr/1ppp1ppp/p7/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3'
  );
});

test('Pawn promotion', () => {
  const FEN = '8/P7/7k/8/8/8/8/4K3 w - - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const state = move({ san: 'a8=Q', state: initial });
  assert.strictEqual(state.FEN, 'Q7/8/7k/8/8/8/8/4K3 b - - 0 1');
});

test('Check by pinning piece', () => {
  const FEN = 'r2qkbnr/pp2pppp/2Pp4/1B2N3/4P1b1/8/PPP2PPP/RNB1K2R w - - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const state = move({ san: 'cxb7+', state: initial });
  assert.strictEqual(
    state.FEN,
    'r2qkbnr/pP2pppp/3p4/1B2N3/4P1b1/8/PPP2PPP/RNB1K2R b - - 0 1'
  );
});
test('En passant detection', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const firstMove = move({ san: 'b4', state: initial });
  const secondMove = move({ san: 'e5', state: firstMove });
  const thirdMove = move({ san: 'Nc3', state: secondMove });
  assert.strictEqual(
    firstMove.FEN,
    'rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq b3 0 1'
  );
  assert.strictEqual(
    secondMove.FEN,
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNR w KQkq e6 0 2'
  );
  assert.strictEqual(
    thirdMove.FEN,
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/2N5/P1PPPPPP/R1BQKBNR b KQkq - 1 2'
  );
});

test('En passant capture', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const firstMove = move({ san: 'd5', state: initial });
  assert.strictEqual(
    'rnbqkbnr/ppp1pppp/8/2Pp4/8/8/PPPPPPPP/RNBQKBNR w KQkq d6 0 2',
    firstMove.FEN
  );
  const secondMove = move({ san: 'cxd6', state: firstMove });
  assert.strictEqual(
    'rnbqkbnr/ppp1pppp/3P4/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2',
    secondMove.FEN
  );
});

test('Kingside Castling - white', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQK2R w KQkq - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const kingsideCastlingMove = move({ san: 'O-O', state: initial });
  assert.strictEqual(
    'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/RNBQ1RK1 b kq - 1 1',
    kingsideCastlingMove.FEN
  );
});
test('Queenside Castling - white', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/R3KBNR w KQkq - 0 1';
  const initial = start({ FEN, mode: 'standard' });
  const kingsideCastlingMove = move({ san: 'O-O-O', state: initial });
  assert.strictEqual(
    'rnbqkbnr/pppppppp/8/2P5/8/8/PPPPPPPP/2KR1BNR b kq - 1 1',
    kingsideCastlingMove.FEN
  );
});

test('Go to first move', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const state = move({ san: 'e4', state: start({ FEN, mode: 'standard' }) });
  assert.strictEqual(
    state.FEN,
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
  );
  const state2 = move({ san: 'e5', state });
  assert.strictEqual(
    state2.FEN,
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2'
  );
  const state3 = goToMove({ move: 0, state: state2 });
  assert.strictEqual(
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    state3.FEN
  );
});

test('Wrong move', () => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  try {
    move({ san: 'e5', state: start({ FEN, mode: 'standard' }) });
  } catch (e) {
    assert.strictEqual(e.name, 'WRONG_MOVE');
  }
});
