import t from 'tap';
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
  if (a.flags.selected && !b.flags.selected) return 1;
  if (!a.flags.selected && b.flags.selected) return -1;
  if (a.flags.move && !b.flags.move) return 1;
  if (!a.flags.move && b.flags.move) return -1;
  if (a.flags.capture && !b.flags.capture) return 1;
  if (!a.flags.capture && b.flags.capture) return -1;
  return 0;
};

const addOrigin = origin => move => {
  move.origin = origin;
  return move;
};
const addPiece = piece => move => ({ ...move, piece });

t.test('Get moves - Black pawn - rank 7', t => {
  const state = start({
    mode: 'demo',
    FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1',
  });
  const origin = { x: 4, y: 1 };
  const input = generateMoves(origin, state, patterns['p']);
  const expected = [
    { target: { x: 4, y: 2 }, flags: { move: true }, piece: 'p' },
    { target: { x: 4, y: 3 }, flags: { move: true }, piece: 'p' },
  ].map(addOrigin(origin));

  t.same(input, expected);
  t.end();
});
t.test('Get moves - Black pawn - after rank 7', t => {
  t.same(
    generateMoves(
      { x: 4, y: 2 },
      start({ mode: 'demo', FEN: '8/8/4p3/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [
      {
        target: { x: 4, y: 3 },
        flags: { move: true },
        origin: { x: 4, y: 2 },
        piece: 'p',
      },
    ]
  );
  t.end();
});
t.test('Get moves - Black pawn - other piece in front', t => {
  const origin = { x: 4, y: 1 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/4p3/4p3/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    []
  );
  t.end();
});
t.test('Get moves - Black pawn - moves and captures', t => {
  const origin = { x: 4, y: 1 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/4p3/3P4/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [
      { target: { x: 4, y: 2 }, flags: { move: true }, piece: 'p' },
      { target: { x: 4, y: 3 }, flags: { move: true }, piece: 'p' },
      {
        target: { x: 3, y: 2 },
        flags: { capture: true },
        piece: 'p',
      },
    ].map(addOrigin(origin))
  );
  t.end();
});
t.test('Get moves - White pawn - moves and captures', t => {
  const origin = { x: 4, y: 6 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/8/8/3p4/4P3/8 w KQkq - 0 1' }),
      patterns['P']
    ),
    [
      { target: { x: 4, y: 5 }, flags: { move: true } },
      { target: { x: 4, y: 4 }, flags: { move: true } },
      {
        target: { x: 3, y: 5 },
        flags: { capture: true },
      },
    ]
      .map(addOrigin(origin))
      .map(addPiece('P'))
  );
  t.end();
});
t.test('Select pawn on file h', t => {
  const origin = { x: 7, y: 1 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/7p/8/8/8/8/8/8 b KQkq - 0 1' }),
      patterns['p']
    ),
    [
      { target: { x: 7, y: 2 }, flags: { move: true } },
      { target: { x: 7, y: 3 }, flags: { move: true } },
    ]
      .map(addOrigin(origin))
      .map(addPiece('p'))
  );
  t.end();
});

t.test('Select knight', t => {
  const origin = { x: 4, y: 3 };
  const actual = generateMoves(
    origin,
    fromFEN('8/8/8/4n3/8/8/8/8 b KQkq - 0 1'),
    patterns['n']
  ).sort(compareByMove);
  t.same(
    actual,
    [
      { target: { x: 6, y: 4 }, flags: { move: true } },
      { target: { x: 5, y: 5 }, flags: { move: true } },
      { target: { x: 3, y: 5 }, flags: { move: true } },
      { target: { x: 2, y: 4 }, flags: { move: true } },
      { target: { x: 2, y: 2 }, flags: { move: true } },
      { target: { x: 3, y: 1 }, flags: { move: true } },
      { target: { x: 5, y: 1 }, flags: { move: true } },
      { target: { x: 6, y: 2 }, flags: { move: true } },
    ]
      .sort(compareByMove)
      .map(addOrigin(origin))
      .map(addPiece('n'))
  );
  t.end();
});
t.test('Highlight Bishop moves', t => {
  const origin = { x: 4, y: 3 };
  const expected = [
    { target: { x: 3, y: 2 }, flags: { move: true } },
    { target: { x: 2, y: 1 }, flags: { move: true } },
    { target: { x: 1, y: 0 }, flags: { move: true } },
    { target: { x: 5, y: 2 }, flags: { move: true } },
    { target: { x: 6, y: 1 }, flags: { move: true } },
    { target: { x: 7, y: 0 }, flags: { move: true } },
    { target: { x: 2, y: 5 }, flags: { move: true } },
    { target: { x: 1, y: 6 }, flags: { capture: true } },
    { target: { x: 5, y: 4 }, flags: { move: true } },
    { target: { x: 3, y: 4 }, flags: { move: true } },
    { target: { x: 6, y: 5 }, flags: { move: true } },
  ];
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4b3/8/8/1P5q/8 b KQkq - 0 2' }),
      patterns['b']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('b'))
  );
  t.end();
});
t.test('Highlight Rook moves', t => {
  const expected = [
    { target: { x: 4, y: 4 }, flags: { move: true } },
    { target: { x: 4, y: 5 }, flags: { move: true } },
    { target: { x: 4, y: 6 }, flags: { capture: true } },
    { target: { x: 4, y: 2 }, flags: { move: true } },
    { target: { x: 4, y: 1 }, flags: { move: true } },
    { target: { x: 4, y: 0 }, flags: { move: true } },
    { target: { x: 3, y: 3 }, flags: { move: true } },
    { target: { x: 2, y: 3 }, flags: { move: true } },
    { target: { x: 1, y: 3 }, flags: { move: true } },
    { target: { x: 0, y: 3 }, flags: { move: true } },
    { target: { x: 5, y: 3 }, flags: { move: true } },
    { target: { x: 6, y: 3 }, flags: { move: true } },
  ];
  const origin = { x: 4, y: 3 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4r2q/8/8/4P3/8 b KQkq - 0 1' }),
      patterns['r']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('r'))
  );
  t.end();
});

t.test('Highlight Queen moves', t => {
  const expected = [
    { target: { x: 5, y: 3 }, flags: { move: true } },
    { target: { x: 6, y: 3 }, flags: { move: true } },
    { target: { x: 3, y: 3 }, flags: { move: true } },
    { target: { x: 4, y: 4 }, flags: { move: true } },
    { target: { x: 4, y: 5 }, flags: { move: true } },
    { target: { x: 4, y: 6 }, flags: { capture: true } },
    { target: { x: 4, y: 2 }, flags: { move: true } },
    { target: { x: 4, y: 1 }, flags: { move: true } },
    { target: { x: 4, y: 0 }, flags: { move: true } },
    { target: { x: 2, y: 3 }, flags: { move: true } },
    { target: { x: 1, y: 3 }, flags: { move: true } },
    { target: { x: 0, y: 3 }, flags: { move: true } },
    { target: { x: 3, y: 2 }, flags: { move: true } },
    { target: { x: 2, y: 1 }, flags: { move: true } },
    { target: { x: 1, y: 0 }, flags: { move: true } },
    { target: { x: 5, y: 2 }, flags: { move: true } },
    { target: { x: 6, y: 1 }, flags: { move: true } },
    { target: { x: 7, y: 0 }, flags: { move: true } },
    { target: { x: 2, y: 5 }, flags: { move: true } },
    { target: { x: 1, y: 6 }, flags: { capture: true } },
    { target: { x: 5, y: 4 }, flags: { move: true } },
    { target: { x: 3, y: 4 }, flags: { move: true } },
    { target: { x: 6, y: 5 }, flags: { move: true } },
  ];
  const origin = { x: 4, y: 3 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4q2q/8/8/1P2P2b/8 b KQkq - 0 1' }),
      patterns['q']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('q'))
  );
  t.end();
});
t.test('Highlight King moves', t => {
  const expected = [
    { target: { x: 4, y: 2 }, flags: { move: true } },
    { target: { x: 4, y: 4 }, flags: { move: true } },
    { target: { x: 5, y: 4 }, flags: { move: true } },
    { target: { x: 3, y: 4 }, flags: { move: true } },
    { target: { x: 3, y: 2 }, flags: { move: true } },
    { target: { x: 5, y: 2 }, flags: { move: true } },
    { target: { x: 5, y: 3 }, flags: { move: true } },
    { target: { x: 3, y: 3 }, flags: { move: true } },
  ];
  const origin = { x: 4, y: 3 };
  t.same(
    generateMoves(
      origin,
      start({ mode: 'demo', FEN: '8/8/8/4k3/8/8/8/8 b KQkq - 0 1' }),
      patterns['k']
    ).sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
  t.end();
});

t.test('Highligh moves with king under check', t => {
  const expected = [
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 7, y: 0 },
      flags: { move: true },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 5, y: 0 },
      flags: { move: true },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 6, y: 1 },
      flags: { move: true },
    },
    {
      piece: 'k',
      origin: { x: 6, y: 0 },
      target: { x: 7, y: 1 },
      flags: { move: true },
    },
    {
      piece: 'p',
      origin: { x: 3, y: 1 },
      target: { x: 3, y: 3 },
      flags: { move: true },
    },
    {
      piece: 'p',
      origin: { x: 4, y: 1 },
      target: { x: 4, y: 2 },
      flags: { move: true },
    },
  ];
  const FEN = '6k1/3pp3/8/8/8/8/B7/3K4 b KQkq - 0 1';
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  t.same(actual, expected);
  t.end();
});

t.test('Highlight moves of king under check', t => {
  const FEN = 'rnbqkbnr/ppp2ppp/8/1B1pp3/8/4P3/PPPP1PPP/RNBQK1NR b KQkq - 0 1';
  // const expected = [{ target: { x: 4, y: 1 }, flags: { move: true } }];
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
      flags: {
        move: true,
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
      flags: {
        move: true,
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
      flags: {
        move: true,
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
      flags: {
        move: true,
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
      flags: {
        move: true,
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
      flags: {
        move: true,
      },
    },
  ];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  t.same(actual, expected);
  t.end();
});

t.test(
  'Highlight kingside castling when no cells are in check and empty',
  t => {
    const FEN = 'rnbqk2r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
    const origin = { x: 4, y: 0 };
    const expected = [
      {
        piece: 'k',
        origin,
        target: { x: 6, y: 0 },
        flags: { move: true, kingSideCastling: true },
      },
      { piece: 'k', origin, target: { x: 5, y: 0 }, flags: { move: true } },
      { piece: 'k', origin, target: { x: 4, y: 1 }, flags: { move: true } },
    ];
    const actual = generateLegalMovesForActiveSide({
      ...fromFEN(FEN),
    }).filter(({ piece }) => piece === 'k');
    t.same(actual, expected);
    t.end();
  }
);

t.test(
  'Highlight queenside castling when no cells are in check and empty',
  t => {
    const FEN = 'r3kb1r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1';
    const origin = { x: 4, y: 0 };
    const expected = [
      { piece: 'k', origin, target: { y: 0, x: 3 }, flags: { move: true } },
      {
        piece: 'k',
        origin,
        target: { y: 0, x: 2 },
        flags: { move: true, queenSideCastling: true },
      },
      { piece: 'k', origin, target: { y: 1, x: 4 }, flags: { move: true } },
    ];
    const actual = generateMoves(
      origin,
      {
        ...fromFEN(FEN),
      },
      patterns.k
    ).filter(({ piece }) => piece === 'k');
    t.same(actual.sort(compareByMove), expected.sort(compareByMove));
    t.end();
  }
);

t.test('Highlight kingside and queenside castling for white', t => {
  const FEN = 'r3kb1r/pppp1ppp/3bpn2/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
  const origin = { x: 4, y: 7 };
  const expected = [
    { piece: 'K', origin, target: { y: 7, x: 3 }, flags: { move: true } },
    {
      piece: 'K',
      origin,
      target: { y: 7, x: 2 },
      flags: { move: true, queenSideCastling: true },
    },
    { piece: 'K', origin, target: { y: 7, x: 5 }, flags: { move: true } },
    {
      piece: 'K',
      origin,
      target: { y: 7, x: 6 },
      flags: { move: true, kingSideCastling: true },
    },
  ];
  const actual = generateLegalMovesForActiveSide({
    ...fromFEN(FEN),
  }).filter(({ piece }) => piece === 'K');
  t.same(actual.sort(compareByMove), expected.sort(compareByMove));
  t.end();
});

t.test('No castling moves if one of the castling cells is under check', t => {
  const FEN = 'r3k2r/pp1p1ppp/1b2pn2/8/8/BP2P1Q1/P1PP1PPP/RN2KBNR b KQkq - 0 1';
  const origin = { x: 4, y: 0 };
  const expected = [{ target: { x: 3, y: 0 }, flags: { move: true } }];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  ).filter(({ piece }) => piece === 'k');
  t.same(
    actual.sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
  t.end();
});

t.test('No castling moves if one of the castling cells is occupied', t => {
  const FEN = 'rn2k2r/pp1p1ppp/1b2pn2/8/8/BP2PQ2/P1PP1PPP/RN2KBNR b KQkq - 0 1';
  const expected = [{ target: { x: 3, y: 0 }, flags: { move: true } }];
  const origin = { x: 4, y: 0 };
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  ).filter(({ piece }) => piece === 'k');
  t.same(
    actual.sort(compareByMove),
    expected.sort(compareByMove).map(addOrigin(origin)).map(addPiece('k'))
  );
  t.end();
});

t.test('Highlight check', t => {
  const FEN = '4k3/8/8/8/8/8/8/4KB2 w - - 0 1';
  const expected = [
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 3, y: 7 },
      flags: { move: true },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 6 },
      flags: { move: true },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 5, y: 6 },
      flags: { move: true },
    },
    {
      piece: 'K',
      origin: { x: 4, y: 7 },
      target: { x: 3, y: 6 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 6, y: 6 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 7, y: 5 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 4, y: 6 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 3, y: 5 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 2, y: 4 },
      flags: { move: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 1, y: 3 },
      flags: { move: true, check: true },
    },
    {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 0, y: 2 },
      flags: { move: true },
    },
  ];
  const actual = generateLegalMovesForActiveSide(
    start({ FEN, mode: 'standard' })
  );
  t.same(actual, expected);
  t.end();
});

t.test('Highlight checkmate', t => {
  const FEN = '1k6/3R1Q2/8/8/8/8/8/4K3 w - - 0 1';
  const FENState = fromFEN(FEN);
  const moves = generateLegalMovesForActiveSide({
    ...FENState,
  });
  const checkMateMoves = moves.filter(({ flags }) => flags.checkmate);
  t.same(checkMateMoves.length, 4);
  t.end();
});

t.test('Check detection', t => {
  t.plan(2);
  t.test('Own king is in check', t => {
    const state = fromFEN('R3k3/8/8/8/8/8/8/4K3 b - - 0 1');
    t.same(calcIfKingUnderCheck(state), true);
    t.end();
  });
  t.test('Opponent king is in check', t => {
    const state = fromFEN('R3k3/8/8/8/8/8/8/4K3 w - - 0 1');
    t.same(isOpponentKingUnderCheck(state), true);
    t.end();
  });
});
