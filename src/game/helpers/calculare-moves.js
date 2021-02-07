export const calculateMoves = ({ PIECES }) => {
  const getMovingPieces = (turn) => (pieces, row, y) => [
    ...pieces,
    ...row.filter(({ color }) => color === turn).map((square, x) => ({ ...square, y, x })),
  ]

  const getLegalMoves = ({ board, turn }) => (legalMoves, { name, y, x }) => {
    return [...legalMoves, ...PIECES[name].moves({ board, color: turn, y, x })]
  }

  return ({ board, turn, x, y }) =>
    board
      .reduce(getMovingPieces(turn), [])
      .reduce(getLegalMoves({ board, turn }), [])
      .filter((move) => move.x === x && move.y === y)
}
