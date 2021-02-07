export const removePieceFromBoard = () => ({ board, y, x }) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), {}, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]
