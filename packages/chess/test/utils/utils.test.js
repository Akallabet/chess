import t from 'tap';
import { getPieceCoord, rotate } from '../../src/utils/index.js';
import { getBoard } from '../../test-utils.js';

t.test('Rotate an 4 x 4 matrix', t => {
  const matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];
  const rotated = [
    [16, 15, 14, 13],
    [12, 11, 10, 9],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
  ];
  t.same(rotate(matrix), rotated);
  t.end();
});

t.test('Get coordinated for black king in e8', t => {
  const coord = getPieceCoord(
    'k',
    getBoard([{ coord: { y: 0, x: 4 }, cell: { piece: 'k' } }])
  );
  t.same(coord, { y: 0, x: 4 });
  t.end();
});

t.test('Get coordinated for white king in e1', t => {
  const coord = getPieceCoord(
    'K',
    getBoard([{ coord: { y: 7, x: 4 }, cell: { piece: 'K' } }])
  );
  t.same(coord, { y: 7, x: 4 });
  t.end();
});

t.test('Get coordinates for first Rook', t => {
  const coord = getPieceCoord(
    'R',
    getBoard([
      { coord: { y: 0, x: 6 }, cell: { piece: 'R' } },
      { coord: { y: 7, x: 2 }, cell: { piece: 'R' } },
      { coord: { y: 0, x: 4 }, cell: { piece: 'k' } },
    ])
  );
  t.same(coord, { y: 0, x: 6 });
  t.end();
});
