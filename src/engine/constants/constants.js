import { COLORS } from './colors'
import { pawn } from './pieces'

export const PIECES = {
  p: pawn,
  n: { name: 'n' },
  b: { name: 'b' },
  r: { name: 'r' },
  q: { name: 'q' },
  k: { name: 'k' },
}
export const FENPieces = {
  [COLORS[0]]: ['P', 'N', 'B', 'R', 'Q', 'K'],
  [COLORS[1]]: ['p', 'n', 'b', 'r', 'q', 'k'],
}
