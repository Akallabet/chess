import { FENState, Move, MoveBase } from '../types.js';
import { translateMoveToSAN } from './translate-move-to-san.js';

export function createMovesBoard(
  state: FENState,
  moves: Array<MoveBase>
): Array<Array<Array<Move>>> {
  const movesBoard: Array<Array<Array<Move>>> = state.board.map(row => {
    return row.map(() => []);
  });

  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i].target;
    movesBoard[y][x].push({ ...moves[i], san: [''] });
  }

  for (let i = 0; i < movesBoard.length; i++) {
    for (let j = 0; j < movesBoard[i].length; j++) {
      const moveSquare = movesBoard[i][j];
      for (let x = 0; x < moveSquare.length; x++) {
        moveSquare[x].san = translateMoveToSAN(moveSquare, x);
      }
    }
  }

  return movesBoard;
}
