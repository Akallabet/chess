import { generateSANForMove } from '../san.js';
import { InternalState, Move, MovesBoardType } from '../types.js';
import { generateLegalMovesForAllPieces } from './generate-moves.js';

export function createMovesBoard(state: InternalState): MovesBoardType {
  const moves = generateLegalMovesForAllPieces(state);

  const movesBoard: Array<Array<Array<Move>>> = state.board.map(row => {
    return row.map(() => []);
  });

  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i].coord;
    movesBoard[y][x].push({ ...moves[i], san: '' });
  }

  for (let i = 0; i < movesBoard.length; i++) {
    for (let j = 0; j < movesBoard[i].length; j++) {
      const moveSquare = movesBoard[i][j];
      for (let x = 0; x < moveSquare.length; x++) {
        moveSquare[x].san = generateSANForMove(moveSquare, x);
      }
    }
  }

  return movesBoard;
}
