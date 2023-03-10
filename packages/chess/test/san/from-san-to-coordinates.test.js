// import { fromSAN } from '../san'
//import { defaultFiles as files, defaultRanks as ranks, defaultNames as pieces } from '../constants'

import t from 'tap';
import { fromSANToCoordinates } from '../../src/san/from-san-to-coordinates.js';
import { start } from '../../src/start.js';

// t.test('SAN to Coordinates', t => {
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
// ['Qe8', { name: 'Q', x: 4, y: 0 }],
// ['c4', { name: 'P', x: 2, y: 4 }],
// ['Nbc3', { name: 'N', originX: 1, x: 2, y: 5 }],
// ['Qe1e8+', { name: 'Q', originX: 4, originY: 7, x: 4, y: 0, check: '+' }],
// ['Qe1xe8', { name: 'Q', originX: 4, originY: 7, x: 4, y: 0, capture: 'x' }],
// ['exc4', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x' }],
// ['exc4+', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x', check: '+' }],
// ['exc4+', { name: 'P', x: 2, y: 4, originX: 4, capture: 'x', check: '+' }],
// ['c8Q', { name: 'P', promotion: 'Q', x: 2, y: 0 }],
// ['Qxf7#', { name: 'Q', x: 5, y: 1, capture: 'x', checkMate: '#' }],
t.test('SAN - Wrong format', t => {
  const FEN = '8/8/8/8/8/8/8/4Q3 w KQkq - 0 1';
  const san = 'Qp1e8';
  const game = start({ FEN });
  t.throws(() => fromSANToCoordinates(san, game), 'WRONG_FORMAT');
  t.end();
});
t.test('SAN - piece - from (file+rank) - to (file+rank)', t => {
  const FEN = '8/8/8/8/8/8/8/4Q3 w KQkq - 0 1';
  const san = 'Qe1e8';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 0 },
  };

  const game = start({ FEN });
  t.same(fromSANToCoordinates(san, game), expected);
  t.end();
});

t.test('SAN - piece with destination file and rank i.e. "Qe8"', t => {
  const FEN = '8/2N5/8/8/8/8/8/4Q3 w KQkq - 0 1';
  const san = 'Qe8';
  const expected = {
    piece: 'Q',
    origin: { x: 4, y: 7 },
    target: { x: 4, y: 0 },
  };

  const game = start({ FEN });
  t.same(fromSANToCoordinates(san, game), expected);
  t.end();
});
// });
