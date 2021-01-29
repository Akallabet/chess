import { COLORS } from './colors'
import { pawn } from './pieces'

const NAMES = { p: 'p', n: 'n', b: 'b', r: 'r', q: 'q', k: 'k' }

export const PIECES = {
  p: { ...pawn, FEN: { [COLORS.b]: 'p', [COLORS.w]: 'P' } },
  n: { name: 'n', FEN: { [COLORS.b]: 'n', [COLORS.w]: 'N' } },
  b: { name: 'b', FEN: { [COLORS.b]: 'b', [COLORS.w]: 'B' } },
  r: { name: 'r', FEN: { [COLORS.b]: 'r', [COLORS.w]: 'R' } },
  q: { name: 'q', FEN: { [COLORS.b]: 'q', [COLORS.w]: 'Q' } },
  k: { name: 'k', FEN: { [COLORS.b]: 'k', [COLORS.w]: 'K' } },
}
export const FENPieces = {
  P: { piece: NAMES.p, color: 'w' },
  N: { piece: NAMES.n, color: 'w' },
  B: { piece: NAMES.b, color: 'w' },
  R: { piece: NAMES.r, color: 'w' },
  Q: { piece: NAMES.q, color: 'w' },
  K: { piece: NAMES.k, color: 'w' },
  p: { piece: NAMES.p, color: 'b' },
  n: { piece: NAMES.n, color: 'b' },
  b: { piece: NAMES.b, color: 'b' },
  r: { piece: NAMES.r, color: 'b' },
  q: { piece: NAMES.q, color: 'b' },
  k: { piece: NAMES.k, color: 'b' },
}
