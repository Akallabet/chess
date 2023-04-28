import { ChessState } from './types.js';

export function clearBoard(state: ChessState): ChessState {
  const board = new Array(state.board.length)
    .fill([])
    .map(() => new Array(state.board[0].length).fill({}));

  for (let y = 0; y < state.board.length; y++) {
    for (let x = 0; x < state.board[y].length; x++) {
      if (state.board[y][x].piece)
        board[y][x] = { piece: state.board[y][x].piece };
      board[y][x] = {};
    }
  }
  return {
    ...state,
    board,
  };
}
