import t from 'tap';
import { toFEN } from '../../src/fen/to-fen.js';
import { FENState } from '../../src/types.js';

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

t.test('FEN string from object with empty board', t => {
  const FEN = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  const FENObj: FENState = {
    FEN,
    board: emptyBoard,
    activeColor: 'w',
    castlingRights: ['K', 'Q', 'k', 'q'],
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
  };
  t.same(FEN, toFEN(FENObj));
  t.end();
});

t.test('FEN string from object with board', t => {
  const FEN = '3k2r/8/8/7P/8/8/8/8 w KQkq - 0 1';
  const board = [
    [{}, {}, {}, { piece: 'k' }, {}, {}, { piece: 'r' }],
    emptyRow,
    emptyRow,
    [{}, {}, {}, {}, {}, {}, {}, { piece: 'P' }],
    emptyRow,
    emptyRow,
    emptyRow,
    emptyRow,
  ];
  const FENObj: FENState = {
    FEN,
    board,
    activeColor: 'w',
    castlingRights: ['K', 'Q', 'k', 'q'],
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
  };
  t.same(FEN, toFEN(FENObj));
  t.end();
});
