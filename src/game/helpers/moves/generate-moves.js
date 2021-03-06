import { pipe, flatten, log } from '../../utils'

const getNextMoves = (args) => {
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

const filterLegalMoves = () => (moves) => {
  return moves
}

export const generateMoves = ({ ranks, files, ...args }) =>
  pipe(getNextMoves, filterLegalMoves(args), mapDestinations(ranks, files))(args)
