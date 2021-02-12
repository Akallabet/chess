export const addPieceToBoard = () => ({ name, color, y, x }) => (board) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { name, color }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]
