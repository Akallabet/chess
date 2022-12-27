import t from 'tap';
import { fromFEN } from './fen.js';

t.test('FEN should return initial positions', t => {
  const FENObj = fromFEN('8/8/8/8/8/8/8/8 w KQkq - 0 1');
  t.same(FENObj, {
    activeColor: 'w',
    castlingRights: ['K', 'Q', 'k', 'q'],
    enPassant: false,
    halfMoves: 0,
  });
  t.end();
});
