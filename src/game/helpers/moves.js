import { pipe } from '../utils'

const createEmptyMoves = ({ ranks, files, ...args }) => {
  const moves = {}
  ranks.forEach((rank) => {
    files.forEach((file) => {
      moves[`${file}${rank}`] = []
    })
  })
  return { moves, ranks, files, ...args }
}

const createBoardMoves = ({ getMoves, COLORS, files, ranks, board, moves, ...FEN }) => {
  const { activeColor } = FEN
  board
    .reduce(
      (pieces, row, y) => [
        ...pieces,
        ...row.map(({ name, color }, x) =>
          name && color === activeColor
            ? getMoves({ y, x, COLORS, board, FEN }).map((move) => ({
                ...move,
                origin: { name, x, y },
              }))
            : []
        ),
      ],
      []
    )
    .reduce((allMoves, moves) => [...allMoves, ...moves], [])
    .forEach(({ y, x, origin, ...move }) =>
      moves[`${files[x]}${ranks[y]}`].push({ ...origin, ...move, destination: { y, x } })
    )
  return moves
}

export const generateMoves = pipe(createEmptyMoves, createBoardMoves)

const byName = (name) => (origin) => (name ? origin.name === name : true)
const byFile = (x) => (origin) => (x ? origin.x === x : true)
const byRank = (y) => (origin) => (y ? origin.y === y : true)
const byCastling = ({ name, x, y }) => (origin) =>
  origin.castling && name === origin.name && y === origin.y && x === origin.x
const byEnPassant = ({ name, x, y }) => (origin) =>
  origin.enPassant && name === origin.name && y === origin.y && x === origin.x

export const filterByName = (name) => (origins) => origins.filter(byName(name))
export const filterByFile = (x) => (origins) => origins.filter(byFile(x))
export const filterByRank = (y) => (origins) => origins.filter(byRank(y))
export const findByCastling = (piece) => (origins) => origins.find(byCastling(piece))
export const findByEnPassant = (piece) => (origins) => origins.find(byEnPassant(piece))

const isWithinBoard = (board, { y, x }) => board[y] && board[y][x]
const isValidStep = (board) => ({ y, x, ...args }) => !board[y][x].name && { y, x, ...args }
const isValidCapture = (board, color) => ({ y, x, ...args }) =>
  board[y][x].name && board[y][x].color !== color && { y, x, capture: true, ...args }
const isValidCheck = (board, color) => ({ y, x, ...args }) =>
  isWithinBoard(board, { y, x }) &&
  board[y][x].name === 'K' &&
  board[y][x].color !== color && { y, x, check: true, ...args }
const isValidMove = (board, color) => ({ y, x }) =>
  isValidStep(board)({ y, x }) || isValidCapture(board, color)({ y, x })

const validate = (board, { y, x }, isValid, moves) => {
  const ret = []
  for (const [increment, limit = () => true] of moves) {
    let steps = 1
    let position = increment({ y, x })
    while (isWithinBoard(board, position) && limit(steps)) {
      const piece = isValid(position)
      if (piece) ret.push(isValid(position))
      if (isValidStep(board)(position)) {
        position = increment(position)
        steps += 1
      } else {
        break
      }
    }
  }
  return ret
}

export const buildGetMoves = (rules) => (args) => {
  const {
    y,
    x,
    board,
    FEN: { activeColor },
  } = args

  const validateCheck = (moves) => (position) => {
    const hasCheck = validate(board, position, isValidCheck(board, activeColor), moves).find(
      ({ check }) => check
    )
    return hasCheck ? { ...position, check: true } : position
  }

  const { moves = [], steps = [], captures = [] } = rules[board[y][x].name](args)

  const ret = [
    ...validate(board, { y, x }, isValidMove(board, activeColor), moves).map(validateCheck(moves)),
    ...validate(board, { y, x }, isValidStep(board), steps),
    ...validate(board, { y, x }, isValidCapture(board, activeColor), captures),
  ]
  return ret
}
