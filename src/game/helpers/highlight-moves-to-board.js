const highligthPieceCell = (board, { y, x }) =>
  board.map((row, i) =>
    row.map((cell, j) => (i === y && j === x ? { ...cell, selected: true } : { ...cell }))
  )

export const highligthMovesToBoard = () => ({ board, y, x }) => (moves) => {
  moves.forEach(({ y, x }) => {
    board[y][x].move = true
  })
  return highligthPieceCell(board, { y, x })
}
