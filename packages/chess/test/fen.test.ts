import test from 'node:test';
import { strict as assert } from 'node:assert';
import {
  fromFEN,
  isFEN,
  rowFromFEN,
  toFEN,
  updateBoardWithMove,
} from '../src/fen.js';
import { FENState, Square } from '../src/types.js';

test('Check FEN format', async t => {
  await t.test('Empty board', () => {
    assert.strictEqual(isFEN('8/8/8/8/8/8/8/8 w KQkq - 0 1'), true);
  });
  await t.test('Too many empty cells', () => {
    assert.strictEqual(isFEN('9/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
  });
  await t.test('Too few empty cells', () => {
    assert.strictEqual(isFEN('1/8/8/8/8/8/8/8 w KQkq - 0 1'), false);
  });
});

test('No castling rights', () => {
  const FEN = '8/8/8/8/8/8/8/8 b - - 0 1';
  assert.deepEqual(
    {
      b: { kingSide: false, queenSide: false },
      w: { kingSide: false, queenSide: false },
    },
    fromFEN(FEN).castlingRights
  );
});

test('No castling rights for black king', () => {
  const FEN = '8/8/8/8/8/8/8/8 b KQ - 0 1';
  assert.deepEqual(
    {
      b: { kingSide: false, queenSide: false },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
});

test('No kingside castling rights for black king', () => {
  const FEN = '8/8/8/8/8/8/8/8 b KQq - 0 1';
  assert.deepEqual(
    {
      b: { kingSide: false, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
});

test('No queenside castling rights for black king', () => {
  const FEN = '8/8/8/8/8/8/8/8 b KQk - 0 1';
  assert.deepEqual(
    {
      b: { kingSide: true, queenSide: false },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
});

test('No kingside castling rights for white king', () => {
  const FEN = '8/8/8/8/8/8/8/8 b Qk - 0 1';
  assert.deepEqual(
    {
      b: { kingSide: true, queenSide: false },
      w: { kingSide: false, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
});

const emptySquare: Square = '' as Square;
const emptyRow = [
  emptySquare,
  emptySquare,
  emptySquare,
  emptySquare,
  emptySquare,
  emptySquare,
  emptySquare,
  emptySquare,
];
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

test('Return object from FEN string', () => {
  const FEN = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  const FENObj = fromFEN(FEN);
  assert.deepEqual(FENObj, {
    board: emptyBoard,
    activeColor: 'w',
    castlingRights: {
      b: { kingSide: true, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
    kings: {
      b: undefined,
      w: undefined,
    },
    opponentColor: 'b',
  });
});

test('Create board rows from piece placement', async t => {
  await test('Empty row', t => {
    assert.deepEqual(rowFromFEN('8'), emptyRow);
  });
  await test('Row with two pawns', t => {
    assert.deepEqual(rowFromFEN('2pp4'), ['', '', 'p', 'p', '', '', '', '']);
  });
});

test('FEN string from object with empty board', () => {
  const FEN = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  const FENObj: FENState = {
    board: emptyBoard,
    activeColor: 'w',
    castlingRights: {
      b: { kingSide: true, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
    kings: {
      b: undefined,
      w: undefined,
    },
  };
  assert.deepEqual(FEN, toFEN(FENObj));
});

test('FEN string from object with board', () => {
  const FEN = '3k2r/8/8/7P/8/8/8/8 w KQkq - 0 1';
  const board: Square[][] = [
    [emptySquare, emptySquare, emptySquare, 'k', emptySquare, emptySquare, 'r'],
    emptyRow,
    emptyRow,
    [
      emptySquare,
      emptySquare,
      emptySquare,
      emptySquare,
      emptySquare,
      emptySquare,
      emptySquare,
      'P',
    ],
    emptyRow,
    emptyRow,
    emptyRow,
    emptyRow,
  ];
  const FENObj: FENState = {
    board,
    activeColor: 'w',
    castlingRights: {
      b: { kingSide: true, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
    enPassant: false,
    halfMoves: 0,
    fullMoves: 1,
    kings: {
      b: undefined,
      w: undefined,
    },
  };
  assert.deepEqual(FEN, toFEN(FENObj));
});

test('Board with moves', () => {
  const { board } = fromFEN(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1'
  );
  const boardMove = updateBoardWithMove(
    {
      origin: { y: 6, x: 1 },
      target: { y: 4, x: 1 },
      piece: 'P',
    },
    board
  );
  assert.deepEqual(
    boardMove,
    fromFEN('rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR w - - 0 1').board
  );
});
