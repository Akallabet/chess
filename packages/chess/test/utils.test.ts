import t from 'tap';
import { fromFEN } from '../src/fen.js';
import {
  anyCellOccupied,
  getPieceCoord,
  isActiveColorPiece,
  isCellOccupied,
} from '../src/utils.js';
import { getBoard } from '../test-utils.js';

t.test('Get coordinated for black king in e8', t => {
  const coord = getPieceCoord(
    'k',
    getBoard([{ coord: { y: 0, x: 4 }, cell: 'k' }])
  );
  t.same(coord, { y: 0, x: 4 });
  t.end();
});

t.test('Get coordinated for white king in e1', t => {
  const coord = getPieceCoord(
    'K',
    getBoard([{ coord: { y: 7, x: 4 }, cell: 'K' }])
  );
  t.same(coord, { y: 7, x: 4 });
  t.end();
});

t.test('Get coordinates for first Rook', t => {
  const coord = getPieceCoord(
    'R',
    getBoard([
      { coord: { y: 0, x: 6 }, cell: 'R' },
      { coord: { y: 7, x: 2 }, cell: 'R' },
      { coord: { y: 0, x: 4 }, cell: 'k' },
    ])
  );
  t.same(coord, { y: 0, x: 6 });
  t.end();
});

t.test('Cell is occupied', t => {
  const FEN = '8/8/3q4/8/8/8/8/8 b KQkq - 0 1';
  const state = fromFEN(FEN);
  t.same(isCellOccupied(state, { x: 3, y: 2 }), true);
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
  t.same(isActiveColorPiece(state.activeColor, 'P'), true);
  t.end();
});
