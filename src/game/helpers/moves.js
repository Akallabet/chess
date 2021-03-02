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
