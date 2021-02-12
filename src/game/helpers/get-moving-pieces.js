export const getMovingPieces = () => (turn, name = 'P') => (pieces, row, y) => [
  ...pieces,
  ...row
    .map((square, x) => ({ ...square, x }))
    .filter(({ name }) => name)
    .filter(({ color, name: pieceName }) => color === turn && pieceName === name)
    .map(({ x, ...square }) => ({ ...square, y, x })),
]
