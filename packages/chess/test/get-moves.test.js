import t from 'tap';
import { fromChessBoardToCoordinares, getMoves } from '../src/get-moves.js';
import { getBoard } from './utils/index.js';

const cell = {};
const row = [cell, cell, cell, cell, cell, cell, cell, cell];
const board = [
  row,
  [cell, cell, cell, cell, { piece: 'p' }, cell, cell, cell],
  row,
  row,
  row,
  row,
  row,
  row,
];

t.test('Convert chessboard piece coordinates to x/y coordinates', t => {
  t.same(fromChessBoardToCoordinares('pe3'), { piece: 'p', x: 4, y: 5 });
  t.end();
});

t.test('Get moves', t => {
  t.plan(3);
  t.test('wrong format', t => {
    t.same(getMoves('', { board }), { error: 'WRONG_FORMAT', board });
    t.same(getMoves('Pb', { board }), { error: 'WRONG_FORMAT', board });
    t.same(getMoves({ piece: 'p', x: 1, y: 9 }, { board }), {
      error: 'WRONG_FORMAT',
      board,
    });
    t.end();
  });
  t.test('Chessboard position', t => {
    t.notHas(getMoves('pe6', { board }), 'error');
    t.notHas(getMoves('Pb8', { board }), 'error');
    t.notHas(getMoves('nh8', { board }), 'error');
    t.end();
  });
  t.test('Pawn moves', t => {
    t.plan(3);
    t.test('Black pawn - rank 7', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 1 },
          { board: getBoard([{ coord: { x: 4, y: 1 }, cell: { piece: 'p' } }]) }
        ),
        {
          board: getBoard([
            { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
            { coord: { x: 4, y: 2 }, cell: { move: true } },
            { coord: { x: 4, y: 3 }, cell: { move: true } },
          ]),
        }
      );
      t.end();
    });
    t.test('Black pawn - after rank 7', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 2 },
          {
            board: getBoard([{ coord: { x: 4, y: 2 }, cell: { piece: 'p' } }]),
          }
        ),
        {
          board: getBoard([
            { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
            { coord: { x: 4, y: 3 }, cell: { move: true } },
          ]),
        }
      );
      t.end();
    });
    t.test('Black pawn - other piece in front', t => {
      t.same(
        getMoves(
          { piece: 'p', x: 4, y: 1 },
          {
            board: getBoard([
              { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
              { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
            ]),
          }
        ),
        {
          board: getBoard([
            { coord: { x: 4, y: 1 }, cell: { piece: 'p' } },
            { coord: { x: 4, y: 2 }, cell: { piece: 'p' } },
          ]),
        }
      );
      t.end();
    });
  });
});
