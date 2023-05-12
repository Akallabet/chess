import { errorCodes } from './error-codes.js';
import { Address, ChessState } from './types.js';
import { fromPositionToCoordinates } from './utils.js';

export const highlightMoves = (
  addr: Address,
  state: ChessState
): ChessState => {
  const coord = fromPositionToCoordinates(addr);

  if (!state.board[coord.y][coord.x].piece)
    throw new Error(errorCodes.no_piece_selected);

  const { board, movesBoard } = state;

  for (let y = 0; y < movesBoard.length; y++) {
    for (let x = 0; x < movesBoard[y].length; x++) {
      const move = movesBoard[y][x].find(
        ({ origin }) => origin.x === coord.x && origin.y === coord.y
      );
      if (move) {
        board[y][x] = { ...board[y][x], ...move.flags };
      }
      if (x === coord.x && y === coord.y) {
        board[y][x] = { ...board[y][x], selected: true };
      }
    }
  }

  return {
    ...state,
    board,
  };
};
