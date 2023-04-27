import { FENState, MovesBoardType } from '../types.js';
import { generateLegalMovesForAllPieces } from './generate-moves.js';

export function createMovesBoard(state: FENState): MovesBoardType {
  const moves = generateLegalMovesForAllPieces(state);

  const movesBoard: MovesBoardType = state.board.map(row => {
    return row.map(() => []);
  });
  for (let i = 0; i < moves.length; i++) {
    const { coord, ...move } = moves[i];
    const { x, y } = coord;
    movesBoard[y][x].push(move);
  }
  return movesBoard;
}
