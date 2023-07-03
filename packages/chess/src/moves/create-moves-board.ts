import { InternalState, Move } from '../types.js';
import { generateMovesForAllPieces } from './generate-moves.js';
import { translateMoveToSAN } from './translate-move-to-san.js';

export function createMovesBoard(
  state: InternalState
): Array<Array<Array<Move>>> {
  const moves = generateMovesForAllPieces(state);

  const movesBoard: Array<Array<Array<Move>>> = state.board.map(row => {
    return row.map(() => []);
  });

  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i].target;
    movesBoard[y][x].push({ ...moves[i], san: '' });
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
