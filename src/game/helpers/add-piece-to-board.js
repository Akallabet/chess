export const addPieceToBoard = () => ({ board, name, color, y, x }) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { name, color }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]
