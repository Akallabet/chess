import t from 'tap';
import { getBoard } from '../test-utils.js';
import { clearBoard } from '../src/clear-board.js';

t.test('Clear board', t => {
  t.same(
    clearBoard({
      FEN: '8/4p3/8/8/8/8/8/8 b KQkq - 0 1',
      board: getBoard([
        { coord: { x: 4, y: 1 }, cell: { piece: 'p', selected: true } },
        { coord: { x: 4, y: 2 }, cell: { move: true } },
        { coord: { x: 4, y: 3 }, cell: { move: true } },
      ]),
    }).board,
    getBoard([{ coord: { x: 4, y: 1 }, cell: { piece: 'p' } }])
  );
  t.end();
});
