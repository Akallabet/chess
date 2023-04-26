export const clearBoard = state => {
  const board = new Array(state.board.length)
    .fill([])
    .map(() => new Array(state.board[0].length).fill({}));

  for (let y = 0; y < state.board.length; y++) {
    for (let x = 0; x < state.board[y].length; x++) {
      const cell = {};
      if (state.board[y][x].piece) cell.piece = state.board[y][x].piece;
      board[y][x] = cell;
    }
  }
  return {
    ...state,
    board,
  };
};
