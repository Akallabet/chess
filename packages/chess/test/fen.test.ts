import t from 'tap';
import {
  fromFEN,
  isFEN,
  rowFromFEN,
  toFEN,
  updateBoardWithMove,
} from '../src/fen.js';
import { FENState, Square } from '../src/types.js';

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
  const FEN = '8/8/8/8/8/8/8/8 b - - 0 1';
  t.same(
    {
      b: { kingSide: false, queenSide: false },
      w: { kingSide: false, queenSide: false },
    },
    fromFEN(FEN).castlingRights
  );

  t.end();
});

t.test('No castling rights for black king', t => {
  const FEN = '8/8/8/8/8/8/8/8 b KQ - 0 1';
  t.same(
    {
      b: { kingSide: false, queenSide: false },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
  t.end();
});

t.test('No kingside castling rights for black king', t => {
  const FEN = '8/8/8/8/8/8/8/8 b KQq - 0 1';
  t.same(
    {
      b: { kingSide: false, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );
  t.end();
});

t.test('No queenside castling rights for black king', t => {
  const FEN = '8/8/8/8/8/8/8/8 b KQk - 0 1';
  t.same(
    {
      b: { kingSide: true, queenSide: false },
      w: { kingSide: true, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );

  t.end();
});

t.test('No kingside castling rights for white king', t => {
  const FEN = '8/8/8/8/8/8/8/8 b Qk - 0 1';
  t.same(
    {
      b: { kingSide: true, queenSide: false },
      w: { kingSide: false, queenSide: true },
    },
    fromFEN(FEN).castlingRights
  );

  t.end();
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

t.test('Return object from FEN string', t => {
  const FEN = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
  const FENObj = fromFEN(FEN);
  t.same(FENObj, {
    board: emptyBoard,
    activeColor: 'w',
    castlingRights: {
      b: { kingSide: true, queenSide: true },
      w: { kingSide: true, queenSide: true },
    },
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
    t.same(rowFromFEN('2pp4'), ['', '', 'p', 'p', '', '', '', '']);
    t.end();
  });
  t.end();
});

t.test('FEN string from object with empty board', t => {
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
  };
  t.same(FEN, toFEN(FENObj));
  t.end();
});

t.test('FEN string from object with board', t => {
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
  };
  t.same(FEN, toFEN(FENObj));
  t.end();
});

t.test('Board with moves', t => {
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
  t.same(
    boardMove,
    fromFEN('rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR w - - 0 1').board
  );
  t.end();
});
