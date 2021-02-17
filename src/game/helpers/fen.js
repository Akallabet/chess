import { check } from 'prettier'
import { pipe } from '../utils'

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

export const removeCastlingColor = (color, COLORS, NAMES) => ({ castling }) =>
  castling
    .split('')
    .filter(
      (name) =>
        (color === COLORS.w && name !== NAMES[name]) ||
        (color === COLORS.b && name !== NAMES[name.toUpperCase()].toLowerCase())
    )
    .join('')

export const isCastlingAvailable = (COLORS, NAMES, FEN) => ({ isKingside, isQueenside }) => {
  const castling = FEN.castling.split('')
  if (isKingside)
    return (
      castling.indexOf(FEN.activeColor === COLORS.w ? NAMES.K : NAMES.K.toLocaleLowerCase()) !== -1
    )
  if (isQueenside)
    return (
      castling.indexOf(FEN.activeColor === COLORS.w ? NAMES.Q : NAMES.Q.toLocaleLowerCase()) !== -1
    )
}
