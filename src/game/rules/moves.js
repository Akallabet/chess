const isValidStep = (board) => ({ y, x }) => board[y] && board[y][x] && !board[y][x].name
const isValidCapture = (board, color) => ({ y, x }) =>
  board[y] && board[y][x] && board[y][x].name && board[y][x].color !== color
const isValidEnPassant = (board, enPassant) => ({ y, x }) =>
  board[y] && board[y][x] && enPassant && enPassant.y === y && enPassant.x === x
const isValidStepOrCapture = (board, color) => ({ y, x }) =>
  isValidStep(board)({ y, x }) || isValidCapture(board, color)({ y, x })

const isValidMove = ({ board, color, y, x }) =>
  board[y] &&
  board[y][x] &&
  ((board[y][x].color && board[y][x].color !== color) || !board[y][x].color)

const validate = (isValid) => (moves) => {
  const ret = []
  for (const steps of moves) {
    for (const step of steps) {
      if (!isValid(step)) break
      ret.push(step)
    }
  }
  return ret
}

const traverse = (incr, limit = () => true) => ({ board, color, y, x }) => {
  const moves = []
  let position = incr({ y, x })
  while (
    position.y < board.length &&
    position.x < board.length &&
    position.y >= 0 &&
    position.x >= 0 &&
    limit(position)
  ) {
    if (isValidMove({ board, color, ...position })) {
      if (board[position.y][position.x].name && board[position.y][position.x].name === 'K')
        moves.push({ ...position, check: true })
      else moves.push(position)
    }
    if (board[position.y][position.x].color) break
    position = incr(position)
  }
  return moves
}

export const pawn = ({ color, COLORS, board, y, x, FEN: { enPassant } }) => {
  const start = color === COLORS.w ? 6 : 1
  const step = (row) => (color === COLORS.w ? row - 1 : row + 1)

  const steps = [{ y: color === COLORS.w ? y - 1 : y + 1, x }]
  if (y === start) steps.push({ y: color === COLORS.w ? y - 2 : y + 2, x })

  const captures = [
    { y: step(y), x: x + 1 },
    { y: step(y), x: x - 1 },
  ]

  const enPassants = [
    { y: step(y), x: x + 1, enPassant: true },
    { y: step(y), x: x - 1, enPassant: true },
  ]

  return [
    ...steps.filter(isValidStep(board)),
    ...captures.filter(isValidCapture(board, color)),
    ...enPassants.filter(isValidEnPassant(board, enPassant)),
  ]
}

export const knight = ({ board, color, y: posY, x: posX }) =>
  validate(isValidStepOrCapture(board, color))([
    [{ y: posY - 1, x: posX - 2 }],
    [{ y: posY - 2, x: posX - 1 }],
    [{ y: posY - 2, x: posX + 1 }],
    [{ y: posY - 1, x: posX + 2 }],
    [{ y: posY + 1, x: posX + 2 }],
    [{ y: posY + 2, x: posX + 1 }],
    [{ y: posY + 2, x: posX - 1 }],
    [{ y: posY + 1, x: posX - 2 }],
  ])

export const rook = ({ board, color, x, y }) =>
  validate(isValidStepOrCapture(board, color))([
    [...new Array(board.length - 1 - x)].map((_, i) => ({ y, x: x + 1 + i })),
    [...new Array(x)].map((_, i) => ({ y, x: x - 1 - i })),
    [...new Array(board.length - 1 - y)].map((_, i) => ({ y: y + 1 + i, x })),
    [...new Array(y)].map((_, i) => ({ y: y - 1 - i, x })),
  ])

export const bishop = ({ board, color, x, y }) => {
  return [
    ...traverse(({ y, x }) => ({ y: y - 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x - 1 }))({ board, color, y, x }),
  ]
}

export const queen = ({ board, color, x, y }) => {
  return [
    ...traverse(({ y, x }) => ({ y, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x - 1 }))({ board, color, y, x }),
  ]
}

export const king = ({ board, color, x, y, FEN }) => {
  const limit = (pos) => pos.y <= y + 1 && pos.x <= x + 1 && pos.y >= y - 1 && pos.x >= x - 1
  const moves = [
    ...traverse(({ y, x }) => ({ y, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y, x: x - 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x - 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x - 1 }), limit)({ board, color, y, x }),
  ]

  if (FEN.castling[color].isKingside && !board[y][x + 1].color && !board[y][x + 2].color)
    moves.push({ y, x: x + 2, castling: { isKingside: true } })
  if (
    FEN.castling[color].isQueenside &&
    !board[y][x - 1].color &&
    !board[y][x - 2].color &&
    !board[y][x - 3].color
  )
    moves.push({ y, x: x - 2, castling: { isQueenside: true } })
  return moves
}
