export const findPosition = (board, name, color) => {
  let piece
  for (let y = 0; y < board.length; y++) {
    const row = board[y]
    for (let x = 0; x < row.length; x++) {
      const square = row[x]
      if (square.name === name && square.color === color) return { y, x }
    }
  }
  return piece
}
