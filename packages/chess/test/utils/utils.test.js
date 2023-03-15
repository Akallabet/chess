import t from 'tap';
import { fromFEN } from '../../src/fen/index.js';
import {
  anyCellOccupied,
  areCellsEmpty,
  getPieceCoord,
  isActiveColorPiece,
  isCellEmpty,
  isCellOccupied,
  rotate,
} from '../../src/utils/index.js';
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

t.test('Cell is empty', t => {
  const FEN = '8/8/8/8/8/8/8/8 b KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(isCellEmpty(state, { x: 4, y: 6 }), true);
  t.end();
});

t.test('Cell is occupied', t => {
  const FEN = '8/8/3q4/8/8/8/8/8 b KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(isCellOccupied(state, { x: 3, y: 2 }), true);
  t.end();
});

t.test('List of cells are all empty', t => {
  const FEN = '8/8/3q4/8/8/8/8/8 b KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(
    areCellsEmpty(state, [
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 5 },
    ]),
    true
  );
  t.end();
});

t.test('List of cells with at least one occupied', t => {
  const FEN = '8/8/3q4/8/8/8/8/8 b KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(
    anyCellOccupied(state, [
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 5 },
      { x: 3, y: 2 },
    ]),
    true
  );
  t.end();
});
t.test('Is active color piece', t => {
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(isActiveColorPiece(state, 'P'), true);
  t.end();
});
