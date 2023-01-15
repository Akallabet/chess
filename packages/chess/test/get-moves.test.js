import t from 'tap';
import { fromChessBoardToCoordinates, getMoves } from '../src/get-moves.js';
import { getBoard } from './utils/index.js';

t.test('Convert chessboard piece coordinates to x/y coordinates', t => {
  t.same(fromChessBoardToCoordinates('pe3'), { piece: 'p', x: 4, y: 5 });
  t.end();
});

t.test('Get moves', t => {
  t.plan(3);
  t.test('wrong format', t => {
    const FEN = '8/4p3/8/8/8/8/8/8 b KQkq - 0 1';
    t.same(getMoves('', { FEN }), { error: 'WRONG_FORMAT', FEN });
    t.same(getMoves('Pb', { FEN }), { error: 'WRONG_FORMAT', FEN });
    t.same(getMoves({ piece: 'p', x: 1, y: 9 }, { FEN }), {
      error: 'WRONG_FORMAT',
      FEN,
    });
    t.end();
  });
  t.test('Chessboard position', t => {
    const FEN = '8/4p3/8/8/8/8/8/8 b KQkq - 0 1';
    t.notHas(getMoves('pe6', { FEN }), 'error');
    t.notHas(getMoves('Pb8', { FEN }), 'error');
    t.notHas(getMoves('nh8', { FEN }), 'error');
    t.end();
  });
  t.test('Pawn moves', t => {
    t.plan(4);
    t.test('Black pawn - rank 7', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 1 },
          { FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1' }
        ).board,
        getBoard([
          { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
          { coord: { x: 4, y: 2 }, cell: { move: true } },
          { coord: { x: 4, y: 3 }, cell: { move: true } },
        ])
      );
      t.end();
    });
    t.test('Black pawn - after rank 7', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 2 },
          { FEN: '8/8/4p3/8/8/8/8/8 b KQkq - 0 1' }
        ).board,
        getBoard([
          { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
          { coord: { x: 4, y: 3 }, cell: { move: true } },
        ])
      );
      t.end();
    });
    t.test('Black pawn - other piece in front', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 1 },
          { FEN: '8/4p3/4p3/8/8/8/8/8 b KQkq - 0 1' }
        ).board,
        getBoard([
          { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
          { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
        ])
      );
      t.end();
    });
    t.test('Black pawn - moves and captures', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 1 },
          { FEN: '8/4p3/3P4/8/8/8/8/8 b KQkq - 0 1' }
        ).board,
        getBoard([
          { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
          { coord: { x: 4, y: 2 }, cell: { move: true } },
          { coord: { x: 4, y: 3 }, cell: { move: true } },
          { coord: { x: 3, y: 2 }, cell: { piece: 'P', capture: true } },
        ])
      );
      t.end();
    });
  });
});
