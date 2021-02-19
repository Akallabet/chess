const isValidMove = ({ board, color, y, x }) =>
  board[y] &&
  board[y][x] &&
  ((board[y][x].color && board[y][x].color !== color) || !board[y][x].color)

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
    if (isValidMove({ board, color, ...position })) moves.push(position)
    if (board[position.y][position.x].color) break
    position = incr(position)
  }
  return moves
}

export const pawn = ({ color, COLORS, ...args }) =>
  color === COLORS.w ? whitePawn(args) : blackPawn(args)

export const whitePawn = ({ board, color, y, x }) => {
  const moves = []
  if (board[y - 1][x] && !board[y - 1][x].name) {
    moves.push({ y: y - 1, x })
  }
  if (y === 6 && board[y - 2][x] && !board[y - 2][x].name) {
    moves.push({ y: y - 2, x })
  }
  if (board[y - 1][x + 1] && board[y - 1][x + 1].name && board[y - 1][x + 1].color !== color) {
    moves.push({ y: y - 1, x: x + 1 })
  }
  if (board[y - 1][x - 1] && board[y - 1][x - 1].name && board[y - 1][x - 1].color !== color) {
    moves.push({ y: y - 1, x: x - 1 })
  }
  return moves
}

export const blackPawn = ({ board, color, y, x }) => {
  const moves = []
  if (board[y + 1][x] && !board[y + 1][x].name) {
    moves.push({ y: y + 1, x })
  }
  if (y === 1 && board[y + 2][x] && !board[y + 2][x].name) {
    moves.push({ y: y + 2, x })
  }
  if (board[y + 1][x + 1] && board[y + 1][x + 1].name && board[y + 1][x + 1].color !== color) {
    moves.push({ y: y + 1, x: x + 1 })
  }
  if (board[y + 1][x - 1] && board[y + 1][x - 1].name && board[y + 1][x - 1].color !== color) {
    moves.push({ y: y + 1, x: x - 1 })
  }
  return moves
}

export const knight = ({ board, color, y: posY, x: posX }) => {
  const moves = []
  const positions = [
    [posY - 1, posX - 2],
    [posY - 2, posX - 1],
    [posY - 2, posX + 1],
    [posY - 1, posX + 2],
    [posY + 1, posX + 2],
    [posY + 2, posX + 1],
    [posY + 2, posX - 1],
    [posY + 1, posX - 2],
  ]

  for (const [y, x] of positions) {
    if (isValidMove({ board, color, y, x })) moves.push({ y, x })
  }
  return moves
}

export const rook = ({ board, color, x, y }) => {
  return [
    ...traverse(({ y, x }) => ({ y, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x }))({ board, color, y, x }),
  ]
}

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
  // console.log(FEN)
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
  // console.log('moves', moves)
  return moves
}
