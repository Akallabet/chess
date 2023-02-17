import t from 'tap';
import { start } from '../../src/start.js';
import {
  canPieceMoveToTarget,
  isCellUnderCheck,
} from '../../src/moves/is-cell-under-check.js';
import { modes } from '../../src/constants.js';

t.test('e8 Black king not under check by e2 white bishop', t => {
  const FEN = '4k3/8/8/8/8/8/4B3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game), false);
  t.end();
});

t.test('e8 Black king under check by e2 white rook', t => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(canPieceMoveToTarget({ x: 4, y: 6 }, { x: 4, y: 0 }, game), true);
  t.end();
});

t.test('e8 Black king not under check from d1 white king', t => {
  const FEN = '4k3/8/8/8/8/8/8/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(isCellUnderCheck({ x: 4, y: 0 }, game), false);
  t.end();
});

t.test('e8 Black king under check from e2 white rook', t => {
  const FEN = '4k3/8/8/8/8/8/4R3/3K4 b KQkq - 0 1';
  const game = start({ FEN, mode: modes.demo });
  t.same(isCellUnderCheck({ x: 4, y: 0 }, game), true);
  t.end();
});
