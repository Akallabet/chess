import t from 'tap';
import { getMoves } from '../src/get-moves.js';

const emptyCell = {};
const emptyRow = [
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
];
const board = [
  emptyRow,
  [
    emptyCell,
    emptyCell,
    emptyCell,
    emptyCell,
    { piece: 'p' },
    emptyCell,
    emptyCell,
    emptyCell,
  ],
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
];

t.test('Get moves', t => {
  t.plan(3);
  t.test('wrong format', t => {
    t.same(getMoves('', { board }), { error: 'WRONG_FORMAT', board });
    t.same(getMoves('Pb', { board }), { error: 'WRONG_FORMAT', board });
    t.same(getMoves({ piece: 'p', x: 1, y: 0 }, { board }), {
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
  t.test('Coordinates position', t => {
    t.same(getMoves({ piece: 'p', x: 1, y: 2 }, { board }), { board });
    t.end();
  });
});
