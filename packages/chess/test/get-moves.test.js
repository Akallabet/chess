import t from 'tap';
import { fromChessBoardToCoordinares, getMoves } from '../src/get-moves.js';

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
    t.same(getMoves('pe6', { board }), { board });
    t.same(getMoves('Pb8', { board }), { board });
    t.same(getMoves('nh8', { board }), { board });
    t.end();
  });
  t.test('Pawn moves', t => {
    const boardMoves = [
      row,
      [cell, cell, cell, cell, { piece: 'p' }, cell, cell, cell],
      [cell, cell, cell, cell, { move: true }, cell, cell, cell],
      [cell, cell, cell, cell, { move: true }, cell, cell, cell],
      row,
      row,
      row,
      row,
    ];
    t.same(getMoves({ piece: 'p', x: 1, y: 2 }, { board }), {
      board: boardMoves,
    });
    t.end();
  });
});
