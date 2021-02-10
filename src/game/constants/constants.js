import { COLORS } from './colors'
import { pawn, rook, bishop, queen, king, knight } from './moves'

const NAMES = {
  P: 'P',
  N: 'N',
  B: 'B',
  R: 'R',
  Q: 'Q',
  K: 'K',
}

const makeMoves = (fn) => ({ board, color, x, y }) =>
  fn({ board, color, x, y }).map((move) => ({ ...move, origin: { x, y } }))

const getFEN = (color, name) =>
  (color === COLORS.w && NAMES[name]) || (color === COLORS.b && NAMES[name].toLowerCase())

const buildBoardPiece = (name, move) => (color) => ({
  name: NAMES[name],
  FEN: getFEN(color, NAMES[name]),
  color,
  moves: makeMoves(move),
})

const boardPieces = {
  [NAMES.P]: buildBoardPiece(NAMES.P, pawn),
  [NAMES.N]: buildBoardPiece(NAMES.N, knight),
  [NAMES.B]: buildBoardPiece(NAMES.B, bishop),
  [NAMES.R]: buildBoardPiece(NAMES.R, rook),
  [NAMES.Q]: buildBoardPiece(NAMES.Q, queen),
  [NAMES.K]: buildBoardPiece(NAMES.K, king),
}

export const PIECES = {
  get: (name, color) => {
    if (!color) {
      return (
        (NAMES[name] && boardPieces[name](COLORS.w)) ||
        (NAMES[name.toUpperCase()] && boardPieces[name.toUpperCase()](COLORS.b))
      )
    }
    return boardPieces[name](color)
  },
}
