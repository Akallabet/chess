import t from 'tap';
import { modes } from '../../src/constants.js';
import { generateLegalMoves } from '../../src/moves/generate-moves.js';
import { start } from '../../src/start.js';
import { fromPositionToCoordinates } from '../../src/utils/index.js';

t.test('Convert chessboard piece coordinates to x/y coordinates', t => {
  t.same(fromPositionToCoordinates('e3'), { x: 4, y: 5 });
  t.end();
});

t.test('Get moves - Black pawn - rank 7', t => {
  const state = start({
    mode: modes.demo,
    FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1',
  });
  t.same(generateLegalMoves({ x: 4, y: 1 }, state), [
    { coord: { x: 4, y: 1 }, flags: { selected: true } },
    { coord: { x: 4, y: 2 }, flags: { move: true } },
    { coord: { x: 4, y: 3 }, flags: { move: true } },
  ]);
  t.end();
});
t.test('Get moves - Black pawn - after rank 7', t => {
  t.same(
    generateLegalMoves(
      { x: 4, y: 2 },
      start({ mode: 'demo', FEN: '8/8/4p3/8/8/8/8/8 b KQkq - 0 1' })
    ),
    [
      { coord: { x: 4, y: 2 }, flags: { selected: true } },
      { coord: { x: 4, y: 3 }, flags: { move: true } },
    ]
  );
  t.end();
});
t.test('Get moves - Black pawn - other piece in front', t => {
  t.same(
    generateLegalMoves(
      { x: 4, y: 1 },
      start({ mode: 'demo', FEN: '8/4p3/4p3/8/8/8/8/8 b KQkq - 0 1' })
    ),
    [{ coord: { x: 4, y: 1 }, flags: { selected: true } }]
  );
  t.end();
});
t.test('Get moves - Black pawn - moves and captures', t => {
  t.same(
    generateLegalMoves(
      { x: 4, y: 1 },
      start({ mode: 'demo', FEN: '8/4p3/3P4/8/8/8/8/8 b KQkq - 0 1' })
    ),
    [
      { coord: { x: 4, y: 1 }, flags: { selected: true } },
      { coord: { x: 4, y: 2 }, flags: { move: true } },
      { coord: { x: 4, y: 3 }, flags: { move: true } },
      {
        coord: { x: 3, y: 2 },
        flags: { capture: true },
      },
    ]
  );
  t.end();
});
t.test('Get moves - White pawn - moves and captures', t => {
  t.same(
    generateLegalMoves(
      { x: 4, y: 6 },
      start({ mode: 'demo', FEN: '8/8/8/8/8/3p4/4P3/8 w KQkq - 0 1' })
    ),
    [
      { coord: { x: 4, y: 6 }, flags: { selected: true } },
      { coord: { x: 4, y: 5 }, flags: { move: true } },
      { coord: { x: 4, y: 4 }, flags: { move: true } },
      {
        coord: { x: 3, y: 5 },
        flags: { capture: true },
      },
    ]
  );
  t.end();
});
t.test('Select pawn on file h', t => {
  t.same(
    generateLegalMoves(
      { x: 7, y: 1 },
      start({ mode: 'demo', FEN: '8/7p/8/8/8/8/8/8 b KQkq - 0 1' })
    ),
    [
      { coord: { x: 7, y: 1 }, flags: { selected: true } },
      { coord: { x: 7, y: 2 }, flags: { move: true } },
      { coord: { x: 7, y: 3 }, flags: { move: true } },
    ]
  );
  t.end();
});
t.test('Highligh moves with king under check', t => {
  const expected = [
    { coord: { x: 3, y: 1 }, flags: { selected: true } },
    { coord: { x: 3, y: 3 }, flags: { move: true } },
  ];
  const FEN = '6k1/3pp3/8/8/8/8/B7/3K4 b KQkq - 0 1';
  const input = generateLegalMoves({ x: 3, y: 1 }, start({ FEN }));
  t.same(input, expected);
  t.end();
});
