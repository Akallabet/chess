import { pawn, rook, bishop, queen, king, knight } from './moves'

export const COLORS = { w: 'w', b: 'b' }
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

const NAMES = {
  P: 'P',
  N: 'N',
  B: 'B',
  R: 'R',
  Q: 'Q',
  K: 'K',
}

const buildBoardPiece = (name, move) => (color) => ({
  name: NAMES[name],
  FEN: (color === COLORS.w && NAMES[name]) || (color === COLORS.b && NAMES[name].toLowerCase()),
  color,
  moves: ({ board, x, y }) =>
    move({ board, color, x, y, COLORS }).map((move) => ({ ...move, origin: { x, y } })),
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
  names: Object.values(NAMES),
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
