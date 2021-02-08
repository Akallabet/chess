import { COLORS } from './colors'
import { NAMES } from './names'
import { whitePawn, blackPawn, rook, bishop, queen, king, knight } from './moves'

const makeMoves = (fn) => ({ board, x, y }) =>
  fn({ board, x, y }).map((move) => ({ ...move, origin: { x, y } }))

export const PIECES = {
  [NAMES.P]: { name: NAMES.P, color: COLORS.w, moves: makeMoves(whitePawn) },
  [NAMES.N]: { name: NAMES.N, color: COLORS.w, moves: makeMoves(knight) },
  [NAMES.B]: { name: NAMES.B, color: COLORS.w, moves: makeMoves(bishop) },
  [NAMES.R]: { name: NAMES.R, color: COLORS.w, moves: makeMoves(rook) },
  [NAMES.Q]: { name: NAMES.Q, color: COLORS.w, moves: makeMoves(queen) },
  [NAMES.K]: { name: NAMES.K, color: COLORS.w, moves: makeMoves(king) },
  [NAMES.p]: { name: NAMES.p, color: COLORS.b, moves: makeMoves(blackPawn) },
  [NAMES.n]: { name: NAMES.n, color: COLORS.b, moves: makeMoves(knight) },
  [NAMES.b]: { name: NAMES.b, color: COLORS.b, moves: makeMoves(bishop) },
  [NAMES.r]: { name: NAMES.r, color: COLORS.b, moves: makeMoves(rook) },
  [NAMES.q]: { name: NAMES.q, color: COLORS.b, moves: makeMoves(queen) },
  [NAMES.k]: { name: NAMES.k, color: COLORS.b, moves: makeMoves(king) },
}
