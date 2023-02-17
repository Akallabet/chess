import t from 'tap';
import { start } from '../src/start.js';
import {
  canPieceMoveToTarget,
  isCellInMoves,
} from '../src/moves/is-cell-in-moves.js';
import { modes } from '../src/constants.js';

t.test('e2 white bishop does not threthen e8 Black king', t => {
  const FEN = '4k3/8/8/8/8/8/4B3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game), false);
  t.end();
});

t.test('e2 white rook threthens e8 Black king', t => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game), true);
  t.end();
});

t.test('e8 Black king not under threat from d1 white king', t => {
  const FEN = '4k3/8/8/8/8/8/8/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(isCellInMoves({ x: 4, y: 0 }, game), false);
  t.end();
});

t.test('e8 Black king under threat from e2 white rook', t => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(isCellInMoves({ x: 4, y: 0 }, game), true);
  t.end();
});
