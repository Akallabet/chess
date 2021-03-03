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

const isValidStep = (board) => ({ y, x }) => board[y] && board[y][x] && !board[y][x].name
const isValidCapture = (board, color) => ({ y, x }) =>
  board[y] && board[y][x] && board[y][x].name && board[y][x].color !== color
const isValidMove = (board, color) => ({ y, x }) =>
  isValidStep(board)({ y, x }) || isValidCapture(board, color)({ y, x })

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

export const buildGetMoves = (rules) => (args) => {
  const {
    y,
    x,
    board,
    FEN: { activeColor },
  } = args

  const { moves = [], steps = [], captures = [] } = rules[board[y][x].name](args)
  const results = [
    ...validate(isValidMove(board, activeColor))(moves),
    ...validate(isValidStep(board))(steps),
    ...validate(isValidCapture(board, activeColor))(captures),
  ]
  return results
}
