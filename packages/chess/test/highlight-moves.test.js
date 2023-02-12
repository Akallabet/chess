import t from 'tap';
import {
  fromChessBoardToCoordinates,
  highlightMoves,
} from '../src/highlight-moves.js';
import { getBoard } from '../test-utils.js';

t.test('Convert chessboard piece coordinates to x/y coordinates', t => {
  t.same(fromChessBoardToCoordinates('e3'), { x: 4, y: 5 });
  t.end();
});

t.test('Get Moves - wrong format', t => {
  const FEN = '8/4p3/8/8/8/8/8/8 b KQkq - 0 1';
  t.same(highlightMoves('', { FEN }).error, 'WRONG_FORMAT');
  t.same(highlightMoves('Pb', { FEN }).error, 'WRONG_FORMAT');
  t.same(highlightMoves({ x: 1, y: 9 }, { FEN }).error, 'NO_PIECE_SELECTED');
  t.end();
});
t.test('Get moves - Black pawn - rank 7', t => {
  t.same(
    highlightMoves({ x: 4, y: 1 }, { FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 1 }, cell: { piece: 'p', selected: true } },
      { coord: { x: 4, y: 2 }, cell: { move: true } },
      { coord: { x: 4, y: 3 }, cell: { move: true } },
    ])
  );
  t.end();
});
t.test('Get moves - Black pawn - after rank 7', t => {
  t.same(
    highlightMoves({ x: 4, y: 2 }, { FEN: '8/8/4p3/8/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 2 }, cell: { piece: 'p', selected: true } },
      { coord: { x: 4, y: 3 }, cell: { move: true } },
    ])
  );
  t.end();
});
t.test('Get moves - Black pawn - other piece in front', t => {
  t.same(
    highlightMoves({ x: 4, y: 1 }, { FEN: '8/4p3/4p3/8/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 1 }, cell: { piece: 'p', selected: true } },
      { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
    ])
  );
  t.end();
});
t.test('Get moves - Black pawn - moves and captures', t => {
  t.same(
    highlightMoves({ x: 4, y: 1 }, { FEN: '8/4p3/3P4/8/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 1 }, cell: { piece: 'p', selected: true } },
      { coord: { x: 4, y: 2 }, cell: { move: true } },
      { coord: { x: 4, y: 3 }, cell: { move: true } },
      {
        coord: { x: 3, y: 2 },
        cell: { piece: 'P', capture: true },
      },
    ])
  );
  t.end();
});
t.test('Get moves - White pawn - moves and captures', t => {
  t.same(
    highlightMoves({ x: 4, y: 6 }, { FEN: '8/8/8/8/8/3p4/4P3/8 w KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 6 }, cell: { piece: 'P', selected: true } },
      { coord: { x: 4, y: 5 }, cell: { move: true } },
      { coord: { x: 4, y: 4 }, cell: { move: true } },
      {
        coord: { x: 3, y: 5 },
        cell: { piece: 'p', capture: true },
      },
    ])
  );
  t.end();
});
t.test('Select pawn on file h', t => {
  t.same(
    highlightMoves({ x: 7, y: 1 }, { FEN: '8/7p/8/8/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 7, y: 1 }, cell: { piece: 'p', selected: true } },
      { coord: { x: 7, y: 2 }, cell: { move: true } },
      { coord: { x: 7, y: 3 }, cell: { move: true } },
    ])
  );
  t.end();
});
t.test('Select knight', t => {
  t.same(
    highlightMoves({ x: 4, y: 3 }, { FEN: '8/8/8/4n3/8/8/8/8 b KQkq - 0 1' })
      .board,
    getBoard([
      { coord: { x: 4, y: 3 }, cell: { piece: 'n', selected: true } },
      { coord: { x: 6, y: 4 }, cell: { move: true } },
      { coord: { x: 5, y: 5 }, cell: { move: true } },
      { coord: { x: 3, y: 5 }, cell: { move: true } },
      { coord: { x: 2, y: 4 }, cell: { move: true } },
      { coord: { x: 2, y: 2 }, cell: { move: true } },
      { coord: { x: 3, y: 1 }, cell: { move: true } },
      { coord: { x: 5, y: 1 }, cell: { move: true } },
      { coord: { x: 6, y: 2 }, cell: { move: true } },
    ])
  );
  t.end();
});
t.test('Highlight Bishop moves', t => {
  const expected = getBoard([
    { coord: { x: 4, y: 3 }, cell: { piece: 'b', selected: true } },
    { coord: { x: 3, y: 2 }, cell: { move: true } },
    { coord: { x: 2, y: 1 }, cell: { move: true } },
    { coord: { x: 1, y: 0 }, cell: { move: true } },
    { coord: { x: 5, y: 2 }, cell: { move: true } },
    { coord: { x: 6, y: 1 }, cell: { move: true } },
    { coord: { x: 7, y: 0 }, cell: { move: true } },
    { coord: { x: 2, y: 5 }, cell: { move: true } },
    { coord: { x: 1, y: 6 }, cell: { piece: 'P', capture: true } },
    { coord: { x: 5, y: 4 }, cell: { move: true } },
    { coord: { x: 3, y: 4 }, cell: { move: true } },
    { coord: { x: 6, y: 5 }, cell: { move: true } },
    { coord: { x: 7, y: 6 }, cell: { piece: 'q' } },
  ]);
  t.same(
    highlightMoves({ x: 4, y: 3 }, { FEN: '8/8/8/4b3/8/8/1P5q/8 b KQkq - 0 2' })
      .board,
    expected
  );
  t.end();
});
t.test('Highlight Rook moves', t => {
  const expected = getBoard([
    { coord: { x: 4, y: 3 }, cell: { piece: 'r', selected: true } },
    { coord: { x: 4, y: 4 }, cell: { move: true } },
    { coord: { x: 4, y: 5 }, cell: { move: true } },
    { coord: { x: 4, y: 6 }, cell: { piece: 'P', capture: true } },
    { coord: { x: 4, y: 2 }, cell: { move: true } },
    { coord: { x: 4, y: 1 }, cell: { move: true } },
    { coord: { x: 4, y: 0 }, cell: { move: true } },
    { coord: { x: 3, y: 3 }, cell: { move: true } },
    { coord: { x: 2, y: 3 }, cell: { move: true } },
    { coord: { x: 1, y: 3 }, cell: { move: true } },
    { coord: { x: 0, y: 3 }, cell: { move: true } },
    { coord: { x: 5, y: 3 }, cell: { move: true } },
    { coord: { x: 6, y: 3 }, cell: { move: true } },
    { coord: { x: 7, y: 3 }, cell: { piece: 'q' } },
  ]);
  t.same(
    highlightMoves({ x: 4, y: 3 }, { FEN: '8/8/8/4r2q/8/8/4P3/8 b KQkq - 0 1' })
      .board,
    expected
  );
  t.end();
});
t.test('Highlight Queen moves', t => {
  const expected = getBoard([
    { coord: { x: 4, y: 3 }, cell: { piece: 'q', selected: true } },
    { coord: { x: 4, y: 4 }, cell: { move: true } },
    { coord: { x: 4, y: 5 }, cell: { move: true } },
    { coord: { x: 4, y: 6 }, cell: { piece: 'P', capture: true } },
    { coord: { x: 4, y: 2 }, cell: { move: true } },
    { coord: { x: 4, y: 1 }, cell: { move: true } },
    { coord: { x: 4, y: 0 }, cell: { move: true } },
    { coord: { x: 3, y: 3 }, cell: { move: true } },
    { coord: { x: 2, y: 3 }, cell: { move: true } },
    { coord: { x: 1, y: 3 }, cell: { move: true } },
    { coord: { x: 0, y: 3 }, cell: { move: true } },
    { coord: { x: 5, y: 3 }, cell: { move: true } },
    { coord: { x: 6, y: 3 }, cell: { move: true } },
    { coord: { x: 7, y: 3 }, cell: { piece: 'q' } },
    { coord: { x: 3, y: 2 }, cell: { move: true } },
    { coord: { x: 2, y: 1 }, cell: { move: true } },
    { coord: { x: 1, y: 0 }, cell: { move: true } },
    { coord: { x: 5, y: 2 }, cell: { move: true } },
    { coord: { x: 6, y: 1 }, cell: { move: true } },
    { coord: { x: 7, y: 0 }, cell: { move: true } },
    { coord: { x: 2, y: 5 }, cell: { move: true } },
    { coord: { x: 1, y: 6 }, cell: { piece: 'P', capture: true } },
    { coord: { x: 5, y: 4 }, cell: { move: true } },
    { coord: { x: 3, y: 4 }, cell: { move: true } },
    { coord: { x: 6, y: 5 }, cell: { move: true } },
    { coord: { x: 7, y: 6 }, cell: { piece: 'b' } },
  ]);
  t.same(
    highlightMoves(
      { x: 4, y: 3 },
      { FEN: '8/8/8/4q2q/8/8/1P2P2b/8 b KQkq - 0 1' }
    ).board,
    expected
  );
  t.end();
});
t.skip('Highligh moves with king under threat', t => {
  const expected = getBoard([
    { coord: { x: 6, y: 0 }, cell: { piece: 'k' } },
    { coord: { x: 3, y: 1 }, cell: { piece: 'p', selected: true } },
    { coord: { x: 3, y: 3 }, cell: { move: true } },
    { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
    { coord: { x: 0, y: 6 }, cell: { piece: 'B' } },
  ]);
  const FEN = '6k1/3pp3/8/8/8/8/B7/8 b KQkq - 0 1';
  t.same(highlightMoves({ x: 3, y: 1 }, { FEN }).board, expected);
  t.end();
});
//t.test('Highlight castling', t => {
//  const expected = getBoard([]);
//  t.same(
//    highlightMoves({ x: 5, y: 0 }, { FEN: 'r3k2r/8/8/8/8/8/8/8 b KQkq - 0 1' }),
//    expected
//  );
//  t.end();
//});
