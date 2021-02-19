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
    castling: castling.split('').reduce(
      (availability, symbol) => {
        if (symbol === 'K') return { ...availability, w: { ...availability.w, isKingside: true } }
        if (symbol === 'Q') return { ...availability, w: { ...availability.w, isQueenside: true } }
        if (symbol === 'k') return { ...availability, b: { ...availability.b, isKingside: true } }
        if (symbol === 'q') return { ...availability, b: { ...availability.b, isQueenside: true } }
        return availability
      },
      { w: { isKingside: false, isQueenside: false }, b: { isKingside: false, isQueenside: false } }
    ),
    enPassant,
    halfmoveClock,
    fullmoveNumber: Number(fullmoveNumber),
  }
}

const buildCastlingString = ({ w, b }) => {
  let castling = ''
  if (w.isKingside) castling += 'K'
  if (w.isQueenside) castling += 'Q'
  if (b.isKingside) castling += 'k'
  if (b.isQueenside) castling += 'q'
  return castling || '-'
}

export const buildFENString = ({
  piecePlacement,
  activeColor,
  castling,
  enPassant,
  halfmoveClock,
  fullmoveNumber,
}) => {
  return `${piecePlacement} ${activeColor} ${buildCastlingString(
    castling
  )} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`
}

export const removeCastlingColor = (color) => ({ castling }) => ({
  ...castling,
  [color]: { isKingside: false, isQueenside: false },
})

export const checkCastlingAvailability = (FEN, { isKingside, isQueenside }) => {
  const castling = FEN.castling
  if (isKingside) return castling[FEN.activeColor].isKingside
  if (isQueenside) return castling[FEN.activeColor].isQueenside
}
