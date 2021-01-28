import { COLORS } from './colors'

export const pawn = {
  name: 'p',
  moves: ({ board, color, y, x }) => {
    const moves = []
    if (color === COLORS[0]) {
      if (board[y - 1][x] && !board[y - 1][x].piece) {
        moves.push({ y: y - 1, x })
      }
      if (y === 6 && board[y - 2][x] && !board[y - 2][x].piece) {
        moves.push({ y: y - 2, x })
      }
      if (
        board[y - 1][x + 1] &&
        board[y - 1][x + 1].piece &&
        board[y - 1][x + 1].color === COLORS[1]
      ) {
        moves.push({ y: y - 1, x: x + 1 })
      }
      if (
        board[y - 1][x - 1] &&
        board[y - 1][x - 1].piece &&
        board[y - 1][x - 1].color === COLORS[1]
      ) {
        moves.push({ y: y - 1, x: x - 1 })
      }
    } else if (color === COLORS[1]) {
      if (board[y + 1][x] && !board[y + 1][x].piece) {
        moves.push({ y: y + 1, x })
      }
      if (y === 1 && board[y + 2][x] && !board[y + 2][x].piece) {
        moves.push({ y: y + 2, x })
      }
      if (
        board[y + 1][x + 1] &&
        board[y + 1][x + 1].piece &&
        board[y + 1][x + 1].color === COLORS[0]
      ) {
        moves.push({ y: y + 1, x: x + 1 })
      }
      if (
        board[y + 1][x - 1] &&
        board[y + 1][x - 1].piece &&
        board[y + 1][x - 1].color === COLORS[0]
      ) {
        moves.push({ y: y + 1, x: x - 1 })
      }
    }
    return moves
  },
}
