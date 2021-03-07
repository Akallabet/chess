import { pipe, flatten } from '../../utils'
import { cleanBoard, findPosition, movePiece } from '../board'
import { getMoves } from './moves'

const getLegalMoves = (args) => {
  const { rules, COLORS, NAMES, board, ...FEN } = args
  const { activeColor } = FEN
  return flatten(
    board.map((row, y) =>
      row
        .map((square, x) => ({ ...square, x }))
        .filter(({ color }) => color === activeColor)
        .map(({ name, x }) =>
          getMoves(rules, NAMES, { y, x, COLORS, board, FEN }).map((move) => ({
            ...move,
            origin: { name, x, y },
          }))
        )
    )
  ).reduce((origins, { origin, y, x, ...move }) => {
    if (!origins.has(`${y}${x}`)) origins.set(`${y}${x}`, [])
    origins.get(`${y}${x}`).push({ ...origin, ...move, destination: { y, x } })
    return origins
  }, new Map())
}

const mapDestinations = (ranks, files) => (legalMoves) =>
  files.reduce((moves, file, x) => {
    ranks.forEach((rank, y) => {
      moves[`${file}${rank}`] = legalMoves.get(`${y}${x}`) || []
    })
    return moves
  }, {})

const filterLegalMoves = ({ board, COLORS, NAMES, activeColor, ...args }) => (moves) =>
  new Map(
    Array.from(moves).map(([[y, x], origins]) => {
      const destination = { y: Number(y), x: Number(x) }
      return [
        `${y}${x}`,
        origins.filter(({ _destination, ...origin }) => {
          const piece = { ...board[origin.y][origin.x] }
          const newBoard = pipe(cleanBoard, movePiece(piece, origin, destination))(board)
          const legalMoves = getLegalMoves({
            ...args,
            COLORS,
            NAMES,
            board: newBoard,
            activeColor: activeColor === COLORS.w ? COLORS.b : COLORS.w,
          })
          const king = findPosition(newBoard, NAMES.K, activeColor)
          return king ? !legalMoves.get(`${king.y}${king.x}`) : true
        }),
      ]
    })
  )

export const generateLegalMoves = ({ ranks, files, ...args }) =>
  pipe(getLegalMoves, filterLegalMoves(args), mapDestinations(ranks, files))(args)
