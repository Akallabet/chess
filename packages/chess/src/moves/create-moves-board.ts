import { files, piecesMap, ranks } from '../constants.js';
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
      const movesSquare = movesBoard[i][j];
      for (let x = 0; x < movesSquare.length; x++) {
        // generate unambiguous standard algebraic notation for each move
        const move = movesSquare[x];
        const { flags, coord, piece } = move;
        const pieceName =
          piece !== piecesMap.p && piece !== piecesMap.P ? piece : '';
        const file = files[coord.x];
        const rank = ranks[coord.y];
        // const { x: cx, y: cy } = coord;
        // const pieceName = piece[0].toUpperCase();
        const capture = flags.capture ? 'x' : '';
        // const promotion = flags.promotion ? `=${flags.promotion}` : '';
        const check = flags.check ? '+' : '';
        // const checkmate = flags.checkmate ? '#' : '';
        // const disambiguation = getDisambiguation(state, move);
        const san = `${pieceName}${capture}${file}${rank}${check}`;
        move.san = san;
      }
    }
  }

  return movesBoard;
}
