export const calculateMoves = ({ PIECES }) => {
  const getMovingPieces = (turn) => (pieces, row, y) => [
    ...pieces,
    ...row.filter(({ color }) => color === turn).map((square, x) => ({ ...square, y, x })),
  ]

  const getLegalMoves = (board) => (legalMoves, { name, color, y, x }) => {
    return [...legalMoves, ...PIECES.get(name, color).moves({ board, color, y, x })]
  }

  return ({ board, turn, x, y }) =>
    board
      .reduce(getMovingPieces(turn), [])
      .reduce(getLegalMoves(board), [])
      .filter((move) => move.x === x && move.y === y)
}
