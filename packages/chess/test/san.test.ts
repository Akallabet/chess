// import { fromSAN } from '../san'
//import { defaultFiles as files, defaultRanks as ranks, defaultNames as pieces } from '../constants'

import t from 'tap';
import { fromSANToCoordinates, generateSANForMove } from '../src/san.js';
import { Move, start } from '../src/index.js';

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
  t.throws(() => fromSANToCoordinates(san, game));
  t.end();
});

t.test('SAN - piece - from (file+rank) - to (file+rank)', t => {
  const FEN = '2k5/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
  const san = 'Qe1e8';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 0 },
  };

  const game = start({ FEN, mode: 'standard' });
  t.same(fromSANToCoordinates(san, game), expected);
  t.end();
});

t.test('SAN - piece with destination file and rank i.e. "Qe8"', t => {
  const FEN = '2k5/2N5/8/8/8/8/8/4QK2 w KQkq - 0 1';
  const san = 'Qe8';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 0 },
  };

  const game = start({ FEN, mode: 'standard' });
  t.same(fromSANToCoordinates(san, game), expected);
  t.end();
});

t.test('Pawn i.e. "c4"', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const san = 'c4';
  const expected = {
    piece: 'P',
    origin: { x: 2, y: 6 },
    target: { x: 2, y: 4 },
  };
  t.same(fromSANToCoordinates(san, start({ FEN, mode: 'standard' })), expected);
  t.end();
});

t.test('SAN - Pawn wrong format i.e. "c3"', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
  const san = 'h5';
  t.throws(() => fromSANToCoordinates(san, start({ FEN, mode: 'standard' })));
  t.end();
});

t.test('Generate SAN - only one pawn', t => {
  const move: Move = {
    piece: 'P',
    origin: { x: 2, y: 6 },
    coord: { x: 2, y: 4 },
    flags: {},
    san: '',
  };
  const moveSquare = [move];
  const input = generateSANForMove(moveSquare, 0);
  t.same(input, 'c4');
  t.end();
});

t.test('Generate SAN - two knights', t => {
  const moveSquare = [
    {
      piece: 'K',
      origin: { x: 2, y: 5 },
      coord: { x: 4, y: 4 },
      flags: {},
      san: '',
    },
    {
      piece: 'K',
      origin: { x: 3, y: 6 },
      coord: { x: 2, y: 5 },
      flags: {},
      san: '',
    },
  ];
  const input = generateSANForMove(moveSquare, 0);
  t.same(input, 'Kce4');
  t.end();
});
