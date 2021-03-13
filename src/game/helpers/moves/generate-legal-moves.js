import { pipe } from '../../utils'
import { findPosition, movePiece } from '../board'
import { getMoves } from './moves'

const getLegalMoves = (args) => {
  const { rules, COLORS, NAMES, board, ...FEN } = args
  const { activeColor } = FEN
  const legalMoves = {}
  for (let y = 0; y < board.length; y++) {
    const row = board[y]
    for (let x = 0; x < row.length; x++) {
      const { name, color } = row[x]
      if (name && color === activeColor) {
        getMoves(rules, NAMES, { y, x, COLORS, board, FEN }).forEach(({ x: X, y: Y, ...move }) => {
          if (!legalMoves[`${Y}${X}`]) legalMoves[`${Y}${X}`] = []
          legalMoves[`${Y}${X}`].push({
            name,
            y,
            x,
            ...move,
            destination: { y: Y, x: X },
          })
        })
      }
    }
  }
  return legalMoves
}

const mapDestinations = (ranks, files) => (legalMoves) =>
  files.reduce((moves, file, x) => {
    ranks.forEach((rank, y) => {
      moves[`${file}${rank}`] = legalMoves[`${y}${x}`] || []
    })
    return moves
  }, {})

const filterLegalMoves = ({ board, COLORS, NAMES, activeColor, ...args }) => (moves) => {
  for (const [y, x] in moves) {
    const destination = { y: Number(y), x: Number(x) }
    moves[`${y}${x}`] = moves[`${y}${x}`].filter(({ _destination, ...origin }) => {
      const piece = { ...board[origin.y][origin.x] }
      const newBoard = movePiece(piece, origin, destination)(board)
      const legalMoves = getLegalMoves({
        ...args,
        COLORS,
        NAMES,
        board: newBoard,
        activeColor: activeColor === COLORS.w ? COLORS.b : COLORS.w,
      })
      const king = findPosition(newBoard, NAMES.K, activeColor)
      return king ? !legalMoves[`${king.y}${king.x}`] : true
    })
  }
  return moves
}

export const generateLegalMoves = ({ ranks, files, ...args }) =>
  pipe(getLegalMoves, filterLegalMoves(args), mapDestinations(ranks, files))(args)
