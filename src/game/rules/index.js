import { bishop, king, knight, pawn, queen, rook } from './moves'

const rules = {
  P: pawn,
  N: knight,
  B: bishop,
  R: rook,
  Q: queen,
  K: king,
}

export const getMoves = ({ y, x, board, ...args }) => {
  return rules[board[y][x].name]({ board, color: board[y][x].color, y, x, ...args })
}
