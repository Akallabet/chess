import * as R from 'ramda';
import { errorCodes } from './error-codes.js';
import { generateLegalMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';
import { fromPositionToCoordinates } from './utils/index.js';
import { generateLegalMovesForAllPieces } from './moves/generate-moves.js';

export const highlightMoves = R.curry((addr, { FEN, ...initialState }) => {
  const coord = fromPositionToCoordinates(addr);
  const state = R.mergeRight(initialState, fromFEN(FEN));
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  if (hasNoPiece) throw new Error(errorCodes.no_piece_selected);

  const { board } = state;
  const moves = generateLegalMoves(coord, state);
  const boardWithHighlights = mapMovesToBoard(board, moves);

  return R.assoc('board', boardWithHighlights, state);
});
export const createMovesBoard = state => {
  const moves = generateLegalMovesForAllPieces(state);

  const movesBoard = state.board.map(row => {
    return row.map(() => []);
  });
  for (let i = 0; i < moves.length; i++) {
    const { coord, ...move } = moves[i];
    const { x, y } = coord;
    movesBoard[y][x].push(move);
  }
  return movesBoard;
};
