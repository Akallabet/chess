export const getLegalMoves = ({ PIECES }) => (board, isValid) => (
  legalMoves,
  { name, color, y, x }
) => [...legalMoves, ...PIECES.get(name, color).moves({ board, color, y, x, isValid })]
