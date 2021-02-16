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

const createBoardMoves = ({ PIECES, files, ranks, board, activeColor, moves }) => {
  board
    .reduce(
      (pieces, row, y) => [
        ...pieces,
        ...row.map(({ name, color }, x) =>
          name && color === activeColor
            ? PIECES.get(name, activeColor).moves({ board, color, y, x })
            : []
        ),
      ],
      []
    )
    .reduce((allMoves, moves) => [...allMoves, ...moves], [])
    .forEach(({ y, x, origin }) =>
      moves[`${files[x]}${ranks[y]}`].push({ ...origin, destination: { y, x } })
    )
  return moves
}

export const generateMoves = pipe(createEmptyMoves, createBoardMoves) //, buildGetters)
