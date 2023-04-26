import t from 'tap';
import { move } from '../src/move.js';
import { start } from '../src/start.js';
import { getBoard } from '../test-utils.js';

t.test('Move white pawn from e8 to e7', t => {
  const expected = getBoard([
    { coord: { x: 4, y: 5 }, cell: { piece: 'P' } },
    { coord: { x: 3, y: 0 }, cell: { piece: 'k' } },
    { coord: { x: 4, y: 7 }, cell: { piece: 'K' } },
  ]);
  const state = move(
    { x: 4, y: 6 },
    { x: 4, y: 5 },
    start({ FEN: '3k4/8/8/8/8/8/4P3/4K3 w KQkq - 0 1' })
  );
  t.same(state.board, expected);
  t.same(state.FEN, '3k4/8/8/8/8/4P3/8/4K3 b KQkq - 0 1');
  t.end();
});
