import t from 'tap';
import { fromFEN, rowFromFEN } from '../src/fen/from-fen.js';

const emptyRow = [{}, {}, {}, {}, {}, {}, {}, {}];
const emptyBoard = [
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
];

t.test('Return object from FEN string', t => {
  const FENObj = fromFEN('8/8/8/8/8/8/8/8 w KQkq - 0 1');
  t.same(FENObj, {
    piecePlacement: emptyBoard,
    activeColor: 'w',
    castlingRights: ['K', 'Q', 'k', 'q'],
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
  });
  t.end();
});

t.test('Create board rows from piece placement', t => {
  t.plan(2);
  t.test('Empty row', t => {
    t.same(rowFromFEN('8'), emptyRow);
    t.end();
  });
  t.test('Row with two pawns', t => {
    t.same(rowFromFEN('2pp4'), [
      {},
      {},
      { piece: 'p' },
      { piece: 'p' },
      {},
      {},
      {},
      {},
    ]);
    t.end();
  });
  t.end();
});
