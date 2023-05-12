import t from 'tap';
import {
  fromFEN,
  getCastlingRights,
  isFEN,
  rowFromFEN,
  toFEN,
} from '../src/fen.js';
import { FENState } from '../src/types.js';

t.test('Check FEN format', t => {
  t.plan(3);
  t.test('Empty board', t => {
    t.same(isFEN('8/8/8/8/8/8/8/8 w KQkq - 0 1'), true);
    t.end();
  });
  t.test('Too many empty cells', t => {
    t.same(isFEN('9/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
    t.end();
  });
  t.test('Too few empty cells', t => {
    t.same(isFEN('1/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
    t.end();
  });
  t.end();
});

t.test('No castling rights', t => {
  t.same(getCastlingRights('k', { castlingRights: [] }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights: [] }).queenSide, false);
  t.end();
});

t.test('No castling rights for black king', t => {
  const castlingRights = ['K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, false);
  t.end();
});

t.test('No kingside castling rights for black king', t => {
  const castlingRights = ['q', 'K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, true);
  t.end();
});

t.test('No queenside castling rights for black king', t => {
  const castlingRights = ['k', 'K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, true);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, false);
  t.end();
});

t.test('No kingside castling rights for white king', t => {
  const castlingRights = ['k', 'Q'];
  t.same(getCastlingRights('K', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('K', { castlingRights }).queenSide, true);
  t.end();
});

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
  const FEN = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  const FENObj = fromFEN(FEN);
  t.same(FENObj, {
    FEN,
    board: emptyBoard,
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
