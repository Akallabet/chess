export const buildFENObject = (FEN) => {
  const [
    piecePlacement,
    activeColor,
    castling,
    enPassant,
    halfmoveClock,
    fullmoveNumber,
  ] = FEN.split(' ')
  return {
    piecePlacement,
    activeColor,
    castling,
    enPassant,
    halfmoveClock,
    fullmoveNumber: Number(fullmoveNumber),
  }
}

export const buildFENString = ({
  piecePlacement,
  activeColor,
  castling,
  enPassant,
  halfmoveClock,
  fullmoveNumber,
}) => {
  return `${piecePlacement} ${activeColor} ${castling} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`
}
