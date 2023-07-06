import t from 'tap';
import { start } from '../../src/index.js';
import { translateSANToMove } from '../../src/moves/translate-san-to-coordinates.js';

// [
//   '0-0',
//   {
//     name: 'K',
//     isCastling: true,
//     isKingside: true,
//     isQueenside: false,
//   },
// ],
// [
//   '0-0-0',
//   {
//     name: 'K',
//     isCastling: true,
//     isQueenside: true,
//     isKingside: false,
//   },
// ],
// ['Nbc3', { name: 'N', originX: 1, x: 2, y: 5 }],
// ['Qe1e8+', { name: 'Q', originX: 4, originY: 7, x: 4, y: 0, check: '+' }],
// ['Qe1xe8', { name: 'Q', originX: 4, originY: 7, x: 4, y: 0, capture: 'x' }],
// ['exc4', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x' }],
// ['exc4+', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x', check: '+' }],
// ['exc4+', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x', check: '+' }],
// ['c8Q', { name: 'P', promotion: 'Q', x: 2, y: 0 }],
// ['Qxf7#', { name: 'Q', x: 5, y: 1, capture: 'x', checkMate: '#' }],
t.test('SAN - Wrong format', t => {
  const FEN = '3k4/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
  const san = 'Qp1e8';
  const game = start({ FEN, mode: 'standard' });
  t.throws(() => translateSANToMove(san, game));
  t.end();
});

t.test('SAN - piece - from (file+rank) - to (file+rank)', t => {
  const FEN = '2k5/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
  const san = 'Qe7';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 1 },
    san: ['Qe7'],
    flags: { move: true },
  };

  const game = start({ FEN, mode: 'standard' });
  const result = translateSANToMove(san, game);
  t.same(result, expected);
  t.end();
});

t.test('SAN - piece with destination file and rank i.e. "Qe8"', t => {
  const FEN = '2k5/2N5/8/8/8/8/8/4QK2 w KQkq - 0 1';
  const san = 'Qe7';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 1 },
    san: [san],
    flags: { move: true },
  };

  const game = start({ FEN, mode: 'standard' });
  t.same(translateSANToMove(san, game), expected);
  t.end();
});

t.test('Pawn i.e. "c3"', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const san = 'c3';
  const expected = {
    piece: 'P',
    origin: { x: 2, y: 6 },
    target: { x: 2, y: 5 },
    san: [san],
    flags: { move: true },
  };
  t.same(translateSANToMove(san, start({ FEN, mode: 'standard' })), expected);
  t.end();
});

t.test('SAN - Pawn wrong format i.e. "c3"', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
  const san = 'h5';
  t.throws(() => translateSANToMove(san, start({ FEN, mode: 'standard' })));
  t.end();
});

t.test('SAN - Bishop unique move', t => {
  const FEN = 'rnbqkbnr/pppp2pp/4pp2/8/8/4PP2/PPPP2PP/RNBQKBNR w KQkq - 0 1';
  const san = 'Bd3';
  const expected = {
    piece: 'B',
    origin: { x: 5, y: 7 },
    target: { x: 3, y: 5 },
    san: [san],
    flags: { move: true },
  };
  t.same(translateSANToMove(san, start({ FEN, mode: 'standard' })), expected);
  t.end();
});
