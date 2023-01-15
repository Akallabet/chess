import t from 'tap';
import { rotate } from '../../src/utils/index.js';

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
