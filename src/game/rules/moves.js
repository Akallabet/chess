export const pawn = ({ COLORS, y, x, FEN: { enPassant, activeColor } }) => {
  const start = activeColor === COLORS.w ? 6 : 1
  const step = (row) => (activeColor === COLORS.w ? row - 1 : row + 1)

  const steps = [[{ y: activeColor === COLORS.w ? y - 1 : y + 1, x }]]
  if (y === start) steps[0].push({ y: activeColor === COLORS.w ? y - 2 : y + 2, x })
  if (enPassant && enPassant.y === step(y) && enPassant.x === x + 1)
    steps.push([{ y: step(y), x: x + 1, enPassant: true, capture: true }])
  if (enPassant && enPassant.y === step(y) && enPassant.x === x - 1)
    steps.push([{ y: step(y), x: x - 1, enPassant: true, capture: true }])

  const captures = [[{ y: step(y), x: x + 1 }], [{ y: step(y), x: x - 1 }]]

  return {
    steps,
    captures,
  }
}

export const knight = ({ y, x }) => ({
  moves: [
    [{ y: y - 1, x: x - 2 }],
    [{ y: y - 2, x: x - 1 }],
    [{ y: y - 2, x: x + 1 }],
    [{ y: y - 1, x: x + 2 }],
    [{ y: y + 1, x: x + 2 }],
    [{ y: y + 2, x: x + 1 }],
    [{ y: y + 2, x: x - 1 }],
    [{ y: y + 1, x: x - 2 }],
  ],
})

export const rook = ({ board, x, y }) => ({
  moves: [
    [...new Array(board.length - 1 - x)].map((_, i) => ({ y, x: x + 1 + i })),
    [...new Array(x)].map((_, i) => ({ y, x: x - 1 - i })),
    [...new Array(board.length - 1 - y)].map((_, i) => ({ y: y + 1 + i, x })),
    [...new Array(y)].map((_, i) => ({ y: y - 1 - i, x })),
  ],
})

export const bishop = ({ board, x, y }) => ({
  moves: [
    [...new Array(board.length - 1 - x)].map((_, i) => ({ y: y - 1 - i, x: x + 1 + i })),
    [...new Array(x)].map((_, i) => ({ y: y + 1 + i, x: x + 1 + i })),
    [...new Array(board.length - 1 - y)].map((_, i) => ({ y: y + 1 + i, x: x - 1 - i })),
    [...new Array(y)].map((_, i) => ({ y: y - 1 - i, x: x - 1 - i })),
  ],
})

export const queen = ({ board, x, y }) => ({
  moves: [
    [...new Array(board.length - 1 - x)].map((_, i) => ({ y, x: x + 1 + i })),
    [...new Array(x)].map((_, i) => ({ y, x: x - 1 - i })),
    [...new Array(board.length - 1 - y)].map((_, i) => ({ y: y + 1 + i, x })),
    [...new Array(y)].map((_, i) => ({ y: y - 1 - i, x })),
    [...new Array(board.length - 1 - x)].map((_, i) => ({ y: y - 1 - i, x: x + 1 + i })),
    [...new Array(x)].map((_, i) => ({ y: y + 1 + i, x: x + 1 + i })),
    [...new Array(board.length - 1 - y)].map((_, i) => ({ y: y + 1 + i, x: x - 1 - i })),
    [...new Array(y)].map((_, i) => ({ y: y - 1 - i, x: x - 1 - i })),
  ],
})

export const king = ({ board, x, y, FEN: { activeColor, castling } }) => {
  const moves = [
    [{ y, x: x + 1 }],
    [{ y, x: x - 1 }],
    [{ y: y + 1, x }],
    [{ y: y - 1, x }],
    [{ y: y - 1, x: x + 1 }],
    [{ y: y + 1, x: x + 1 }],
    [{ y: y + 1, x: x - 1 }],
    [{ y: y - 1, x: x - 1 }],
  ]

  const castlingMoves = []

  if (castling[activeColor].isKingside && !board[y][x + 1].color && !board[y][x + 2].color)
    castlingMoves.push({ y, x: x + 2, castling: { isKingside: true } })
  if (
    castling[activeColor].isQueenside &&
    !board[y][x - 1].color &&
    !board[y][x - 2].color &&
    !board[y][x - 3].color
  )
    castlingMoves.push({ y, x: x - 2, castling: { isQueenside: true } })

  return {
    moves,
    steps: [castlingMoves],
  }
}
