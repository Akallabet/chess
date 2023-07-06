import t from 'tap';
import { fromFEN } from '../../src/fen.js';
import { boardWithMove } from '../../src/moves/move-and-update-state.js';

t.test('Board with moves', t => {
  const { board } = fromFEN(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1'
  );
  const boardMove = boardWithMove(
    {
      origin: { y: 6, x: 1 },
      target: { y: 4, x: 1 },
      flags: { move: true },
      piece: 'P',
      san: ['b4'],
    },
    board
  );
  t.same(
    boardMove,
    fromFEN('rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR w - - 0 1').board
  );
  t.end();
});
