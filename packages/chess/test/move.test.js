import t from 'tap';
import { move } from '../src/move.js';
import { getBoard } from '../test-utils.js';

t.test('Move white pawn from e8 to e7', t => {
  const expected = getBoard([{ coord: { x: 4, y: 5 }, cell: { piece: 'P' } }]);
  const { board } = move(
    { x: 4, y: 6 },
    { x: 4, y: 5 },
    { FEN: '8/8/8/8/8/8/4P3/8 w KQkq - 0 1' }
  );
  t.same(board, expected);
  t.end();
});
