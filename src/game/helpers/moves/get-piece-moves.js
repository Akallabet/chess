export const getPieceMoves = (legalMoves) => ({ x, y }) =>
  Object.keys(legalMoves)
    .reduce(
      (moves, dest) => [
        ...moves,
        ...legalMoves[dest].filter((origin) => y === origin.y && x === origin.x),
      ],
      []
    )
    .map(({ destination }) => destination)
