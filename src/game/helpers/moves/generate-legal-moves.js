import { pipe, flatten, log } from '../../utils'
import { cleanBoard, findPosition, movePiece } from '../board'

const getLegalMoves = (args) => {
  const { getMoves, COLORS, board, ...FEN } = args
  const { activeColor } = FEN
  return flatten(
    board.map((row, y) =>
      row
        .map((square, x) => ({ ...square, x }))
        .filter(({ color }) => color === activeColor)
        .map(({ name, x }) =>
          getMoves({ y, x, COLORS, board, FEN }).map((move) => ({
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

const filterLegalMoves = (args) => (moves) => {
  const { board, COLORS, NAMES, activeColor } = args
  // const color = activeColor === COLORS.w ? COLORS.b : COLORS.w
  console.log(moves)
  for (const [[y, x], origins] of moves) {
    const destination = { y, x }

    origins.forEach(({ _destination, ...origin }) => {
      // console.log(origin)
      const newBoard = pipe(
        cleanBoard,
        movePiece(board[origin.y][origin.x], origin, destination)
      )(board)
      const legalMoves = getLegalMoves({
        ...args,
        board: newBoard,
        activeColor: activeColor === COLORS.w ? COLORS.b : COLORS.w,
      })
      const king = findPosition(newBoard, NAMES.K, activeColor)
      // console.log(king)
      // console.log(legalMoves.keys())
    })
    // console.log([y, x], origins)
  }
  // console.log(moves)
  return moves
}

export const generateLegalMoves = ({ ranks, files, ...args }) =>
  pipe(getLegalMoves, /*filterLegalMoves(args),*/ mapDestinations(ranks, files))(args)
