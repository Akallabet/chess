// import { fromSAN } from '../san'
//import { defaultFiles as files, defaultRanks as ranks, defaultNames as pieces } from '../constants'

import t from 'tap';
import { fromSANToCoordinates } from '../../src/san/from-san-to-coordinates.js';
import { start } from '../../src/start.js';

t.test('SAN to Coordinates', t => {
  const cases = [
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
    [
      '8/8/8/8/8/8/8/4Q3 w KQkq - 0 1',
      'Qe1e8',
      { piece: 'Q', origin: { x: 4, y: 7 }, target: { x: 4, y: 0 } },
    ],
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
  ];
  console.log(cases.length);
  const [FEN, SAN, expected] = cases[0];
  t.test('Piece - from (file+rank) - to (file+rank)', t => {
    const game = start({ FEN });
    t.same(fromSANToCoordinates(SAN, game), expected);
    t.end();
  });
  t.end();
});
