import test from 'node:test';
import { strict as assert } from 'node:assert';
import { fromFEN } from '../../src/fen.js';
import {
  generateMoves,
  generateLegalMovesForActiveSide,
  calcIfKingUnderCheck,
  isOpponentKingUnderCheck,
} from '../../src/moves/generate-moves.js';
import { start } from '../../src/index.js';
import { patterns } from '../../src/moves/patterns.js';

const compareByMove = (a, b) => {
  if (a.target.x > b.target.x) return 1;
  if (a.target.x < b.target.x) return -1;
  if (a.target.y > b.target.y) return 1;
  if (a.target.y < b.target.y) return -1;
  if (a.selected && !b.selected) return 1;
  if (!a.selected && b.selected) return -1;
  if (a.move && !b.move) return 1;
  if (!a.move && b.move) return -1;
  if (a.capture && !b.capture) return 1;
  if (!a.capture && b.capture) return -1;
  return 0;
};

const addOrigin = origin => move => {
  move.origin = origin;
  return move;
};
const addPiece = piece => move => ({ ...move, piece });

test('Get moves - Black pawn - rank 7', t => {
  const state = start({
    mode: 'demo',
    FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1',
  });
  const origin = { x: 4, y: 1 };
  const input = generateMoves(origin, state, patterns['p']);
  const expected = [
    { target: { x: 4, y: 2 }, piece: 'p' },
    { target: { x: 4, y: 3 }, piece: 'p' },
  ].map(addOrigin(origin));

  assert.deepStrictEqual(input, expected);
});

test('Get moves - Black pawn - after rank 7', t => {
  assert.deepStrictEqual(
    generateMoves(
      { x: 4, y: 2 },
      start({ mode: 'demo', FEN: '8/8/4p3/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [
      {
        target: { x: 4, y: 3 },
        origin: { x: 4, y: 2 },
        piece: 'p',
      },
    ]
  );
});
test('Get moves - Black pawn - other piece in front', t => {
  const origin = { x: 4, y: 1 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/4p3/4p3/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    []
  );
});
test('Get moves - Black pawn - moves and captures', t => {
  const origin = { x: 4, y: 1 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/4p3/3P4/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [
      { target: { x: 4, y: 2 }, piece: 'p' },
      { target: { x: 4, y: 3 }, piece: 'p' },
      {
        target: { x: 3, y: 2 },
        piece: 'p',
        capture: true,
      },
    ].map(addOrigin(origin))
  );
});
test('Get moves - White pawn - moves and captures', t => {
  const origin = { x: 4, y: 6 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/8/8/3p4/4P3/8 w KQkq - 0 1' }),
      patterns['P']
    ),
    [
      { target: { x: 4, y: 5 } },
      { target: { x: 4, y: 4 } },
      {
        target: { x: 3, y: 5 },
        capture: true,
      },
    ]
      .map(addOrigin(origin))
      .map(addPiece('P'))
  );
});
test('Select pawn on file h', t => {
  const origin = { x: 7, y: 1 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/7p/8/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [{ target: { x: 7, y: 2 } }, { target: { x: 7, y: 3 } }]
      .map(addOrigin(origin))
      .map(addPiece('p'))
  );
});

test('Select knight', t => {
  const origin = { x: 4, y: 3 };
  const actual = generateMoves(
    origin,
    fromFEN('8/8/8/4n3/8/8/8/8 b KQkq - 0 1'),
    patterns['n']
  ).sort(compareByMove);
  assert.deepStrictEqual(
    actual,
    [
      { target: { x: 6, y: 4 } },
      { target: { x: 5, y: 5 } },
      { target: { x: 3, y: 5 } },
      { target: { x: 2, y: 4 } },
      { target: { x: 2, y: 2 } },
      { target: { x: 3, y: 1 } },
      { target: { x: 5, y: 1 } },
      { target: { x: 6, y: 2 } },
    ]
      .sort(compareByMove)
      .map(addOrigin(origin))
      .map(addPiece('n'))
  );
});
test('Highlight Bishop moves', t => {
  const origin = { x: 4, y: 3 };
  const expected = [
    { target: { x: 3, y: 2 } },
    { target: { x: 2, y: 1 } },
    { target: { x: 1, y: 0 } },
    { target: { x: 5, y: 2 } },
    { target: { x: 6, y: 1 } },
    { target: { x: 7, y: 0 } },
    { target: { x: 2, y: 5 } },
    { target: { x: 1, y: 6 }, capture: true },
    { target: { x: 5, y: 4 } },
    { target: { x: 3, y: 4 } },
    { target: { x: 6, y: 5 } },
  ];
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4b3/8/8/1P5q/8 b KQkq - 0 2' }),
      patterns['b']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('b'))
  );
});
test('Highlight Rook moves', t => {
  const expected = [
    { target: { x: 4, y: 4 } },
    { target: { x: 4, y: 5 } },
    { target: { x: 4, y: 6 }, capture: true },
    { target: { x: 4, y: 2 } },
    { target: { x: 4, y: 1 } },
    { target: { x: 4, y: 0 } },
    { target: { x: 3, y: 3 } },
    { target: { x: 2, y: 3 } },
    { target: { x: 1, y: 3 } },
    { target: { x: 0, y: 3 } },
    { target: { x: 5, y: 3 } },
    { target: { x: 6, y: 3 } },
  ];
  const origin = { x: 4, y: 3 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4r2q/8/8/4P3/8 b KQkq - 0 1' }),
      patterns['r']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('r'))
  );
});

test('Highlight Queen moves', t => {
  const expected = [
    { target: { x: 5, y: 3 } },
    { target: { x: 6, y: 3 } },
    { target: { x: 3, y: 3 } },
    { target: { x: 4, y: 4 } },
    { target: { x: 4, y: 5 } },
    { target: { x: 4, y: 6 }, capture: true },
    { target: { x: 4, y: 2 } },
    { target: { x: 4, y: 1 } },
    { target: { x: 4, y: 0 } },
    { target: { x: 2, y: 3 } },
    { target: { x: 1, y: 3 } },
    { target: { x: 0, y: 3 } },
    { target: { x: 3, y: 2 } },
    { target: { x: 2, y: 1 } },
    { target: { x: 1, y: 0 } },
    { target: { x: 5, y: 2 } },
    { target: { x: 6, y: 1 } },
    { target: { x: 7, y: 0 } },
    { target: { x: 2, y: 5 } },
    { target: { x: 1, y: 6 }, capture: true },
    { target: { x: 5, y: 4 } },
    { target: { x: 3, y: 4 } },
    { target: { x: 6, y: 5 } },
  ];
  const origin = { x: 4, y: 3 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4q2q/8/8/1P2P2b/8 b KQkq - 0 1' }),
      patterns['q']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('q'))
  );
});
test('Highlight King moves', t => {
  const expected = [
    { target: { x: 4, y: 2 } },
    { target: { x: 4, y: 4 } },
    { target: { x: 5, y: 4 } },
    { target: { x: 3, y: 4 } },
    { target: { x: 3, y: 2 } },
    { target: { x: 5, y: 2 } },
    { target: { x: 5, y: 3 } },
    { target: { x: 3, y: 3 } },
  ];
  const origin = { x: 4, y: 3 };
  assert.deepStrictEqual(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4k3/8/8/8/8 b KQkq - 0 1' }),
      patterns['k']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
});

test('Highligh moves with king under check', t => {
  const expected = [
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 7, y: 0 },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 5, y: 0 },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 6, y: 1 },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 7, y: 1 },
    },
    {
      piece: 'p',
      origin: { x: 3, y: 1 },
      target: { x: 3, y: 3 },
    },
    {
      piece: 'p',
      origin: { x: 4, y: 1 },
      target: { x: 4, y: 2 },
    },
  ];
  const FEN = '6k1/3pp3/8/8/8/8/B7/3K4 b KQkq - 0 1';
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  assert.deepStrictEqual(actual, expected);
});

test('Highlight moves of king under check', t => {
  const FEN = 'rnbqkbnr/ppp2ppp/8/1B1pp3/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 0 1';
  // const expected = [{ target: { x: 4, y: 1 },  }];
  const expected = [
    {
      piece: 'n',
      origin: {
        x: 1,
        y: 0,
      },
      target: {
        x: 3,
        y: 1,
      },
    },
    {
      piece: 'n',
      origin: {
        x: 1,
        y: 0,
      },
      target: {
        x: 2,
        y: 2,
      },
    },
    {
      piece: 'b',
      origin: {
        x: 2,
        y: 0,
      },
      target: {
        x: 3,
        y: 1,
      },
    },
    {
      piece: 'q',
      origin: {
        x: 3,
        y: 0,
      },
      target: {
        x: 3,
        y: 1,
      },
    },
    {
      piece: 'k',
      origin: {
        x: 4,
        y: 0,
      },
      target: {
        x: 4,
        y: 1,
      },
    },
    {
      piece: 'p',
      origin: {
        x: 2,
        y: 1,
      },
      target: {
        x: 2,
        y: 2,
      },
    },
  ];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  assert.deepStrictEqual(actual, expected);
});

test('Highlight kingside castling when no cells are in check and empty', t => {
  const FEN = 'rnbqk2r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
  const origin = { x: 4, y: 0 };
  const expected = [
    {
      piece: 'k',
      origin,
      target: { x: 6, y: 0 },
      kingSideCastling: true,
    },
    { piece: 'k', origin, target: { x: 5, y: 0 } },
    { piece: 'k', origin, target: { x: 4, y: 1 } },
  ];
  const actual = generateLegalMovesForActiveSide({
    ...fromFEN(FEN),
  }).filter(({ piece }) => piece === 'k');
  assert.deepStrictEqual(actual, expected);
});

test('Highlight queenside castling when no cells are in check and empty', t => {
  const FEN = 'r3kb1r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
  const origin = { x: 4, y: 0 };
  const expected = [
    { piece: 'k', origin, target: { y: 0, x: 3 } },
    {
      piece: 'k',
      origin,
      target: { y: 0, x: 2 },
      queenSideCastling: true,
    },
    { piece: 'k', origin, target: { y: 1, x: 4 } },
  ];
  const actual = generateMoves(
    origin,
    {
      ...fromFEN(FEN),
    },
    patterns.k
  ).filter(({ piece }) => piece === 'k');
  assert.deepStrictEqual(
    actual.sort(compareByMove),
    expected.sort(compareByMove)
  );
});

test('Highlight kingside and queenside castling for white', t => {
  const FEN = 'r3kb1r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
  const origin = { x: 4, y: 7 };
  const expected = [
    { piece: 'K', origin, target: { y: 7, x: 3 } },
    {
      piece: 'K',
      origin,
      target: { y: 7, x: 2 },
      queenSideCastling: true,
    },
    { piece: 'K', origin, target: { y: 7, x: 5 } },
    {
      piece: 'K',
      origin,
      target: { y: 7, x: 6 },
      kingSideCastling: true,
    },
  ];
  const actual = generateLegalMovesForActiveSide({
    ...fromFEN(FEN),
  }).filter(({ piece }) => piece === 'K');
  assert.deepStrictEqual(
    actual.sort(compareByMove),
    expected.sort(compareByMove)
  );
});

test('No castling moves if one of the castling cells is under check', t => {
  const FEN = 'r3k2r/pp1p1ppp/1b2pn2/8/8/BP2P1Q1/P1PP1PPP/RN2KBNR b KQkq - 0 1';
  const origin = { x: 4, y: 0 };
  const expected = [{ target: { x: 3, y: 0 } }];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  ).filter(({ piece }) => piece === 'k');
  assert.deepStrictEqual(
    actual.sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
});

test('No castling moves if one of the castling cells is occupied', t => {
  const FEN = 'rn2k2r/pp1p1ppp/1b2pn2/8/8/BP2PQ2/P1PP1PPP/RN2KBNR b KQkq - 0 1';
  const expected = [{ target: { x: 3, y: 0 } }];
  const origin = { x: 4, y: 0 };
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  ).filter(({ piece }) => piece === 'k');
  assert.deepStrictEqual(
    actual.sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
});

test('Highlight check', t => {
  const FEN = '4k3/8/8/8/8/8/8/4KB2 w - - 0 1';
  const expected = [
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 3, y: 7 },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 6 },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 5, y: 6 },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 3, y: 6 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 6, y: 6 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 7, y: 5 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 4, y: 6 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 3, y: 5 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 2, y: 4 },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 1, y: 3 },
      check: true,
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 0, y: 2 },
    },
  ];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  assert.deepStrictEqual(actual, expected);
});

test('Highlight checkmate', t => {
  const FEN = '1k6/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
  const FENState = fromFEN(FEN);
  const moves = generateLegalMovesForActiveSide({
    ...FENState,
  });
  const checkMateMoves = moves.filter(move => move.checkmate);
  assert.deepStrictEqual(checkMateMoves.length, 4);
});

test('Own king is in check', t => {
  const state = fromFEN('R3k3/8/8/8/8/8/8/4K3 b - - 0 1');
  assert.deepStrictEqual(calcIfKingUnderCheck(state), true);
});
test('Opponent king is in check', t => {
  const state = fromFEN('R3k3/8/8/8/8/8/8/4K3 w - - 0 1');
  assert.deepStrictEqual(isOpponentKingUnderCheck(state), true);
});
