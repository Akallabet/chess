import { COLORS } from './colors'

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

const straight = ({ board, color, y, x }) => {
  const moves = [
    ...traverse(({ y, x }) => ({ y, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x }))({ board, color, y, x }),
  ]
  return moves
}

const oblique = ({ board, color, y, x }) => {
  const moves = [
    ...traverse(({ y, x }) => ({ y: y - 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x + 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x - 1 }))({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x - 1 }))({ board, color, y, x }),
  ]
  return moves
}

export const whitePawn = ({ board, y, x }) => {
  const moves = []
  if (board[y - 1][x] && !board[y - 1][x].name) {
    moves.push({ y: y - 1, x })
  }
  if (y === 6 && board[y - 2][x] && !board[y - 2][x].name) {
    moves.push({ y: y - 2, x })
  }
  if (board[y - 1][x + 1] && board[y - 1][x + 1].name && board[y - 1][x + 1].color === COLORS.b) {
    moves.push({ y: y - 1, x: x + 1 })
  }
  if (board[y - 1][x - 1] && board[y - 1][x - 1].name && board[y - 1][x - 1].color === COLORS.b) {
    moves.push({ y: y - 1, x: x - 1 })
  }
  return moves
}

export const blackPawn = ({ board, y, x }) => {
  const moves = []
  if (board[y + 1][x] && !board[y + 1][x].name) {
    moves.push({ y: y + 1, x })
  }
  if (y === 1 && board[y + 2][x] && !board[y + 2][x].name) {
    moves.push({ y: y + 2, x })
  }
  if (board[y + 1][x + 1] && board[y + 1][x + 1].name && board[y + 1][x + 1].color === COLORS.w) {
    moves.push({ y: y + 1, x: x + 1 })
  }
  if (board[y + 1][x - 1] && board[y + 1][x - 1].name && board[y + 1][x - 1].color === COLORS.w) {
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
    [posY - 1, posX - 2],
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
  return [...straight({ board, color, x, y })]
}

export const bishop = ({ board, color, x, y }) => {
  return [...oblique({ board, color, x, y })]
}

export const queen = ({ board, color, x, y }) => {
  return [...straight({ board, color, x, y }), ...oblique({ board, color, x, y })]
}

export const king = ({ board, color, x, y }) => {
  const limit = (pos) => pos.y <= y + 1 && pos.x <= x + 1 && pos.y >= y - 1 && pos.x >= x - 1
  return [
    ...traverse(({ y, x }) => ({ y, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y, x: x - 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x + 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y + 1, x: x - 1 }), limit)({ board, color, y, x }),
    ...traverse(({ y, x }) => ({ y: y - 1, x: x - 1 }), limit)({ board, color, y, x }),
  ]
}
