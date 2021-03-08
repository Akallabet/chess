const oneSquare = (steps) => steps <= 1
const twoSquares = (steps) => steps <= 2

const top = ({ y, x }) => ({ y: y - 1, x })
const bottom = ({ y, x }) => ({ y: y + 1, x })
const left = ({ y, x }) => ({ y, x: x - 1 })
const right = ({ y, x }) => ({ y, x: x + 1 })

const topLeft = ({ y, x }) => ({ y: y - 1, x: x - 1 })
const topRight = ({ y, x }) => ({ y: y - 1, x: x + 1 })
const bottomRight = ({ y, x }) => ({ y: y + 1, x: x + 1 })
const bottomLeft = ({ y, x }) => ({ y: y + 1, x: x - 1 })

export const pawn = ({ COLORS, NAMES, y, x, FEN: { enPassant, activeColor } }) => {
  const startingSquare = activeColor === COLORS.w ? 6 : 1
  const promotionRow = activeColor === COLORS.w ? 1 : 6

  const step = (row) => (activeColor === COLORS.w ? row - 1 : row + 1)

  const limit = y === startingSquare ? twoSquares : oneSquare

  const steps = [[activeColor === COLORS.w ? top : bottom, limit]]
  const promotions = []

  if (y === promotionRow) {
    promotions.push([
      ({ y, x }) => ({ x, y: activeColor === COLORS.w ? y - 1 : y + 1, promotion: NAMES.Q }),
    ])
    promotions.push([
      ({ y, x }) => ({ x, y: activeColor === COLORS.w ? y - 1 : y + 1, promotion: NAMES.R }),
    ])
    promotions.push([
      ({ y, x }) => ({ x, y: activeColor === COLORS.w ? y - 1 : y + 1, promotion: NAMES.B }),
    ])
    promotions.push([
      ({ y, x }) => ({ x, y: activeColor === COLORS.w ? y - 1 : y + 1, promotion: NAMES.N }),
    ])
  }

  if (enPassant && enPassant.y === step(y) && enPassant.x === x + 1)
    steps.push([
      (origin) => ({ y: step(origin.y), x: x + 1, enPassant: true, capture: true }),
      oneSquare,
    ])
  if (enPassant && enPassant.y === step(y) && enPassant.x === x - 1)
    steps.push([
      (origin) => ({ y: step(origin.y), x: x - 1, enPassant: true, capture: true }),
      oneSquare,
    ])
  return {
    steps: promotions.length ? promotions : steps,
    captures: [
      [activeColor === COLORS.w ? topRight : bottomRight, oneSquare],
      [activeColor === COLORS.w ? topLeft : bottomLeft, oneSquare],
    ],
  }
}

export const knight = () => ({
  moves: [
    [(origin) => ({ y: origin.y - 1, x: origin.x - 2 }), oneSquare],
    [(origin) => ({ y: origin.y - 2, x: origin.x - 1 }), oneSquare],
    [(origin) => ({ y: origin.y - 2, x: origin.x + 1 }), oneSquare],
    [(origin) => ({ y: origin.y - 1, x: origin.x + 2 }), oneSquare],
    [(origin) => ({ y: origin.y + 1, x: origin.x + 2 }), oneSquare],
    [(origin) => ({ y: origin.y + 2, x: origin.x + 1 }), oneSquare],
    [(origin) => ({ y: origin.y + 2, x: origin.x - 1 }), oneSquare],
    [(origin) => ({ y: origin.y + 1, x: origin.x - 2 }), oneSquare],
  ],
})

export const rook = () => ({
  moves: [[top], [bottom], [right], [left]],
})

export const bishop = () => ({
  moves: [[topLeft], [topRight], [bottomLeft], [bottomRight]],
})

export const queen = () => ({
  moves: [[top], [bottom], [right], [left], [topLeft], [topRight], [bottomLeft], [bottomRight]],
})

export const king = ({ board, x, y, FEN: { activeColor, castling } }) => {
  const moves = [
    [top, oneSquare],
    [bottom, oneSquare],
    [right, oneSquare],
    [left, oneSquare],
    [topLeft, oneSquare],
    [topRight, oneSquare],
    [bottomRight, oneSquare],
    [bottomLeft, oneSquare],
  ]
  const steps = []

  if (castling[activeColor].isKingside && !board[y][x + 1].color && !board[y][x + 2].color)
    steps.push([
      (origin) => ({ y: origin.y, x: origin.x + 2, castling: { isKingside: true } }),
      oneSquare,
    ])
  if (
    castling[activeColor].isQueenside &&
    !board[y][x - 1].color &&
    !board[y][x - 2].color &&
    !board[y][x - 3].color
  )
    steps.push([
      (origin) => ({ y: origin.y, x: origin.x - 2, castling: { isQueenside: true } }),
      oneSquare,
    ])

  return {
    moves,
    steps,
  }
}
