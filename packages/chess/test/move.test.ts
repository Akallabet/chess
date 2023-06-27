import t from 'tap';
import { move, start } from '../src/index.js';
import { getBoard } from '../test-utils.js';

t.only('Move white pawn from e2 to e3', t => {
  const expected = getBoard([
    { coord: { x: 4, y: 5 }, cell: { piece: 'P' } },
    { coord: { x: 3, y: 0 }, cell: { piece: 'k' } },
    { coord: { x: 4, y: 7 }, cell: { piece: 'K' } },
  ]);
  const state = move(
    'e3',
    start({ FEN: '3k4/8/8/8/8/8/4P3/4K3 w KQkq - 0 1', mode: 'standard' })
  );
  t.same(state.board, expected);
  t.same(state.FEN, '3k4/8/8/8/8/4P3/8/4K3 b KQkq - 0 1');
  t.end();
});
